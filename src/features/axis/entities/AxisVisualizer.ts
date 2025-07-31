import * as THREE from 'three'
import * as d3 from "d3"
import { Tick } from '@/features/axis/types'
import Group from '@/features/experience/entities/Group'
import Line from './Line'


export default class AxisVisualizer extends Group {
  private domain: Line
  private ticks: Line[]

  constructor(ticks: Tick[]) {
    super()
    const domainExtent = d3.extent(ticks, d => d.height) as number[]

    this.domain = new Line(domainExtent.map(d => new THREE.Vector3(0, d, 0)))
    this.ticks = ticks.map(d => new Line(d.points))

    this.add(this.domain, ...this.ticks)
  }

  public tick() {
    // 
  }

  public getWorldPosition() {
    const axisPosition = new THREE.Vector3()
    this.getObject().getWorldPosition(axisPosition)
    return axisPosition
  }
}
