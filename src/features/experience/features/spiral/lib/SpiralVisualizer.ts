import * as THREE from 'three'
import { makeBufferGeometry } from '@/lib/helpers';
import { MonthlyDatum, TransformedDatum, TransformedDataset } from "@/types/data";
import { createSpiralLine, createSpiralMarker } from '@/features/experience/features/spiral/utils';
import BaseObject from '@/features/experience/lib/BaseObject';
import Line from '@/features/experience/lib/Line';


const createLine = (positions: number[]): THREE.Line => {
  const geometry = makeBufferGeometry(positions);
  return createSpiralLine(geometry)
}

const createMarker = (): THREE.Mesh => {
  return createSpiralMarker()
}

export default class SpiralVisualizer extends BaseObject {
  private line: Line
  private markers: THREE.Mesh[]

  constructor(dataset: TransformedDataset) {
    super()

    const lineVertices = dataset.interpolated.flatMap(({ coordinate }) => {
      return new THREE.Vector3(coordinate.x, coordinate.y, coordinate.z)
    })

    this.line = new Line(lineVertices)

    this.markers = dataset.monthly.map(({ coordinate }) => {
      const marker = createMarker()
      marker.position.copy(coordinate)
      return marker
    })

    this.object = new THREE.Group()
    this.object.add(this.line.object, ...this.markers)
  }

  public render() {
    // Update logic
  }

  public reposition() {
    // Reposition logic
  }

  public dispose() {
    this.line.dispose()

    for (let i = this.markers.length - 1; i >= 0; i--) {
      this.markers[i].geometry.dispose()
    }

    this.object.remove(...this.markers)
    this.object.removeFromParent()
  }

}