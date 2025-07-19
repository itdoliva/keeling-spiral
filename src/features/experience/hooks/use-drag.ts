import { useEffect, useRef } from "react";
import Drag from "@/features/drag/Drag"


export default function useDrag(targetRef: React.RefObject<HTMLElement | null>) {
  const dragRef = useRef(new Drag())

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => dragRef.current.onPointerDown(e)
    const onPointerMove = (e: MouseEvent | TouchEvent) => dragRef.current.onPointerMove(e)
    const onPointerUp = () => dragRef.current.onPointerUp()

    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchend', onPointerUp)
    targetRef.current?.addEventListener('mousedown', onPointerDown)
    targetRef.current?.addEventListener('touchstart', onPointerDown, { passive: false })
    targetRef.current?.addEventListener('mousemove', onPointerMove)
    targetRef.current?.addEventListener('touchmove', onPointerMove, { passive: false })

    return () => {
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchend', onPointerUp)
      targetRef.current?.removeEventListener('mousedown', onPointerDown)
      targetRef.current?.removeEventListener('touchstart', onPointerDown)
      targetRef.current?.removeEventListener('mousemove', onPointerMove)
      targetRef.current?.removeEventListener('touchmove', onPointerMove)
    }
  }, [])

  return dragRef
}

