import { SVGAttributes } from "react";
import cn from "@/utils/cn";
import { PointerEvent } from "@/features/year-controller/types";

type TrackThumbProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  margin?: number;
  onClick?: (arg: PointerEvent) => void;
  preview?: boolean;
} & SVGAttributes<SVGGElement>

export default function TrackThumb({ 
  x = 0, 
  y = 0, 
  width = 3, 
  height = 10, 
  margin = 0, 
  preview = false ,
  onClick = undefined, 
  className,
  ...props
}: TrackThumbProps) {
  const marginWidth = width + margin

  return (
    <g 
      className={cn( "group", { "pointer-events-none": preview }, className)} 
      transform={`translate(${x || 0}, ${y || 0})`}
      onMouseDown={onClick ? (e) => onClick(e) : undefined}  
      onTouchStart={onClick ? (e) => onClick(e): undefined}
    >
      {!preview && (
        <>
          <rect rx="3" x="-5" width="10" y={-height / 2} height={height} className="fill-transparent" />
          <rect x={-marginWidth/2} width={marginWidth} y="-8" height="16" className="fill-zinc-50 group-hover:scale-105" />
        </>
      )}

      <rect rx="2" x={-width/2} width={width} y="-8" height="16" 
        className={cn(
          "group-hover:scale-105", 
          { 
            "fill-zinc-600": !preview, 
            "fill-zinc-600/25": preview
          })} 
        />
    </g>
  )
}

