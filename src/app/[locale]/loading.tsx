import { useTranslations } from 'next-intl';
import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner label={t('loading')} />
    </div>
  );
}
