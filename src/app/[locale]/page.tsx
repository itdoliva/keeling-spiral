'use client'

import '@/lib/gsap'

import useAppState from "@/hooks/use-app-state"
import { YearControllerConfig } from "@/config/layout";
import { augmentDataset, filterByYear, getYears, } from "@/lib/data/helpers";
import { ppmScale } from "@/lib/scale";

import YearController from "@/features/year-controller/components/controller";
import Experience from "@/features/experience/components/experience";

import Header from "@/components/header/header";
import { useData } from "@/contexts/data-context";
import Center from "@/components/layout/center";
import SelectedYear from "@/features/selected-year/selected-year";
import Stack from '@/components/layout/stack';
import BigNumber from '@/components/big-number/big-number';

export default function App() {
  const dataset = useData()

  const { appState, appStateDispatch } = useAppState()
  
  const years = getYears(dataset.annual)
  ppmScale.updateDomain(dataset.monthly)
  
  const augmentedData = augmentDataset(dataset)

  const filtered = filterByYear(dataset, appState.selectedYear)

  return (
    <>
      <Header />

      <main className="relative flex-grow-1 flex-shrink-0">
        <Experience 
          dataset={augmentedData} 
          selectedYear={appState.selectedYear} 
        />

        <Center className="relative z-10 mt-6 md:mt-16 px-6">
          <Stack className="justify-end items-end gap-4">
            <SelectedYear value={appState.selectedYear} className="text-5xl md:text-7xl text-right font-bold" />
            
            <Stack className='gap-4'>
              <BigNumber label="Annual Mean" value={filtered.annual.ppm} suffix="ppm"/>
              <BigNumber label="Growth" value={filtered.annual.growth} preffix='+' suffix="ppm"/>
            </Stack>

          </Stack>
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