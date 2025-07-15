import { MeasureLocation } from '@/types/data';

export type ReducerState = {
  location: MeasureLocation;
  selectedYear: number;
  hoveredYear: number | null;
}

export type ReducerAction = 
 | { type: 'SELECT_YEAR' | 'HOVER_YEAR'; year: any; } 
 | { type: 'TOGGLE_LOCATION'; };

