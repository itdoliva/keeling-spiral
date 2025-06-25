import '@/lib/clock'

import { useRef, useMemo, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { useSizes } from './utils/sizes'
import { useCamera } from './camera';
import { useRenderer } from './renderer' 

import { useTime } from './utils/time'
import { useDebug } from './utils/debug'
import { useWorld } from './world/world';
import { Dataset } from '@/data/definitions';


export function Experience({ dataset }: { dataset: Dataset }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const scene = useMemo(() => new THREE.Scene(), [])

  // Utils
  const sizes = useSizes()
  const time = useTime()
  const debug = useDebug()

  const renderer = useRenderer({ canvasRef, debug })
  const camera = useCamera({ canvasRef, scene, debug })

  const world = useWorld({ dataset, camera, sizes, scene, debug })

  const onResize = useCallback(() => {
    camera.resize(sizes.ref.current)
    renderer.resize(sizes.ref.current)
  }, [])

  const onTick = useCallback(() => {
    world.update()
    camera.update()

    if (camera.ref.current instanceof THREE.PerspectiveCamera) {
      renderer.update(scene, camera.ref.current)
    }

  }, [])

  useEffect(() => {
    sizes.add(onResize)
    time.add(onTick)

    onResize()

    return () => {
      sizes.remove(onResize)
      time.remove(onTick)
    }
  }, [])


  return <canvas ref={canvasRef} />
}