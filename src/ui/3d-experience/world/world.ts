import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import * as d3 from "d3"
import gsap from "gsap";

import { useDrag } from '@/ui/3d-experience/utils/drag'; 
import { useEnvironment } from "./environment";
import { useBubbleChart } from "./bubble-chart";
import { Dataset, MonthCO2 } from "@/data/definitions";
import { UseDebug } from "../utils/debug";
import { UseCamera } from "../camera";
import { UseSizes } from "../utils/sizes";
import { useFloor } from "./floor";
import { useLengthAxis } from "./length-axis";
import { usePointer } from "./pointer";
import { useMonthBars } from "./month-bars";
import { useMonthAxis } from "./month-axis";
import { useAppState } from "@/ui/context";
import { groupByYear } from "@/data/helpers";
import { CHART_CONFIG } from "@/app/lib/config";
import { ChartConfig } from "@/data/definitions";
import { useSpiralChart } from "./spiral-chart";


export interface UseWorld {
  dataset: Dataset;
  scene: THREE.Scene;
  debug: UseDebug;
  camera: UseCamera;
  sizes: UseSizes;
}



const makeLengthScale = (lengthRange: number): d3.ScaleLinear<number, number> => {
  return d3.scaleLinear()
    .domain([ 330, 430 ])
    .range([0, lengthRange])
}



const makeAngleScale = (): d3.ScaleLinear<number, number> => {
  return d3.scaleLinear()
    .domain([ 0, 12 ])
    .range([ CHART_CONFIG.angleStart, CHART_CONFIG.angleEnd ])
}

export function useWorld({ dataset, scene, camera, sizes, debug }: UseWorld) {

  const state = useAppState()

  // const groupedData = useRef(groupByYear(data))

  const months = useRef(d3.range(0, 12).map((d: number) => d.toString()))

  const lengthScale = useRef(makeLengthScale(CHART_CONFIG.lengthRange))
  const angleScale = useRef(makeAngleScale())

  const pointer = usePointer({ sizes, camera })
  const drag = useDrag()
  
  const environment = useEnvironment({ scene, debug })

  const figure = useRef(new THREE.Group())
  const chart = useRef(new THREE.Group())
  
  const lengthAxis = useLengthAxis({ context: figure.current, lengthScale, config: CHART_CONFIG, camera, sizes })
  // const yearBubbles = useBubbleChart({ groupedData: groupedData.current, context: figure.current, lengthScale, camera, sizes })

  // const monthBars = useMonthBars({ context: chart.current, groupedData: groupedData.current, months: months.current, lengthScale, angleScale, config: CHART_CONFIG })
  // const monthAxis = useMonthAxis({ axisGroup: monthBars.ref.current, camera, sizes })
  
  const spiralChart = useSpiralChart({ dataset, context: chart.current, lengthScale, angleScale, config: CHART_CONFIG })

  // Setup
  useEffect(() => {
    scene.add(figure.current)
    figure.current.add(chart.current)

    // drag.yEmitter.add((deltaY) => {
    //   const newY = context.current.position.y + (-deltaY * 0.0035)
    //   context.current.position.y = Math.min(Math.max(newY, -(CHART_CONFIG.lengthRange - 2)), 0.25)
    // })

    drag.xEmitter.add((deltaX) => {
      const factor = (Math.PI/180) * deltaX * 0.05 // Adjust sensitivity as needed
      chart.current.rotation.y += factor
      // monthBars.ref.current.rotation.y += factor
    })

    const setAxesHelper = (size: number = 10) => {
      const axesHelper = new THREE.AxesHelper(size)
      scene.add(axesHelper)
    }

    const setTweaks = () => {
      const folder = debug.ref.current.gui!.addFolder('Chart')
      
      folder.add(CHART_CONFIG, 'lengthRange')
        .name('Length Range (PPM)')
        .min(0).max(30).step(.1)
        .onFinishChange(() => {
          lengthScale.current = makeLengthScale(CHART_CONFIG.lengthRange)
          // chart.reposition()
        })

      folder.add(CHART_CONFIG, 'radius')
        .name('Radius')
        .min(0).max(10).step(.1)
        .onFinishChange(() => {
          CHART_CONFIG.radius = CHART_CONFIG.radius
        })
    }

    if (debug.ref.current.active) {
      setAxesHelper()
      setTweaks()
    }

  }, [])

  const update = useCallback(() => {
    // yearBubbles.update()
    // lengthAxis.update()
    // monthAxis.update()
  }, [  ]) //yearBubbles

  useEffect(() => {
    // const yearData = groupedData.current.find(d => d.year === state.selectedYear)
    // const y = lengthScale.current(yearData!.avgPPM)

    // gsap.to(figure.current.position, {
    //   y: -y + 1.5,
    //   ease: 'power3.out',
    //   duration: .750,
    //   overwrite: true,
    //   onUpdate: () => figure.current.updateMatrixWorld(true)
    // })

  }, [ state.selectedYear ])


  return { 
    update 
  }
}




