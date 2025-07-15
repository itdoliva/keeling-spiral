import { ReducerState, ReducerAction } from '@/types/store'
import { useReducer } from 'react'

const initialState = {
  location: 'MLO',
  selectedYear: 1980,
  hoveredYear: null,
} as ReducerState

function reducer(prevState: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case 'SELECT_YEAR': {
      return {
        ...prevState,
        selectedYear: +action.year
      }
    }
    case 'HOVER_YEAR': {
      return {
        ...prevState,
        hoveredYear: +action.year
      }
    }
    case 'TOGGLE_LOCATION': {
      return {
        ...prevState,
        location: prevState.location === 'GLB' ? 'MLO' : 'GLB'
      }
    }
    default: {
      throw new Error("Error on State Reducer");
    }
  }
}

export default function useAppState() {
  const [ state, dispatch ] = useReducer(reducer, initialState)
  return { appState: state, appStateDispatch: dispatch }
}