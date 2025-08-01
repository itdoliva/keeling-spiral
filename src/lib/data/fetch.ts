import { Dataset, MasterDataset, MeasureLocation } from "@/types/data"


type FetchResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }


export async function fetchData(): Promise<FetchResult<Dataset>> {
  console.log('fetching 👀')
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${base}/api/get-data`

  try {
    const response = await fetch(url, { cache: 'default', next: { revalidate: 3600 } })
    
    if (!response.ok) {
      return { 
        success: false, 
        error: `HTTP error! status: ${response.status}` 
      }
    }
    
    const data: Dataset = await response.json()
    return { 
      success: true, 
      data: data
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


