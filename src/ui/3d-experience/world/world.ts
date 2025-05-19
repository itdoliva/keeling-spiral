import { useCallback, useEffect } from "react";
import * as THREE from 'three'
import { useEnvironment } from "./environment";
import { useSpiralChart } from "./chart";
import { MonthCO2 } from "@/data/definitions";

export function useWorld({ data, scene }: { data: MonthCO2[], scene: THREE.Scene }) {

  const setTestMesh = useCallback(() => {
    const geometry = new THREE.SphereGeometry(1, 64, 64)
    const material = new THREE.MeshStandardMaterial({ color: '#00ff83' })
    const sphere = new THREE.Mesh(geometry, material)

    scene.add(sphere)
  }, [])

  const setAxesHelper = useCallback(() => {
    scene.add(new THREE.AxesHelper(10))
  }, [])

  const environment = useEnvironment({ scene, lightHelper: true })
  const chart = useSpiralChart({ data, scene })

  useEffect(() => {
    // setTestMesh()
    setAxesHelper()
  }, [ ])


 
}