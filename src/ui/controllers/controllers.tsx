'use client'

import { YearController } from "./year-controller"

export function Controllers({ years }: { years: string[] }) {
  return (
    <aside className="fixed top-4 left-4 z-50 flex flex-col min-w-[600px]">
      <YearController years={years.map(String)} />
    </aside>
  )
}