import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { YearTick } from "./year-controller"
import { formatDecade } from "@/lib/helpers";

export function YearTicklabels({ ticks, xScaleRef, resizeEmitter }: {
  ticks: YearTick[];
  xScaleRef: React.RefObject<d3.ScalePoint<number>>;
  resizeEmitter: any;
}) {

  const ulRef = useRef(null)

  useEffect(() => {
    if (!ulRef.current) return

    d3.select(ulRef.current).selectAll<HTMLLIElement, YearTick>('li.tick')
      .data(ticks.filter(d => d.decade), d => d.year)
      .join(
        (enter) => enter.append('li')
          .attr('class', 'tick')
          .text(d => formatDecade(String(d.year))),
        (update) => update,
        (exit) => exit.remove()
      )
  }, [ ticks.length ])


    useEffect(() => {
      // console.log(Date.now(), 'YearTrack :: UseEffect []')
  
      const ul = d3.select(ulRef.current)
  
      const handleResize = ({ width, height }: { width: number, height: number }) => {
        ul.selectAll<HTMLLIElement, YearTick>('li.tick')
          .style('left', d => xScaleRef.current(d.year) + 'px')
      }
  
      resizeEmitter.add(handleResize)
  
      return () => {
        resizeEmitter.remove(handleResize)
      }
    }, [])


  return (
    <ul ref={ulRef} className="relative">

    </ul>
  )
}