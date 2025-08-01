import "@/styles/global.css";


import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl'



export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params
  
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Hey, even though we're in static generation mode, 
  // pretend this is the locale for this page
  setRequestLocale(locale)

  
  return (
    <html lang={locale} className="h-dvh overflow-hidden">
      <body className="antialiased font-grotesk h-full overflow-hidden text-black bg-white m-0 p-0 tracking-text text-sm flex flex-col">
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
