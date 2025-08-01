import { NextIntlClientProvider } from "next-intl";

import { fetchData } from "@/lib/data/fetch";
import App from "@/components/app";

import { cache } from 'react';

const getData = cache(fetchData)

export default async function Home() {
  const response = await getData()

  if (!response.success) {
    throw new Error(response.error)
  }

  return (
    <NextIntlClientProvider>
      <App dataset={response.data} />
    </NextIntlClientProvider>
    
  );
}


