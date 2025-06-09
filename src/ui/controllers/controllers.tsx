'use client'

import { YearController } from "./year-controller"

export function Controllers({ years }: { years: string[] }) {
  return (
    <aside className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col min-w-[400px]">
      <YearController years={years.map(String)} />
    </aside>
  )
}