import * as THREE from 'three'
import * as d3 from 'd3'
import AxisTicklabels from '@/features/axis/entities/AxisTicklabels';
import AxisVisualizer from '@/features/axis/entities/AxisVisualizer';
import { Tick } from '@/features/axis/types';
import { PPMScale } from '@/types/scale'
import Sizes from '@/features/experience/entities/Sizes';
import { ObjectVisualizer } from '@/types/three';

export default class Axis implements ObjectVisualizer {
  private ticks: Tick[]
  private ticklabels: AxisTicklabels
  private visualizer: AxisVisualizer

  constructor(ticks: Tick[], htmlNode: HTMLElement) {
    this.ticks = ticks
    this.ticklabels = new AxisTicklabels(this.ticks, htmlNode)
    this.visualizer = new AxisVisualizer(this.ticks)
  }

  public tick(camera: THREE.Camera, sizes: Sizes) {
    this.ticklabels.render(this.visualizer.getWorldPosition(), camera, sizes)
    this.visualizer.tick()
  }

  public getObject() {
    return this.visualizer.getObject()
  }

  public dispose() {
    this.visualizer.dispose()
  }
  get position() {
    return this.getObject().position
  }

  get rotation() {
    return this.getObject().rotation
  }
}