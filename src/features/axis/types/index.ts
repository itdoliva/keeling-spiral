import * as THREE from 'three';

export type TickType = 'minor' | 'major' | 'half';

export interface Tick {
  value: number;
  height: number;
  type: TickType;
  points: THREE.Vector3[];
}

