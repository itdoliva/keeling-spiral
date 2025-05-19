'use client'

import { createContext, useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { ISizes, useSizes } from './utils/sizes'
import { ICamera, useCamera } from './camera';
import { IRenderer, useRenderer } from './renderer' 
import { ITime, useTime } from './utils/time'
import { useWorld } from './world/world';
import { MonthCO2 } from '@/data/definitions';

interface IExperience {
  scene: THREE.Scene;
  sizes: ISizes;
  camera: ICamera;
  renderer: IRenderer;
  time: ITime;
}

export const ExperienceContext = createContext<IExperience | null>(null)

export function Experience({ data }: { data: MonthCO2[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const sceneRef = useRef(new THREE.Scene())

  // Utils
  const sizes = useSizes()
  const time = useTime()

  const renderer = useRenderer({ canvasRef })
  const camera = useCamera({ scene: sceneRef.current, canvasRef })

  const world = useWorld({ data, scene: sceneRef.current })

  const onResize = useCallback(() => {
    camera.resize(sizes.ref.current)
    renderer.resize(sizes.ref.current)
  }, [])

  const onTick = useCallback(() => {
    camera.update()

    if (camera.ref.current instanceof THREE.PerspectiveCamera) {
      renderer.update(sceneRef.current, camera.ref.current)
    }
  }, [])

  useEffect(() => {
    sizes.add(onResize)
    time.add(onTick)

    onResize()

    console.log(data)

    return () => {
      sizes.remove(onResize)
      time.remove(onTick)
    }
  }, [])


  return (
    <canvas ref={canvasRef} />
  )
}