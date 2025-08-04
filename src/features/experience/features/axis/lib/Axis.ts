import * as THREE from 'three'
import AxisTicklabels from '@/features/experience/features/axis/lib/AxisTicklabels';
import AxisVisualizer from '@/features/experience/features/axis/lib/AxisVisualizer';
import { Tick } from '@/features/experience/types';
import Sizes from '@/features/experience/lib/Sizes';
import BaseObject from '@/features/experience/lib/BaseObject';

export default class Axis extends BaseObject {
  private ticks: Tick[]
  private ticklabels: AxisTicklabels
  private visualizer: AxisVisualizer

  constructor(ticks: Tick[], htmlNode: HTMLElement) {
    super()

    this.ticks = ticks
    this.ticklabels = new AxisTicklabels(this.ticks, htmlNode)
    this.visualizer = new AxisVisualizer(this.ticks)

    this.object = this.visualizer.object
  }

  public tick(camera: THREE.Camera, sizes: Sizes) {
    this.ticklabels.render(this.visualizer.worldTransform(), camera, sizes)
    this.visualizer.tick()
  }


  public dispose() {
    this.visualizer.dispose()
  }

  public hide() {
    this.visualizer.hide()
    this.ticklabels.hide()
  }

  public show() {
    this.visualizer.show()
    this.ticklabels.show()
  }


}