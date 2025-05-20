import { MonthCO2 } from '@/data/definitions';
import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import * as d3 from "d3"

interface ISpiral {
  line: THREE.LineLoop
  markers: THREE.Group
}

const markerGeometry = new THREE.SphereGeometry(0.0675, 16, 16)
const markerMaterial = new THREE.MeshStandardMaterial({ color: '#333333' })
const lineMaterial = new THREE.LineBasicMaterial({ color: '#1c1c1c', linewidth: 5 })


function toBufferAttribute(array: number[]) {
  return new THREE.BufferAttribute(new Float32Array(array), 3)
}


function positionsToBufferGeometry(positions: number[]) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', toBufferAttribute(positions))
  return geometry
}


function makeLineMesh(positions: number[]) {
  return new THREE.LineLoop(positionsToBufferGeometry(positions), lineMaterial)
}


function makeMarkerMesh(x: number, y: number, z: number) {
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(x, y, z)
  return marker
}


function makeSpiralMeshes(data: MonthCO2[]) {
  const positions: number[] = []
  const markers = new THREE.Group()

  for (const { coordinates } of data) {
    const { x, y, z } = coordinates
    markers.add(makeMarkerMesh(x, y, z)) // Add marker to the group
    positions.push(x, y, z) // Insert coordinates into the positions array
  }

  const line = makeLineMesh(positions)
  return { line, markers }
}


export function useSpiralChart({ data, scene }: { data: MonthCO2[], scene: THREE.Scene }) {

  const spiralsRef = useRef(new Map<string, ISpiral>())
  
  useEffect(() => {
    const spirals = new Map<string, ISpiral>()
    const byYearData = d3.groups(data, (d: MonthCO2) => new Date(d.date).getFullYear())

    byYearData.forEach(([ year, yearData ]) => {
      const { line, markers } = makeSpiralMeshes(yearData)
      scene.add(line, markers)
      spirals.set(String(year), { line, markers })
    })

    spiralsRef.current = spirals

    // Clean up function to remove spirals from the scene
    return () => {
      spirals.forEach(({ line, markers }) => {
        scene.remove(line, markers)
        line.geometry.dispose()
        markers.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose()
          }
        })
      })
    }
  
  }, [])

}