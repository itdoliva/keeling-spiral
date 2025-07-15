import * as THREE from 'three'
import * as d3 from 'd3'
import AxisTicklabels from '@/features/axis/AxisTicklabels';
import AxisVisualizer from '@/features/axis/AxisVisualizer';
import { makeTick } from '@/features/axis/utils';
import { Tick } from '@/features/axis/types';
import { PPMScale } from '@/types/scale'
import Sizes from '@/features/experience/utils/Sizes';

export default class Axis {
  private ticks: Tick[]
  private ticklabels: AxisTicklabels
  private visualizer: AxisVisualizer

  constructor(scale: PPMScale, htmlNode: HTMLElement) {
    const [ minTick, maxTick ] = scale.domain()
    const tickValues = d3.range(minTick, maxTick + 1, 1)
    
    this.ticks = tickValues.map(value => makeTick(value, scale))

    this.ticklabels = new AxisTicklabels(this.ticks, htmlNode)
    this.visualizer = new AxisVisualizer(this.ticks)
  }

  public dispose() {
    this.visualizer.dispose()
  }

  public tick(camera: THREE.Camera, sizes: Sizes) {
    this.ticklabels.render(this.visualizer.getWorldPosition(), camera, sizes)
    this.visualizer.tick()
  }
}