import * as THREE from 'three'

import Sizes from "@/features/experience/lib/Sizes";
import Time from "@/features/experience/lib/Time";
import Camera from "@/features/experience/lib/Camera3D"
import Renderer from "@/features/experience/lib/Renderer"
import Camera3D from "@/features/experience/lib/Camera3D"
import LightingSystem from '@/features/experience/lib/LightingSystem';
import BaseObject from '@/features/experience/lib/BaseObject';

export default class ExperienceManager {
  private scene: THREE.Scene
  private sizes: Sizes
  private time: Time
  private camera: Camera
  private renderer: Renderer
  private lightingSystem: LightingSystem
  private objects: BaseObject[]

  constructor(canvas: HTMLCanvasElement) {
    this.objects = []
    
    this.sizes = new Sizes(canvas)
    this.time = new Time()
    this.renderer = new Renderer(canvas)
    this.camera = new Camera3D()
    this.lightingSystem = new LightingSystem()
    
    this.scene = new THREE.Scene()
    this.scene.add(this.camera.camera, ...this.lightingSystem.getLights())

    this.time.add(this.tick.bind(this))
    this.sizes.add(this.resize.bind(this))
  }

  private tick() {
    this.renderer.render(this.scene, this.camera.camera)
  }

  private resize(sizes: Sizes) {
    this.camera.resize(sizes)
    this.renderer.resize(sizes)
  }

  public init() {
    this.handleWindowResize()
    this.time.init()
  }

  public addObject(...objects: BaseObject[]) {
    for (const instance of objects) {
      this.objects.push(instance)
      this.scene.add(instance.object)
    }
  }

  public removeObject(...objects: BaseObject[]) {
    for (const instance of objects) {
      this.scene.remove(instance.object)

      const idx = this.objects.indexOf(instance)
      if (idx >= 0) this.objects.splice(idx, 1)
    }
  }

  public addIntoScene(...objects: THREE.Object3D[]) {
    this.scene.add(...objects)
  }

  public removeFromScene(...objects: THREE.Object3D[]) {
    this.scene.remove(...objects)
  }

  public addLoopCallback(callback: (time: Time, { sizes, camera }: { sizes: Sizes, camera: THREE.Camera }) => void) {
    this.time.add(() => callback(this.time, { sizes: this.sizes, camera: this.camera.camera }))
  }

  public dispose() {
    this.time.remove(this.tick.bind(this))
    this.sizes.remove(this.resize.bind(this))

    this.scene.remove(this.camera.camera, ...this.lightingSystem.getLights())
    this.renderer.dispose()

    for (const object of this.objects) {
      object.dispose()
    }

    this.scene.removeFromParent()
  }

  public handleWindowResize = () => {
    this.sizes.handleResize()
  }

  public getOriginHalfFrustum() {
    return this.camera.getOriginHalfFrustum()
  }

}