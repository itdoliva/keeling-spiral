import { useMemo, useState, useEffect } from "react"
import Stack from "@/components/layout/stack"
import cn from "@/utils/cn"


type BigNumberProps = {
  label: string,
  value: number | string | null,
  suffix: string,
  preffix?: string,
}
export default function BigNumber({
  label,
  value,
  suffix,
  preffix = '',
}: BigNumberProps) {

  const [ isActive, setIsActive ] = useState(false)
  const [ displayValue, setDisplayValue ] = useState<number | string | null>(null)

  useEffect(() => {
    if (value === null) {
      setIsActive(false)
      return
    }

    setDisplayValue(Number(value).toFixed(1))
    setIsActive(true)
  }, [ value ])

  return (
    <Stack className={cn("justify-end items-end transition-all duration-500 ease-out select-none", {
      "opacity-0 translate-x-full": !isActive
     })}>

      <h5 className=" text-gray-dark text-sm tracking-text h-[1.2em]">
        {label}
      </h5>

      <h3 className="text-xl font-bold h-[1.2em]">
        {preffix}{displayValue}
        &nbsp;
        <span className="text-sm">{suffix}</span>
      </h3>

    </Stack>
  )
}