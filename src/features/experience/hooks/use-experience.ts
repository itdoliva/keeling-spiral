import { useRef, useEffect } from "react"
import * as THREE from 'three'

import ExperienceManager from "@/features/experience/lib/helpers/ExperienceManager";
import SpiralVisualizer from "@/features/experience/features/spiral/lib/SpiralVisualizer";

import { TransformedDataset } from "@/types/data";
import { ppmScale } from "@/lib/scale";
import { SpiralConfig } from "@/config/three";
import Indicator from "@/features/experience/features/indicator/lib/Indicator";
import { makePPMTicks } from "@/features/experience/features/axis/utils";
import Figure from "@/features/experience/features/figure/lib/Figure";

type Experience = {
  manager: ExperienceManager,
  figure: Figure,
  spiral: SpiralVisualizer,
  indicator: Indicator
}

export default function useExperience(
  canvasRef: React.RefObject<HTMLCanvasElement | null>, 
  layerRef: React.RefObject<HTMLDivElement | null>,
  dataset: TransformedDataset,
  config: typeof SpiralConfig = SpiralConfig
) {
  const experienceRef = useRef<Experience | null>(null)
  
  useEffect(() => {
    if (!canvasRef.current || !layerRef.current) return

    if (!experienceRef.current) {
      const experienceManager = new ExperienceManager(canvasRef.current)
  
      const figure = new Figure(dataset, makePPMTicks(ppmScale), layerRef.current)
      const spiral = figure.spiral
      const ppmAxis = figure.axis
      const indicator = figure.indicator

      ppmAxis.position.copy(new THREE.Vector3(-(config.radius + config.offset), 0, 0))
  
      experienceManager.addObject(figure)
      experienceManager.addLoopCallback((time, { camera, sizes }) => {
        figure.tick(camera, sizes)
      })
  
      experienceRef.current = { 
        manager: experienceManager, 
        figure,
        spiral,
        indicator
      }

      setInterval(() => {
        figure.toggleViewpoint()
      }, 3000)
  
      experienceManager.init()
    }

    window.addEventListener('resize', experienceRef.current.manager.handleWindowResize)
    return () => {
      if (experienceRef.current) {
        window.removeEventListener('resize', experienceRef.current.manager.handleWindowResize)
      }
    }
  }, [])

  return experienceRef
}