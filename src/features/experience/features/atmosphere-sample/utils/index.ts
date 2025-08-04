import { AtmSampleConfig } from '@/config/three';
import * as THREE from 'three';


export const randomizeCylindricalPosition = () => {
  const theta = 2 * Math.PI * Math.random()
  const radius = AtmSampleConfig.radius * Math.cbrt(Math.random())
  const height = -AtmSampleConfig.height / 2 + AtmSampleConfig.height * Math.random()

  return new THREE.Vector3(
    radius * Math.sin(theta),
    height,
    radius * Math.cos(theta)
  )
}

export const randomizeSphericalPosition = () => {
  const theta = 2 * Math.PI * Math.random()
  const phi = Math.acos(2 * Math.random() - 1)
  const radius = AtmSampleConfig.radius * Math.cbrt(Math.random())

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  )
}
