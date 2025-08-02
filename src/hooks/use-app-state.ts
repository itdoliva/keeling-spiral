import { ReducerState, ReducerAction } from '@/types/store'
import { useReducer } from 'react'

const initialState = {
  selectedYear: 1959,
} as ReducerState

function reducer(prevState: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case 'SELECT_YEAR': {
      return {
        ...prevState,
        selectedYear: +action.year
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