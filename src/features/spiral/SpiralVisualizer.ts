import * as THREE from 'three'
import { makeBufferGeometry } from '@/lib/helpers';
import { TransformedDataset } from "@/types/data";
import { createSpiralLine, createSpiralMarker } from '@/features/spiral/utils';

const createLine = (positions: number[]): THREE.Line => {
  const geometry = makeBufferGeometry(positions);
  return createSpiralLine(geometry)
}

const createMarker = (): THREE.Mesh => {
  return createSpiralMarker()
}

export default class SpiralVisualizer {
  private object: THREE.Group
  private line: THREE.Line
  private markers: THREE.Mesh[]

  constructor(dataset: TransformedDataset) {
    const linePositions = dataset.monthly.flatMap(({ coordinate }) => {
      return [ coordinate.x, coordinate.y, coordinate.z ]
    })

    this.line = createLine(linePositions)
    this.markers = dataset.monthly.map(({ coordinate }) => {
      const marker = createMarker()
      marker.position.copy(coordinate)
      return marker
    })

    this.object = new THREE.Group()
    this.object.add(this.line, ...this.markers)
  }

  public update() {
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

    this.object.remove(this.line, ...this.markers)
  }

  public getObject() {
    return this.object
  }
}