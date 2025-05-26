import { useRef, useEffect, useCallback, RefObject } from "react"
import * as THREE from 'three'
import { UseSizes } from "../utils/sizes"
import { UseCamera } from "../camera"

export interface UsePointer {
  intersect: (intersect: THREE.Object3D | THREE.Object3D[], recursive: boolean) => THREE.Intersection[]
}

export function usePointer({ sizes, camera }: {
  sizes: UseSizes
  camera: UseCamera
}): UsePointer {
  const raycaster = useRef(new THREE.Raycaster())
  const pointer = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      pointer.current.x = (event.clientX / sizes.ref.current.width) * 2 - 1
      pointer.current.y = - (event.clientY / sizes.ref.current.height) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)  

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const intersect = useCallback((intersect: THREE.Object3D | THREE.Object3D[], recursive:boolean=false) => {
    raycaster.current.setFromCamera(pointer.current, camera.ref.current!)

    if (Array.isArray(intersect)) {
      return raycaster.current.intersectObjects(intersect, recursive)
    } else {
      return raycaster.current.intersectObject(intersect, recursive)
    }
  }, [])

  return {
    intersect
  }

}