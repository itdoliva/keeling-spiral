import { MonthCO2, YearCO2, Dataset } from '@/data/definitions';
import { useEffect, useRef, useCallback, RefObject } from 'react';
import * as THREE from 'three';
import * as d3 from "d3"
import { UseSizes } from '../utils/sizes';
import { UseCamera } from '../camera';
import { makeBufferGeometry } from '@/app/lib/helpers';
import { UsePointer } from './pointer';
import { CHART_CONFIG } from '@/app/lib/config'

import jsspline from "@/app/lib/jsspline"


// --- Types ---
type Spiral = THREE.Group & {
  children: [ THREE.LineLoop, THREE.Group ]
}

// --- Constants ---
const markerGeometry = new THREE.SphereGeometry(0.0575, 16, 16)
const markerMaterial = new THREE.MeshStandardMaterial({ color: '#333333' })
const spiralLineMaterial = new THREE.LineBasicMaterial({ color: '#1c1c1c', linewidth: 1 })


// --- Utility functions ---
const makeSpiralLine = (positions: number[] | THREE.Vector3[]) => {
  return new THREE.Line(makeBufferGeometry(positions), spiralLineMaterial)
}

const makeMarkerMesh = () => {
  const mesh = new THREE.Mesh(markerGeometry, markerMaterial)
  mesh.castShadow = true
  return mesh
}


export function useSpiralChart({ dataset, context, lengthScale, angleScale, config, pointer }: { 
  dataset: Dataset,
  context: THREE.Object3D, 
  lengthScale: RefObject<d3.ScaleLinear<number, number>>, 
  angleScale: RefObject<d3.ScaleLinear<number, number>>,
  config: { lengthRange: number, radius: number },
  pointer?: UsePointer,
}) {

  const chart = useRef(new THREE.Group())
  const spiralsRef = useRef(new Map<string, Spiral>(new Map()))
  const markersRef = useRef<THREE.Group[]>([])

  const getCoordinates = (d: MonthCO2) => {
    const angle = angleScale.current(d.date.getMonth().toString())

    return { 
      x: Math.cos(angle!) * config.radius, 
      z: Math.sin(angle!) * config.radius,
      y: lengthScale.current(d.ppm), 
    }
  }

  const makeSpiralMeshes = useCallback((yearData: MonthCO2[]): { 
    spiral: Spiral, 
    markers: THREE.Group 
  } => {
    const year = yearData[0].date.getFullYear()

    // Create a new spiral group for the year
    const spiral = new THREE.Group()
    spiral.userData = { 
      year: year, 
      data: yearData 
    }

    const positions: number[] = [] // Positions array to hold line loop coordinates
    const markers = new THREE.Group() // Group to hold marker meshes

    // Iterate through the months os the year to increment positions array and add markers
    yearData.forEach(d => {
      const { x, y, z } = getCoordinates(d)
      
      positions.push(x, y, z) // Insert coordinates into the positions array

      const marker = makeMarkerMesh()
      marker.position.set(x, y, z)
      marker.userData = { year: year, month: d.date, data: d }
      markers.add(marker)
    })

    // Create the line loop geometry and add it to the spiral
    const line = makeSpiralLine(positions)
    spiral.add(line, markers)

    // Add spiral to the scene
    chart.current.add(spiral)

    // Store the spiral and markers in the refs
    spiralsRef.current.set(String(year), <Spiral>spiral)
    markersRef.current.push(markers)

    return { spiral: <Spiral>spiral, markers: markers}
  }, [])


  const repositionSpirals = useCallback(() => {
    spiralsRef.current.forEach((spiral, _) => {
      const data = spiral.userData.data
      const [ line, markers ] = spiral.children

      // Update the line positions and markers' positions
      const positionsAttr = line.geometry.getAttribute('position') as THREE.BufferAttribute

      data.forEach((d: MonthCO2, i: number) => {
        const { x, y, z } = getCoordinates(d)
        markers.children[i].position.set(x, y, z)
        positionsAttr.setXYZ(i, x, y, z)
      })


      positionsAttr.needsUpdate = true
    })
  }, [])


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
    context.add(chart.current)
    
    // Create spirals for each year
    // groupedData.forEach(yearData => {
    //   makeSpiralMeshes(yearData.months)
    // })

    const positions: number[] = [] 
    dataset.interpolated.forEach(d => {
      const angle = angleScale.current(d.monthDecimal)

      const coordinates = { 
        x: Math.cos(angle!) * CHART_CONFIG.radius, 
        z: Math.sin(angle!) * CHART_CONFIG.radius,
        y: lengthScale.current(d.ppm), 
      }

      positions.push(coordinates.x, coordinates.y, coordinates.z)
    })


    // Create the line loop geometry and add it to the spiral
    const line = makeSpiralLine(positions)

    chart.current.add(line)



    // groupedData.forEach(yearData => {
    //   makeSpiralMeshes(yearData.months)
    // })



    // Clean up function to remove spirals from the scene
    return () => {
      spiralsRef.current.forEach((spiral) => {
        context.remove(spiral)
        const [ line, markers ] = spiral.children
        line.geometry.dispose()
        markers.children.forEach(child => {
          if (child instanceof THREE.Mesh) 
            child.geometry.dispose()
        })
      })
    }
  
  }, [])

  return { ref: chart, reposition, update }

}