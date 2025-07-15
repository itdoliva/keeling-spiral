import * as d3 from "d3"
import { useRef, useState, useEffect, useCallback } from 'react'
import { ReducerAction } from "@/types/store"

import cn from "@/utils/cn"

import { YearTick, Scale, Coordinates, PointerEvent } from '@/features/year-controller/types'
import useDragHandler from "@/features/year-controller/hooks/useDragHandler"

import Track from "@/features/year-controller/components/track/track"
import TrackBase from "@/features/year-controller/components/track/track-base"
import TrackLine from "@/features/year-controller/components/track/track-line"
import TrackTicks from "@/features/year-controller/components/track/track-ticks"
import TrackThumb from "@/features/year-controller/components/track/track-thumb"

type YearControllerTrackProps = {
  ticks: YearTick[];
  scale: Scale;
  width: number;
  height: number;
  hoveredYear: number | null;
  selectedYear: number;
  dispatch: React.Dispatch<ReducerAction>;
}

export default function YearControllerTrack({ 
  ticks, 
  scale, 
  width,
  height,
  selectedYear, 
  hoveredYear,
  dispatch
}: YearControllerTrackProps) {
  const ref = useRef<SVGSVGElement>(null)

  const [ thumbDragX, setThumbDragX ] = useState(0)

  const select = useCallback((year: number) => {
    dispatch({ type: 'SELECT_YEAR', year: year })
  }, [ dispatch ])

  const extractCoordinates = useCallback((event: PointerEvent) => {
    return d3.pointer(event, ref.current)
  }, [ ref ])

  const getClosest = useCallback((x: number) => {
    const points = scale.domain()

    let closestPoint = points[0]
    let closestPosition = Infinity
    let minDist = Infinity

    for (const point of points) {
      const pointPosition = scale(point) ?? 0
      const dist = Math.abs(pointPosition - x)
      if (dist < minDist) {
        minDist = dist
        closestPoint = point
        closestPosition = pointPosition
      }
    }
    return { point: closestPoint, position: closestPosition }
  }, [ scale ])

  const onDragStart = useCallback(() => {
    document.body.classList.add('cursor-ew-resize')
  }, [])

  const onDrag = useCallback(([ x, _ ]: Coordinates) => {
    const closest = getClosest(x)
    setThumbDragX(closest.position)
  }, [ getClosest ])

  const onDragEnd = useCallback(([ x, _ ]: Coordinates) => {
    const closest = getClosest(x)
    select(closest.point)
    document.body.classList.remove('cursor-ew-resize')
  }, [ getClosest, select ])

  const { isDragging, startDrag} = useDragHandler({
    extractCoordinates,
    onDragStart,
    onDrag,
    onDragEnd
  })

  useEffect(() => {
    return () => {
      document.body.classList.remove('cursor-ew-resize')
    };
  }, [])


  return (
    <Track ref={ref} width={width} height={height} className="group">

      <TrackBase width={width} height={height} onClick={startDrag}>

        <TrackLine 
          fullExtent={scale.range()} 
          selectedTo={isDragging ? thumbDragX : scale(selectedYear) as number} 
        />
        
        <TrackTicks 
          ticks={ticks} 
          hoveredYear={hoveredYear} 
          scale={scale}
        />

      </TrackBase>

      <TrackThumb 
        x={isDragging ? thumbDragX : scale(selectedYear) as number} 
        margin={scale.step() + (1.75 * 2)}
        height={height} 
        onClick={startDrag}
      />

      <TrackThumb 
        preview
        className={cn(
          "opacity-0",
          { "group-hover:opacity-100 group-hover:duration-300 transition-opacity duration-150": !isDragging })}
        x={thumbDragX} 
        margin={scale.step() + (1.75 * 2)}
        height={height} 
      />

    </Track>
  )
}