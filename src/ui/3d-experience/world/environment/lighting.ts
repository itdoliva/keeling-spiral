import * as THREE from 'three'

const ambientLight = new THREE.AmbientLight(0xffffff, 1)

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(5, 30, 5)
directionalLight.castShadow = false
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 10
directionalLight.shadow.normalBias = 0.05

const pointLight = new THREE.PointLight(0xd6c580, 30)
pointLight.position.set(0.15, 5, -5)
pointLight.castShadow = false


export {
  ambientLight,
  directionalLight,
  pointLight
}