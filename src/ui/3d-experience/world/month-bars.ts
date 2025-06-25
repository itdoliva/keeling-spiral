import * as THREE from 'three'
import * as d3 from 'd3'
import { RefObject, useEffect, useRef, useCallback } from 'react';
import { ChartConfig, YearCO2 } from '@/data/definitions'
import { useAppState } from '@/ui/context/context';
import { UseCamera } from '@/ui/3d-experience/camera';
import { UseSizes } from '@/ui/3d-experience/utils/sizes';

import gsap from 'gsap';

const baseHeight = 1/4 // Height of the cylinder representing 1 ppm (25 (lengthRange) / 100 (range of PPM))
const circleMaterial = new THREE.MeshStandardMaterial({ color: '#1c1c1c'  })
const circleGeometry = new THREE.CylinderGeometry(.15, .15, baseHeight, 16, 1)
circleGeometry.translate(0, baseHeight / 2, 0);


export function useMonthBars({ context, groupedData, months, lengthScale, angleScale, config }: {
  context: THREE.Object3D;
  groupedData: YearCO2[];
  months: string[];
  lengthScale: RefObject<d3.ScaleLinear<number, number>>;
  angleScale: RefObject<d3.ScalePoint<string>>;
  config: ChartConfig;
}) {

  const state = useAppState()
  
  const axis = useRef(new THREE.Group())


  useEffect(() => {
    axis.current.position.set(0, 0, 0)
    context.add(axis.current)

    const bars = months.map(month => {
      const angle = angleScale.current(month)

      const mesh = new THREE.Mesh(circleGeometry, circleMaterial)
      mesh.position.set(
        Math.cos(angle!) * config.radius,
        0,
        Math.sin(angle!) * config.radius
      )
      mesh.userData = { month }
      return mesh
    })

    axis.current.add(...bars)


    
  }, [])

  useEffect(() => { 

    const monthsData = groupedData.find(d => d.year === state.selectedYear)!.months

    const middle = Math.random()*11 // Randomly select a month to be the middle month for animation
    axis.current.children.forEach((mesh: THREE.Mesh, i) => {
      const monthData = monthsData[i]

      let scaleY = 0

      if (monthData) {
        const height = lengthScale.current(monthData.ppm)
        scaleY = height / baseHeight
      }

      gsap.to(mesh.scale, {
        y: scaleY,
        duration: 0.5,
        ease: 'power2.out',
        delay: Math.abs(i - middle) * 0.025,
        onUpdate: () => mesh.updateMatrixWorld(true)
      })


    })


  }, [ state.selectedYear ])

  return { ref: axis }
}