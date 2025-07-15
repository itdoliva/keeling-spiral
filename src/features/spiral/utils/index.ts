import * as THREE from 'three';
import { SpiralConfig } from '@/config/three';
import { toFloat } from '@/lib/helpers';


export const createLineMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    defines: {
      'SPIRAL_RADIUS': toFloat(SpiralConfig.radius)
    },
    vertexShader: `
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
};



const createMarkerMaterial = () => {
  const material = new THREE.LineBasicMaterial(SpiralConfig.marker.material)

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

const spiralLineMaterial = createLineMaterial()
const spiralMarkerMaterial = createMarkerMaterial()

const spiralMarkerGeometry = new THREE.SphereGeometry(
  SpiralConfig.marker.geometry.radius, 
  SpiralConfig.marker.geometry.widthSegments, 
  SpiralConfig.marker.geometry.heightSegments
)


export const createSpiralLine = (geometry: THREE.BufferGeometry) => {
  return new THREE.Line(geometry, spiralLineMaterial)
}

export const createSpiralMarker = () => {
  return new THREE.Mesh(spiralMarkerGeometry, spiralMarkerMaterial)
}