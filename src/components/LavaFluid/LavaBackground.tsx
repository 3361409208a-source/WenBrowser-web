"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { snoiseGLSL } from "./snoise3D";
import { lavaVertGLSL } from "./lavaFluid.vert";
import { lavaFragGLSL } from "./lavaFluid.frag";

export interface LavaPalette {
  name: string;
  colors: [string, string, string];
}

export const LAVA_PALETTES: LavaPalette[] = [
  { name: "Magma",    colors: ["#ff2200", "#ff8800", "#ffee00"] },
  { name: "Neon",     colors: ["#ff0055", "#aa00ff", "#00eaff"] },
  { name: "Forest",   colors: ["#0aff00", "#ccff00", "#ffff00"] },
  { name: "Abyss",    colors: ["#001133", "#0044ff", "#00ffff"] },
  { name: "Rose",     colors: ["#ff0044", "#ff66aa", "#ffddee"] },
  { name: "Monochrome", colors: ["#111111", "#888888", "#ffffff"] },
];

function hexToRgb(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

// ── particle ──────────────────────────────────────────────────────────────────
interface Particle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;       // 0→1, counts down
  decay: number;
}

function makeParticle(scene: THREE.Scene): Particle {
  const geo = new THREE.SphereGeometry(0.018 + Math.random() * 0.035, 6, 6);
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color().setHSL(0.04 + Math.random() * 0.06, 1, 0.55 + Math.random() * 0.3),
    transparent: true,
    opacity: 1,
  });
  const mesh = new THREE.Mesh(geo, mat);

  // spawn on sphere surface
  const dir = new THREE.Vector3(
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
  ).normalize();
  mesh.position.copy(dir.clone().multiplyScalar(1.05));

  const speed = 1.2 + Math.random() * 2.2;
  const vel = dir.clone().multiplyScalar(speed);
  vel.x += (Math.random() - 0.5) * 0.6;
  vel.y += Math.random() * 0.8 + 0.3; // slight upward bias
  vel.z += (Math.random() - 0.5) * 0.6;

  scene.add(mesh);
  return { mesh, vel, life: 1, decay: 0.018 + Math.random() * 0.022 };
}

interface LavaBackgroundProps {
  paletteIndex?: number;
  autoCycle?: boolean;
}

