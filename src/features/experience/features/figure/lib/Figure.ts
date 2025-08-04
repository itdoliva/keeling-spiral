import * as THREE from 'three'
import Sizes from "@/features/experience/lib/Sizes";
import Axis from "@/features/experience/features/axis/lib/Axis";
import SpiralVisualizer from "@/features/experience/features/spiral/lib/SpiralVisualizer";
import IndicatorVisualizer from '@/features/experience/features/indicator/lib/Indicator';

import movePositionTo from "@/utils/moveTo";

import { FigurePositionTween, IndicatorPositionTween } from "@/config/tween-vars";

import { TransformedDataset } from "@/types/data";
import { Tick } from "@/features/experience/types";
import TweenTransformGroup from '@/features/experience/lib/TweenTransformGroup';

type Viewpoint = 'bottom' | 'front'

export default class Figure extends TweenTransformGroup {
  public axis: Axis
  public spiral: SpiralVisualizer
  public indicator: IndicatorVisualizer

  private viewpoint: Viewpoint
  
  constructor(dataset: TransformedDataset, ticks: Tick[], htmlNode: HTMLElement) {
    super()

    this.spiral = new SpiralVisualizer(dataset)
    this.axis = new Axis(ticks, htmlNode)
    this.indicator = new IndicatorVisualizer()

    this.add(this.spiral, this.axis, this.indicator)

    this.viewpoint = 'front'
  }
 

  public tick(camera: THREE.Camera, sizes: Sizes) {
    super.updateTransforms()
    this.axis.tick(camera, sizes)
  }


  public setViewpoint(viewpoint: Viewpoint) {
    if (this.viewpoint === viewpoint) return

    this.viewpoint = viewpoint
    const rotationX = viewpoint === 'bottom' ? -Math.PI / 2 : 0
    this.rotateTo({ x: rotationX }, FigurePositionTween)

    if (viewpoint === 'front') {
      this.axis.show()
    } else {
      this.axis.hide()
    }
  }

  public toggleViewpoint() {
    this.setViewpoint(this.viewpoint === 'front' ? 'bottom' : 'front')
  }

  public moveTo(distance: number) {
    // Get the current "up" direction based on rotation
    this.translateTo({ y: -distance }, FigurePositionTween)
    // Indicator moves opposite in world Y only (always vertical)
    movePositionTo(this.indicator.object, { y: distance }, IndicatorPositionTween);
  }

}