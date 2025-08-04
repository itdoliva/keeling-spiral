import Tweener, { TweenOptions } from "./Tweener";
import { Vec3 } from "@/features/experience/types";


export default class TransformTweener {
  private translateTweener: Tweener<Vec3>
  private rotationTweener: Tweener<Vec3>
  private scaleTweener: Tweener<Vec3>

  constructor() {
    this.translateTweener = new Tweener<Vec3>({ x: 0, y: 0, z: 0 })
    this.rotationTweener = new Tweener<Vec3>({ x: 0, y: 0, z: 0 })
    this.scaleTweener = new Tweener<Vec3>({ x: 1, y: 1, z: 1 })
  }

  public dispose() {
    this.translateTweener.killActiveTween()
    this.rotationTweener.killActiveTween()
    this.scaleTweener.killActiveTween()
  }

  private tweenerTo(
    targetState: Partial<Vec3>, 
    stateKey: 'translateTweener' | 'rotationTweener' | 'scaleTweener', 
    options?: TweenOptions
  ) {
    this[stateKey].tween({
      x: targetState.x ?? this[stateKey].state.x,
      y: targetState.y ?? this[stateKey].state.y,
      z: targetState.z ?? this[stateKey].state.z
    }, options)
  }

  public translateTo(translate: Partial<Vec3>, options?: TweenOptions) {
    this.tweenerTo(translate, 'translateTweener', options)
  }

  public rotateTo(rotation: Partial<Vec3>, options?: TweenOptions) {
    this.tweenerTo(rotation, 'rotationTweener', options)
  }

  public scaleTo(scale: Partial<Vec3>, options?: TweenOptions) {
    this.tweenerTo(scale, 'scaleTweener', options)
  }

  get translate() {
    return this.translateTweener.state
  }

  get rotation() {
    return this.rotationTweener.state
  }

  get scale() {
    return this.scaleTweener.state
  }

}