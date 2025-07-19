import * as d3 from "d3"
import { useRef, useMemo } from 'react'
import { YearControllerConfig } from '@/config/layout';
import { ReducerAction } from '@/types/store';

import YearControllerTrack from '@/features/year-controller/components/controller-track';
import YearTicklabels from '@/features/year-controller/components/controller-ticklabels';
import useElementResize from '@/features/year-controller/hooks/use-element-resize';
import makeTick from '@/features/year-controller/utils/makeTick';

type YearControllerProps = {
  years: number[];
  config: typeof YearControllerConfig;
  selectedYear: number;
  hoveredYear: number | null;
  dispatch: React.Dispatch<ReducerAction>
}

export default function YearController({ years, config, selectedYear, hoveredYear, dispatch }: YearControllerProps) {
  const ref = useRef<HTMLDivElement>(null)

  const dimensions = useElementResize(ref)

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
    <div ref={ref} className="max-w-84 mx-auto">

      <YearTicklabels ticks={decadeTicks} scale={scale} />

      <YearControllerTrack 
        ticks={decadeTicks}
        scale={scale}
        width={dimensions.width}
        height={config.domain.height}
        selectedYear={selectedYear}
        hoveredYear={hoveredYear}
        dispatch={dispatch}
      />

    </div>
  )
}