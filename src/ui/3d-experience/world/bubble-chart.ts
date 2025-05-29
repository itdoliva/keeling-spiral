import { MonthCO2 } from '@/data/definitions';
import { useEffect, useRef, useCallback, RefObject } from 'react';
import * as THREE from 'three';
import * as d3 from "d3"
import { UseSizes } from '../utils/sizes';
import { UseCamera } from '../camera';
import { makeBufferGeometry } from '@/app/lib/helpers';
import { UsePointer } from './pointer';
import { groupByYear } from '@/data/helpers';

// --- Types ---

interface Tick {
  value: number;
  coordinate: THREE.Vector3;
  type: 'major' | 'tick' | 'minor';
  vector: THREE.Vector3;
};


// --- Constants ---
const markerGeometry = new THREE.SphereGeometry(0.0575, 16, 16)
const markerMaterial = new THREE.MeshStandardMaterial({ color: '#333333' })

// --- Utility functions ---
const makeMarkerMesh = () => {
  const mesh = new THREE.Mesh(markerGeometry, markerMaterial)
  return mesh
}

export function useBubbleChart({ data, context, lengthScale, angleScale, config, pointer }: { 
  data: MonthCO2[], 
  context: THREE.Object3D, 
  lengthScale: RefObject<d3.ScaleLinear<number, number>>, 
  angleScale: RefObject<d3.ScalePoint<string>>,
  pointer: UsePointer,
  config: { lengthRange: number, radius: number }
}) {

  const groupedData = useRef(groupByYear(data))

  const chart = useRef(new THREE.Group())
  const markersRef = useRef(new Map<string, THREE.Mesh>(new Map()))

  const positionMarker = (marker: THREE.Mesh) => {
    marker.position.setY(lengthScale.current(marker.userData.ppmAvg))
  }

  const positionMarkers = useCallback(() => {
    markersRef.current.forEach(positionMarker)
  }, [])


  const reposition = useCallback(() => {
    positionMarkers()
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
    groupedData.current.forEach((d) => {
      const marker = makeMarkerMesh()
      marker.userData = d
      positionMarker(marker)
      chart.current.add(marker)
    })

    // Clean up function to remove spirals from the scene
    return () => {
      markersRef.current.forEach((mesh) => {
        context.remove(mesh)
        mesh.geometry.dispose()
      })
    }
  
  }, [])

  return { ref: chart, reposition, update }

}