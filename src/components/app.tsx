'use client'

import useAppState from "@/hooks/use-app-state"

import { YearControllerConfig } from "@/config/layout";

import { augmentDataset, getYears, } from "@/lib/data/transform";

import YearController from "@/features/year-controller/components/controller";
import Experience from "@/features/experience/components/experience";
import { ppmScale } from "@/lib/scale";


import Header from "@/components/header/header";
import { useEffect } from "react";
import { useData } from "@/contexts/data-context";

export default function App() {
  const dataset = useData()

  const { appState, appStateDispatch } = useAppState()
  
  const years = getYears(dataset.annual)
  ppmScale.updateDomain(dataset.monthly)
  
  const augmentedData = augmentDataset(dataset)

  return (
    <>
      <Header />

      <main className="flex-grow-1 flex-shrink-0">
        <Experience dataset={augmentedData} selectedYear={appState.selectedYear} />
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