import * as THREE from 'three'

export interface Object3D {
  getObject: () => THREE.Object3D;
  dispose: () => void;
}

export interface ObjectVisualizer extends Object3D {
  readonly position: THREE.Vector3;
  readonly rotation: THREE.Euler;
}