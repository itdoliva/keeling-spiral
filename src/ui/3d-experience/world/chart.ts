import { MonthCO2 } from '@/data/definitions';
import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import * as d3 from "d3"

export function useSpiralChart({ data, scene }: { data: MonthCO2[], scene: THREE.Scene }) {

  const xScale = useCallback(d3.scaleTime()
    .domain([ new Date(data[0].date), new Date(data[data.length - 1].date) ])
    .range([0, 5])
  , [])

  const yScale = useCallback(d3.scaleLinear()
    .domain(d3.extent(data, (d: MonthCO2) => d.ppm) as [number, number])
    .range([0, 5])
  , [])
  
  useEffect(() => {
    const lineMaterial = new THREE.LineBasicMaterial()
    const markerGeometry = new THREE.SphereGeometry(0.005, 16, 16)
    const markerMaterial = new THREE.MeshBasicMaterial({ color: '#00ff83', opacity: 0.5, transparent: true })

    const positions: Array<number> = []

    for (let i = 0; i < data.length; i++) {
      const x = xScale(new Date(data[i].date))
      const y = yScale(data[i].ppm)
      const z = 0

      positions.push(x)
      positions.push(y)
      positions.push(z)

      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      scene.add(marker);
    }

    const attrPositions = new THREE.BufferAttribute(new Float32Array(positions), 3)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', attrPositions)
    
    const line = new THREE.Line(geometry, lineMaterial);
  
    scene.add(line);
  }, [])

}