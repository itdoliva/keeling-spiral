import { MasterDataset, Dataset } from '@/types/data';
import { createContext, useContext, useReducer } from 'react';
import { Actions } from "@/types/store";
import { AppState } from '@/types/store';

const initialAppState = {
  location: 'MLO',
  selectedYear: 1980,
  hoveredYear: null,
} as AppState

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

