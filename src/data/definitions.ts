export type MonthCO2 = {
  date: Date;
  ppm: number;
};

export type YearCO2 = {
  year: string;
  avgPPM: number;
  months: MonthCO2[];
};

export interface ChartConfig {
  lengthRange: number; // Length range in PPM
  radius: number; // Radius of the spiral
}

export type MeasureLocation = 'MLO' | 'GLB'

export interface AnnualDatum {
  date: Date;
  year: number;
  ppm: number;
  growth: number;
  runningGrowth: number;
}

export interface MonthlyDatum {
  date: Date;
  year: number;
  month: number;
  ppm: number;
}

export interface InterpolatedDatum {
  year: number;
  monthDecimal: number;
  ppm: number;
}

export interface Dataset {
  annual: AnnualDatum[],
  monthly: MonthlyDatum[],
  interpolated: InterpolatedDatum[]
}

export type MasterDataset = Map<MeasureLocation, Dataset>