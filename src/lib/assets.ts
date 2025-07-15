import * as THREE from 'three'
import { loadTexture, loadTextureRGBE } from "./loaders";

export const ASSET_PATHS = {
  cylinderEnvMap: '/assets/environment-maps/cloudy-sky.hdr',
  indicatorMatCap: '/assets/matcaps/matcap-1.png'
};

export async function preloadAssets() {

  const loadingAssets = [
    loadTextureRGBE(ASSET_PATHS.cylinderEnvMap),
    loadTexture(ASSET_PATHS.indicatorMatCap)
  ]

  const [
    cylinderEnvMap,
    indicatorMatcap
  ] = await Promise.all(loadingAssets)

  return {
    cylinder: { 
      envMap: cylinderEnvMap 
    },
    indicator: {
      matCap: indicatorMatcap
    }
  }
}

      