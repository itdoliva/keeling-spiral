import * as THREE from 'three'

export const CameraConfig = {
  position: new THREE.Vector3(0, 3, 10),
  lookAt: new THREE.Vector3(0, 2.5, 0)
}

export const ControlsConfig = {
  target: new THREE.Vector3(0, 2, 0)
}

export const YearControllerConfig = {
  radius: { ordinary: 1.25, decade: 2.5, hover: 5 },
  margin: { top: 20, bottom: 0 },
  domain: { height: 32, hpad: 18 },
}

