import { useEffect, useCallback } from 'react';
import * as THREE from 'three'
import * as d3 from 'd3'
import gsap from 'gsap';
import { MONTH_LABELS } from '@/lib/constants';
import { UseCamera } from '@/ui/3d-experience/camera';
import { UseSizes } from '@/ui/3d-experience/utils/sizes';


const opacityScale = d3.scaleLinear()
  .domain([ .25, .9 ])
  .range([ 0, 1 ])
  .clamp(true)

const kScale = d3.scaleLinear()
  .domain([ .1, .9 ])
  .range([ .5, 1 ])
  .clamp(true)


export function useMonthAxis({ axisGroup, camera, sizes }: {
  axisGroup: THREE.Group;
  camera: UseCamera;
  sizes: UseSizes;
}) {

  

  useEffect(() => {
    d3.select('.label-layer')
    .selectAll('div.month-label')
      .data(axisGroup.children, d => d.userData.month)
      .enter()
    .append('div')
      .attr('class', 'month-label')
    .append('span')
      .text(d => MONTH_LABELS[d.userData.month])

  }, [])


  const update = useCallback(() => {
    // Get the rotation of the axis
    const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      axisGroup.rotation.y
    )

    d3.selectAll('div.month-label')
      .each(function(mesh) {
        const screenPosition = (<THREE.Mesh>mesh).position.clone()
        screenPosition.applyQuaternion(rotationQuaternion)
        // screenPosition.add(axisGroup.parent.position)

        const scale = kScale(screenPosition.z)
        const opacity = opacityScale(screenPosition.z)

        screenPosition.project(<THREE.PerspectiveCamera>(camera.ref.current))

        const translateX = screenPosition.x * sizes.ref.current.width * 0.5
        const translateY = -screenPosition.y * sizes.ref.current.height * 0.5

        d3.select(this)
          .style('left', translateX + 'px')
          .style('top', translateY + 'px')
          .style('opacity', opacity)
          .style('transform', `scale(${scale})`)
      })

  }, [])


  return { update }
}