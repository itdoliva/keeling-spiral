import "@/styles/global.css";


import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
  

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


  return (
    <html lang={locale} className="h-dvh overflow-hidden">
      <body className="antialiased font-grotesk h-full overflow-hidden text-black bg-white m-0 p-0 tracking-text text-sm flex flex-col">
        {children}
      </body>
    </html>
  );
}
