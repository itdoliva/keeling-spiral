import * as d3 from 'd3'
import * as THREE from 'three'
import gsap from 'gsap'
import Sizes from '@/features/experience/lib/Sizes';
import { Tick } from "@/features/axis/types";

export default class AxisTicklabels {
  private ticks: Tick[]
  private htmlNode: HTMLElement

  constructor(ticks: Tick[], htmlNode: HTMLElement) {
    this.ticks = ticks
    this.htmlNode = htmlNode
  }

  public render(worldTransform: THREE.Matrix4, camera: THREE.Camera, sizes: Sizes) {
    const labels = d3.select(this.htmlNode)
      .selectAll<HTMLDivElement, Tick>('.ppm-ticklabel')
      .each(function (d) {
        const el = d3.select(this)

        const { points } = d
        const worldPosition = points[1].clone()
        
        // Apply parent transform
        worldPosition.applyMatrix4(worldTransform)
        
        // Transform to camera space (view space)
        const cameraPosition = worldPosition.clone()
        cameraPosition.applyMatrix4(camera.matrixWorldInverse)

        // Get screen position
        const screenPosition = worldPosition.clone()
        screenPosition.project(camera)

        const translateX = screenPosition.x * sizes.width * 0.5
        const translateY = - screenPosition.y * sizes.height * 0.5

        el
          .style('display', cameraPosition.z > 0 ? 'none' : 'block')
          .style('transform', `translateX(${translateX}px) translateY(${translateY}px)`)
      })
      .data(this.ticks.filter(d => d.type === 'major'), d => d.value)

    labels.exit().remove()
    labels.enter()
      .append('div')
        .attr('class', 'ppm-ticklabel')
      .append('span')
        .text(d => d.value + ' ppm')
  }

  public show() {
    gsap.to(d3.select(this.htmlNode).selectAll('.ppm-ticklabel').nodes(), {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    })
  }

  public hide() {
    gsap.to(d3.select(this.htmlNode).selectAll('.ppm-ticklabel').nodes(), {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    })
  }
}