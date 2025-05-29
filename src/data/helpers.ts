import * as d3 from "d3"
import { MonthCO2 } from "./definitions";

export function groupByYear(data: MonthCO2[]) {
  
  const grouped: any[] = []

  d3.group(data, (d: MonthCO2) => d.date.getFullYear())
    .forEach((yearData: MonthCO2[], year: number) => {
      const ppmAvg = d3.mean(yearData, (d: MonthCO2) => d.ppm) || 0;
      const months = yearData.map(monthData => ({
        ...monthData,
        month: monthData.date.getMonth().toString(),
      }))

      grouped.push({
        year: year.toString(),
        ppmAvg: ppmAvg,
        months: months,
      })
    })

  return grouped
}