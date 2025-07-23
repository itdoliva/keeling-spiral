import * as THREE from 'three';

export type TickType = 'minor' | 'major' | 'half';

export interface Tick {
  label: string;
  value: number;
  height: number;
  type: TickType;
  points: THREE.Vector3[];
}

