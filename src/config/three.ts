import * as THREE from 'three';

export const SpiralConfig = {
  lengthRange: 25,
  radius: 1,
  angleStart: 0,
  angleEnd: -2*Math.PI,
  offset: .5,
  marker: {
    geometry: {
      radius: .01,
      widthSegments: 16,
      heightSegments: 16
    },
    material: {
      color: 0x5c5c5c,
      transparent: true
    }
  }
}

export const AxisConfig = {
  tickSizes: {
    major: 0.3,
    half: 0.125,
    minor: 0.05,
  },
  material: {
    color: 0x1c1c1c,
    linewidth: 1 
  }
}

export const IndicatorConfig = {
  geometry: {
    radius: .075, 
    widthSegments: 16, 
    heightSegments: 16
  },
  material: {
    color: 0x1c1c1c
  }
}

export const AtmSampleConfig = {
  radius: .16,
  size: 12,
  height: 3
};
export const CameraConfig = {
  position: new THREE.Vector3(0, 0, 10),
  lookAt: new THREE.Vector3(0, 0, 0)
}

