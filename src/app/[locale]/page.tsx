'use client'

import '@/lib/gsap'

import useAppState from "@/hooks/use-app-state"
import { YearControllerConfig } from "@/config/layout";
import { augmentDataset, getYears, } from "@/lib/data/transform";
import { ppmScale } from "@/lib/scale";

import YearController from "@/features/year-controller/components/controller";
import Experience from "@/features/experience/components/experience";

import Header from "@/components/header/header";
import { useData } from "@/contexts/data-context";
import Center from "@/components/layout/center";
import SelectedYear from "@/features/selected-year/selected-year";

export default function App() {
  const dataset = useData()

  const { appState, appStateDispatch } = useAppState()
  
  const years = getYears(dataset.annual)
  ppmScale.updateDomain(dataset.monthly)
  
  const augmentedData = augmentDataset(dataset)

  return (
    <>
      <Header />

      <main className="relative flex-grow-1 flex-shrink-0">
        <Experience 
          dataset={augmentedData} 
          selectedYear={appState.selectedYear} 
        />

        <Center>
          <SelectedYear value={appState.selectedYear} className="text-5xl md:text-7xl text-right font-bold" />
        </Center>
      </main>

      <footer className="md:w-96 md:absolute md:bottom-6 md:left-1/2 md:-translate-x-1/2">
        <YearController 
          years={years}
          config={YearControllerConfig}
          selectedYear={appState.selectedYear} 
          hoveredYear={appState.hoveredYear} 
          dispatch={appStateDispatch}
        />
      </footer>
  </>
  )
}