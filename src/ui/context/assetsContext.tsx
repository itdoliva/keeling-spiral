import { preloadAssets } from '@/lib/assets'
import { createContext, useContext, useState, useEffect } from 'react'

const AssetsContext = createContext<Awaited<ReturnType<typeof preloadAssets>> | null>(null)

export function AssetsContextProvider({ children }: { children: React.ReactNode }) {
  const [ assets, setAssets ] = useState<Awaited<ReturnType<typeof preloadAssets>> | null>(null)

  useEffect(() => {
    preloadAssets().then(assets => {
      setAssets(assets)
    })
  }, [])

  return (
    <AssetsContext.Provider value={assets}>
      {children}
    </AssetsContext.Provider>
  )
}

export function useAssets() {
  const context = useContext(AssetsContext)
  // if (!context) throw new Error('useAssets must be used within an AssetsContextProvider')
  return context
}