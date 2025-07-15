'use client'

import useFetch from "@/hooks/useFetch";
import useAppState from "@/hooks/useAppState"
import YearController from "@/features/year-controller/year-controller";
import { fetchData } from "@/data/fetch";

import { MasterDataset, Dataset } from "@/types/data";
import { YearControllerConfig } from "@/config/layout";


export default function Home() {
  const { data, error, isLoading } = useFetch<MasterDataset>(fetchData)
  const { appState, appStateDispatch } = useAppState()

  if (error) return <h1>Error!</h1>
  if (isLoading) return <div>Loading...</div>

  const dataset = (data as MasterDataset).get(appState.location) as Dataset
  const years = dataset.annual.map(d => d.year)

  return (
    <main>
      <div className="label-layer"></div>
      <YearController 
        years={years}
        config={YearControllerConfig}
        selectedYear={appState.selectedYear} 
        hoveredYear={appState.hoveredYear} 
        dispatch={appStateDispatch}
      />
      {/* <Experience dataset={data} /> */}
    </main>
  );
}
