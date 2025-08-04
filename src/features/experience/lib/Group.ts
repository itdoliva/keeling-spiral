import * as THREE from 'three'
import BaseObject from '@/features/experience/lib/BaseObject';

export default class Group extends BaseObject {
  protected children: BaseObject[]

  constructor() {
    super()
    this.object = new THREE.Group()
    this.children = []
  }

  public add(...objects: BaseObject[]) {
    for (const instance of objects) {
      this.children.push(instance)
      this.object.add(instance.object)
    }
  }

  public remove(...objects: BaseObject[]) {
    for (const instance of objects) {
      const idx = this.children.indexOf(instance)
      if (idx >= 0) this.children.splice(idx, 1)
      this.object.remove(instance.object)
    }
  }

  public dispose() {
    for (let i = this.children.length - 1; i >= 0; i--) {
      this.children[i].dispose()
    }

    this.object.removeFromParent()
  }

}