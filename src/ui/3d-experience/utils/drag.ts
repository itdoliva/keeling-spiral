import { useEffect, useRef } from "react";

import { useInertialEmitter } from "./events";


function getPointerCoordinates(e: MouseEvent | TouchEvent): [number, number] {
  if ('touches' in e) {
    const { clientX, clientY } = e.touches[0]
    return [ clientX, clientY ]
  } 

  const { clientX, clientY } = e as MouseEvent
  return [ clientX, clientY ]
}



export function useDrag() {
  const x = useInertialEmitter(0.15);
  const y = useInertialEmitter(0.15);

  const lastX = useRef<number | null>(null)
  const lastY = useRef<number | null>(null)
  const isDragging = useRef(false)

  useEffect(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;

    if (!canvas) return;  

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      const [px, py] = getPointerCoordinates(e);
      lastX.current = px;
      lastY.current = py;

      // stop ongoing momentum
      x.cancel(); 
      y.cancel();
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return

      const [ px, py ] = getPointerCoordinates(e)

      if (lastX.current !== null) {
        const deltaX = px - lastX.current
        x.applyDelta(deltaX)
        lastX.current = px
      }

      if (lastY.current !== null) {
        const deltaY = py - lastY.current
        y.applyDelta(deltaY)
        lastY.current = py
      }
    }

    const onPointerUp = () => {
      isDragging.current = false;
      lastX.current = null
      lastY.current = null
    };

    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: false });
    canvas.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);

    return () => {
      canvas.removeEventListener('mousedown', onPointerDown);
      canvas.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);

      canvas.removeEventListener('touchstart', onPointerDown);
      canvas.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };
  }, [  ])


  return { xEmitter: x.emitter, yEmitter: y.emitter }
}