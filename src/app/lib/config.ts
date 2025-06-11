import * as THREE from 'three'


export const YEAR_CONTROLLER = {
  radius: { ordinary: 1.25, decade: 2.5, hover: 5 },
  margin: { top: 20, bottom: 0 },
  domain: { height: 32, hpad: 18 },
}

export const CAMERA = {
  position: new THREE.Vector3(0, 3, 10),
  lookAt: new THREE.Vector3(0, 2.5, 0)
}

// const ANGLE_START = Math.PI/2 + Math.PI/3.7
// const ANGLE_END = -2*Math.PI + ANGLE_START
const ANGLE_START = 0
const ANGLE_END = -2*Math.PI

export const CHART_CONFIG = {
  lengthRange: 25,
  radius: 1,
  angleStart: ANGLE_START,
  angleEnd: ANGLE_END
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