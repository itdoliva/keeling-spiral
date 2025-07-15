import { useRef, useCallback, useEffect, useState } from "react";

interface FetchError {
  message: string;
  code?: string;
  timestamp: number;
}

export default function useFetch<T>(
  fetchFn: () => Promise<{ success: boolean; data?: T; error?: string }>,
) {
  const [ data, setData ] = useState<T | null>(null)
  const [ error, setError ] = useState<FetchError | null>(null)
  const [ isLoading, setIsLoading ] = useState(true)

  // Prevents async function to change state if component has unmounted
  const mountedRef = useRef(true)

  const fetchData = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchFn()
      
      if (!mountedRef.current) return

      if (!response.success) {
        setError({
          message: response.error || 'Request failed',
          timestamp: Date.now(),
        })
        return
      }

      setData(response.data || null);
    } 
    catch (err) {
      if (!mountedRef.current) return;
      
      setError({
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        timestamp: Date.now(),
      });
    } 
    finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [ fetchFn ])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])


  useEffect(() => {
    fetchData()

    return () => {
      mountedRef.current = false
    }
  }, [ fetchData ])


  return {
    data,
    error,
    isLoading,
    isError: !!error,
    refetch: fetchData,
    reset,
  }
}