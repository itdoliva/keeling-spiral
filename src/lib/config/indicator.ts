import * as THREE from 'three'

export const IndicatorGeometryParams = {
  radius: .075, 
  widthSegments: 16, 
  heightSegments: 16
}

export const IndicatorMaterialParams = {
  color: 0xdd2323
}

export const createIndicatorGeometry = () => {
  const { radius, widthSegments, heightSegments } = IndicatorGeometryParams
  return new THREE.SphereGeometry(radius, widthSegments, heightSegments)
}

export const createIndicatorMaterial = () => {
  const material = new THREE.MeshMatcapMaterial()
  material.side = THREE.DoubleSide
  return material
}

const indicatorGeometry = createIndicatorGeometry()
// const indicatorMaterial = createIndicatorMaterial()
const indicatorMaterial = new THREE.MeshStandardMaterial({ color: 0x1c1c1c })

export const createIndicator = () => {
  return new THREE.Mesh(indicatorGeometry, indicatorMaterial)
}

