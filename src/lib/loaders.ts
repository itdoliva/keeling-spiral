import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

const manager = new THREE.LoadingManager()

export const rgbeLoader = new RGBELoader(manager)

export const loadTexture = (url: string): Promise<THREE.Texture> => {
  return new Promise((resolve, reject) => {
    rgbeLoader.load(url, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        texture.colorSpace = THREE.SRGBColorSpace
        resolve(texture)
      },
      undefined,
      (err) => reject(err)
    )
  })
}

export { manager as loadingManager }