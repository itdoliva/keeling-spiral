import * as THREE from 'three';


export default abstract class BaseObject {
  public object!: THREE.Object3D;
  abstract dispose(): void;

  get position() {
    return this.object.position;
  }

  get rotation() {
    return this.object.rotation;
  }

  get quaternion() {
    return this.object.quaternion;
  }
}
