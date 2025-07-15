
export const PPMAxisConfig = {
  tickSizes: {
    major: 0.3,
    half: 0.125,
    minor: 0.05,
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