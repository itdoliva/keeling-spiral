import * as THREE from 'three'
import { ObjectVisualizer } from "@/types/three";
import { IndicatorConfig } from '@/config/three';

export default class IndicatorVisualizer implements ObjectVisualizer {
  private indicator: THREE.Mesh
  private geometry: THREE.SphereGeometry
  private material: THREE.MeshStandardMaterial
  constructor() {
    this.geometry = new THREE.SphereGeometry(
      IndicatorConfig.geometry.radius, 
      IndicatorConfig.geometry.widthSegments, 
      IndicatorConfig.geometry.heightSegments
    )

    this.material = new THREE.MeshStandardMaterial({ 
      color: IndicatorConfig.material.color 
    })

    this.indicator = new THREE.Mesh(this.geometry, this.material)
  }

  public getObject() {
    return this.indicator
  }

  public dispose() {
    this.geometry.dispose()
    this.material.dispose()
    this.indicator.removeFromParent()
  }

  public get position() {
    return this.indicator.position
  }

  public get rotation() {
    return this.indicator.rotation
  }
}