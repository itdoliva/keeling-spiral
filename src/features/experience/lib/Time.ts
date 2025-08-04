import EventEmitter from "@/features/event-emitter/entities/EventEmitter"

export default class Time extends EventEmitter<Time> {
  private start: number
  private current: number
  public elapsed: number
  public delta: number

  private animationFrameId: number | null = null 

  constructor() {
    super()

    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16 // Default to 16ms for 60fps, avoids 0 on first calculation
  }

  private tick() {
    // Only execute if window is defined (i.e., on the client-side)
    if (typeof window === 'undefined') {
      return
    }

    const now = Date.now()

    this.delta = now - this.current
    this.elapsed = now - this.start
    this.current = now

    this.trigger(this)

    this.animationFrameId = window.requestAnimationFrame(() =>{
      this.tick()
    })
  }

  public init(): void {
    // Only start if on the client-side and not already running
    if (typeof window !== 'undefined' && this.animationFrameId === null) {
      // Ensure initial values are fresh before starting the loop
      this.start = Date.now()
      this.current = this.start
      this.elapsed = 0
      this.delta = 16 // Reset delta

      this.tick()
    }
  }
}