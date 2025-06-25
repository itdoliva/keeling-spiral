import { useRef, useEffect, useCallback, RefObject } from 'react'
import { CameraConfig, ControlsConfig } from '@/lib/config/layout';

import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { UseDebug } from './utils/debug';

export interface UseCamera {
  ref: RefObject<THREE.PerspectiveCamera>;
  resize: (sizes: any) => void;
  update: () => void;
}

export function useCamera({ scene, canvasRef, debug }: {
  scene: THREE.Scene;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  debug: UseDebug
}): UseCamera {

  const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(35, 1, 0.1, 1000))
  const controls = useRef<OrbitControls | null>(null)

  // Setup
  useEffect(() => {
    camera.current.position.copy(CameraConfig.position)
    camera.current.lookAt(CameraConfig.lookAt)
    camera.current.updateProjectionMatrix()
    scene.add(camera.current)
    
    if (canvasRef.current instanceof HTMLCanvasElement && debug.ref.current.active) {
      controls.current = new OrbitControls(camera.current, canvasRef.current)
      controls.current.enableDamping = true
      controls.current.target.copy(ControlsConfig.target)
    }

  }, [ canvasRef ])


  const resize = useCallback((sizes: any) => {
    camera.current.aspect = sizes.width / sizes.height
    camera.current.updateProjectionMatrix()
  }, [])
  
  const update = useCallback(() => {
    if (debug.ref.current.active && controls.current instanceof OrbitControls) {
      controls.current.update()
    }
  }, [])

  return { ref: camera, resize, update }
}