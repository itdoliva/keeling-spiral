'use client'

import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { useSizes } from './utils/sizes'
import { useCamera } from './camera';
import { useRenderer } from './renderer' 

import { useTime } from './utils/time'
import { useDebug } from './utils/debug'
import { useWorld } from './world/world';
import { MonthCO2 } from '@/data/definitions';


export function Experience({ data }: { data: MonthCO2[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const sceneRef = useRef(new THREE.Scene())

  // Utils
  const sizes = useSizes()
  const time = useTime()
  const debug = useDebug()

  const renderer = useRenderer({ canvasRef, debug })
  const camera = useCamera({ canvasRef, scene: sceneRef.current, debug })

  const world = useWorld({ data, camera, sizes, scene: sceneRef.current, debug })

  const onResize = useCallback(() => {
    camera.resize(sizes.ref.current)
    renderer.resize(sizes.ref.current)
  }, [])

  const onTick = useCallback(() => {
    world.update()
    camera.update()

    if (camera.ref.current instanceof THREE.PerspectiveCamera) {
      renderer.update(sceneRef.current, camera.ref.current)
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