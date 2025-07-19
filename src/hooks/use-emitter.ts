import { useRef } from 'react'


export function useEventEmitter<Args extends any[] = []>() {
  const callbacks = useRef<Array<(...args: Args) => void>>([])

  const add = (callback: (...args: Args) => void) => {
    callbacks.current.push(callback)
  }

  const remove = (callback: (...args: Args) => void) => {
    const index = callbacks.current.indexOf(callback)
    if (index !== -1) {
      callbacks.current.splice(index, 1)
    }
  }

  const trigger = (...args: Args) => {
    for (const callback of callbacks.current) {
      callback(...args)
    }
  }

  return { add, remove, trigger }
}

export function useInertialEmitter(smoothing = 0.1, friction = 0.95) {
  const emitter = useEventEmitter<[number]>()

  let velocity = useRef(0)
  let rafId = useRef<number | null>(null)

  const animate = () => {
    velocity.current *= friction

    if (Math.abs(velocity.current) < 0.1) {
      velocity.current = 0
      rafId.current = null
      return
    }

    emitter.trigger(velocity.current)
    rafId.current = requestAnimationFrame(animate)
  };

  const applyDelta = (delta: number) => {
    velocity.current += delta * smoothing

    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(animate)
    }
  }

  const cancel = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
    }
    rafId.current = null
    velocity.current = 0
  }

  return {
    emitter,
    applyDelta,
    cancel
  }
}