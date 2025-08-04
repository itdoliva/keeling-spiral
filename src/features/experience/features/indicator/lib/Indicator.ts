import * as THREE from 'three'
import BaseObject from '@/features/experience/lib/BaseObject';
import { IndicatorConfig } from '@/config/three';

export default class IndicatorVisualizer extends BaseObject {
  private geometry: THREE.SphereGeometry
  private material: THREE.MeshStandardMaterial
  constructor() {
    super()

    this.geometry = new THREE.SphereGeometry(
      IndicatorConfig.geometry.radius, 
      IndicatorConfig.geometry.widthSegments, 
      IndicatorConfig.geometry.heightSegments
    )

    this.material = new THREE.MeshStandardMaterial({ 
      color: IndicatorConfig.material.color 
    })

    this.object = new THREE.Mesh(this.geometry, this.material)
  }

  public dispose() {
    this.geometry.dispose()
    this.material.dispose()
    this.object.removeFromParent()
  }
}