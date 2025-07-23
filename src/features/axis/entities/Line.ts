import { makeBufferGeometry } from '@/lib/helpers'
import * as THREE from 'three'
import { spiralLineMaterial } from '@/features/axis/utils'
import { Object3D } from '@/types/three'
import gsap from 'gsap'
import TweenGeometry from '@/features/experience/entities/TweenGeometry'

export default class Line implements Object3D {
  private tweenGeometry: TweenGeometry
  private line: THREE.Line
  private tween: gsap.core.Tween | null
  
  constructor(positions: THREE.Vector3[]) {
    this.tweenGeometry = new TweenGeometry(positions)
    this.line = new THREE.Line(this.tweenGeometry.geometry, spiralLineMaterial)
    this.tween = null
  }

  getObject() {
    return this.line
  }

  dispose() {
    this.tweenGeometry.dispose()
    this.line.removeFromParent()
  }

  updatePositions(positions: THREE.Vector3[], duration: number = 1) {
    this.tweenGeometry.tweenTo(positions, duration)
  }
}