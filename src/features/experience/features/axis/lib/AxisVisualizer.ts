import * as THREE from 'three'
import * as d3 from "d3"
import { Tick } from '@/features/experience/types'
import Line from '@/features/experience/lib/Line'
import LineGroup from '@/features/experience/lib/LineGroup'


export default class AxisVisualizer extends LineGroup {
  private domain: Line
  private ticks: Line[]

  constructor(ticks: Tick[]) {
    super()

    const domainExtent = d3.extent(ticks, d => d.height) as number[]

    this.domain = this.addSegment(domainExtent.map(d => new THREE.Vector3(0, d, 0)))
    this.ticks = ticks.map(d => this.addSegment(d.points))

    this.add(this.domain, ...this.ticks)
  }

  public tick() {
    // 
  }

  public worldTransform() {
    return this.object.matrixWorld
  }


}
