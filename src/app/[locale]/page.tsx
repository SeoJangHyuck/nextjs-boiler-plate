import { useLocale, useTranslations } from 'next-intl';
import { locales, type Locale } from '@/lib/i18n/config';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';

/** 언어 전환 버튼의 표시 순서. locale이 빠지면 타입 오류가 난다. */
const displayOrder: Record<Locale, number> = { ko: 1, en: 2 };

const languages = locales.toSorted((a, b) => displayOrder[a] - displayOrder[b]);

export default function HomePage() {
  const t = useTranslations();
  const currentLocale = useLocale();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        {/* Title */}
        <h1 className="mb-8 text-4xl leading-tight font-bold text-foreground md:text-5xl">
          {t('home.welcome')}
        </h1>

        {/* Description */}
        <p className="mb-16 text-lg leading-relaxed text-secondary">
          {t('home.description')}
        </p>

        {/* Language Switcher */}
        <nav
          aria-label={t('language.switch')}
          className="flex justify-center gap-6"
        >
          {languages.map((locale) => {
            const isCurrent = locale === currentLocale;

            return (
              <Link
                key={locale}
                href="/"
                locale={locale}
                lang={locale}
                aria-current={isCurrent ? 'true' : undefined}
                className={cn(
                  'min-w-28 rounded-xl border-2 px-8 py-4 text-base font-semibold transition-all duration-200',
                  isCurrent
                    ? 'border-primary bg-primary text-background'
                    : 'border-(--white-op-30) bg-transparent text-secondary hover:border-primary hover:text-primary-light'
                )}
              >
                {t(`language.${locale}`)}
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
