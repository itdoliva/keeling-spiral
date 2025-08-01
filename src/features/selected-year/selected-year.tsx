import React, { useRef, useEffect, useMemo, useState } from "react"
import gsap from 'gsap'
import SplitText from "gsap/dist/SplitText"
import cn from "@/utils/cn"


type SelectedYearProps = {
  value: number
} & React.HTMLAttributes<HTMLHeadingElement>

const yPercentOffset = 50

export default function SelectedYear({ value, className, ...props }: SelectedYearProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLHeadingElement>(null)
  const previousRef = useRef<HTMLHeadingElement>(null)
  
  const currentSplit = useRef<SplitText | null>(null)
  const previousSplit = useRef<SplitText | null>(null)
  
  const hasRendered = useRef(false)
  
  const initValue = useMemo(() => value, [])

  useEffect(() => {
    if (!hasRendered.current) return

    // Store the current value as previous
    if (previousRef.current && currentRef.current) {

      if (previousSplit.current) previousSplit.current.revert()
      previousRef.current.textContent = currentRef.current.textContent
      previousSplit.current = SplitText.create(previousRef.current, { type: 'chars' })
      
      // Position previous element to match current
      gsap.set(previousRef.current, { 
        opacity: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1
      })
      
      // Slide down previous text
      gsap.to(previousSplit.current.chars, {
        stagger: 0.05,
        ease: 'power2.in',
        duration: .2,
        yPercent: yPercentOffset,
        opacity: 0,
        onComplete: () => {
          if (previousSplit.current) {
            previousSplit.current.revert()
            previousSplit.current = null
          }
          gsap.set(previousRef.current, { opacity: 0 })
        }
      })
    }

    // Update current text content
    if (currentRef.current) {
      // Clean up current split
      if (currentSplit.current) currentSplit.current.revert()
      currentRef.current.textContent = value.toString()
      currentSplit.current = SplitText.create(currentRef.current, { type: 'chars' })
      
      // Position current element
      gsap.set(currentRef.current, { 
        opacity: 1,
        position: 'relative',
        zIndex: 2
      })
      
      // Animate new text in (slide from below)
      gsap.fromTo(currentSplit.current.chars, 
        { yPercent: -yPercentOffset, opacity: 0 },
        {
          stagger: 0.05,
          ease: 'power2.out',
          duration: .3,
          yPercent: 0,
          opacity: 1,
          delay: 0.15 // slight delay to see the transition better
        }
      )
    }

  }, [ value ])

  useEffect(() => {
    if (hasRendered.current) return
    if (!currentRef.current) return

    currentSplit.current = SplitText.create(currentRef.current, { type: 'chars' })

    gsap.from(currentSplit.current.chars, {
      stagger: 0.05,
      ease: 'power2.out',
      duration: .3,
      delay: 0.15,
      yPercent: -yPercentOffset,
      opacity: 0,
    })

    gsap.set(currentRef.current, { opacity: 1 })

    hasRendered.current = true
  }, [])

  return (
    <div ref={containerRef} className={cn("relative inline-block min-h-[1.2em] tracking-number select-none", className)}>
      
      <h1 ref={currentRef} style={{ opacity: 0 }}
        className="flex justify-end" 
      >
        {initValue}
      </h1>
      
      <h1 ref={previousRef} style={{ opacity: 0 }} aria-hidden="true"
        className="flex justify-end"
      />
    </div>
  )
}