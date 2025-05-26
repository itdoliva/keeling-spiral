import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import * as d3 from "d3"

import { useDrag } from '@/ui/3d-experience/utils/drag'; 
import { useEnvironment } from "./environment";
import { useSpiralChart } from "./chart";
import { MonthCO2 } from "@/data/definitions";
import { UseDebug } from "../utils/debug";
import { UseCamera } from "../camera";
import { UseSizes } from "../utils/sizes";
import { useFloor } from "./floor";
import { useLengthAxis } from "./lengthAxis";
import { usePointer } from "./pointer";


export interface UseWorld {
  data: MonthCO2[];
  scene: THREE.Scene;
  debug: UseDebug;
  camera: UseCamera;
  sizes: UseSizes;
}

export interface ChartConfig {
  lengthRange: number; // Length range in PPM
  radius: number; // Radius of the spiral
}

// Constants
const chartConfig: ChartConfig = {
  lengthRange: 25,
  radius: 1,
}


const makeLengthScale = (lengthRange: number): d3.ScaleLinear<number, number> => {
  return d3.scaleLinear()
    .domain([ 330, 430 ])
    .range([0, lengthRange])
}

const makeAngleScale = (months: string[]): d3.ScalePoint<string> => {
  return d3.scalePoint()
    .domain(months)
    .range([0, 2 * Math.PI])
    .padding(0.5)
}



export function useWorld({ data, scene, camera, sizes, debug }: UseWorld) {

  const months = useRef(d3.range(0, 12).map((d: number) => d.toString()))

  const lengthScale = useRef(makeLengthScale(chartConfig.lengthRange))
  const angleScale = useRef(makeAngleScale(months.current))

  const pointer = usePointer({ sizes, camera })
  const drag = useDrag()
  
  const environment = useEnvironment({ scene, debug })

  const context = useRef(new THREE.Group())
  const floor = useFloor({ context: context.current, debug })
  const chart = useSpiralChart({ data, context: context.current, lengthScale, angleScale, config: chartConfig, pointer })
  const lengthAxis = useLengthAxis({ context: context.current, lengthScale, config: chartConfig, camera, sizes })


  const setTestMesh = useCallback(() => {
    const geometry = new THREE.CylinderGeometry( 1.5, 1.5, 4, 32)
    const material = new THREE.MeshBasicMaterial( { color: 0xc1d4c0, opacity: .95 } );
    material.transparent = true
    const mesh = new THREE.Mesh( geometry, material )
    mesh.position.set(0, 2, 0)
    // mesh.rotation.x = -Math.PI / 2
    scene.add(mesh)
  }, [])

  // Setup
  useEffect(() => {
    scene.add(context.current)

    drag.yEmitter.add((deltaY) => {
      const newY = context.current.position.y + (-deltaY * 0.0035)
      context.current.position.y = Math.min(Math.max(newY, -(chartConfig.lengthRange - 2)), 0.5)
    })

    drag.xEmitter.add((deltaX) => {
      chart.ref.current.rotation.y += (Math.PI/180) * deltaX * 0.05; // Adjust sensitivity as needed
    })

    const setAxesHelper = (size: number = 10) => {
      const axesHelper = new THREE.AxesHelper(size)
      scene.add(axesHelper)
    }

    const setTweaks = () => {
      const folder = debug.ref.current.gui!.addFolder('Chart')
      
      folder.add(chartConfig, 'lengthRange')
        .name('Length Range (PPM)')
        .min(0).max(30).step(.1)
        .onFinishChange(() => {
          lengthScale.current = makeLengthScale(chartConfig.lengthRange)
          // chart.reposition()
        })

      folder.add(chartConfig, 'radius')
        .name('Radius')
        .min(0).max(10).step(.1)
        .onFinishChange(() => {
          chartConfig.radius = chartConfig.radius
          // chart.reposition()
        })
    }

    if (debug.ref.current.active) {
      setAxesHelper()
      setTweaks()
    }

  }, [])

  const update = useCallback(() => {
    chart.update()
    lengthAxis.update()
  }, [ chart ])


  return { 
    update 
  }
}




