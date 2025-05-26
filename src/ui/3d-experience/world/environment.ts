import { useEffect, useCallback } from "react"
import * as THREE from 'three'
import { UseDebug } from "../utils/debug"


export function useEnvironment({ scene, debug }: { 
  scene: THREE.Scene, 
  debug: UseDebug
}) {

  const setAmbientLight = useCallback((intensity: number) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, intensity)
    scene.add(ambientLight)

    return ambientLight
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

    if (debug.ref.current.active) {
      scene.add(new THREE.DirectionalLightHelper(directionalLight, 0.5))
    }

    return directionalLight
  }, [])

  const setPointLight = useCallback((x: number, y: number, z: number, intensity: number) => {
    const pointLight = new THREE.PointLight(0xd6c580, intensity)
    pointLight.position.set(x, y, z)
    pointLight.castShadow = false
    scene.add(pointLight)
    
    if (debug.ref.current.active) {
      scene.add(new THREE.PointLightHelper(pointLight, 0.5))
    }

    return pointLight
  }, [])

  useEffect(() => {
    const ambientLight = setAmbientLight(1)
    const directionalLight = setDirectionalLight(5, 30, 5, 3)
    const pointLight = setPointLight(0.15, 5, -5, 30)

    const setTweaks = () => {
      if (!debug.ref.current.active)
        return

      const folder = debug.ref.current.gui!.addFolder('Environment')
      
      folder.add(ambientLight, 'intensity').name('Ambient Light Intensity')
        .min(0).max(25).step(0.1)

      folder.add(directionalLight, 'intensity').name('Directional Light Intensity')
        .min(0).max(25).step(0.1)

      folder.add(pointLight, 'intensity').name('Point Light Intensity')
        .min(0).max(100).step(0.1)
    }

    setTweaks()
  }, [])

}