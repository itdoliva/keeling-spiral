import * as THREE from 'three'
import * as d3 from "d3"
import { createLine } from '@/features/axis/utils'
import { Tick } from '@/features/axis/types'


export default class AxisVisualizer {
  private object: THREE.Group
  private domain: THREE.Line
  private ticks: THREE.Line[]

  constructor(ticks: Tick[]) {
    const domainExtent = d3.extent(ticks, d => d.height) as number[]

    this.domain = createLine(domainExtent.map(d => new THREE.Vector3(0, d, 0)))
    this.ticks = ticks.map(d => createLine(d.points))
    this.object = new THREE.Group()
    this.object.add(this.domain, ...this.ticks)
  }

  public getObject() {
    return this.object
  }

  public tick() {
    // 
  }

  public dispose() {
    for (let i = this.object.children.length - 1; i >= 0; i--) {
      const child = this.object.children[i] as THREE.Line
      child.geometry.dispose()
      this.object.remove(child)
    }
  }

  public getWorldPosition() {
    const axisPosition = new THREE.Vector3()
    this.object.getWorldPosition(axisPosition)
    return axisPosition
  }
}
