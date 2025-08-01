import { SVGAttributes } from "react";
import cn from "@/utils/cn";

type TrackOptions = {
  children: React.ReactNode;
  ref: React.RefObject<SVGSVGElement | null>;
  width: number;
  height: number;
} & SVGAttributes<SVGSVGElement>

export default function Track({ 
  children,
  ref,
  width,
  height,
  className,
  ...props
}: TrackOptions) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
      ref={ref} 
      width={width} 
      height={height} 
      className={cn("bg-transparent", className)}
    >

      <defs>
        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#FF4400" offset="0%" />
          <stop stopColor="#D90F8C" offset="65%" />
          <stop stopColor="#4C9CEB" offset="100%" />
        </linearGradient>
      </defs>

      <g className="axis" transform={`translate(0, ${height/2})`}>
        {children}
      </g>

    </svg>
  )
}