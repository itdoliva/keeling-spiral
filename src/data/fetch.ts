import { Dataset, MasterDataset, MeasureLocation } from "@/types/data"

type FetchResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

export async function fetchData(): Promise<FetchResult<MasterDataset>> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${base}/api/get-data`

  try {
    const response = await fetch(url, { cache: 'default' })
    
    if (!response.ok) {
      return { 
        success: false, 
        error: `HTTP error! status: ${response.status}` 
      }
    }
    
    const data: unknown = await response.json()
    
    if (!Array.isArray(data)) {
      return { 
        success: false, 
        error: 'Invalid data format: expected array' 
      }
    }
    
    return { 
      success: true, 
      data: new Map(data as [ MeasureLocation, Dataset][]) as MasterDataset 
    }
  } 
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { 
      success: false, 
      error: `Error while fetching data: ${message}` 
    }
  }
}