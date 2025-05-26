import * as THREE from 'three'
import * as d3 from "d3"
import { makeBufferGeometry } from '@/app/lib/helpers';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { ChartConfig } from './world';
import { UseCamera } from '../camera';
import { UseSizes } from '../utils/sizes';

type TickType = 'minor' | 'major' | 'half';

interface Tick {
  value: number;
  type: TickType;
};

interface PositionedTick extends Tick {
  coordinate: THREE.Vector3;
}

// Constants
const axisMaterial = new THREE.LineBasicMaterial({ color: '#1c1c1c', linewidth: 1 })

const tickVectors = {
  major: new THREE.Vector3(-.3, 0, 0),
  half: new THREE.Vector3(-.125, 0, 0),
  minor: new THREE.Vector3(-.05, 0, 0)
}

// --- Utility functions ---
const makeLineMesh = (positions: number[] | THREE.Vector3[]) => {
  return new THREE.Line(makeBufferGeometry(positions), axisMaterial)
}

const makeTickData = (): Tick[] => {
  return d3.range(330, 430+1, 1).map(d => {
    let type: TickType

    if (d % 10 === 0) {
      type = 'major'
    } 
    else if (d % 5 === 0) {
      type = 'half'
    }
    else {
      type = 'minor'
    }

    return { value: d, type }
  })
}

const ticks = makeTickData()

export function useLengthAxis({ context, lengthScale, config, camera, sizes }: {
  context: THREE.Object3D;
  config: ChartConfig;
  lengthScale: RefObject<d3.ScaleLinear<number, number>>;
  camera: UseCamera,
  sizes: UseSizes
}) {

  const axis = useRef(new THREE.Group())

  const getAxisPosition = useCallback(() => {
    return new THREE.Vector3(-(config.radius + .5), 0, 0)
  }, [ config ])

  const getTickPosition = useCallback((tick: Tick): THREE.Vector3 => {
    return new THREE.Vector3(0, lengthScale.current(tick.value), 0)
  }, [])

  const getPositionedTicks = useCallback(() => {
    return ticks.map(tick => ({
      ...tick,
      coordinate: getTickPosition(tick),
    }))
  }, [])

  const [ tickData, setTickData ] = useState<PositionedTick[]>(getPositionedTicks())

  const setAxisMeshes = useCallback(() => {
    // Domain line
    const positions = lengthScale.current.range().flatMap(d => [ 0, d, 0])
    const domainLine = makeLineMesh(positions)
  
    // Ticks
    const tickLines: THREE.Line[] = []
    
    tickData.forEach((d) => {
      const positions = [ 
        d.coordinate, 
        d.coordinate.clone().add(tickVectors[d.type])
      ]
      tickLines.push(makeLineMesh(positions))
    })
  
    axis.current.add(domainLine, ...tickLines)
    context.add(axis.current)
  }, [ tickData ])

  const setAxisLabels = useCallback(() => {
    d3.select('body')
      .append('div')
        .attr('class', 'ticklabels')
      .selectAll('.ticklabel')
        .data(tickData, d => (<Tick>d).value)
        .enter()
      .append('div')
        .attr('class', d => 'ticklabel ' + d.type)
      .each(function (d) {
        if (d.type != 'major') return

        d3.select(this)
         .append('span')
          .text(d => (<PositionedTick>d).value + ' ppm')

      })
  }, [ tickData ])

  const update = useCallback(() => {
    axis.current.position.copy(getAxisPosition())

    d3.selectAll('.ticklabel')
      .style('transform', (d) => {
        const { coordinate, type } = <PositionedTick>d

        const screenPosition = coordinate.clone()
        screenPosition.add(getAxisPosition())
        screenPosition.add(tickVectors[type])
        screenPosition.add(context.position)
        screenPosition.project(<THREE.PerspectiveCamera>(camera.ref.current))

        const translateX = screenPosition.x * sizes.ref.current.width * 0.5
        const translateY = - screenPosition.y * sizes.ref.current.height * 0.5

        return `translateX(${translateX}px) translateY(${translateY}px)`
      })
  }, [])

  // const repositionTicks = useCallback(() => {
  //   d3.selectAll('.ticklabel')
  //     .style('transform', (d) => {
  //       const { coordinate, vector } = <Tick>d

  //       const screenPosition = coordinate.clone()
  //       screenPosition.add(getAxisPosition())
  //       screenPosition.add(vector)
  //       screenPosition.project(<THREE.PerspectiveCamera>(camera.ref.current))

  //       const translateX = screenPosition.x * sizes.ref.current.width * 0.5
  //       const translateY = - screenPosition.y * sizes.ref.current.height * 0.5

  //       return `translateX(${translateX}px) translateY(${translateY}px)`
  //     })
  // }, [])


  useEffect(() => {
    setAxisMeshes()
    setAxisLabels()
    update()
  }, [])

  return { update }

}