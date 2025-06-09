import { YearCO2 } from '@/data/definitions';
import { useEffect, useRef, useCallback, RefObject } from 'react';
import * as THREE from 'three';
import * as d3 from "d3"
import { UseCamera } from '../camera';
import { UseSizes } from '../utils/sizes';
import { useAppState, useAppStateDispatch } from '@/ui/context';
import { CHART_CONFIG, AXIS_OFFSET } from '@/app/lib/config'


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

export function useBubbleChart({ groupedData, context, lengthScale, camera, sizes }: { 
  groupedData: YearCO2[], 
  context: THREE.Object3D, 
  lengthScale: RefObject<d3.ScaleLinear<number, number>>, 
  camera: UseCamera,
  sizes: UseSizes
}) {
  
  const state = useAppState()
  const dispatch = useAppStateDispatch() as React.Dispatch<{ type: string; year: string | null; }>

  const chart = useRef(new THREE.Group())
  const markersRef = useRef(new Map<string, THREE.Mesh>(new Map()))

  const positionMarker = useCallback((marker: THREE.Mesh) => {
    marker.position.setY(lengthScale.current(marker.userData.avgPPM))
  }, [])

  const positionMarkers = useCallback(() => {
    markersRef.current.forEach(positionMarker)
  }, [])


  const reposition = useCallback(() => {
    positionMarkers()
  }, [])

  const update = useCallback(() => {
    d3.selectAll('button.year-label')
      .each(function(mesh) {
        const screenPosition = (<THREE.Mesh>mesh).position.clone()
        screenPosition.add(context.position)
        screenPosition.project(<THREE.PerspectiveCamera>(camera.ref.current))

        const translateX = screenPosition.x * sizes.ref.current.width * 0.5
        const translateY = -screenPosition.y * sizes.ref.current.height * 0.5

        d3.select(this)
          .style('left', translateX + 'px')
          .style('top', translateY + 'px')
      })

  }, [])

  
  useEffect(() => {
    context.add(chart.current)
    
    // Create spirals for each year
    groupedData.forEach((d) => {
      const marker = makeMarkerMesh()
      marker.position.set(-(CHART_CONFIG.radius + AXIS_OFFSET), 0, 0)
      marker.userData = d
      positionMarker(marker)
      marker.visible = false
      chart.current.add(marker)
      markersRef.current.set(d.year, marker)
    })

    const yearLabels = d3.select('.label-layer')
    .selectAll('button.year-label')
      .data(markersRef.current.values(), d => (<THREE.Mesh>d).userData.year)
      .enter()
    .append('button')
      .attr('class', 'year-label')
      
    yearLabels.append('span')
      .text(d => d.userData.year)

    yearLabels.on('click', (e, d) => dispatch({ type: 'select', year: d.userData.year }))


    // Clean up function to remove spirals from the scene
    return () => {
      markersRef.current.forEach((mesh) => {
        context.remove(mesh)
        mesh.geometry.dispose()
      })
    }
  
  }, [])

  useEffect(() => {
    d3.selectAll('button.year-label')
      .classed('selected', d => state.selectedYear && d.userData.year === state.selectedYear)
  }, [ state.selectedYear ])

  useEffect(() => {
    d3.selectAll('button.year-label')
      .classed('hovered', d => state.hoveredYear && d.userData.year === state.hoveredYear)
  }, [ state.hoveredYear ])

  return { ref: chart, reposition, update }

}