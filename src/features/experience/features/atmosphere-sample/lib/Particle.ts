import * as THREE from 'three'
import clock from '@/lib/clock'
import { randomizeCylindricalPosition } from '@/features/experience/features/atmosphere-sample/utils';
import { Binary } from '@/types/general';


export default class Particle {
  public idx: number
  public randomness: number
  public position: THREE.Vector3
  private _visibility: Binary
  private _lifetimeStart: number

  constructor(idx: number, visibility: Binary) {
    this.idx = idx
    this.randomness = Math.random()
    this.position = randomizeCylindricalPosition() // To implement OCP, this must be changed
    this._visibility = visibility
    this._lifetimeStart = clock.getElapsedTime()
  }

  get visibility() {
    return this._visibility
  }

  get lifetimeStart() {
    return this._lifetimeStart
  }

  set visibility(value: Binary) {
    this._visibility = value
    this._lifetimeStart = clock.getElapsedTime()
  }

}