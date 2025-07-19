'use client'

import useFetch from "@/hooks/use-fetch";
import useAppState from "@/hooks/use-app-state"
import { fetchData } from "@/data/fetch";

import { MasterDataset, Dataset } from "@/types/data";
import { YearControllerConfig } from "@/config/layout";

import DataTransformer from "@/features/data-transformer/DataTransformer";

import YearController from "@/features/year-controller/components/controller";
import Experience from "@/features/experience/components/experience";
import { ppmScale } from "@/lib/scale";

export default function Home() {
  const { data, error, isLoading } = useFetch<MasterDataset>(fetchData)
  const { appState, appStateDispatch } = useAppState()

  if (error) return <h1>Error!</h1>
  if (isLoading) return <div>Loading...</div>

  const dataset = (data as MasterDataset).get(appState.location) as Dataset
  const years = dataset.annual.map(d => d.year)

  ppmScale.updateDomain(dataset.monthly)
  const transformedDataset = new DataTransformer(dataset).transform()

  return (
    <main>
      <Experience dataset={transformedDataset} selectedYear={appState.selectedYear} />

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
  );
}
