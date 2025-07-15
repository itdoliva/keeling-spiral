import { useCallback, useEffect, useMemo } from "react";
import * as THREE from 'three'
import * as d3 from "d3"
import gsap from "gsap";

import { useDrag } from '@/ui/3d-experience/utils/drag'; 
import { AnnualDatum, Dataset } from "@/types/data";
import { UseDebug } from "../utils/debug";
import { UseCamera } from "../camera";
import { UseSizes } from "../utils/sizes";
import { usePPMAxis } from "./ppmAxis";
import { useAppState } from "@/ui/context/appStateContext";
import { SpiralConfig } from '@/config/three';
import { useATMSample } from "@/ui/3d-experience/world/atm-sample/atmSample";
import { useSpiral } from "./spiral-chart/spiral";
import * as lighting from '@/ui/3d-experience/world/environment/lighting'
import Indicator from "@/ui/3d-experience/world/indicator/Indicator";
import { useAssets } from "@/ui/context/assetsContext";


const monthScale = d3.scaleLinear()
  .domain([ 0, 12 ])
  .range([ SpiralConfig.angleStart, SpiralConfig.angleEnd ])



export function useWorld({ dataset, scene, camera, sizes, debug }: {
  dataset: Dataset;
  scene: THREE.Scene;
  debug: UseDebug;
  camera: UseCamera;
  sizes: UseSizes;
}) {
  
  const state = useAppState()
  const assets = useAssets()
  
  const [ minPPM, maxPPM ] = d3.extent(dataset.monthly, d => d.ppm) as number[]

  const ppmScale = useMemo(() => { return d3.scaleLinear()
    .domain([ Math.floor(minPPM/10)*10, Math.ceil(maxPPM/10)*10 ])
    .range([ 0, SpiralConfig.lengthRange ])
  }, [ dataset ])


  const getRadialCoordinates = useCallback(<T>(
    datum: T, 
    monthAcc: (d: T) => number = (d => (d as any).monthDecimal),
    ppmAcc: (d: T) => number = (d => (d as any).ppm)
  ) => {
    const month = monthAcc(datum)
    const ppm = ppmAcc(datum)
    const angle = monthScale(month)
    return { 
      x: Math.cos(angle) * SpiralConfig.radius, 
      z: Math.sin(angle) * SpiralConfig.radius,
      y: ppmScale(ppm), 
    }
  }, [ ppmScale ])

  const drag = useDrag()
  
  const figure = useMemo(() => new THREE.Group(), [])
  const chart = useMemo(() => new THREE.Group(), [])
  const indicator = useMemo(() => new Indicator(), [])
  
  const ppmAxis = usePPMAxis({ ppmScale, camera, sizes })
  const spiral = useSpiral({ dataset, getRadialCoordinates })

  const yearData = dataset.annual.find(d => d.year === state.selectedYear) as AnnualDatum

  const ppmExtent = d3.extent(dataset.annual, d => d.ppm) as [ number, number ]
  const ppmCurrent = yearData.ppm


  const atmSample = useATMSample({ ppmExtent: ppmExtent, ppmCurrent: ppmCurrent })

  const y = ppmScale(yearData.ppm)

  gsap.to(figure.position, {
    y: -y + 1.5,
    ease: 'power3.out',
    duration: .750,
    overwrite: true,
    onUpdate: () => figure.updateMatrixWorld(true)
  })

  indicator.moveTo(y)

  // Setup
  useEffect(() => {
    /* Axis */
    ppmAxis.object.position.copy(new THREE.Vector3(-(SpiralConfig.radius + SpiralConfig.offset), 0, 0))

    /* Atmosphere Sample Cylinder */
    atmSample.points.material.uniforms.uSize.value = 40 * 2
    atmSample.object.position.x = 1.6
    atmSample.object.position.y = 2.5
    
    /* Nest objects */
    chart.add(spiral.object)
    figure.add(ppmAxis.object, chart, indicator.object)
    scene.add(figure, atmSample.object, lighting.ambientLight, lighting.directionalLight, lighting.pointLight)

    /* Add drag callback */
    drag.xEmitter.add((deltaX) => {
      const factor = (Math.PI/180) * deltaX * 0.05 // Adjust sensitivity as needed
      chart.rotation.y += factor
    })

    const setAxesHelper = (size: number = 10) => {
      const axesHelper = new THREE.AxesHelper(size)
      scene.add(axesHelper)
    }

    const setTweaks = () => {
      const folder = debug.ref.current.gui!.addFolder('Chart')
      
      folder.add(SpiralConfig, 'lengthRange')
        .name('Length Range (PPM)')
        .min(0).max(30).step(.1)
        .onFinishChange(() => {
        })

      folder.add(SpiralConfig, 'radius')
        .name('Radius')
        .min(0).max(10).step(.1)
        .onFinishChange(() => {
          SpiralConfig.radius = SpiralConfig.radius
        })
    }

    if (debug.ref.current.active) {
      setAxesHelper()
      setTweaks()
    }


  }, [])

  useEffect(() => {
    if (!assets) return
    indicator.object.material.matcap = assets.indicator.matCap
  }, [ assets ])

  const update = useCallback(() => {
    ppmAxis.update()
    atmSample.update()
  }, []) //yearBubbles



  return { 
    update 
  }
}




