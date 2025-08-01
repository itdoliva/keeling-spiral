import * as d3 from "d3"
import gsap from "gsap";
import { useRef, useMemo, useEffect } from 'react'
import { YearControllerConfig } from '@/config/layout';
import { ReducerAction } from '@/types/store';

import YearControllerTrack from '@/features/year-controller/components/controller-track';
import YearTicklabels from '@/features/year-controller/components/controller-ticklabels';
import useElementResize from '@/features/year-controller/hooks/use-element-resize';
import makeTick from '@/features/year-controller/utils/makeTick';
import useSlideIn from "@/hooks/use-slide-in";

type YearControllerProps = {
  years: number[];
  config: typeof YearControllerConfig;
  selectedYear: number;
  hoveredYear: number | null;
  dispatch: React.Dispatch<ReducerAction>
}

export default function YearController({ years, config, selectedYear, hoveredYear, dispatch }: YearControllerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  const dimensions = useElementResize(ref)

  useSlideIn({ ref: wrapperRef, play: dimensions.width > 100, desktopOnly: true, delay: .3 })

  const ticks = useMemo(() => {
    return years.map(year => makeTick(year, config.radius))
  }, [ years ])

  const decadeTicks = useMemo(() => {
    return ticks.filter(d => d.decade)
  }, [ ticks ])
  
  const scale = useMemo(() => {
    return d3.scalePoint<number>()
      .domain(ticks.map(d => d.year))
      .range([ config.domain.hpad, dimensions.width - config.domain.hpad ])
  }, [ ticks, dimensions ])


  return (
    <div ref={wrapperRef} className="bg-black/85 px-1.5 py-2 md:py-1.5 md:rounded-xl opacity-0">
      <div ref={ref} className="bg-gray-dark border border-gray-medium/50 rounded-lg py-0.5">

        <YearControllerTrack 
          ticks={decadeTicks}
          scale={scale}
          width={dimensions.width}
          height={config.domain.height}
          selectedYear={selectedYear}
          hoveredYear={hoveredYear}
          dispatch={dispatch}
        />
        
        <YearTicklabels ticks={decadeTicks} scale={scale} />

      </div>
    </div>
  )
}