import { useRef, useState, useEffect, useCallback } from 'react'
import { Coordinates, PointerEvent } from '../types'
import useStableProps from '@/hooks/useStableProps'

type UseDragHandlerOptions = {
  extractCoordinates: (event: PointerEvent) => Coordinates
  onDragStart?: (coords: Coordinates) => void
  onDrag?: (coords: Coordinates) => void
  onDragEnd?: (coords: Coordinates) => void
}

function useDragState() {
  const isDraggingRef = useRef(false)
  const [ isDragging, setIsDragging ] = useState(false)
  const [ position, setPosition ] = useState<Coordinates>([0, 0])
  
  const startDrag = useCallback((coords: Coordinates) => {
    isDraggingRef.current = true
    setIsDragging(true)
    setPosition(coords)
  }, [])
  
  const updateDrag = useCallback((coords: Coordinates) => {
    setPosition(coords)
    return true
  }, [])
  
  const endDrag = useCallback((coords: Coordinates) => {
    if (!isDraggingRef.current) return false
    isDraggingRef.current = false
    setIsDragging(false)
    setPosition(coords)
    return true
  }, [])

  return {
    position,
    isDragging,
    isDraggingRef,
    startDrag,
    updateDrag,
    endDrag
  }
}


export default function useDragHandler({
  extractCoordinates,
  onDragStart,
  onDrag,
  onDragEnd,
}: UseDragHandlerOptions)  {

  const { position, isDragging, isDraggingRef, startDrag, updateDrag, endDrag } = useDragState()

  const handlersRef = useStableProps({
    extractCoordinates,
    onDragStart,
    onDrag,
    onDragEnd,
  })
  

  const handleDragMove = useCallback((event: PointerEvent) => {
    event.preventDefault()
    const coords = handlersRef.current.extractCoordinates(event)
    updateDrag(coords)
    handlersRef.current.onDrag?.(coords)
  }, [])


  const handleDragStart = useCallback((event: PointerEvent) => {
    if (isDraggingRef.current) return false

    event.preventDefault()
    const coords = handlersRef.current.extractCoordinates(event)
    startDrag(coords)
    handlersRef.current.onDragStart?.(coords)

    return true
  }, [])


  const handleDragEnd = useCallback((event: PointerEvent) => {
    if (!isDraggingRef.current) return

    event.preventDefault()
    const coords = handlersRef.current.extractCoordinates(event)
    endDrag(coords)
    handlersRef.current.onDragEnd?.(coords)
  }, [])


  useEffect(() => {
    window.addEventListener('pointermove', handleDragMove)
    window.addEventListener('pointerup', handleDragEnd)
    window.addEventListener('pointercancel', handleDragEnd)
    window.addEventListener('pointerleave', handleDragEnd)
    return () => {
      window.removeEventListener('pointermove', handleDragMove)
      window.removeEventListener('pointerup', handleDragEnd)
      window.removeEventListener('pointercancel', handleDragEnd)
      window.removeEventListener('pointerleave', handleDragEnd)
    }
  }, [ handleDragMove, handleDragEnd ])

  return { 
    dragCoords: position, 
    isDragging,
    startDrag: handleDragStart
  }

}