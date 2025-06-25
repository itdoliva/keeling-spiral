uniform float uSize;
uniform float uTime;
uniform float uBaseCount;
uniform float uAnimation;
attribute float aIndex;
attribute float aRandomness;
attribute float aVisibility;
attribute float aLifetimeStart;
varying float vAnimation;
varying float vIsIncrement;
varying float vVisibility;
varying float vNormalizedLifetime;

float random(vec3 seed) {
  return fract(sin(dot(seed, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

float easeInBack(float x) {
  float c1 = 1.70158;
  float c3 = c1 + 1.;
  return c3 * x * x * x - c1 * x * x;
}

float easeInOutBack(float x) {
  float c1 = 1.70158;
  float c2 = c1 * 1.525;

  float i = step(.5, x);
  float t = (1.0 - i) * (pow(2. * x, 2.) * ((c2 + 1.0) * 2. * x - c2)) / 2.;
  t += (i) * (pow(2. * x - 2., 2.) * ((c2 + 1.) * (x * 2. - 2.) + c2) + 2.) / 2.;
  return t;
}

float ANIMATION_DURATION = 1.0;

void main () {
  float isIncrement = step(uBaseCount + 1.0, aIndex);

  // Spherical rotation
  float amplitude = .015 + aRandomness * .025;
  float speed = .15 + random(vec3(aRandomness)) * .3;
  float theta = 10. * random(position) + uTime + random(position) * uTime * speed;
  float phi = 10. * random(position) + uTime + random(position.zyx) * uTime * speed;

  vec3 displaced = position;
  displaced.x += sin(phi) * cos(theta) * amplitude;
  displaced.y += sin(phi) * sin(theta) * amplitude;
  displaced.z += cos(phi) * amplitude;

  // Position matrix
  vec4 modelPosition = modelMatrix * vec4(displaced, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // Calculate normalized lifetime for appearance/disappearance
  float elapsedAnimationTime = (1.0 - isIncrement); // Always 1 to ordinary nodes
  elapsedAnimationTime += isIncrement * (uTime - aLifetimeStart); // Dynamic on increment nodes

  float normalizedLifetime = clamp(elapsedAnimationTime / ANIMATION_DURATION, 0.0, 1.0);

  // Vertex Size
  gl_PointSize = uSize;
  gl_PointSize += isIncrement * ((.15 * uSize) + (.3 * uSize * (1.0 - easeInOutBack(normalizedLifetime))));
  gl_PointSize *= (1.0 / (-viewPosition.z)); // Size attenuation

  vNormalizedLifetime = normalizedLifetime;
  vVisibility = aVisibility; // Pass the target visibility to fragment
  vAnimation = uAnimation;
  vIsIncrement = isIncrement;
}