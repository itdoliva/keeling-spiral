import * as d3 from "d3"
import { RawMonthCO2 } from "./definitions";

export function getRadianScale(data: RawMonthCO2[]) {
  return d3.scalePoint()
    .domain(d3.range(0, 12).map((d: number) => d.toString()))
    .range([0, 2 * Math.PI])
    .padding(0.5)
}

export function getPPMScale(data: RawMonthCO2[]) {
  return d3.scaleLinear()
    .domain(d3.extent(data, (d: RawMonthCO2) => d.ppm) as [number, number])
    .range([0, 10])
}

export function toCartesian3D(d: RawMonthCO2, radianScale: d3.ScalePoint<string>, ppmScale: d3.ScaleLinear<number, number>) {
  const angle = radianScale(d.date.getMonth().toString())
  const x = Math.cos(angle!) * 1
  const z = Math.sin(angle!) * 1
  const y = ppmScale(d.ppm)

  return { x, y, z }
}
