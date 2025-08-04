import * as THREE from 'three'
import BaseObject from '@/features/experience/lib/BaseObject'
import TweenGeometry from '@/features/experience/lib/TweenGeometry'
import { AxisConfig } from '@/config/three'

export default class Line extends BaseObject {
  private tweenGeometry: TweenGeometry
  
  constructor(vertices: THREE.Vector3[], material: THREE.LineBasicMaterial = new THREE.LineBasicMaterial(AxisConfig.material)) {
    super()
    this.tweenGeometry = new TweenGeometry(vertices)
    this.object = new THREE.Line(this.tweenGeometry.geometry, material)
  }

  dispose() {
    this.tweenGeometry.dispose()
    this.object.removeFromParent()
  }

  tweenVertices(vertices: THREE.Vector3[], duration: number = 1) {
    this.tweenGeometry.tweenTo(vertices, duration)
  }
}