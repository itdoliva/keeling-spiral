import * as THREE from 'three'

export const handleColorChange = (color: THREE.Color) => {
  return (hex: number) => {
    color.setHex(hex)
  }
}

const toBufferAttribute = (array: number[]) => {
  return new THREE.BufferAttribute(new Float32Array(array), 3)
}

export const makeBufferGeometry = (positions: number[] | THREE.Vector3[]) => {
  const geometry = new THREE.BufferGeometry()

  if (!(positions instanceof Array) || positions.length === 0) {
    console.warn('Invalid positions array provided to makeBufferGeometry')
    return geometry
  }

  if (positions[0] instanceof THREE.Vector3) {
    geometry.setFromPoints(<THREE.Vector3[]>positions)
  }
  else if (typeof positions[0] === 'number') {
    geometry.setAttribute('position', toBufferAttribute(<number[]>positions))
  }

  return geometry
}

export const isDecade = (year: string): boolean => {
  if (year.length !== 4 || isNaN(Number(year))) {
    throw new Error('Invalid year format. Year must be a 4-digit number.');
  }
  return Number(year) % 10 === 0
}

export const formatDecade = (year: string): string => {
  if (year === '2000') {
    return '2000s'
  }
  return "'" + year.slice(2, 4) + 's'
}

export const bodyStyle = {
  setCursor: (value: string) => document.body.style.cursor = value,
  resetCursor: () => document.body.style.cursor = 'auto',
  disableSelect: () => document.body.style.userSelect = 'none',
  enableSelect: () => document.body.style.userSelect = '',
}

export const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
  )
}

export const makeTestMesh = () => {
  const geometry = new THREE.CylinderGeometry( 1.5, 1.5, 4, 32)
  const material = new THREE.MeshBasicMaterial( { color: 0xc1d4c0, opacity: .95 } );
  material.transparent = true
  const mesh = new THREE.Mesh( geometry, material )
  mesh.position.set(0, 2, 0)

  return mesh
}

export const getMeshBoundingBox = (mesh: THREE.Mesh) => {
  const boundingBox = new THREE.Box3()
  const size = new THREE.Vector3()
  boundingBox.setFromObject(mesh)
  boundingBox.getSize(size)
  return size
}