'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        {/* Title */}
        <h1 className="mb-8 text-4xl leading-tight font-bold text-[var(--color-text-primary)] md:text-5xl">
          {t('home.welcome')}
        </h1>

        {/* Description */}
        <p className="mb-16 text-lg leading-relaxed text-[var(--color-text-secondary)]">
          {t('home.description')}
        </p>

        {/* Language Switcher */}
        <div className="flex justify-center gap-6">
          <Link
            href="/"
            locale="ko"
            className={`min-w-28 rounded-xl border-2 px-8 py-4 text-base font-semibold transition-all duration-200 ${
              locale === 'ko'
                ? 'border-[var(--green)] bg-[var(--green)] text-white'
                : 'border-[var(--white-op-30)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--green)] hover:text-[var(--green-light)]'
            }`}
          >
            {t('language.ko')}
          </Link>
          <Link
            href="/"
            locale="en"
            className={`min-w-28 rounded-xl border-2 px-8 py-4 text-base font-semibold transition-all duration-200 ${
              locale === 'en'
                ? 'border-[var(--green)] bg-[var(--green)] text-white'
                : 'border-[var(--white-op-30)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--green)] hover:text-[var(--green-light)]'
            }`}
          >
            {t('language.en')}
          </Link>
        </div>
      </div>
    </main>
  );
}
