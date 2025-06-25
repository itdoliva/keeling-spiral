'use client'

import { MasterDataset } from "@/data/definitions";
import { DataController } from "./data-controller";
import { AppStateProvider } from "./context/context";



export function App({ master }: { master: MasterDataset }) {

  return (
    <main className="">
      <div className="label-layer">
        {/* Floating labels */}
      </div>
      <AppStateProvider>
        <DataController master={master} />
      </AppStateProvider>
    </main>
  )
}