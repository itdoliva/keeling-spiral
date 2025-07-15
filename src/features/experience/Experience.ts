import Sizes from "@/features/experience/utils/Sizes";
import Time from "@/features/experience/utils/Time";
import Camera from "@/features/experience/Camera"
import Renderer from "@/features/experience/Renderer"
import World from "@/features/experience/World"

export default class Experience {
  private sizes: Sizes
  private time: Time
  private camera: Camera
  private renderer: Renderer
  private world: World

  constructor(canvas: HTMLCanvasElement, world: World) {
    this.sizes = new Sizes()
    this.time = new Time()
    this.renderer = new Renderer(canvas)
    this.camera = new Camera()

    this.world = world

    this.sizes.add(this.resize)
    this.time.add(this.tick)

    this.resize()
  }

  private tick() {
    this.world.tick()
  }

  private resize() {
    this.camera.resize(this.sizes)
    this.renderer.resize(this.sizes)
  }


}