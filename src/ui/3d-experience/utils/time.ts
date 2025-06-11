import { useRef, useEffect, useCallback, useState } from 'react'
import { useEventEmitter } from "../../utils/events"

export interface UseTime {
  elapsed: number;
  delta: number;
  current: number;
  add: (callback: () => void) => void;
  remove: (callback: () => void) => void;
}

export function useTime(): UseTime {
  const { add, remove, trigger } = useEventEmitter()

  const start = useRef(Date.now())
  const state = useRef({
    current: start.current,
    elapsed: 0,
    delta: 16, // Avoid 0 (16ms for 60fps) 
  })

  const tick = useCallback(() => {
    const now = Date.now()

    state.current = {
      delta: now - state.current.current,
      elapsed: now - start.current,
      current: now,
    }

    trigger()

    window.requestAnimationFrame(() => {
      tick()
    })

  }, [])

  useEffect(() => {
    window.requestAnimationFrame(() => {
      tick()
    })
  }, [])

  return { ...state.current, add, remove }
}