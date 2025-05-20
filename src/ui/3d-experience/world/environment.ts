import { useEffect, useCallback } from "react"
import * as THREE from 'three'

export function useEnvironment({ scene, lightHelper }: { scene: THREE.Scene, lightHelper: boolean }) {

  const setAmbientLight = useCallback((intensity: number) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, intensity)
    scene.add(ambientLight)
  }, [])

  const setDirectionalLight = useCallback((x: number, y: number, z: number, intensity: number) => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, intensity)
    directionalLight.position.set(x, y, z)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 10
    directionalLight.shadow.normalBias = 0.05

    scene.add(directionalLight)

    if (lightHelper) {
      scene.add(new THREE.DirectionalLightHelper(directionalLight, 0.5))
    }
  }, [])

  const setPointLight = useCallback((x: number, y: number, z: number, intensity: number) => {
    const pointLight = new THREE.PointLight(0xd6c580, intensity)
    pointLight.position.set(x, y, z)
    pointLight.castShadow = false
    scene.add(pointLight)
    
    if (lightHelper) {
      scene.add(new THREE.PointLightHelper(pointLight, 0.5))
    }
  }, [])

  useEffect(() => {
    setAmbientLight(1)
    setDirectionalLight(15, 30, 50, 3)
    setPointLight(0.15, 5, -5, 30)
  }, [])

}