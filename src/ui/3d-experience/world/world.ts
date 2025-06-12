import { RefObject, useCallback, useEffect, useRef, useState, useMemo } from "react";
import * as THREE from 'three'
import * as d3 from "d3"
import gsap from "gsap";

import { useDrag } from '@/ui/3d-experience/utils/drag'; 
import { useEnvironment } from "./environment";
import { useBubbleChart } from "./bubble-chart";
import { Dataset, MonthCO2, MonthlyDatum } from "@/data/definitions";
import { UseDebug } from "../utils/debug";
import { UseCamera } from "../camera";
import { UseSizes } from "../utils/sizes";
import { useFloor } from "./floor";
import { usePPMAxis } from "./ppm-axis";
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


const monthScale = d3.scaleLinear()
  .domain([ 0, 12 ])
  .range([ CHART_CONFIG.angleStart, CHART_CONFIG.angleEnd ])

export function useWorld({ dataset, scene, camera, sizes, debug }: UseWorld) {

  const state = useAppState()

  const [ minPPM, maxPPM ] = d3.extent(dataset.monthly, d => d.ppm) as number[]

  const ppmScale = useMemo(() => { return d3.scaleLinear()
    .domain([ Math.floor(minPPM/10)*10, Math.ceil(maxPPM/10)*10 ])
    .range([ 0, CHART_CONFIG.lengthRange ])
  }, [ dataset ])


  const getRadialCoordinates = useCallback((
    datum: MonthlyDatum, 
    monthAcc: (d: any) => any = d => d.monthDecimal,
    ppmAcc: (d: any) => any = d => d.ppm
  ) => {
    const angle = monthScale(monthAcc(datum))
    return { 
      x: Math.cos(angle!) * CHART_CONFIG.radius, 
      z: Math.sin(angle!) * CHART_CONFIG.radius,
      y: ppmScale(ppmAcc(datum)), 
    }
  }, [ ppmScale ])

  const drag = useDrag()
  
  const environment = useEnvironment({ scene, debug })

  const figure = useRef(new THREE.Group())
  const chart = useRef(new THREE.Group())
  
  const ppmAxis = usePPMAxis({ context: figure.current, ppmScale, config: CHART_CONFIG, camera, sizes })
  // const yearBubbles = useBubbleChart({ groupedData: groupedData.current, context: figure.current, lengthScale, camera, sizes })

  // const monthBars = useMonthBars({ context: chart.current, groupedData: groupedData.current, months: months.current, lengthScale, angleScale, config: CHART_CONFIG })
  // const monthAxis = useMonthAxis({ axisGroup: monthBars.ref.current, camera, sizes })
  
  const spiralChart = useSpiralChart({ 
    dataset, 
    context: chart.current, 
    getRadialCoordinates, 
    config: CHART_CONFIG 
  })

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
    ppmAxis.update()
    // yearBubbles.update()
    // monthAxis.update()
  }, [  ]) //yearBubbles

  useEffect(() => {
    const yearData = dataset.annual.find(d => d.year === state.selectedYear)
    if (!yearData) return

    const y = ppmScale(yearData.ppm)

    gsap.to(figure.current.position, {
      y: -y + 1.5,
      ease: 'power3.out',
      duration: .750,
      overwrite: true,
      onUpdate: () => figure.current.updateMatrixWorld(true)
    })

  }, [ ppmScale, state.selectedYear ])


  return { 
    update 
  }
}




