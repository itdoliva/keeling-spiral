import * as THREE from 'three'

export const CAMERA = {
  position: new THREE.Vector3(0, 3, 10),
  lookAt: new THREE.Vector3(0, 2.5, 0)
}

export const CHART_CONFIG = {
  lengthRange: 25,
  radius: 1,
}

export const AXIS_OFFSET = .5

export const TICK_SIZES = {
  major: new THREE.Vector3(-.3, 0, 0),
  half: new THREE.Vector3(-.125, 0, 0),
  minor: new THREE.Vector3(-.05, 0, 0)
}

export const MONTH_LABELS = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec'
}