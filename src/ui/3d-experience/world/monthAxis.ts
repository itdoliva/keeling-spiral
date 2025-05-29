import { RefObject, useEffect, useRef } from 'react';
import * as THREE from 'three'
import * as d3 from 'd3'
import { ChartConfig } from './world';
import { UseCamera } from '../camera';
import { UseSizes } from '../utils/sizes';

const circleMaterial = new THREE.MeshStandardMaterial({ color: '#1c1c1c'  })
const circleGeometry = new THREE.CylinderGeometry(.15, .15, 2, 16, 1)

export function useMonthAxis({ context, months, angleScale, config, camera, sizes }: {
  context: THREE.Object3D;
  months: string[];
  config: ChartConfig;
  angleScale: RefObject<d3.ScalePoint<string>>;
  camera: UseCamera;
  sizes: UseSizes;
}) {

  const axis = useRef(new THREE.Group())


  useEffect(() => {
    axis.current.position.set(0, -.5, 0)
    context.add(axis.current)

    months.forEach(month => {
      const mesh = new THREE.Mesh(circleGeometry, circleMaterial)
      const angle = angleScale.current(month)
      mesh.position.set(
        Math.cos(angle!) * config.radius,
        0,
        Math.sin(angle!) * config.radius
      )
      mesh.name = month
      axis.current.add(mesh)
    })

  }, [])

  return { ref: axis }
}