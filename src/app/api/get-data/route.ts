import postgres from 'postgres';
import { parseAnnualData, parseMonthlyData, parseInterpolatedData } from '@/data/parsers'
import { MeasureLocation } from '@/types/data';

const sql = postgres(<string>process.env.DB_URL, 
  { 
    ssl: 'require',
    idle_timeout: 10, // seconds
    max: 5, // max connections
  });


async function getAnnualData(location: MeasureLocation)  {
  return await sql`
    SELECT 
      year::int AS year,
      ppm,
      growth,
      running_growth
    FROM co2_annual_means 
    WHERE location = ${location}
    ORDER BY 
      year ASC;`
}

async function getMonthlyData(location: MeasureLocation)  {
  return await sql`
    SELECT 
      year::int AS year,
      month::int AS month,
      ppm
    FROM co2_monthly_means 
    WHERE location = ${location}
    ORDER BY 
      year ASC, 
      month ASC;`
}

async function getInterpolatedData(location: MeasureLocation) {
  return await sql`
    SELECT 
      year::int AS year,
      month_decimal,
      ppm
    FROM co2_interpolation 
    WHERE location = ${location}
    ORDER BY 
      year ASC;`
}


export async function GET() {
  try {

    const data = await Promise.all([ 
      // MLO
      getAnnualData('MLO').then(data => data.map(parseAnnualData)),
      getMonthlyData('MLO').then(data => data.map(parseMonthlyData)),
      getInterpolatedData('MLO').then(data => data.map(parseInterpolatedData)),

      // GLB
      getAnnualData('GLB').then(data => data.map(parseAnnualData)),
      getMonthlyData('GLB').then(data => data.map(parseMonthlyData)),
      getInterpolatedData('GLB').then(data => data.map(parseInterpolatedData))
    ])
     .then((datasets) => [
      [ 'MLO', { annual: datasets[0], monthly: datasets[1], interpolated: datasets[2] } ],
      [ 'GLB', { annual: datasets[3], monthly: datasets[4], interpolated: datasets[5] } ],
     ])
     
    return Response.json(data, { status: 200 })
  }
  catch (error) {
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}