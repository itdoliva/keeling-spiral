'use client'

import { Dataset } from "@/data/definitions"
import { YearController } from "./year-controller/year-controller"

export function Controllers({ dataset }: { dataset: Dataset }) {
  return (
    <aside className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col min-w-[400px]">
      <YearController dataset={dataset} />
    </aside>
  )
}