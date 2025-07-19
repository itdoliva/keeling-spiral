import { useCallback, useEffect, useState } from "react";
import { debounce } from "@/utils/debounce";


export default function useElementResize(ref: React.RefObject<HTMLElement | null>) {
  const [ dimensions, setDimensions ] = useState({ width: 0, height: 0 })

  const onResize = useCallback(debounce(() => {
    if (!ref.current) return

    setDimensions({ 
      width: ref.current.clientWidth, 
      height:  ref.current.clientHeight
    })

  }, 150), [ ref ])

  useEffect(() => {
    onResize()

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [ onResize ])

  return dimensions
}