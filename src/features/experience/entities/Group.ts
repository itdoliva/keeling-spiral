import * as THREE from 'three'
import { ObjectVisualizer } from "@/types/three";

export default class Group implements ObjectVisualizer {
  private group: THREE.Group
  private children: ObjectVisualizer[]

  constructor() {
    this.group = new THREE.Group()
    this.children = []
  }

  public add(...objects: ObjectVisualizer[]) {
    for (const object of objects) {
      this.children.push(object)
      this.group.add(object.getObject())
    }
  }

  public remove(...objects: ObjectVisualizer[]) {
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