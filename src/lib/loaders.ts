import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

const manager = new THREE.LoadingManager()

const rgbeLoader = new RGBELoader(manager)
const textureLoader = new THREE.TextureLoader()

export const loadTextureRGBE = (url: string): Promise<THREE.Texture> => {
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

export const loadTexture = (url: string): Promise<THREE.Texture> => {
  return new Promise((resolve, reject) => {
    textureLoader.load(url, (texture) => {
        texture.format = THREE.RGBAFormat;
        texture.type = THREE.UnsignedByteType;
        texture.colorSpace = THREE.SRGBColorSpace
        texture.needsUpdate = true
        resolve(texture)
      },
      undefined,
      (err) => reject(err)
    )
  })
}

export { manager as loadingManager }