export default function LavaBackground({ paletteIndex = -1, autoCycle = true }: LavaBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paletteIndexRef = useRef(paletteIndex);

  useEffect(() => { paletteIndexRef.current = paletteIndex; }, [paletteIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 2.8);

    const startPalette = LAVA_PALETTES[Math.max(0, paletteIndexRef.current)] ?? LAVA_PALETTES[0];
    const targetColors = startPalette.colors.map(hexToRgb);
    const currentColors = startPalette.colors.map(hexToRgb);

    const uniforms = {
      uTime:      { value: 0 },
      uExplosion: { value: 0 },
      uColor1:    { value: currentColors[0].clone() },
      uColor2:    { value: currentColors[1].clone() },
      uColor3:    { value: currentColors[2].clone() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader:   `${snoiseGLSL}\n${lavaVertGLSL}`,
      fragmentShader: `${snoiseGLSL}\n${lavaFragGLSL}`,
    });

    const geo  = new THREE.SphereGeometry(1, 128, 128);
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    // ── resize ────────────────────────────────────────────────────────────────
    const handleResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // ── mouse ─────────────────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ── explosion state ───────────────────────────────────────────────────────
    // phase: idle → buildup → peak → decay → idle
    type Phase = "idle" | "buildup" | "peak" | "decay";
    const expl = { phase: "idle" as Phase, t: 0, nextAt: 3 + Math.random() * 5 };
    const particles: Particle[] = [];
    const gravity = new THREE.Vector3(0, -2.4, 0);

    // ── palette state ─────────────────────────────────────────────────────────
    let currentPaletteIndex = Math.max(0, Math.min(LAVA_PALETTES.length - 1, paletteIndexRef.current < 0 ? 0 : paletteIndexRef.current));
    targetColors.forEach((c, i) => c.copy(hexToRgb(LAVA_PALETTES[currentPaletteIndex].colors[i])));
    currentColors.forEach((c, i) => c.copy(targetColors[i]));

    const palette = {
      transition: 1,
      duration: 2.5, // seconds for a full lerp
      nextSwitchAt: autoCycle && paletteIndexRef.current < 0 ? 6 + Math.random() * 8 : Infinity,
      lastManagedIndex: paletteIndexRef.current,
    };

    // ── animate ───────────────────────────────────────────────────────────────
    const startTime = performance.now();
    let elapsed = 0;
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      elapsed = (performance.now() - startTime) / 1000;
      const dt = Math.min(elapsed - uniforms.uTime.value, 0.05);
      uniforms.uTime.value = elapsed;

      // mouse follow
      mesh.rotation.y += ( mouse.x * Math.PI * 0.6 - mesh.rotation.y) * 0.04;
      mesh.rotation.x += (-mouse.y * Math.PI * 0.3 - mesh.rotation.x) * 0.04;

      // explosion state machine
      switch (expl.phase) {
        case "idle":
          uniforms.uExplosion.value += (0 - uniforms.uExplosion.value) * 0.1;
          if (elapsed >= expl.nextAt) {
            expl.phase = "buildup";
            expl.t = 0;
          }
          break;

        case "buildup":
          expl.t += dt * 1.4;
          uniforms.uExplosion.value = expl.t * expl.t; // ease-in
          if (expl.t >= 1) {
            expl.phase = "peak";
            expl.t = 0;
            // spawn particles on explosion
            const count = 60 + Math.floor(Math.random() * 60);
            for (let i = 0; i < count; i++) particles.push(makeParticle(scene));
          }
          break;

        case "peak":
          uniforms.uExplosion.value = 1;
          expl.t += dt;
          if (expl.t >= 0.15) { expl.phase = "decay"; expl.t = 0; }
          break;

        case "decay":
          expl.t += dt * 0.7;
          uniforms.uExplosion.value = 1 - expl.t;
          if (expl.t >= 1) {
            expl.phase = "idle";
            // next explosion: 4–12 s later
            expl.nextAt = elapsed + 4 + Math.random() * 8;
          }
          break;
      }

      // palette switching — independent of explosion
      const managedIndex = paletteIndexRef.current;
      if (managedIndex !== palette.lastManagedIndex) {
        palette.lastManagedIndex = managedIndex;
        currentPaletteIndex = managedIndex < 0
          ? currentPaletteIndex
          : Math.max(0, Math.min(LAVA_PALETTES.length - 1, managedIndex));
        targetColors.forEach((c, i) => c.copy(hexToRgb(LAVA_PALETTES[currentPaletteIndex].colors[i])));
        palette.transition = 0;
        palette.nextSwitchAt = autoCycle && managedIndex < 0 ? elapsed + 6 + Math.random() * 8 : Infinity;
      } else if (autoCycle && managedIndex < 0 && elapsed >= palette.nextSwitchAt) {
        let nextIndex = currentPaletteIndex;
        while (nextIndex === currentPaletteIndex && LAVA_PALETTES.length > 1) {
          nextIndex = Math.floor(Math.random() * LAVA_PALETTES.length);
        }
        currentPaletteIndex = nextIndex;
        targetColors.forEach((c, i) => c.copy(hexToRgb(LAVA_PALETTES[currentPaletteIndex].colors[i])));
        palette.transition = 0;
        palette.nextSwitchAt = elapsed + 6 + Math.random() * 8;
      }

      // smooth lerp toward target palette
      if (palette.transition < 1) {
        palette.transition = Math.min(1, palette.transition + dt / palette.duration);
        const ease = palette.transition * palette.transition * (3 - 2 * palette.transition); // smoothstep
        for (let i = 0; i < 3; i++) {
          currentColors[i].lerp(targetColors[i], ease);
          (uniforms[`uColor${i + 1}` as 'uColor1'].value as THREE.Color).copy(currentColors[i]);
        }
      }

      // update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;
        if (p.life <= 0) {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.MeshBasicMaterial).dispose();
          particles.splice(i, 1);
          continue;
        }
        p.vel.addScaledVector(gravity, dt);
        p.mesh.position.addScaledVector(p.vel, dt);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = p.life;
        const s = 0.5 + p.life * 0.5;
        p.mesh.scale.setScalar(s);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      particles.forEach(p => {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.MeshBasicMaterial).dispose();
      });
      renderer.dispose();
      geo.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
