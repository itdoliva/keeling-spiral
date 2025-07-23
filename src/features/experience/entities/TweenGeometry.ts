import { makeBufferGeometry } from '@/lib/helpers'
import * as THREE from 'three'
import gsap from 'gsap'

export default class TweenGeometry {
  public geometry: THREE.BufferGeometry
  private positionAttr: THREE.BufferAttribute
  private tween: gsap.core.Tween | null
  private tweenT: number

  constructor(positions: THREE.Vector3[]) {
    this.geometry = makeBufferGeometry(positions)
    this.positionAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute
    this.tween = null
    this.tweenT = 0
  }

  private onTweenUpdate(startPositionAttr: THREE.BufferAttribute, endPositions: THREE.Vector3[]) {
    for (let i = 0; i < endPositions.length; i++) {
      const origX = startPositionAttr.getX(i)
      const origY = startPositionAttr.getY(i)
      const origZ = startPositionAttr.getZ(i)

      const target = endPositions[i]

      this.positionAttr.setXYZ(i,
        THREE.MathUtils.lerp(origX, target.x, this.tweenT),
        THREE.MathUtils.lerp(origY, target.y, this.tweenT), 
        THREE.MathUtils.lerp(origZ, target.z, this.tweenT))
    }
    this.positionAttr.needsUpdate = true
  }

  private onTweenEnd() {
    this.tween = null
  }

  public tweenTo(positions: THREE.Vector3[], duration: number) {
    if (this.positionAttr.count !== positions.length) {
      console.warn('Mismatch in position count; consider rebuilding the geometry.');
      return
    }

    if (this.tween) {
      this.tween.kill()
    }

    const startPositionAttr = this.geometry.getAttribute('position').clone()

    this.tweenT = 0
    this.tween = gsap.to(this, {
      tweenT: 1,
      duration,
      onUpdateParams: [ startPositionAttr, positions ],
      onUpdate: this.onTweenUpdate.bind(this),
      onComplete: this.onTweenEnd.bind(this),
      onInterrupt: this.onTweenEnd.bind(this)
    })
  }

  public dispose() {
    this.geometry.dispose()
    
    if (this.tween) this.tween.kill()
    this.tween = null
    this.tweenT = 0
  }

  
}