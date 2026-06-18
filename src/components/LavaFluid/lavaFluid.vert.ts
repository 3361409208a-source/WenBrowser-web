export const lavaVertGLSL = /* glsl */`
uniform float uTime;
uniform float uExplosion;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vPosition = position;
  vNormal   = normalize(normalMatrix * normal);

  float d1 = snoise(position * 1.5 + uTime * 0.30);
  float d2 = snoise(position * 3.0 - uTime * 0.20);
  float disp = (d1 * 0.6 + d2 * 0.4) * 0.14;

  // explosion: sharp random spikes outward
  float spike = snoise(position * 8.0 + uTime * 2.0);
  disp += uExplosion * (0.4 + spike * 0.3);

  vec3 displaced = position + normal * disp;
  vWorldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;
