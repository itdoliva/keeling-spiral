import * as THREE from "three"
import Sizes from "@/features/experience/entities/Sizes"

export default class Renderer {
  private renderer: THREE.WebGLRenderer

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas })
    this.renderer.toneMapping = THREE.CineonToneMapping
    this.renderer.toneMappingExposure = 1.75
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.BasicShadowMap
    this.renderer.setClearColor(0xd1d1d1)
  }

  public resize(sizes: Sizes) {
    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.setPixelRatio(sizes.pixelRatio)
  }

  public render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera)
  }

  public dispose() {
    this.renderer.dispose()
  }
}