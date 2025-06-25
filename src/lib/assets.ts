import * as THREE from 'three'
import { loadTexture } from "./loaders";

export const ASSET_PATHS = {
  cylinderEnvMap: '/assets/environment-maps/cloudy-sky.hdr',
};

export async function preloadAssets() {

  const loadingAssets = [
    loadTexture(ASSET_PATHS.cylinderEnvMap)
  ]

  const [
    cylinderEnvMap
  ] = await Promise.all(loadingAssets)

  return {
    cylinder: { 
      envMap: cylinderEnvMap 
    }
  }
}

      