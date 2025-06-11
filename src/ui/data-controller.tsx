import { useEffect, useState } from "react";
import { Dataset, MasterDataset } from "@/data/definitions";
import { Experience } from "@/ui/3d-experience/experience";
import { Controllers } from "@/ui/controllers/controllers";
import { useAppState, useAppStateDispatch } from "@/ui/context";


export function DataController({ master }: { master: MasterDataset }) {
  
  const state = useAppState()
  const dispatch = useAppStateDispatch()

  const dataset = master.get(state.location) as Dataset

  useEffect(() => {
    const toggle = () => {
      if (dispatch) dispatch({ type: 'locationToggle' })
      console.log('interval!')
    }

    // const interval = setInterval(toggle, 5000)
    // const timeout = setTimeout(toggle, 5000)

    return () => {
      // clearInterval(interval)
      // clearTimeout(timeout)
    }
  }, [ dispatch ])

  return (
    <>
      <Controllers dataset={dataset} />
      <Experience dataset={dataset} />
    </>
  )
}