import * as THREE from 'three'
import * as d3 from "d3"
import { makeBufferGeometry } from '@/lib/helpers';
import { useCallback, useEffect, useMemo } from 'react';
import { UseCamera } from '../camera';
import { UseSizes } from '../utils/sizes';

import { PPMAxisConfig, createPPMAxisLine } from '@/lib/config/ppmAxis';

type TickType = 'minor' | 'major' | 'half';

interface Tick {
  value: number;
  type: TickType;
  coordinate: THREE.Vector3;
}


export function usePPMAxis({ ppmScale, camera, sizes }: {
  ppmScale: d3.ScaleLinear<number, number>;
  camera: UseCamera;
  sizes: UseSizes;
}) {

  const axis = useMemo(() => new THREE.Group(), [])

  const ticks = useMemo(() => {
    const [ minTick, maxTick ] = ppmScale.domain()
    const tickValues = d3.range(minTick, maxTick + 1, 1)

    return tickValues.map((value: number) => {
      let type: TickType

      if (value % 10 === 0) {
        type = 'major'
      } 
      else if (value % 5 === 0) {
        type = 'half'
      }
      else {
        type = 'minor'
      }

      const coordinate = new THREE.Vector3(0, ppmScale(value), 0)

      return { value, type, coordinate }
    })
  }, [ ppmScale ])


  useEffect(() => {
    // Domain
    const domainPositions = ppmScale.range().flatMap(d => [ 0, d, 0 ])
    const geometry = makeBufferGeometry(domainPositions)
    const domainLine = createPPMAxisLine(geometry)

    // Tick lines
    const tickLines = ticks.map(({ coordinate, type }) => {
      const tickPositions = [ coordinate, coordinate.clone().add(PPMAxisConfig.tickSizes[type]) ]
      const geometry = makeBufferGeometry(tickPositions)
      return createPPMAxisLine(geometry)
    })

    axis.add(domainLine, ...tickLines)

    // Tick labels (HTML)
    d3.select('body').select('.label-layer')
      .selectAll<HTMLDivElement, Tick>('.ppm-ticklabel')
        .data(ticks.filter(d => d.type === 'major'), d => d.value)
        .join(
          enter => enter.append('div').attr('class', 'ppm-ticklabel')
            .append('span')
              .text(d => d.value + ' ppm'),
          update => update,
          exit => exit.remove()
        )

    return () => {
      // Clean up
      for (let i = axis.children.length - 1; i >= 0; i--) {
        const child = axis.children[i]
        if (child instanceof THREE.Line) {
          child.geometry.dispose()
        }
        axis.remove(child)
      }
      
    }
  }, [ ppmScale, ticks.length ])


  const update = useCallback(() => {
    const axisPosition = axis.position.clone()

    d3.selectAll<HTMLDivElement, Tick>('.ppm-ticklabel')
      .style('transform', ({ coordinate, type }) => {

        const screenPosition = coordinate.clone()
        screenPosition.add(PPMAxisConfig.tickSizes[type]) // Offset to the left
        screenPosition.add(axisPosition)

        if (axis.parent) {
          screenPosition.add(axis.parent.position)
        }
        
        screenPosition.project(<THREE.PerspectiveCamera>(camera.ref.current))

        const translateX = screenPosition.x * sizes.ref.current.width * 0.5
        const translateY = - screenPosition.y * sizes.ref.current.height * 0.5

        return `translateX(${translateX}px) translateY(${translateY}px)`
      })
  }, [])

  useEffect(() => {
    update()
  }, [])

  return { object: axis, update }

}