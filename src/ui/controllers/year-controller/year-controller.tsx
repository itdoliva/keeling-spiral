import { useRef, useEffect, useMemo, useState, useCallback } from "react"
import * as d3 from "d3"
import { YearControllerConfig } from '@/lib/config/layout';
import { AnnualDatum, Dataset } from "@/data/definitions";
import { isDecade } from "@/lib/helpers";
import { YearTrack } from "./year-track";
import { YearTicklabels } from "./year-ticklabels";
import { useEventEmitter } from "@/ui/utils/events";


export interface YearTick {
  year: number;
  decade: boolean;
  getRadius: (hoveredYear?: number | null) => number;
}


const createRadiusFn = (year: number, baseRadius: number) => (hoveredYear?: number | null) => {  
  return hoveredYear && hoveredYear === year 
    ? YearControllerConfig.radius.hover 
    : baseRadius
}

const tickDatapoint = ({ year }: AnnualDatum) => {
  const decade = isDecade(year)
  const radius = decade ? YearControllerConfig.radius.decade : YearControllerConfig.radius.ordinary;
  
  const tick = { 
    year, 
    decade, 
    getRadius: createRadiusFn(year, radius) 
  }

  return tick
}

export function YearController({ dataset }: { dataset: Dataset }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const xScaleRef = useRef(d3.scalePoint<number>())
  const resizeEmitter = useEventEmitter<Array<any>>()

  const dimensions = useRef({
    width: 200,
    height: YearControllerConfig.domain.height,
  })
  
  const ticks = useMemo(() => {
    return dataset.annual.map(tickDatapoint)
  }, [ dataset ])

  const onResize = useCallback(() => {
      dimensions.current.width = containerRef.current?.clientWidth || 200
      
      xScaleRef.current.range([ 
        YearControllerConfig.domain.hpad, 
        dimensions.current.width - YearControllerConfig.domain.hpad 
      ])

      resizeEmitter.trigger(dimensions.current, xScaleRef.current)
    }, [])


  useEffect(() => {
    xScaleRef.current.domain(ticks.map(d => d.year))
    onResize()
  }, [ ticks.length ])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div ref={containerRef} className="years-controller">
      <YearTicklabels xScaleRef={xScaleRef} ticks={ticks} resizeEmitter={resizeEmitter} />
      
      <div className="rounded-lg border border-gray-500 bg-[#d1d1d1] shadow-sm shadow-black/15 relative">
        
        <YearTrack ticks={ticks} xScaleRef={xScaleRef} resizeEmitter={resizeEmitter} />
        
        {/* <p className="absolute left-0 pointer-events-none select-none bg-[#1c1c1c]/75 text-[#d1d1d1] px-1 py-px font-bold text-xs -translate-x-1/2 -translate-y-1/3" 
          style={{ top: (YearControllerConfig.domain.height) + 'px'}} /> */}
      </div>
    </div>
  );
}
