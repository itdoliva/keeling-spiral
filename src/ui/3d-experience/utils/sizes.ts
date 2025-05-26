import { useRef, useEffect, useCallback, RefObject } from 'react'
import { useEventEmitter } from './events'

export interface Sizes {
  width: number;
  height: number;
  pixelRatio: number;
}

export interface UseSizes {
  ref: RefObject<Sizes>;
  add: (callback: () => void) => void;
  remove: (callback: () => void) => void;
}

const getSizes = () => ({
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
  pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1,
})

export function useSizes() {
  const { add, remove, trigger } = useEventEmitter()

  const sizesRef = useRef(getSizes())

  const update = useCallback(() => {
    const { width, height, pixelRatio } = getSizes()

    // Mutate the ref object directly
    sizesRef.current.width = width
    sizesRef.current.height = height
    sizesRef.current.pixelRatio = pixelRatio

    trigger()
  }, [])


  useEffect(() => {
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [ update ])

  return { ref: sizesRef, add, remove }
}

