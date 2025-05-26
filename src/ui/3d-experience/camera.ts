import { useRef, useEffect, useCallback, RefObject } from 'react'

import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface UseCamera {
  ref: RefObject<THREE.PerspectiveCamera>;
  resize: (sizes: any) => void;
  update: () => void;
}

export function useCamera({ scene, canvasRef }: {
  scene: THREE.Scene;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}): UseCamera {

  const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(35, 1, 0.1, 1000))
  const controls = useRef<OrbitControls | null>(null)

  // Setup
  useEffect(() => {
    camera.current.position.set(2, 3, 8)
    camera.current.lookAt(0, 2, 0)
    scene.add(camera.current)

    if (canvasRef.current instanceof HTMLCanvasElement) {
  
      // controls.current = new OrbitControls(camera.current, canvasRef.current)
      // controls.current.enableDamping = true
      // controls.current.target.set(0, 2, 0)
    }
  }, [ canvasRef ])

  const resize = useCallback((sizes: any) => {
    camera.current.aspect = sizes.width / sizes.height
    camera.current.updateProjectionMatrix()
  }, [])
  
  const update = useCallback(() => {
    // if (controls.current instanceof OrbitControls) {
    //   controls.current.update()
    // }
  }, [])

  return { ref: camera, resize, update }
}