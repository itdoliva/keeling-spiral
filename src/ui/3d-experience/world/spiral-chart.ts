import { MonthCO2, YearCO2, Dataset } from '@/data/definitions';
import { useEffect, useRef, useCallback, RefObject } from 'react';
import * as THREE from 'three';
import * as d3 from "d3"
import { UseSizes } from '../utils/sizes';
import { UseCamera } from '../camera';
import { makeBufferGeometry } from '@/app/lib/helpers';
import { UsePointer } from './pointer';
import { CHART_CONFIG, SPIRAL_MATERIAL, MARKER_GEOMETRY, MARKER_MATERIAL } from '@/app/lib/config'

import jsspline from "@/app/lib/jsspline"


// --- Types ---
type Spiral = THREE.Group & {
  children: [ THREE.LineLoop, THREE.Group ]
}


// --- Utility functions ---
const makeMarker = () => {
  return new THREE.Mesh(MARKER_GEOMETRY, MARKER_MATERIAL)
}


export function useSpiralChart({ dataset, context, getRadialCoordinates, config }: { 
  dataset: Dataset,
  context: THREE.Object3D, 
  getRadialCoordinates: (...args: any[]) => any,
  config: { lengthRange: number, radius: number },
}) {

  const chartRef = useRef(new THREE.Group())
  const markersRef = useRef<THREE.Group[]>([])


  // const makeSpiralMeshes = useCallback((yearData: MonthCO2[]): { 
  //   spiral: Spiral, 
  //   markers: THREE.Group 
  // } => {
  //   const year = yearData[0].date.getFullYear()

  //   // Create a new spiral group for the year
  //   const spiral = new THREE.Group()
  //   spiral.userData = { 
  //     year: year, 
  //     data: yearData 
  //   }

  //   const positions: number[] = [] // Positions array to hold line loop coordinates
  //   const markers = new THREE.Group() // Group to hold marker meshes

  //   // Iterate through the months os the year to increment positions array and add markers
  //   yearData.forEach(d => {
  //     const { x, y, z } = getCoordinates(d)
      
  //     positions.push(x, y, z) // Insert coordinates into the positions array

  //     const marker = makeMarkerMesh()
  //     marker.position.set(x, y, z)
  //     marker.userData = { year: year, month: d.date, data: d }
  //     markers.add(marker)
  //   })

  //   // Create the line loop geometry and add it to the spiral
  //   const line = makeSpiralLine(positions)
  //   spiral.add(line, markers)

  //   // Add spiral to the scene
  //   chartRef.current.add(spiral)

  //   // Store the spiral and markers in the refs
  //   spiralsRef.current.set(String(year), <Spiral>spiral)
  //   markersRef.current.push(markers)

  //   return { spiral: <Spiral>spiral, markers: markers}
  // }, [])


  // const repositionSpirals = useCallback(() => {
  //   spiralsRef.current.forEach((spiral, _) => {
  //     const data = spiral.userData.data
  //     const [ line, markers ] = spiral.children

  //     // Update the line positions and markers' positions
  //     const positionsAttr = line.geometry.getAttribute('position') as THREE.BufferAttribute

  //     data.forEach((d: MonthCO2, i: number) => {
  //       const { x, y, z } = getCoordinates(d)
  //       markers.children[i].position.set(x, y, z)
  //       positionsAttr.setXYZ(i, x, y, z)
  //     })


  //     positionsAttr.needsUpdate = true
  //   })
  // }, [])


  const reposition = useCallback(() => {
    // repositionSpirals()
  }, [])

  const update = useCallback(() => {
    // const intersects = pointer.intersect(markersRef.current, false)

    // if (intersects.length > 0) {
    //   const object = intersects[0].object

    //   // const year = spiral.userData.data[0].date.getFullYear().toString()

    //   console.log(`Object:`, object)
    // } else {
    //   console.log('No spiral intersected')
    // }
  }, [])

  useEffect(() => {
    context.add(chartRef.current)
  }, [])

  
  useEffect(() => {
    // Make Spiral Line
    const linePositions: number[] = [] 

    dataset.interpolated.forEach(d => {
      const { x, y, z } = getRadialCoordinates(d, d => d.monthDecimal)
      linePositions.push(x, y, z)
    })

    // Create the line geometry and add it to the spiral
    const line = new THREE.Line(makeBufferGeometry(linePositions), SPIRAL_MATERIAL)

    // Make Markers
    const markers = new THREE.Group()
    dataset.monthly.forEach(d => {
      const { x, y, z } = getRadialCoordinates(d, d => d.month)
      const marker = makeMarker()
      marker.position.set(x, y, z)
      markers.add(marker)
    })

    // Add line and markers
    chartRef.current.add(line, markers)

    // Clean up function to remove spirals from the scene
    return () => {
      line.geometry.dispose()

      for (let i = markers.children.length - 1; i >= 0; i--) {
        const child = markers.children[i]
        if (child instanceof THREE.Mesh) 
          child.geometry.dispose()
      }
      
      chartRef.current.remove(line, markers)
    }
  
  }, [ dataset ])

  return { ref: chartRef, reposition, update }

}