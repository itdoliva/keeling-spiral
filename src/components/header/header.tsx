import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations()

  return (
    <header className="bg-black/85 px-8 py-1 flex justify-between">
      <h1 className="text-white text-sm">
        <span className="font-bold">{t('title')}</span>
        {' '}
        {t('common.by')}
        {' '}
        <a href="https://italodoliva.com.br" className="font-bold underline">Italo Doliva</a>
      </h1>
    </header>
  )
}