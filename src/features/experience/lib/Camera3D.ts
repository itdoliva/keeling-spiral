import * as THREE from 'three'
import Sizes from "@/features/experience/lib/Sizes"
import { CameraConfig } from '@/config/three';

export default class Camera3D {
  public camera: THREE.PerspectiveCamera
  private fov: number

  constructor(fov: number = 35) {
    this.fov = fov
    this.camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 1000)
    this.camera.position.copy(CameraConfig.position)
    this.camera.lookAt(CameraConfig.lookAt)
    this.camera.updateProjectionMatrix()
  }

  public resize(sizes: Sizes) {
    this.camera.aspect = sizes.width / sizes.height
    this.camera.updateProjectionMatrix()
  }

  public update() { }

  public getOriginHalfFrustum() {
    const z = this.camera.position.z
    return z * Math.tan( (this.fov / 2) * Math.PI / 180 )
  }
}