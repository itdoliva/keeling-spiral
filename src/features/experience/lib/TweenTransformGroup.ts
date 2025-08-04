import * as THREE from 'three';
import Group from './Group';
import { TweenOptions } from '@/features/experience/lib/Tweener';
import { Vec3 } from "@/features/experience/types";
import BaseObject from '@/features/experience/lib/BaseObject';
import TransformTweener from './TransformTweener';

export default class TweenTransformGroup extends Group {
  public pivotGroup: Group
  public contentGroup: Group
  
  private transform: TransformTweener

  constructor() {
    super()

    this.transform = new TransformTweener()

    // Create the transform hierarchy
    this.pivotGroup = new Group()
    this.contentGroup = new Group()

    this.pivotGroup.add(this.contentGroup)
    
    // Set up hierarchy: root (translationGroup) -> pivotGroup -> content
    super.add(this.pivotGroup)
  }

  public add(...objects: BaseObject[]): void {
    this.contentGroup.add(...objects)
  }

  public remove(...objects: BaseObject[]): void {
    this.contentGroup.remove(...objects)
  }

  public dispose(): void {
    this.transform.dispose
    super.dispose()
  }

  public translateTo(translate: Partial<Vec3>, options?: TweenOptions) {
    const tweenOptions = {
      ...options,
      onUpdate: () => {
        this.updateTransforms()
        options?.onUpdate?.()
      }
    }

    this.transform.translateTo(translate, tweenOptions)
  }

  public rotateTo(rotation: Partial<Vec3>, options?: TweenOptions) {

    const tweenOptions = {
      ...options,
      onUpdate: () => {
        this.updateTransforms()
        options?.onUpdate?.()
      }
    }

    this.transform.rotateTo(rotation, tweenOptions)
  }



  public updateTransforms(): void {
    const translate = this.transform.translate
    const rotation = this.transform.rotation

    this.pivotGroup.rotation.set(rotation.x, rotation.y, rotation.z)

    // Calculate translation based on current rotation
    const upVector = new THREE.Vector3(0, 1, 0)
    upVector.applyQuaternion(this.pivotGroup.quaternion)
    upVector.multiplyScalar(translate.y)
    
    // Apply translation
    this.position.copy(upVector)
  }

}