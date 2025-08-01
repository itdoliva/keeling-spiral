'use client'

import { Dataset } from '@/types/data'
import { createContext, useContext } from 'react'

const DataContext = createContext<Dataset | null>(null)

export function DataProvider({ 
  children, 
  dataset 
}: { 
  children: React.ReactNode
  dataset: Dataset
}) {
  return (
    <DataContext.Provider value={dataset}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === null) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}