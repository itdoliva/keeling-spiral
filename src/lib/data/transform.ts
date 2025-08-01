import * as THREE from 'three'
import { AnnualDatum, Dataset, InterpolatedDatum, MonthlyDatum, TransformedDataset } from "@/types/data";
import { ppmScale, monthScale } from "@/lib/scale"
import { SpiralConfig } from "@/config/three";

function makeCoordinate(datum: AnnualDatum): THREE.Vector3
function makeCoordinate(datum: MonthlyDatum): THREE.Vector3
function makeCoordinate(datum: InterpolatedDatum): THREE.Vector3
function makeCoordinate(datum: AnnualDatum | MonthlyDatum | InterpolatedDatum) {
  const y = ppmScale(datum.ppm)
  let x = 0, z = 0

  if ('month' in datum || 'monthDecimal' in datum) {
    const month = 'month' in datum ? datum.month : datum.monthDecimal
    const angle = monthScale(month)
    x = Math.cos(angle) * SpiralConfig.radius
    z = Math.sin(angle) * SpiralConfig.radius
  }

  return new THREE.Vector3(x, y, z)
}

export function augmentDataset(dataset: Dataset) {
  return {
  annual: dataset.annual.map(d => ({ ...d, coordinate: makeCoordinate(d) })),
  monthly: dataset.monthly.map(d => ({ ...d, coordinate: makeCoordinate(d) })),
  interpolated: dataset.interpolated.map(d => ({ ...d, coordinate: makeCoordinate(d) })),
}
}

export function getYears(data: AnnualDatum[] | MonthlyDatum[]) {
  return data.map(d => d.year)
}