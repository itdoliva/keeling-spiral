import { useRef } from 'react'

export function useEventEmitter() {
  const callbacks = useRef<Array<() => void>>([])

  const add = (callback: () => void) => {
    callbacks.current.push(callback)
  }

  const remove = (callback: () => void) => {
    const index = callbacks.current.indexOf(callback)
    if (index !== -1) {
      callbacks.current.splice(index, 1)
    }
  }

  const trigger = () => {
    for (const callback of callbacks.current) {
      callback()
    }
  }

  return { add, remove, trigger }
}
