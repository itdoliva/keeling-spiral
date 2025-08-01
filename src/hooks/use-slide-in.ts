import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

type SlideInOptions = {
  ref: React.RefObject<HTMLElement | null>
  slideDirection?: 'left' | 'right' | 'up' | 'down';
  slideDistance?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  desktopOnly?: boolean;
  onMount?: boolean;
  play?: boolean
}

export default function useSlideIn({
  ref,
  slideDirection = 'up',
  slideDistance = 100,
  duration = 1,
  delay = 0,
  ease = 'power2.out',
  desktopOnly = false,
  onMount = false, 
  play = false
}: SlideInOptions) {


  const hasPlayed = useRef(false)

  const isDesktop = useCallback(() => {
    return window.innerWidth >= 768 // Tailwind's md breakpoint
  }, [])

  const shouldAnimate = useCallback(() => {
    if (!ref.current) return false
    if (hasPlayed.current) return false
    if (desktopOnly && !isDesktop()) return false
    return true
  }, [ desktopOnly, isDesktop ])

  const getSlideValues = useCallback(() => {
    switch (slideDirection) {
      case 'right':
        return { from: { x: slideDistance, opacity: 0 }, to: { x: 0, opacity: 1 } };
      case 'up':
        return { from: { y: slideDistance, opacity: 0 }, to: { y: 0, opacity: 1 } };
      case 'down':
        return { from: { y: -slideDistance, opacity: 0 }, to: { y: 0, opacity: 1 } };
      case 'left':
      default:
        return { from: { x: -slideDistance, opacity: 0 }, to: { x: 0, opacity: 1 } };
    }
  }, [ slideDirection, slideDistance ])

  const animate = useCallback(() => {
    if (!shouldAnimate()) return

    const { from, to } = getSlideValues()
    
    gsap.fromTo(ref.current,
      from,
      { ...to, duration, delay, ease }
    )

    hasPlayed.current = true

  }, [ shouldAnimate, getSlideValues, duration, delay, ease ])


  useEffect(() => {
    if (onMount) animate()
  }, [ onMount, animate ])

  useEffect(() => {
    if (play) animate()
  }, [ play, animate ])

  return animate
}