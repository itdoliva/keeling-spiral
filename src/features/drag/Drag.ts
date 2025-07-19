import InertiaEmitter from "@/features/event-emitter/entities/InertiaEmitter"

function getPointerCoordinates(event: MouseEvent | TouchEvent): [number, number] {
  if ('touches' in event) {
    const touch = event.touches[0]
    return [ touch.clientX, touch.clientY ]
  }
  return [ event.clientX, event.clientY ]
}

export default class Drag {
  private xInertia: InertiaEmitter
  private yInertia: InertiaEmitter

  private xLast: number | null
  private yLast: number | null

  private isDragging: boolean

  constructor(smoothing: number = 0.15, friction: number = 0.95) {
    this.xInertia = new InertiaEmitter(smoothing, friction)
    this.yInertia = new InertiaEmitter(smoothing, friction)
    this.isDragging = false
    this.xLast = null
    this.yLast = null
  }

  public onPointerDown = (event: MouseEvent | TouchEvent) => {
    const [ px, py ] = getPointerCoordinates(event)
    this.xLast = px
    this.yLast = py
    this.isDragging = true

    // Stop ongoing inertia / momentum
    this.xInertia.cancel()
    this.yInertia.cancel()
  }

  public onPointerMove = (event: MouseEvent | TouchEvent) => {
    if (!this.isDragging) return

    const [ px, py ] = getPointerCoordinates(event)

    if (this.xLast !== null) {
      const deltaX = px - this.xLast
      this.xInertia.accelerate(deltaX)
      this.xLast = px
    }

    if (this.yLast !== null) {
      const deltaY = py - this.yLast
      this.yInertia.accelerate(deltaY)
      this.yLast = py
    }
  }

  public onPointerUp = () => {
    this.isDragging = false
    this.xLast = null
    this.yLast = null
  }

  public addXCallback = (callback: (delta: number) => void) => {
    this.xInertia.add(callback)
  }

  public removeXCallback = (callback: (delta: number) => void) => {
    this.xInertia.remove(callback)
  }
}