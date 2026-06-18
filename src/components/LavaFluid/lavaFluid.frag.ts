export const lavaFragGLSL = /* glsl */`
uniform float uTime;
uniform float uExplosion;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  float n1 = snoise(vPosition * 1.0 + uTime * 0.30) * 0.5;
  float n2 = snoise(vPosition * 2.0 - uTime * 0.40) * 0.3;
  float n3 = snoise(vPosition * 4.0 + uTime * 0.55) * 0.2;
  float n  = n1 + n2 + n3;
  float t  = clamp(n * 0.5 + 0.5, 0.0, 1.0);

  // boost heat toward white-hot during explosion
  t = clamp(t + uExplosion * 0.6, 0.0, 1.0);

  vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, t));
  color       = mix(color,  uColor3, smoothstep(0.5, 1.0, t));
  // white core at peak
  color       = mix(color, vec3(1.0, 0.98, 0.9), smoothstep(0.7, 1.0, t) * uExplosion);

  float crack = smoothstep(0.02, 0.0, abs(snoise(vPosition * 6.0 + uTime * 0.2)));
  float crackBoost = 1.0 + uExplosion * 3.0;
  vec3  gold  = vec3(1.0, 0.92, 0.35);
  color = mix(color, gold, crack * 0.85 * crackBoost);

  vec3  viewDir = normalize(cameraPosition - vWorldPos);
  float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
  fresnel = pow(fresnel, 2.0);
  // edge glow flares during explosion
  color += fresnel * uColor3 * (0.25 + uExplosion * 1.5);

  gl_FragColor = vec4(color, 1.0);
}
`;
