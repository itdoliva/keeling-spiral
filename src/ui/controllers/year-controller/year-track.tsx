import { useAppState, useAppStateDispatch } from "@/ui/context";
import { YEAR_CONTROLLER } from "@/app/lib/config";
import * as d3 from "d3";
import { useRef, useEffect, useCallback } from "react";
import { YearTick } from "./year-controller";


export function YearTrack({ ticks, xScaleRef, resizeEmitter }: {
  ticks: YearTick[];
  xScaleRef: React.RefObject<d3.ScalePoint<number>>; // Cant remove it. It's used on resizing and dragging
  resizeEmitter: any;
}) {

  // console.log(Date.now(), 'YearTrack :: Render')


  const state = useAppState()
  const dispatch = useAppStateDispatch()

  const svgRef = useRef<SVGSVGElement>(null)


  // Render ticks
  useEffect(() => {
    // console.log(Date.now(), 'YearTrack :: UseEffect [ ticks, state.* ]')

    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)

    // Update ticks
    svg.select('.ticks').selectAll<SVGCircleElement, YearTick>('.tick')
      .data(ticks, d => d.year)
      .join(
        (enter) => enter.append('circle')
          .attr('class', d => `tick ${d.decade ? 'decade' : ''}`)
          .attr('r', d => d.getRadius(state.hoveredYear)),

        (update) => update.transition()
          .duration(300)
          .ease(d3.easeCubicInOut)
          .attr('r', d => d.getRadius(state.hoveredYear)),

        (exit) => exit.remove()
      )

    svg.select('.thumb-wrapper')
      .attr('transform', `translate(${xScaleRef.current(state.selectedYear)}, 0)`)

  }, [ ticks, state.selectedYear, state.hoveredYear ])



  // Add click and drag event listeners
  useEffect(() => {
    // console.log(Date.now(), 'YearTrack :: UseEffect [ getClosest ]')

    const svg = d3.select(svgRef.current)
    const axis = svg.select('.axis')

    let isDragging = false

    const extractX = (e: MouseEvent | TouchEvent) => {
      return d3.pointer(e, svgRef.current)[0]
    }

    const getClosest = (x: number) => {
      const years = xScaleRef.current.domain()

      let closestYear = years[0]
      let closestPosition = Infinity
      let minDist = Infinity

      for (const year of years) {
        const yearPosition = xScaleRef.current(year) ?? 0
        const dist = Math.abs(yearPosition - x)
        if (dist < minDist) {
          minDist = dist
          closestYear = year
          closestPosition = yearPosition
        }
      }
      return { year: closestYear, position: closestPosition }
    }

    const handleDragStart = (event: MouseEvent | TouchEvent) => {
      isDragging = true
      event.preventDefault()
      document.body.style.cursor = "ew-resize"
    }

    const handleDragMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return

      event.preventDefault()
      const closest = getClosest(extractX(event))
      axis.select('.thumb-wrapper')
        .attr('transform', `translate(${closest.position}, 0)`)
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return

      isDragging = false
      dispatch({ type: 'select', year: getClosest(extractX(event)).year })

      if (!event.target || !(event.target instanceof Element) || !event.target.closest('.thumb-wrapper')) {
        document.body.style.cursor = 'auto'
      }
    };

    const handleTrackClick = () => {
      if (isDragging) return
      dispatch({ type: 'hover', year: null })
      isDragging = true
    };

    const handleTrackMove = (event: MouseEvent | TouchEvent) => {
      if (isDragging) return
      const closest = getClosest(extractX(event))
      dispatch({ type: 'hover', year: closest.year })
    };

    const handleTrackLeave = (event: MouseEvent | TouchEvent) => {
      dispatch({ type: 'hover', year: null })
      if (!isDragging) document.body.style.cursor = 'auto'
    };

    const handleThumbEnter = () => {
      document.body.style.cursor = 'ew-resize'
    };

    const handleThumbLeave = () => {
      if (!isDragging) document.body.style.cursor = 'auto'
    };

    const track = axis.select('.track')
      .on('mousedown touchstart', handleTrackClick)
      .on('mousemove touchmove', handleTrackMove)
      .on('mouseleave touchcancel', handleTrackLeave)

    const thumbWrapper = axis.select('.thumb-wrapper')
      .on('mousedown touchstart', handleDragStart)
      .on('mouseenter', handleThumbEnter)
      .on('mouseleave', handleThumbLeave)


    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('touchmove', handleDragMove)
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('mouseleave', handleDragEnd)
    window.addEventListener('touchend', handleDragEnd)
    window.addEventListener('touchcancel', handleDragEnd)

    return () => {

     track
      .on('mousedown touchstart', null)
      .on('mousemove touchmove', null)
      .on('mouseleave touchcancel', null)

    thumbWrapper
      .on('mousedown touchstart', null)
      .on('mouseenter', null)
      .on('mouseleave', null)

      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('mouseleave', handleDragEnd)
      window.removeEventListener('touchend', handleDragEnd)
      window.removeEventListener('touchcancel', handleDragEnd)
    }


  }, [])

  // Add resize event listeners
  useEffect(() => {
    // console.log(Date.now(), 'YearTrack :: UseEffect []')

    const svg = d3.select(svgRef.current)
    const axis = svg.select('.axis')

    const handleResize = ({ width, height }: { width: number, height: number }) => {
      svg.attr('width', width)
         .attr('height', height)

      axis.attr('transform', `translate(0, ${height/2})`)

      axis.select('.domain')
        .attr('x', 0)
        .attr('width', width)
        .attr('y', -YEAR_CONTROLLER.domain.height/2)
        .attr('height', YEAR_CONTROLLER.domain.height)

      svg.select('.ticks').selectAll<SVGCircleElement, YearTick>('.tick')
        .attr('transform', d => `translate(${xScaleRef.current(d.year) ?? 0}, 0)`)

      svg.select('.thumb-wrapper')
        .attr('transform', `translate(${xScaleRef.current(state.selectedYear) ?? 0}, 0)`)
    }

    resizeEmitter.add(handleResize)

    return () => {
      resizeEmitter.remove(handleResize)
    }
  }, [])


  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg">
      <g className="axis">
        <g className="track">
          <rect rx="18" className="domain fill-transparent" />
          <g className="ticks fill-[#747474]">
            {/* ... circle.tick */}
          </g>
        </g>
        <g className="thumb-wrapper group">
          <rect rx="3" x="-5" width="10" y={-YEAR_CONTROLLER.domain.height / 2} height={YEAR_CONTROLLER.domain.height} className="fill-transparent" />
          <rect rx="3" x="-5" width="10" y="-10" height="20" className="fill-[#747474] stroke-1 stroke-[#1c1c1c] group-hover:scale-105" />
        </g>
      </g>
    </svg>
  );

}
