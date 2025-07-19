import * as THREE from 'three'
import Sizes from "@/features/experience/entities/Sizes"
import { CameraConfig } from '@/lib/config/layout';

export default class Camera3D {
  public camera: THREE.PerspectiveCamera

  constructor() {
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000)
    this.camera.position.copy(CameraConfig.position)
    this.camera.lookAt(CameraConfig.lookAt)
    this.camera.updateProjectionMatrix()
  }

  public resize(sizes: Sizes) {
    this.camera.aspect = sizes.width / sizes.height
    this.camera.updateProjectionMatrix()
  }

  public update() { }
}