import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold">{t('home.welcome')}</h1>
        <p className="mb-8 text-lg text-gray-600">{t('home.description')}</p>

        <div className="flex justify-center gap-4">
          <Link
            href="/"
            locale="ko"
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            {t('language.ko')}
          </Link>
          <Link
            href="/"
            locale="en"
            className="rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            {t('language.en')}
          </Link>
        </div>
      </div>
    </main>
  );
}
