import * as d3 from "d3"
import { useCallback, useEffect, useRef, useState } from "react";
import { bodyStyle, isDecade, formatDecade } from "@/app/lib/helpers";
import { useAppState, useAppStateDispatch } from "../context";

interface Dimensions {
  width: number
  height: number
}

interface YearDatum {
  year: string;
  decade: boolean;
  radius: (hoveredYear?: string | null) => number;
}

const CONFIG = {
  margin: { top: 20, bottom: 0 },
  domain: { height: 32, hpad: 18 },
}

const RADIUS = {
  ordinary: 1.25,
  decade: 2.5,
  hover: 5
}

const initialDimensions: Dimensions = {
  width: 200,
  height: CONFIG.domain.height,
}

const createRadiusFn = (year: string, baseRadius: number) => (hoveredYear?: string | null) => {
  return hoveredYear && hoveredYear === year ? RADIUS.hover : baseRadius
}

const getYearData = (years: string[]): YearDatum[] => {
  return years.map(year => {
    const isDec = isDecade(year)
    const r = isDec ? RADIUS.decade : RADIUS.ordinary
    return { year, decade: isDec, radius: createRadiusFn(year, r) }
  })
}

export function YearController({ years }: { years: string[] }) {

  const data = useRef(getYearData(years))

  const state = useAppState()
  const dispatch = useAppStateDispatch() as React.Dispatch<{ type: string; year: string | null; }>

  const dimensions = useRef(initialDimensions)
  const ref = useRef<HTMLDivElement | null>(null)
  const selection = useRef<{ [ key: string ] : d3.Selection<SVGElement, unknown, null, undefined> }>({})
  const xScale = useRef<d3.ScalePoint<string>>(d3.scalePoint().domain(years))


  const create = useCallback(() => {
    const { ticksGroup, ulEl } = selection.current

    // Ticks
    ticksGroup.selectAll('.tick')
      .data(data.current, d => (d as YearDatum).year)
      .enter()
    .append('circle')
      .attr('class', d => `tick ${d.decade ? 'decade' : ''}`)
      .attr('r', d => (d as YearDatum).radius())

    // Decade labels
    const decades = data.current.filter(d => d.decade)

    ulEl.selectAll('li')
      .data(decades, d => (d as YearDatum).year)
      .enter()
    .append('li')
      .text(d => formatDecade(d.year as string))

    update()
  }, [])

  const update = useCallback(() => {
    const { svgEl, axisEl, domainEl, ticksGroup, ulEl } = selection.current
    const { width, height } = dimensions.current

    svgEl
      .attr('width', dimensions.current.width)
      .attr('height', dimensions.current.height)

    axisEl
      .attr('transform', `translate(0, ${height/2})`)

    domainEl
      .attr('x', 0)
      .attr('width', width)
      .attr('y', -CONFIG.domain.height/2)
      .attr('height', CONFIG.domain.height)

    ticksGroup.selectAll('.tick')
      .attr('transform', (d) => `translate(${xScale.current((d as YearDatum).year) ?? 0}, 0)`)
    
    ulEl.selectAll('li')
      .style('left', (d) => `${xScale.current((d as YearDatum).year)}px`)
  }, [])


  useEffect(() => {
    selection.current.ulEl = d3.select(ref.current).select('ul')
    selection.current.svgEl = d3.select(ref.current).select('svg')
    selection.current.floatingLabelEl = d3.select(ref.current).select('p')
    selection.current.axisEl = selection.current.svgEl.select('.axis')
    selection.current.trackEl = selection.current.axisEl.select('.track')
    selection.current.thumbWrapperEl = selection.current.axisEl.select('.thumb-wrapper')
    selection.current.thumbEl = selection.current.thumbWrapperEl.select('circle')
    selection.current.ticksGroup = selection.current.axisEl.select('.ticks')
    selection.current.domainEl = selection.current.axisEl.select('.domain')

    const handleResize = () => {
      dimensions.current.width = ref.current?.clientWidth || initialDimensions.width
      xScale.current.range([CONFIG.domain.hpad, dimensions.current.width - CONFIG.domain.hpad])
      update()
    }

    let isDragging = false

    const extractX = (e: MouseEvent | TouchEvent) => {
      const pointerX = d3.pointer(e, window)[0]
      const rect = ref.current!.getBoundingClientRect()
      return pointerX - rect.left
    }

    const getClosestYear = (x: number) => {
      let closestYear = years[0]
      let minDist = Infinity
      for (const year of years) {
        const yearX = xScale.current(year) ?? 0
        const dist = Math.abs(yearX - x)
        if (dist < minDist) {
          minDist = dist
          closestYear = year
        }
      }
      return closestYear
    }

    const handleDragStart = (event: MouseEvent | TouchEvent) => {
      isDragging = true
      event.preventDefault()
      document.body.style.cursor = "ew-resize"
    }

    const handleDragMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      event.preventDefault()

      const closestYear = getClosestYear(extractX(event))
      const x = xScale.current(closestYear) ?? 0
      selection.current.thumbWrapperEl
        .attr('transform', `translate(${x}, 0)`)

      selection.current.floatingLabelEl
        .text(closestYear)
        .style('left', x + 'px')
        .style('display', 'block')
    }

    const handleDragEnd = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      isDragging = false

      const closestYear = getClosestYear(extractX(event))
      dispatch({ type: 'select', year: closestYear })

      if (!event.target || !(event.target instanceof Element) || !event.target.closest('.thumb-wrapper')) {
        document.body.style.cursor = 'auto'
      }

      selection.current.floatingLabelEl.style('display', 'none')
    }

    const handleTrackClick = (event: MouseEvent | TouchEvent) => {
      if (isDragging) return
      dispatch({ type: 'hover', year: null })
      isDragging = true
    }

    const handleTrackMove = (event: MouseEvent | TouchEvent) => {
      if (isDragging) return
      const closestYear = getClosestYear(extractX(event))
      selection.current.floatingLabelEl
        .text(closestYear)
        .style('display', 'block')
        .style('left', xScale.current(closestYear) + 'px')
      dispatch({ type: 'hover', year: closestYear })
    }

    const handleTrackLeave = (event: MouseEvent | TouchEvent) => {
      dispatch({ type: 'hover', year: null })
      selection.current.floatingLabelEl.style('display', 'none')
      if (!isDragging) document.body.style.cursor = 'auto'
    }

    const handleThumbEnter = () => {
      document.body.style.cursor = 'ew-resize'
    }

    const handleThumbLeave = () => {
      if (!isDragging) document.body.style.cursor = 'auto'
    }

    // Create year elements and update scales
    create()
    handleResize()

    // Listeners
    window.addEventListener('resize', handleResize)

    selection.current.trackEl
      .on('mousedown touchstart', handleTrackClick)
      .on('mousemove touchmove', handleTrackMove)
      .on('mouseleave touchcancel', handleTrackLeave)

    selection.current.thumbWrapperEl
      .on('mousedown touchstart', handleDragStart)
      .on('mouseenter', handleThumbEnter)
      .on('mouseleave', handleThumbLeave)

    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('touchmove', handleDragMove)
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('mouseleave', handleDragEnd)
    window.addEventListener('touchend', handleDragEnd)
    window.addEventListener('touchcancel', handleDragEnd)
    
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('resize', handleResize)

      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('mouseleave', handleDragEnd)
      window.removeEventListener('touchend', handleDragEnd)
      window.removeEventListener('touchcancel', handleDragEnd)
    }

  }, [])

  useEffect(() => {
    const { thumbWrapperEl } = selection.current
    if (!thumbWrapperEl) return

    thumbWrapperEl
      .attr('transform', `translate(${xScale.current(state.selectedYear)}, 0)`)

  }, [ state.selectedYear ])

  useEffect(() => {
    const { ticksGroup } = selection.current

    if (!ticksGroup) return

    ticksGroup.selectAll('.tick')
      .transition()
      .duration(300)
      .ease(d3.easeCubicInOut)
      .attr('r', d => (d as YearDatum).radius(state.hoveredYear))

    
  }, [ state.hoveredYear ])

  return (
    <div ref={ref} className="years-controller">

      <ul 
        className="relative select-none" 
        style={{ height: CONFIG.margin.top }}
      />

      <div className="rounded-lg border border-gray-500 bg-[#d1d1d1] shadow-sm shadow-black/15 relative">
        <svg xmlns="http://www.w3.org/2000/svg">
          <g className="axis">
            <g className="track">
              <rect rx="18" className="domain fill-transparent" />
              <g className="ticks fill-[#747474]" />
            </g>
            <g className="thumb-wrapper group">
              <rect rx="3" x="-5" width="10" y={-CONFIG.domain.height/2} height={CONFIG.domain.height} className="fill-transparent" />
              <rect rx="3" x="-5" width="10" y="-10" height="20" className="fill-[#747474] stroke-1 stroke-[#1c1c1c] group-hover:scale-105" />
            </g>
          </g>
        </svg>

        <p className="absolute left-0 pointer-events-none select-none bg-[#1c1c1c]/75 text-[#d1d1d1] px-1 py-px font-bold text-xs -translate-x-1/2 -translate-y-1/3" style={{ top: (CONFIG.domain.height) + 'px'}}/>
      </div>

      {/* <div className="select-none text-center">
        <p>{state.hoveredYear ?? 'No hovered year'}</p>
        <p>{state.selectedYear}</p>
      </div> */}


    </div>
  )
}