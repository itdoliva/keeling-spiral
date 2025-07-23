import { useRef, useEffect } from "react"
import * as THREE from 'three'
import * as d3 from 'd3'

import ExperienceManager from "@/features/experience/entities/ExperienceManager";
import Group from "@/features/experience/entities/Group";
import SpiralVisualizer from "@/features/spiral/entities/SpiralVisualizer";

import { TransformedDataset } from "@/types/data";
import Axis from "@/features/axis/entities/Axis";
import { ppmScale } from "@/lib/scale";
import { SpiralConfig } from "@/config/three";
import Indicator from "@/features/indicator/entities/Indicator";
import { makePPMTicks } from "@/features/axis/utils";

type Experience = {
  manager: ExperienceManager,
  figure: Group,
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
  
      const figure = new Group()
      const spiral = new SpiralVisualizer(dataset)

      const ppmAxis = new Axis(makePPMTicks(ppmScale), layerRef.current)
      const indicator = new Indicator()

      ppmAxis.position.copy(new THREE.Vector3(-(config.radius + config.offset), 0, 0))
  
      figure.add(spiral, ppmAxis, indicator)
  
      experienceManager.addObject(figure)
      experienceManager.addLoopCallback((time, { camera, sizes }) => {
        ppmAxis.tick(camera, sizes)
      })
  
      experienceRef.current = { 
        manager: experienceManager, 
        figure,
        spiral,
        indicator
      }
  
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