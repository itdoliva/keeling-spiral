import { cache } from 'react';

import { fetchData } from "@/lib/data/fetch";
import { DataProvider } from '@/contexts/data-context'


const getData = cache(fetchData)


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const response = await getData()
  
  if (!response.success) {
    throw new Error(response.error)
  }

  return (
    <DataProvider dataset={response.data}>
      {children}
    </DataProvider>
  )
}