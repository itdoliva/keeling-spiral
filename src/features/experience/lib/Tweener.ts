import gsap from 'gsap';

export interface TweenOptions {
  duration?: number;
  ease?: string;
  onUpdateParams?: any[];
  onCompleteParams?: any[];
  onStart?: (...params: any[]) => void;
  onUpdate?: (...params: any[]) => void;
  onComplete?: (...params: any[]) => void;
  onInterrupt?: (...params: any[]) => void;
}

const DEFAULT_OPTIONS = {
  duration: 1,
  ease: 'power2.inOut'
}

export default class Tweener<T extends Object> {
  public state: T
  private activeTween: gsap.core.Tween | null

  constructor(initialState: T) {
    this.state = initialState
    this.activeTween = null
  }

  public killActiveTween() {
    if (this.activeTween) {
      this.activeTween.kill()
      this.activeTween = null
    }
  }

  private startNewTween(targetState: T, options: TweenOptions): void {
    this.activeTween = gsap.to(this.state, {
      ...targetState,
      duration: options.duration,
      ease: options.ease,
      onStart: options.onStart,
      onUpdate: () => this.handleUpdate(options),
      onComplete: () => this.handleComplete(options),
      onInterrupt: () => this.handleInterrupt(options)
    })
  }

  private handleUpdate(options: TweenOptions): void {
    options.onUpdate?.(...(options.onUpdateParams ?? []))
  }

  private handleComplete(options: TweenOptions): void {
    this.activeTween = null
    options.onComplete?.(...(options.onCompleteParams ?? []))
  }

  private handleInterrupt(options: TweenOptions): void {
    this.activeTween = null
    options.onInterrupt?.()
  }

  public tween(targetState: T, options?: TweenOptions): void {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    this.killActiveTween()
    this.startNewTween(targetState, opts)
  }

}