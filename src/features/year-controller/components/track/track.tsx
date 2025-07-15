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
      className={cn("bg-zinc-50 rounded-xl border-1 border-zinc-100 shadow shadow-black/15", className)}
    >
      <g className="axis" transform={`translate(0, ${height/2})`}>
        {children}
      </g>
    </svg>
  )
}