"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { snoiseGLSL } from "./snoise3D";
import { lavaVertGLSL } from "./lavaFluid.vert";
import { lavaFragGLSL } from "./lavaFluid.frag";

export default function LavaFluidOrb() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3);

    const uniforms = {
      uTime:   { value: 0 },
      uColor1: { value: new THREE.Color("#ff2200") },
      uColor2: { value: new THREE.Color("#ff8800") },
      uColor3: { value: new THREE.Color("#ffee00") },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader:   `${snoiseGLSL}\n${lavaVertGLSL}`,
      fragmentShader: `${snoiseGLSL}\n${lavaFragGLSL}`,
    });

    const geo  = new THREE.SphereGeometry(1, 128, 128);
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    const startTime = performance.now();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      uniforms.uTime.value = (performance.now() - startTime) / 1000;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      geo.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
