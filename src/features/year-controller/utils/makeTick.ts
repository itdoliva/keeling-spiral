import { YearTick } from "@/features/year-controller/types";
import { formatDecade, isDecade } from "@/lib/helpers";

type RadiiConfig = { 
  decade: number;
  ordinary: number;
  hover: number;
}

const getRadiusFactory = (year: number, decade: boolean, radiiConfig: RadiiConfig) => {
  const baseRadius = decade 
    ? radiiConfig.decade 
    : radiiConfig.ordinary

  return (hoveredYear?: number | null) => hoveredYear && hoveredYear === year 
    ? radiiConfig.hover 
    : baseRadius
}

export default function makeTick(year: number, radiiConfig: RadiiConfig): YearTick {
  const decade = isDecade(year)
  return {
    year,
    decade,
    label: formatDecade(String(year)),
    getRadius: getRadiusFactory(year, decade, radiiConfig)
  }
}