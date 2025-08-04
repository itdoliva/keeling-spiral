import { useEffect, useRef } from "react";

import useExperience from "@/features/experience/hooks/use-experience";
import useDrag from "@/features/experience/hooks/use-drag";

import { TransformedDataset, AnnualDatum } from "@/types/data";
import { ppmScale } from "@/lib/scale";


type ExperienceProps = {
  dataset: TransformedDataset;
  selectedYear: number;
}


export default function Experience({ dataset, selectedYear }: ExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  const experienceRef = useExperience(canvasRef, layerRef, dataset)
  const dragRef = useDrag(canvasRef)

  const selectedData = dataset.annual.find(d => d.year === selectedYear) as AnnualDatum
  const selectionY = ppmScale(selectedData.ppm)

  if (experienceRef.current) {
    experienceRef.current.figure.moveTo(selectionY)
  }

  useEffect(() => {
    if (experienceRef.current) {
      experienceRef.current.figure.moveTo(selectionY)
      // experienceRef.current.figure.position.y = -selectionY + 1.5
    }

    const horizontalPan = (delta: number) => {
      if (!experienceRef.current) return
      experienceRef.current.spiral.rotation.y += 
        (Math.PI/180) * delta * 0.05
    }

    dragRef.current.addXCallback(horizontalPan)
    return () => {
      dragRef.current.removeXCallback(horizontalPan)
    }
  }, [])

  

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex overflow-hidden">
      <canvas className="flex-grow-1" ref={canvasRef} />
      <div className="absolute top-1/2 left-1/2" ref={layerRef}></div>
    </div>
  )
}