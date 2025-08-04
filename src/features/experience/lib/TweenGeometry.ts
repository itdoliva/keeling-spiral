import { makeBufferGeometry } from '@/lib/helpers'
import * as THREE from 'three'
import gsap from 'gsap'

export default class TweenGeometry {
  public geometry: THREE.BufferGeometry
  private positionAttr: THREE.BufferAttribute
  private tween: gsap.core.Tween | null
  private tweenT: number

  constructor(vertices: THREE.Vector3[]) {
    this.geometry = makeBufferGeometry(vertices)
    this.positionAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute
    this.tween = null
    this.tweenT = 0
  }

  private onTweenUpdate(
    startPositionAttr: THREE.BufferAttribute, 
    endPositions: THREE.Vector3[],
    startCount: number,
    endCount: number
  ) {
    const currentCount = Math.round(THREE.MathUtils.lerp(startCount, endCount, this.tweenT))
    this.geometry.setDrawRange(0, currentCount)

    const maxVisible = Math.max(startCount, currentCount)
    for (let i = 0; i < maxVisible; i++) {
      let origX: number, origY: number, origZ: number
      
      if (i < startPositionAttr.count) {
        // Use existing position
        origX = startPositionAttr.getX(i)
        origY = startPositionAttr.getY(i)
        origZ = startPositionAttr.getZ(i)
      } 
      else {
        const prevTarget = endPositions[i - 1] || new THREE.Vector3(0, 0, 0)
        origX = prevTarget.x
        origY = prevTarget.y
        origZ = prevTarget.z
      }

      const target = endPositions[i] || new THREE.Vector3(0, 0, 0)

      // Skip if positions are identical
      if (origX === target.x && origY === target.y && origZ === target.z) {
        continue
      }

      this.positionAttr.setXYZ(i,
        THREE.MathUtils.lerp(origX, target.x, this.tweenT),
        THREE.MathUtils.lerp(origY, target.y, this.tweenT), 
        THREE.MathUtils.lerp(origZ, target.z, this.tweenT))
    }

    this.positionAttr.needsUpdate = true
  }

  private ensureBufferSize(minCount: number) {
    if (this.positionAttr.count >= minCount) return

    // Create new larger buffer
    const newPositions = new Float32Array(minCount * 3)
    
    // Copy existing positions
    for (let i = 0; i < this.positionAttr.count; i++) {
      newPositions[i * 3] = this.positionAttr.getX(i)
      newPositions[i * 3 + 1] = this.positionAttr.getY(i)
      newPositions[i * 3 + 2] = this.positionAttr.getZ(i)
    }

    // Update the geometry
    this.geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
    this.positionAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute
  }

  private onTweenEnd(endCount: number) {
    this.geometry.setDrawRange(0, endCount)
    this.tween = null
  }

  public tweenTo(vertices: THREE.Vector3[], duration: number) {
    if (this.tween) {
      this.tween.kill()
    }

    const startPositionAttr = this.geometry.getAttribute('position').clone()
    const startCount = this.geometry.drawRange.count || this.positionAttr.count
    const endCount = vertices.length

    // Ensure we have enough buffer space for all vertices
    const maxCount = Math.max(this.positionAttr.count, endCount)
    this.ensureBufferSize(maxCount)

    this.tweenT = 0
    this.tween = gsap.to(this, {
      tweenT: 1,
      duration,
      onUpdateParams: [ startPositionAttr, vertices, startCount, endCount ],
      onUpdate: this.onTweenUpdate.bind(this),
      onComplete: () => this.onTweenEnd(endCount),
      onInterrupt: () => this.onTweenEnd(endCount)
    })
  }

  public dispose() {
    this.geometry.dispose()
    
    if (this.tween) this.tween.kill()
    this.tween = null
    this.tweenT = 0
  }
}