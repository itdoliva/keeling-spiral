import EventEmitter from "@/features/event-emitter/entities/EventEmitter"

export default class Sizes extends EventEmitter<Sizes> {
  public width: number
  public height: number
  public pixelRatio: number

  constructor() {
    super()

    this.width = this.getWidth()
    this.height = this.getHeight()
    this.pixelRatio = this.getPixelRatio()

    this.trigger(this)
  }

  private getWidth() {
    return typeof window !== 'undefined' ? window.innerWidth : 0
  }

  private getHeight() {
    return typeof window !== 'undefined' ? window.innerHeight : 0
  }

  private getPixelRatio() {
    // Clamp pixel ratio between 1 and 2
    return typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
  }

  public handleResize = () => {
    // const oldWidth = this.width
    // const oldHeight = this.height
    // const oldPixelRatio = this.pixelRatio

    this.width = this.getWidth()
    this.height = this.getHeight()
    this.pixelRatio = this.getPixelRatio()

    this.trigger(this)
  }
}