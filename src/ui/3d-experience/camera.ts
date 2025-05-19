import { useRef, useEffect, useCallback, RefObject } from 'react'

import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface ICamera {
  ref: RefObject<THREE.PerspectiveCamera | null>;
  resize: (sizes: any) => void;
  update: () => void;
}

export function useCamera({ scene, canvasRef }: {
  scene: THREE.Scene;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}): ICamera {

  const camera = useRef<THREE.PerspectiveCamera | null>(null)
  const controls = useRef<OrbitControls | null>(null)

  // Setup
  useEffect(() => {
    if (canvasRef.current instanceof HTMLCanvasElement) {
      camera.current = new THREE.PerspectiveCamera(35, 1, 0.1, 1000)
      camera.current.position.set(6, 4, 8)
      scene.add(camera.current)
  
      controls.current = new OrbitControls(camera.current, canvasRef.current)
      controls.current.enableDamping = true
    }
  }, [ canvasRef ])

  const resize = useCallback((sizes: any) => {
    if (camera.current instanceof THREE.PerspectiveCamera) {
      camera.current.aspect = sizes.width / sizes.height
      camera.current.updateProjectionMatrix()
    }
  }, [])
  
  const update = useCallback(() => {
    if (controls.current instanceof OrbitControls) {
      controls.current.update()
    }
  }, [])

  return { ref: camera, resize, update }
}