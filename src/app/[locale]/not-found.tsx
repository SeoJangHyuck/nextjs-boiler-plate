import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h2 className="mb-4 text-2xl font-bold">{t('notFound')}</h2>
      <Link
        href="/"
        className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        {t('backToHome')}
      </Link>
    </div>
  );
}
