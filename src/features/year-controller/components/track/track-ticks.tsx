import * as d3 from "d3"
import { useEffect, useRef } from 'react'
import { Scale, YearTick } from "../../types";
import cn from "@/utils/cn";

type TrackTicksOptions = {
  ticks: YearTick[];
  hoveredYear: number | null;
  scale: Scale
}

export default function TrackTicks<T>({ ticks, hoveredYear, scale }: TrackTicksOptions) {
  const ref = useRef<SVGGElement>(null)

    useEffect(() => {
      const tickEls = d3.select(ref.current)
        .selectAll<SVGCircleElement, YearTick>('.tick')
          .data(ticks, d => d.year)
  
      tickEls.exit().remove()
      tickEls.enter().append('circle')
        .attr('class', d => cn('tick', d.year, { decade: d.decade }))
        .attr('r', d => d.getRadius())
    }, [ ticks ])

    useEffect(() => {
      d3.select(ref.current).selectAll<SVGCircleElement, YearTick>('.tick')
        .attr('transform', d => `translate(${scale(d.year)}, 0)`)
    }, [ scale ])
  
    useEffect(() => {
      d3.select(ref.current).selectAll<SVGCircleElement, YearTick>('.tick')
        .transition()
        .duration(300)
        .ease(d3.easeCubicInOut)
          .attr('r', d => d.getRadius(hoveredYear))
    }, [ hoveredYear ])

  return (
    <g ref={ref} className="ticks fill-gray-light">
      {/* ... circle.tick */}
    </g>
  )
}