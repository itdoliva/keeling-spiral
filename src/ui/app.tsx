'use client'

import { MonthCO2 } from "@/data/definitions";
import { Experience } from "@/ui/3d-experience/experience";
import { Controllers } from "@/ui/controllers/controllers";
import { AppStateProvider } from "./context";


export function App({ data }: { data: MonthCO2[] }) {
  const years = [ ...new Set(data.map(d => d.date.getFullYear())) ].map(String)

  return (
    <main className="">
      <AppStateProvider>
        <Controllers years={years} />
        <Experience data={data} />
      </AppStateProvider>
    </main>
  )
}