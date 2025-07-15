import { Dataset, InterpolatedDatum, MonthlyDatum } from '@/types/data';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { makeBufferGeometry } from '@/lib/helpers';
import { createSpiralMarker } from '@/features/spiral/utils';
import { createSpiralLine } from '@/features/spiral/utils';



export function useSpiral({ dataset, getRadialCoordinates }: { 
  dataset: Dataset,
  getRadialCoordinates: <T>(datum: T, monthAcc?: (d: T) => number, ppmAcc?: (d: T) => number) => {
    x: number;
    z: number;
    y: number;
},
}) {

  const chart = useMemo(() => {
    return new THREE.Group()
  }, [])

  const reposition = useCallback(() => {
  }, [])

  const update = useCallback(() => {
  }, [])

  
  useEffect(() => {
    /* 
      Line
    */
    const linePositions: number[] = [] 
    dataset.interpolated.forEach(d => {
      const { x, y, z } = getRadialCoordinates(d, d => d.monthDecimal)
      linePositions.push(x, y, z)
    })

    const line = createSpiralLine(makeBufferGeometry(linePositions))

    /* 
      Markers
    */
    const markers = new THREE.Group()
    dataset.monthly.forEach(d => {
      const { x, y, z } = getRadialCoordinates(d, d => d.month)
      const marker = createSpiralMarker()
      marker.position.set(x, y, z)
      markers.add(marker)
    })

    chart.add(line, markers)

    // Clean up on unmount
    return () => {
      line.geometry.dispose()

      for (let i = markers.children.length - 1; i >= 0; i--) {
        const child = markers.children[i] as THREE.Mesh
        child.geometry.dispose()
      }
      
      chart.remove(line, markers)
    }
  
  }, [ dataset ])

  return { object: chart, reposition, update }

}