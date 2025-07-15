type TrackLineProps = { 
  fullExtent: number[] 
  selectedTo: number
}

export default function TrackLine({ fullExtent, selectedTo }: TrackLineProps) {
  return (
    <>
      <line 
        x1={fullExtent[0]} 
        x2={fullExtent[1]}
        className="stroke-1 stroke-[#747474]/20"
      />
      
      <line 
        x1={fullExtent[0]} 
        x2={selectedTo}
        className="stroke-2 stroke-[#747474]/40"
      />
    </>
  )
}

