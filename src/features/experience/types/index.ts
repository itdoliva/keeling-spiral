import * as THREE from 'three';

export type Vec3 = {
  x: number;
  y: number;
  z: number;
};export interface Tick {
  label: string;
  value: number;
  height: number;
  type: TickType;
  points: THREE.Vector3[];
}
export type TickType = 'minor' | 'major' | 'half';

