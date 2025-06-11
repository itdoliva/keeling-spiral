
import "@/css/global.css"
import { MasterDataset } from "@/data/definitions";
import { App } from "@/ui/app";


export default async function Home() {
  const master: MasterDataset = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/get-data`, {
    cache: 'no-store',
  })
  .then((res) => res.json())
  .then((data) => new Map(data))


  return (
    <App master={master} />
  );
}
