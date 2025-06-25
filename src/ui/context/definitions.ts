import { MeasureLocation } from '@/data/definitions';


export interface AppState {
  location: MeasureLocation;
  selectedYear: number;
  hoveredYear: number | null;
}
export type YearAction = { type: 'select' | 'hover'; year: any; };
export type LocationAction = { type: 'locationToggle'; };
export type Actions = YearAction | LocationAction;

