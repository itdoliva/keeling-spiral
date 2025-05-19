import { useEffect, useCallback } from "react"
import * as THREE from 'three'

export function useEnvironment({ scene, lightHelper }: { scene: THREE.Scene, lightHelper: boolean }) {

  const setAmbientLight = useCallback(() => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
  }, [])

  const setDirectionalLight = useCallback(() => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 5, 10)
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

  useEffect(() => {
    setAmbientLight()
    setDirectionalLight()
  }, [ ])

}