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