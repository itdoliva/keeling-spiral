import * as THREE from 'three'
import gsap from 'gsap'
import Group from '@/features/experience/lib/Group'
import { AxisConfig } from '@/config/three'
import Line from './Line'

export default class LineGroup extends Group {
  protected material: THREE.LineBasicMaterial

  constructor() {
    super()
    this.material = new THREE.LineBasicMaterial(AxisConfig.material)
  }

  addSegment(vertices: THREE.Vector3[]) {
    const segment = new Line(vertices, this.material)
    this.add(segment)
    return segment
  }

  show() {
    gsap.to(this.material, {
      opacity: 1,
      duration: .5,
      ease: 'power2.inOut'
    })
  }

  hide() {
    gsap.to(this.material, {
      opacity: 0,
      duration: .5,
      ease: 'power2.inOut'
    })
  }

}