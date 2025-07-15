import * as THREE from 'three'


export type MeasureLocation = 'MLO' | 'GLB'

export type AnnualDatum = {
  date: Date;
  year: number;
  ppm: number;
  growth: number;
  runningGrowth: number;
}

export type TransformedDatum<T> = T & {
  coordinate: THREE.Vector3;
}

export type MonthlyDatum = {
  date: Date;
  year: number;
  month: number;
  ppm: number;
}

export type InterpolatedDatum = {
  year: number;
  monthDecimal: number;
  ppm: number;
}

export type Dataset = {
  annual: AnnualDatum[],
  monthly: MonthlyDatum[],
  interpolated: InterpolatedDatum[]
}

export type TransformedAnnualDatum = TransformedDatum<AnnualDatum>[]
export type TransformedMonthly = TransformedDatum<MonthlyDatum>[]
export type TransformedInterpolated = TransformedDatum<InterpolatedDatum>[]

export type TransformedDataset = {
  annual: TransformedAnnualDatum;
  monthly: TransformedMonthly;
  interpolated: TransformedInterpolated;
}

export type MasterDataset = Map<MeasureLocation, Dataset>