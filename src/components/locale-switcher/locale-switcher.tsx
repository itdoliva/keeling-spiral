import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'pt' : 'en'
    router.push(pathname, { locale: newLocale })
  }

  return (
    <button onClick={switchLocale} className="text-white text-sm font-bold py-px px-2 rounded-md bg-black hover:bg-gray-dark">
      {locale === 'en' ? 'English' : 'Português'}
    </button>
  );
}