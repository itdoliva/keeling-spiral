import * as THREE from 'three'
import { toFloat } from '../helpers'

/* 
  Spiral Config
*/

const ANGLE_START = 0
const ANGLE_END = -2*Math.PI

export const SpiralConfig = {
  lengthRange: 25,
  radius: 1,
  angleStart: ANGLE_START,
  angleEnd: ANGLE_END,
  offset: .5
}

/* 
  Spiral Line Mesh
*/

export const SpiralLineMaterialParams = { 
  color: 0x1c1c1c,
  linewidth: 1 
}

export const createSpiralLineMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    vertexShader: `
      #define SPIRAL_RADIUS ${toFloat(SpiralConfig.radius)}
      varying float vNormalizedZ;
  
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
  
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  
        vNormalizedZ = (modelPosition.z + SPIRAL_RADIUS) / (2.0 * SPIRAL_RADIUS);
      }
    `,
    fragmentShader: `
      varying float vNormalizedZ;

      float easeInOutQuart(float v) {
        float i = step(0.5, v);
        float easeIn = 8.0 * v * v * v * v;
        float easeOut = 1.0 - pow(-2.0 * v + 2.0, 4.0) / 2.0;
        return mix(easeIn, easeOut, i);
      }

  
      void main() {
        float alpha = easeInOutQuart(vNormalizedZ) * 0.8 + 0.2;
        // float alpha = vNormalizedZ;
        gl_FragColor = vec4(vec3(28./255.), alpha); // white line with variable opacity
      }
    `,
  })
}

const spiralLineMaterial = createSpiralLineMaterial()

export const createSpiralLine = (geometry: THREE.BufferGeometry) => {
  return new THREE.Line(geometry, spiralLineMaterial)
}

/* 
  Spiral Marker Mesh
*/

export const SpiralMarkerGeometryParams = {
  radius: .01,
  widthSegments: 16,
  heightSegments: 16
}

export const SpiralMarkerMaterialParams = { 
  color: 0x5c5c5c,
  transparent: true 
}

export const createSpiralMarkerGeometry = () => {
  const { radius, widthSegments, heightSegments } = SpiralMarkerGeometryParams
  return new THREE.SphereGeometry(radius, widthSegments, heightSegments)
}

export const createSpiralMarkerMaterial = () => {
  const material = new THREE.LineBasicMaterial(SpiralMarkerMaterialParams)

  material.defines = {
    'SPIRAL_RADIUS': toFloat(SpiralConfig.radius)
  }

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
       varying float vNormalizedZ;`
    )
  
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `#include <worldpos_vertex>
       vNormalizedZ = ((modelMatrix * vec4(position, 1.0)).z + SPIRAL_RADIUS) / (2.0 * SPIRAL_RADIUS);`
    )
  
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
       varying float vNormalizedZ;`
    )
  
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      `float alphaZ = (vNormalizedZ * .9 + .1);

      diffuseColor.a *= alphaZ;
  
      #include <opaque_fragment>
      `
    )
  }

  return material
}

const spiralMarkerGeometry = createSpiralMarkerGeometry()
const spiralMarkerMaterial = createSpiralMarkerMaterial()

export const createSpiralMarker = () => {
  return new THREE.Mesh(spiralMarkerGeometry, spiralMarkerMaterial)
}
