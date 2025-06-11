import { Row } from "postgres"
import { AnnualDatum, MonthlyDatum, InterpolatedDatum } from "@/data/definitions"

export const parseAnnualData = ({ location, year, ppm, growth, running_growth }: Row): AnnualDatum => {
  return {
    location,
    date: new Date(year),
    year,
    ppm: parseFloat(ppm),
    growth: parseFloat(growth),
    runningGrowth: parseFloat(running_growth)
  }
}

export const parseMonthlyData = ({ location, year, month, ppm }: Row): MonthlyDatum => {
  const monthIndex = month - 1
  return {
    location,
    date: new Date(year, monthIndex),
    year,
    month: monthIndex,
    ppm: parseFloat(ppm),
  }
}

export const parseInterpolatedData = ({ location, year, month_decimal, ppm }: Row): InterpolatedDatum => {
  return {
    location,
    year,
    monthDecimal: parseFloat(month_decimal) - 1.,
    ppm: parseFloat(ppm),
  }
}