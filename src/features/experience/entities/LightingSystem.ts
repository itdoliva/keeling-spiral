import * as THREE from 'three'

export default class LightingSystem {
  public ambientLight: THREE.AmbientLight
  public directionalLight: THREE.DirectionalLight
  public pointLight: THREE.PointLight

  constructor() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1)

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 3)
    this.directionalLight.position.set(5, 30, 5)
    this.directionalLight.castShadow = false
    this.directionalLight.shadow.mapSize.set(1024, 1024)
    this.directionalLight.shadow.camera.near = 0.5
    this.directionalLight.shadow.camera.far = 10
    this.directionalLight.shadow.normalBias = 0.05

    this.pointLight = new THREE.PointLight(0xd6c580, 30)
    this.pointLight.position.set(0.15, 5, -5)
    this.pointLight.castShadow = false
  }

  public getLights() {
    return [ this.ambientLight, this.directionalLight, this.pointLight ]
  }
}