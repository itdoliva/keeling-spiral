import { useRef, useEffect, useCallback, RefObject } from 'react'
import * as THREE from 'three'
import { SizesObject } from './utils/sizes'

export interface IRenderer {
  current: THREE.WebGLRenderer | null
  resize: (sizes: SizesObject) => void
  update: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => void
}

export function useRenderer({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement | null> }) {
  const renderer = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (canvasRef.current instanceof HTMLCanvasElement) {
      renderer.current = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current })
      renderer.current.toneMapping = THREE.CineonToneMapping
      renderer.current.toneMappingExposure = 1.75
      renderer.current.shadowMap.enabled = true
      renderer.current.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.current.setClearColor('#211d20')
    }
  }, [ canvasRef ])


  const resize = useCallback((sizes: any) => {

    if (renderer.current) {
      renderer.current.setSize(sizes.width, sizes.height)
      renderer.current.setPixelRatio(sizes.pixelRatio)
    }
  }, [])

  const update = useCallback((scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
    if (renderer.current) {
      console.log('🏗 update renderer')
      renderer.current.render(scene, camera)
    }
  }, [])

  return { ref: renderer, resize, update }
}
