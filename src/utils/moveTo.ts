import * as THREE from 'three'
import gsap from 'gsap'

type Target = {
  x?: number;
  y?: number;
  z?: number;
}
export default function movePositionTo(object: THREE.Object3D, target: Target, options: gsap.TweenVars = {}) {
  gsap.to(object.position, {
    ...target,
    ...options,
    overwrite: true,
    onUpdate: () => object.updateMatrixWorld(true)
  })
}