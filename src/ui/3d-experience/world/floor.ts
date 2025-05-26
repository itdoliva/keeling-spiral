import * as THREE from 'three'
import { UseDebug } from '../utils/debug'
import { useEffect, useRef } from 'react'
import { handleColorChange } from '@/app/lib/helpers'

const floorConfig = {
  color: 0x747474,
}

const makeFloor = () => {
  const geometry = new THREE.CircleGeometry( 5, 64 )
  const material = new THREE.MeshStandardMaterial( { color: floorConfig.color } );
  const mesh = new THREE.Mesh( geometry, material )
  mesh.position.set(0, -1, 0)
  mesh.rotation.x = -Math.PI / 2
  mesh.receiveShadow = true
  return mesh
}

export function useFloor({ context, debug }: { context: THREE.Object3D, debug: UseDebug }) {

  const floor = useRef(makeFloor())

  useEffect(() => {
    context.add(floor.current)

    if (debug.ref.current.active) {
      const folder = debug.ref.current.gui!.addFolder('Floor')

      folder.addColor(floorConfig, 'color').name('Color')
        .onChange(handleColorChange(floor.current.material.color))
    }
  }, [])

  return { }
}