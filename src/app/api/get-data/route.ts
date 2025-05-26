import { MonthCO2 } from '@/data/definitions';
import postgres from 'postgres';

const sql = postgres(<string>process.env.DB_URL, 
  { 
    ssl: 'require',
    idle_timeout: 10, // seconds
    max: 5, // max connections
  });

async function getData()  {
  const data = await sql`
    SELECT 
      year::int AS year,
      month::int AS month,
      average AS ppm 
    FROM global_co2 
    ORDER BY 
      year ASC, 
      month ASC 
    LIMIT 1000;`

  const parsedData = data.map(({ year, month, ppm }) => {
    return {
      date: new Date(year, month - 1),
      ppm: parseFloat(ppm),
    }
  })

  return parsedData
}

export async function GET() {
  try {
    return Response.json(await getData(), { status: 200 })
  }
  catch (error) {
    console.error('Error fetching data:', error)
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}