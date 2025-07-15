import * as d3 from 'd3'
import * as THREE from 'three'
import Sizes from '@/features/experience/utils/Sizes';
import { Tick } from "@/features/axis/types";

export default class AxisTicklabels {
  private ticks: Tick[]
  private htmlNode: HTMLElement

  constructor(ticks: Tick[], htmlNode: HTMLElement) {
    this.ticks = ticks
    this.htmlNode = htmlNode
  }

  public render(axisPosition: THREE.Vector3, camera: THREE.Camera, sizes: Sizes) {
    const labels = d3.select(this.htmlNode)
      .selectAll<HTMLDivElement, Tick>('.ppm-ticklabel')
      .style('transform', ({ points }) => {
        const screenPosition = points[1].clone()
        screenPosition.add(axisPosition)

        screenPosition.project(camera)

        const translateX = screenPosition.x * sizes.width * 0.5
        const translateY = - screenPosition.y * sizes.height * 0.5

        return `translateX(${translateX}px) translateY(${translateY}px)`
      })
      .data(this.ticks.filter(d => d.type === 'major'), d => d.value)

    labels.exit().remove()
    labels.enter()
      .append('div')
        .attr('class', 'ppm-ticklabel')
      .append('span')
        .text(d => d.value + ' ppm')
  }
}