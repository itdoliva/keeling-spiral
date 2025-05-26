import { useRef, useEffect, RefObject } from 'react';

import GUI from 'lil-gui';

export interface Debug {
  active: boolean;
  gui: GUI | null;
}

export interface UseDebug {
  ref: RefObject<Debug>;
}

export function useDebug() {
  const debug = useRef<Debug>({
    active: false,
    gui: null,
  })

  useEffect(() => {
    const updateDebugState = () => {
      const active = window.location.hash === '#debug'
      debug.current.active = active

      if (active) {
        debug.current.gui = new GUI()
      } else {
        debug.current.gui?.destroy()
        debug.current.gui = null
      }
    }

    window.addEventListener('hashchange', updateDebugState)
    updateDebugState()

    return () => {
      window.removeEventListener('hashchange', updateDebugState)
      debug.current.gui?.destroy()
    }
  }, [])

  return { ref: debug }
}