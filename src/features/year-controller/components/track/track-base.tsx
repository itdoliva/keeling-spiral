import { useRef } from "react"

type TrackBaseOptions = {
  children: React.ReactNode;
  width: number;
  height: number;
  onClick?: (arg: React.PointerEvent) => void;
  onMove?: (arg: React.PointerEvent) => void;
  onLeave?: (arg: React.PointerEvent) => void;
}

export default function TrackBase({ 
  children,
  width,
  height,
  onClick,
  onMove,
  onLeave
}: TrackBaseOptions) {
  const ref = useRef<SVGGElement>(null)
  
  return (
    <g 
      ref={ref} 
      className="track"
      {...(onClick && { onPointerDown: onClick })}
      {...(onMove && { onPointerMove: onMove })}
      {...(onLeave && { onPointerLeave: onLeave })}
    >
      <rect width={width} y={-height/2} height={height} className="fill-transparent" />
      {children}
    </g>
  )
}