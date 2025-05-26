import { Experience } from "@/ui/3d-experience/experience";
import "@/css/global.css"

export default async function Home() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-data`, {
    cache: 'no-store',
  })
  .then((res) => res.json())
  .then(data => data.map(d => ({ ...d, date: new Date(d.date) })));


  return (
    <div>
      <main className="">

        <Experience data={data} />

      </main>
    </div>
  );
}
