import * as d3 from "d3"
import { AnnualDatum, MonthlyDatum, InterpolatedDatum, MonthCO2, YearCO2 } from "./definitions";

export function groupByYear(data: MonthCO2[]): YearCO2[] {
  
  const grouped: any[] = []

  d3.group(data, (d: MonthCO2) => d.date.getFullYear())
    .forEach((yearData: MonthCO2[], year: number) => {
      const avgPPM = d3.mean(yearData, (d: MonthCO2) => d.ppm) || 0;
      const months = yearData.map(monthData => ({
        ...monthData,
        month: monthData.date.getMonth().toString(),
      }))

      grouped.push({
        year: year.toString(),
        avgPPM: avgPPM,
        months: months,
      })
    })

  return grouped
}

export const groupByLocation = (data: Array<AnnualDatum | MonthlyDatum | InterpolatedDatum>) => {
  return d3.group(data, d => d.location)
}

