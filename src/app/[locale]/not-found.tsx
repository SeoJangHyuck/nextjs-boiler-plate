import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8 dark:from-gray-900 dark:to-gray-950">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-9xl font-black text-gray-300 dark:text-gray-700">
          404
        </h1>

        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          {t('notFound')}
        </h2>

        <p className="text-lg text-gray-500 dark:text-gray-400">
          {t('notFoundDescription')}
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex min-w-52 items-center justify-center gap-2 rounded-xl border-2 border-[var(--green)] bg-[var(--green)] px-10 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-transparent hover:text-[var(--green-light)]"
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
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
