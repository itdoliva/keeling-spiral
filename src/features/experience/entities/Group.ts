import * as THREE from 'three'
import { Object3D, ObjectVisualizer } from "@/types/three";

export default class Group implements ObjectVisualizer {
  private group: THREE.Group
  private children: Object3D[]

  constructor() {
    this.group = new THREE.Group()
    this.children = []
  }

  public add(...objects: Object3D[]) {
    for (const object of objects) {
      this.children.push(object)
      this.group.add(object.getObject())
    }
  }

  public remove(...objects: Object3D[]) {
    for (const object of objects) {
      const idx = this.children.indexOf(object)
      if (idx >= 0) this.children.splice(idx, 1)
      this.group.remove(object.getObject())
    }
  }

  public getObject() {
    return this.group
  }

  public dispose() {
    for (let i = this.children.length - 1; i >= 0; i--) {
      this.children[i].dispose()
    }

    this.group.removeFromParent()
  }

  get position() {
    return this.group.position
  }

  get rotation() {
    return this.group.rotation
  }

}