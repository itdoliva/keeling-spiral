import { createContext, useContext, useReducer } from 'react';

export interface AppState {
  selectedYear: string;
  hoveredYear: string | null;
}

const initialAppState = {
  selectedYear: '1980',
  hoveredYear: null,
}

const AppStateContext = createContext<AppState>(initialAppState)
const AppStateDispatchContext = createContext<React.Dispatch<{ type: string; year: string | null; }> | undefined>(undefined);

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

export function useAppStateDispatch() {
  return useContext(AppStateDispatchContext)
}

function appStateReducer(appState: AppState, action: { type: string; year: any; }) {
  switch (action.type) {
    case 'select': {
      return {
        ...appState, 
        selectedYear: action.year
      };
    }
    case 'hover': {
      return {
        ...appState, 
        hoveredYear: action.year
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

