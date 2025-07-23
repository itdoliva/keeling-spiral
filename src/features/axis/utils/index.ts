import * as THREE from 'three';
import * as d3 from 'd3'
import { AxisConfig } from '@/config/three';
import { makeBufferGeometry } from '@/lib/helpers'
import { PPMScale } from '@/types/scale';
import { Tick, TickType } from '../types';

export const spiralLineMaterial = new THREE.LineBasicMaterial(AxisConfig.material)

export const createLine = (positions: number[] | THREE.Vector3[]): THREE.Line => {
  const geometry = makeBufferGeometry(positions)
  return new THREE.Line(geometry, spiralLineMaterial)
}

const createTickpoints = (height: number, size: number, leftward: boolean) => {
  return [
    new THREE.Vector3(0, height, 0),
    new THREE.Vector3(leftward ? -size : size, height, 0)
  ]
}

export const makeTicks = <T>(
  data: T[], 
  labelAcc: (d: T) => string,
  valueAcc: (d: T) => number, 
  valueScale: d3.ScaleLinear<number, number>,
  typeFn: (value: number) => TickType,
  leftward: boolean = true,
  tickSizes: typeof AxisConfig.tickSizes = AxisConfig.tickSizes,
) => {
  return data.map(d => {
    const label = labelAcc(d)
    const value = valueAcc(d)
    const height = valueScale(value)
    const type = typeFn(value)
    const points = createTickpoints(height, tickSizes[type], leftward)
    return { label, value, height, type, points }
  })
}

export const ppmTickType = (value: number): TickType => {
  if (value % 10 === 0) {
    return 'major';
  }
  else if (value % 5 === 0) {
    return 'half';
  }
  else {
    return 'minor';
  }
}

export const makePPMTicks = (scale: PPMScale) => {
  const [ minValue, maxValue ] = scale.domain()
  const ppmValues = d3.range(minValue, maxValue + 1, 1) as number[]
  return makeTicks(ppmValues, d => d.toString(), d => d, scale, ppmTickType)
}
