import { useRef, useEffect } from 'react'

export default function useStableProps(props: any) {
  const propsRef = useRef(props)

  useEffect(() => {
    propsRef.current = props
  }, [ props ])

  return propsRef
}