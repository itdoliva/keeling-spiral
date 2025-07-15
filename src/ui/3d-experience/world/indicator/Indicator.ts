import * as THREE from 'three'
import { createIndicator } from '@/lib/config/indicator'
import gsap from "gsap";

export default class Indicator {
  public object: THREE.Mesh<THREE.SphereGeometry, THREE.MeshMatcapMaterial>

  constructor() {
    this.object = createIndicator()
  }

  public moveTo(y: number) {
    gsap.to(this.object.position, {
      y: y,
      ease: 'elastic.out(1, 1)',
      duration: 1.250,
      overwrite: true,
      onUpdate: () => this.object.updateMatrixWorld(true)
    })
  }
}

