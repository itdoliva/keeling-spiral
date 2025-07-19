import EventEmitter from "./EventEmitter";


export default class InertiaEmitter extends EventEmitter<number> {
  private velocity: number;
  private rafId: number | null;
  private smoothing: number;
  private friction: number;

  constructor(smoothing: number = 0.1, friction: number = 0.95) {
    super();

    this.velocity = 0;
    this.rafId = null;
    this.smoothing = smoothing;
    this.friction = friction;
  }

  public animate = () => {
    this.velocity *= this.friction;

    if (Math.abs(this.velocity) < 0.1) {
      this.velocity = 0;
      this.rafId = null;
      return;
    }

    this.trigger(this.velocity);
    this.rafId = requestAnimationFrame(this.animate);
  }

  public accelerate = (delta: number) => {
    this.velocity += delta * this.smoothing;

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.animate)
    }
  }

  public cancel = () => {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
    }
    this.rafId = null;
    this.velocity = 0;
  }
}
