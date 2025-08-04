import EventEmitter from "@/features/event-emitter/entities/EventEmitter"

export default class Sizes extends EventEmitter<Sizes> {
  public width: number
  public height: number
  public pixelRatio: number
  private target: null | HTMLElement

  constructor(target: null | HTMLElement = null) {
    super()

    this.target = target
    this.width = this.getWidth()
    this.height = this.getHeight()
    this.pixelRatio = this.getPixelRatio()

    this.trigger(this)
  }

  private shouldResize() {
    return typeof window !== 'undefined'
  }

  private getWidth() {
    if (!this.shouldResize()) return 0
    return this.target ? this.target.clientWidth : window.innerWidth
  }

  private getHeight() {
    if (!this.shouldResize()) return 0
    return this.target ? this.target.clientHeight : window.innerHeight
  }

  private getPixelRatio() {
    // Clamp pixel ratio between 1 and 2
    return this.shouldResize() ? Math.min(window.devicePixelRatio, 2) : 1
  }

  public handleResize = () => {
    this.width = this.getWidth()
    this.height = this.getHeight()
    this.pixelRatio = this.getPixelRatio()

    this.trigger(this)
  }
}