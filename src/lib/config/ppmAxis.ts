import * as THREE from 'three';

export const PPMAxisConfig = {
  tickSizes: {
    major: new THREE.Vector3(-.3, 0, 0),
    half: new THREE.Vector3(-.125, 0, 0),
    minor: new THREE.Vector3(-.05, 0, 0)
  }
}

export const PPMAxisMaterialParams = { 
  color: 0x1c1c1c,
  linewidth: 1 
}

export const createPPMAxisMaterial = () => {
  return new THREE.LineBasicMaterial(PPMAxisMaterialParams)
}

export const PPMAxisMaterial = createPPMAxisMaterial()

export const createPPMAxisLine = (geometry: THREE.BufferGeometry) => {
  return new THREE.Line(geometry, PPMAxisMaterial)
}