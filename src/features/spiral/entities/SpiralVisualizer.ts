import * as THREE from 'three'
import { makeBufferGeometry } from '@/lib/helpers';
import { MonthlyDatum, TransformedDatum, TransformedDataset } from "@/types/data";
import { createSpiralLine, createSpiralMarker } from '@/features/spiral/utils';
import { ObjectVisualizer } from '@/types/three';

const createLine = (positions: number[]): THREE.Line => {
  const geometry = makeBufferGeometry(positions);
  return createSpiralLine(geometry)
}

const createMarker = (): THREE.Mesh => {
  return createSpiralMarker()
}

export default class SpiralVisualizer implements ObjectVisualizer {
  private spiral: THREE.Group
  private line: THREE.Line
  private markers: THREE.Mesh[]

  constructor(dataset: TransformedDataset) {
    const linePositions = dataset.interpolated.flatMap(({ coordinate }) => {
      return [ coordinate.x, coordinate.y, coordinate.z ]
    })

    this.line = createLine(linePositions)

    this.markers = dataset.monthly.map(({ coordinate }) => {
      const marker = createMarker()
      marker.position.copy(coordinate)
      return marker
    })

    this.spiral = new THREE.Group()
    this.spiral.add(this.line, ...this.markers)
  }

  public render() {
    // Update logic
  }

  public reposition() {
    // Reposition logic
  }

  public dispose() {
    this.line.geometry.dispose()

    for (let i = this.markers.length - 1; i >= 0; i--) {
      this.markers[i].geometry.dispose()
    }

    this.spiral.remove(this.line, ...this.markers)
    this.spiral.removeFromParent()
  }

  public getObject() {
    return this.spiral
  }

  get position() {
    return this.spiral.position
  }

  get rotation() {
    return this.spiral.rotation
  }
}