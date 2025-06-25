'use client'

import { MasterDataset } from "@/data/definitions";
import { DataController } from "./data-controller";
import { AppStateProvider } from "./context/appStateContext";
import { AssetsContextProvider } from "./context/assetsContext";



export function App({ master }: { master: MasterDataset }) {

  return (
    <main className="">
      <div className="label-layer">
        {/* Floating labels */}
      </div>
      <AssetsContextProvider>
        <AppStateProvider>
          <DataController master={master} />
        </AppStateProvider>
      </AssetsContextProvider>
    </main>
  )
}