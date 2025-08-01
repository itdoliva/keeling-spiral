'use client'

import useAppState from "@/hooks/use-app-state"

import { Dataset } from "@/types/data";
import { YearControllerConfig } from "@/config/layout";

import { augmentDataset, getYears, } from "@/lib/data/transform";

import YearController from "@/features/year-controller/components/controller";
import Experience from "@/features/experience/components/experience";
import { ppmScale } from "@/lib/scale";


import Header from "@/components/header/header";

export default function App({ dataset }: { dataset: Dataset }) {
  const { appState, appStateDispatch } = useAppState()
  
  const years = getYears(dataset.annual)
  ppmScale.updateDomain(dataset.monthly)
  
  const augmentedData = augmentDataset(dataset)

  return (
    <>
      <Header />
      <main>
          <Experience dataset={augmentedData} selectedYear={appState.selectedYear} />

          <div className="absolute top-4 left-0 w-full z-10">
            <YearController 
              years={years}
              config={YearControllerConfig}
              selectedYear={appState.selectedYear} 
              hoveredYear={appState.hoveredYear} 
              dispatch={appStateDispatch}
            />
          </div>

      </main>
  </>
  )
}