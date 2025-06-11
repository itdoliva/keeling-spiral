import { MeasureLocation, MasterDataset, Dataset } from '@/data/definitions';
import { createContext, useContext, useReducer } from 'react';

export interface AppState {
  location: MeasureLocation;
  selectedYear: number;
  hoveredYear: number | null;
}

const initialAppState = {
  location: 'MLO',
  selectedYear: 1980,
  hoveredYear: null,
} as AppState

type YearAction = { type: 'select' | 'hover', year: any }
type LocationAction = { type: 'locationToggle' }
export type Actions = YearAction | LocationAction

const AppStateContext = createContext(initialAppState)
const AppStateDispatchContext = createContext<React.Dispatch<Actions> | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [ state, dispatch ] = useReducer(appStateReducer, initialAppState )

  return (
    <AppStateContext.Provider value={state}>
      <AppStateDispatchContext.Provider value={dispatch}>
        {children}
      </AppStateDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext)
}

export function useAppStateDispatch(): React.Dispatch<Actions>  {
  return useContext(AppStateDispatchContext) as React.Dispatch<Actions>
}

function appStateReducer(prevState: AppState, action: Actions): AppState {
  switch (action.type) {
    case 'select': {
      return {
        ...prevState, 
        selectedYear: +action.year
      };
    }
    case 'hover': {
      return {
        ...prevState, 
        hoveredYear: +action.year
      }
    }
    case 'locationToggle': {
      return {
        ...prevState,
        location: prevState.location === 'GLB' ? 'MLO' : 'GLB'
      }
    }
    default: {
      throw Error('Error on appStateReducer');
    }
  }
}

