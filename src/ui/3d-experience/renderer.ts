import { useRef, useEffect, useCallback, RefObject } from 'react'
import * as THREE from 'three'
import { Sizes } from './utils/sizes'
import { UseDebug } from './utils/debug'

// Constants
const rendererConfig = {
  clearColor: 0xd1d1d1,
}

export interface UseRenderer {
  ref: RefObject<THREE.WebGLRenderer | null>
  resize: (sizes: Sizes) => void
  update: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void
}

export function useRenderer({ canvasRef, debug }: {
  canvasRef: RefObject<HTMLCanvasElement | null>,
  debug: UseDebug
}): UseRenderer {
  const renderer = useRef<THREE.WebGLRenderer | null>(null)

  const makeRenderer = useCallback((canvas: HTMLCanvasElement) => {
    renderer.current = new THREE.WebGLRenderer({ antialias: true, canvas })
    renderer.current.toneMapping = THREE.CineonToneMapping
    renderer.current.toneMappingExposure = 1.75
    renderer.current.shadowMap.enabled = true
    renderer.current.shadowMap.type = THREE.BasicShadowMap
    renderer.current.setClearColor(rendererConfig.clearColor)
  }, [])

  const setTweaks = useCallback(() => {
    const folder = debug.ref.current.gui!.addFolder('Renderer')

    folder.addColor(rendererConfig, 'clearColor').name('Background Color')
      .onChange((hex: number) => {
        renderer.current!.setClearColor(hex)
      })
  }, [])

  useEffect(() => {
    if (!(canvasRef.current instanceof HTMLCanvasElement)) 
      return

    makeRenderer(canvasRef.current)

    if (debug.ref.current.active) {
      setTweaks()
    }
  }, [ canvasRef ])


  const resize = useCallback((sizes: Sizes) => {

    if (renderer.current) {
      renderer.current.setSize(sizes.width, sizes.height)
      renderer.current.setPixelRatio(sizes.pixelRatio)
    }
  }, [])

  const update = useCallback((scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
    if (renderer.current) {
      renderer.current.render(scene, camera)
    }
  }, [])

  return { ref: renderer, resize, update }
}
