import * as THREE from 'three';
import { AxisConfig } from '@/config/three';
import { makeBufferGeometry } from '@/lib/helpers'
import { PPMScale } from '@/types/scale';
import { Tick, TickType } from '../types';

const spiralLineMaterial = new THREE.LineBasicMaterial(AxisConfig.material)

export const createLine = (positions: number[] | THREE.Vector3[]): THREE.Line => {
  const geometry = makeBufferGeometry(positions)
  return new THREE.Line(geometry, spiralLineMaterial)
};

export const makeTick = (value: number, scale: PPMScale): Tick => {
  let type: TickType;
  if (value % 10 === 0) {
    type = 'major';
  }
  else if (value % 5 === 0) {
    type = 'half';
  }
  else {
    type = 'minor';
  }

  const height = scale(value);
  const size = AxisConfig.tickSizes[type];

  const points = [
    new THREE.Vector3(0, height, 0),
    new THREE.Vector3(-size, height, 0)
  ];

  return { value, height, type, points };
};

