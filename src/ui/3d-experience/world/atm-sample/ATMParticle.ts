import * as THREE from 'three'
import { ATMSampleConfig } from '@/lib/config/atmSample';
import clock from '@/lib/clock'


export default class ATMParticle {
  public idx: number
  public randomness = Math.random()
  public position: THREE.Vector3
  public _visibility: number = 0
  public _lifetimeStart = 0

  constructor(idx: number, visibility: number) {
    this.idx = idx
    this.visibility = visibility

    // const theta = 2 * Math.PI * Math.random()
    // const phi = Math.acos(2 * Math.random() - 1)
    // const radius = ATMSampleConfig.radius * Math.cbrt(Math.random())

    // this.position = new THREE.Vector3(
    //   radius * Math.sin(phi) * Math.cos(theta),
    //   radius * Math.sin(phi) * Math.sin(theta),
    //   radius * Math.cos(phi)
    // )
    const theta = 2 * Math.PI * Math.random()
    const radius = ATMSampleConfig.radius * Math.cbrt(Math.random())
    const height = -ATMSampleConfig.height/2 + ATMSampleConfig.height * Math.random()

    this.position = new THREE.Vector3(
      radius * Math.sin(theta),
      height,
      radius * Math.cos(theta)
    )
  }

  get visibility() {
    return this._visibility
  }

  get lifetimeStart() {
    return this._lifetimeStart
  }

  set visibility(v: number) {
    this._visibility = v
    this._lifetimeStart = clock.getElapsedTime()
  }

}