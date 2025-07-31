import { useTranslations } from 'next-intl';
import LocaleSwitcher from '@/components/locale-switcher/locale-switcher';

export default function Header() {
  const t = useTranslations()

  return (
    <header className="bg-black/85 px-4 md:px-8 py-1 flex items-center justify-between">
      <h1 className="text-white">
        <span className="font-bold">{t('title')}</span>
        {' '}
        {t('common.by')}
        {' '}
        <a href="https://italodoliva.com.br" className="font-bold underline">Italo Doliva</a>
      </h1>
      <LocaleSwitcher />
    </header>
  )
}