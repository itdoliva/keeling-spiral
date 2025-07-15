import * as d3 from "d3"
import { SpiralConfig } from "@/config/three"
import { MonthlyDatum } from "@/types/data"

function getRoundExtent(values: any[], accessor: (d: any) => any = d => d) {
  const [ min, max ] = d3.extent(values, accessor) as number[]
  return [ Math.floor(min/10)*10, Math.ceil(max/10)*10 ]
}

function createPPMScale() {
  const scale = d3.scaleLinear<number, number>()
    .range([0, SpiralConfig.lengthRange])

  function updateDomain(data: MonthlyDatum[]) {
    scale.domain(getRoundExtent(data, d => d.ppm))
    return scale
  }

  return Object.assign(scale, { updateDomain })
}

function createMonthScale() {
  return d3.scaleLinear()
    .domain([ 0, 12 ])
    .range([ SpiralConfig.angleStart, SpiralConfig.angleEnd ])
}

export const ppmScale = createPPMScale()
export const monthScale = createMonthScale()