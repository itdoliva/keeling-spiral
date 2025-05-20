export type RawMonthCO2 = {
  date: Date;
  ppm: number;
};

export type MonthCO2 = {
  date: Date;
  ppm: number;
  coordinates: { x: number; y: number; z: number };
};