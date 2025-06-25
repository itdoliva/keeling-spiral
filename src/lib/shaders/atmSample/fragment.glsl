uniform float uTime;
varying float vVisibility;
varying float vNormalizedLifetime;
varying float vAnimation;
varying float vIsIncrement;

void main() {
  if (vVisibility == 0. && vNormalizedLifetime == 1.) discard;

  float dist = distance(gl_PointCoord, vec2(.5));

  // Kill fragments that should be fully transparent
  if (dist > 0.5) discard;

  float normDist = 2. * dist;


  float animatedAlpha = (
    (vVisibility * vNormalizedLifetime) + // Fades in from 0 to 1
    ((1.0 - vVisibility) * (1.0 - vNormalizedLifetime)) // Fades out from 1 to 0
  );

  vec3 color = vIsIncrement * mix(vec3(0.4, 0.0, 0.0), vec3(1.0, 0.535, 0.0), (1. - normDist)); // Increment node
  color += (1.0 - vIsIncrement) * mix(vec3(0.2), vec3(0.3), (1. - normDist)); // Ordinary node

  gl_FragColor = vec4(color, animatedAlpha);
  #include <colorspace_fragment>
}