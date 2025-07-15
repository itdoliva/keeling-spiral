import * as THREE from 'three'

export default class World {
  private scene: THREE.Scene

  constructor() {
    this.scene = new THREE.Scene()
  }

  public add(...objects: THREE.Object3D[]) {
    this.scene.add(...objects)
  }

  public tick() {
    
  }
}