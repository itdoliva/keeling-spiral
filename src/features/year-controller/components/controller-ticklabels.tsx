import { Scale, YearTick } from "@/features/year-controller/types"

type YearTicklabelsOptions = {
  ticks: YearTick[],
  scale: Scale
}

export default function YearTicklabels({ ticks, scale }: YearTicklabelsOptions) {
  return (
    <ul className="relative text-white text-xs text-center tracking-number min-h-4 select-none">
      {ticks.map(tick => (
        <li key={tick.year} className="absolute -translate-x-1/2 bottom-0" style={{ left: scale(tick.year) + 'px'}}>
          {tick.label}
        </li>
      ))}
    </ul>
  )
}
