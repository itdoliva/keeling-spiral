
import "@/css/global.css"
import { MonthCO2 } from "@/data/definitions";
import { App } from "@/ui/app";


export default async function Home() {
  const data: MonthCO2[] = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-data`, {
    cache: 'no-store',
  })
  .then((res) => res.json())
  .then(data => data.map((d: MonthCO2) => ({ ...d, date: new Date(d.date) })));


  return (
    <App data={data} />
  );
}
