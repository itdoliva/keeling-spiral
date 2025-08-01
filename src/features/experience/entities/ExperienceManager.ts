import * as THREE from 'three'

import Sizes from "@/features/experience/entities/Sizes";
import Time from "@/features/experience/entities/Time";
import Camera from "@/features/experience/entities/Camera3D"
import Renderer from "@/features/experience/entities/Renderer"
import Camera3D from "@/features/experience/entities/Camera3D"
import LightingSystem from '@/features/experience/entities/LightingSystem';
import { ObjectVisualizer } from '@/types/three';

export default class ExperienceManager {
  private scene: THREE.Scene
  private sizes: Sizes
  private time: Time
  private camera: Camera
  private renderer: Renderer
  private lightingSystem: LightingSystem
  private objects: ObjectVisualizer[]

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

  public addObject(...objects: ObjectVisualizer[]) {
    for (const object of objects) {
      this.objects.push(object)
      this.scene.add(object.getObject())
    }
  }

  public removeObject(...objects: ObjectVisualizer[]) {
    for (const object of objects) {
      this.scene.remove(object.getObject())

      const idx = this.objects.indexOf(object)
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

}