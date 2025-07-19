import * as THREE from 'three'

export interface ObjectVisualizer {
  getObject: () => THREE.Object3D;
  dispose: () => void;
  readonly position: THREE.Vector3;
  readonly rotation: THREE.Euler;
}