import { EventEmitter } from "@/features/event-emitter/EventEmitter"

export default class Sizes extends EventEmitter {
  public width: number
  public height: number
  public pixelRatio: number

  constructor() {
    super()

    this.width = this.getWidth()
    this.height = this.getHeight()
    this.pixelRatio = this.getPixelRatio()
  }

  private getWidth() {
    return typeof window !== 'undefined' ? window.innerWidth : 0
  }

  private getHeight() {
    return typeof window !== 'undefined' ? window.innerHeight : 0
  }

  private getPixelRatio(): number {
    // Clamp pixel ratio between 1 and 2
    return typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
  }

  public update() {
    const oldWidth = this.width
    const oldHeight = this.height
    const oldPixelRatio = this.pixelRatio

    this.width = this.getWidth()
    this.height = this.getHeight()
    this.pixelRatio = this.getPixelRatio()

    if (this.width !== oldWidth || this.height !== oldHeight || this.pixelRatio !== oldPixelRatio) {
      this.trigger()
    }
  }
}