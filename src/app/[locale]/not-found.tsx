import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6">
        <p className="text-9xl font-black text-muted">404</p>

        <h1 className="text-3xl font-semibold text-foreground">
          {t('notFound')}
        </h1>

        <p className="text-lg text-secondary">{t('notFoundDescription')}</p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex min-w-52 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary px-10 py-4 text-base font-semibold text-background transition-all duration-200 hover:bg-transparent hover:text-primary-light"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </main>
  );
}
