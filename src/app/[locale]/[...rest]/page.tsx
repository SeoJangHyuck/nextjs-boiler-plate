import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

/**
 * 항상 404인 경로이므로 즉시 탐색(instant) 검증에서 제외한다.
 * 제외하지 않으면 개발 서버가 검증 실패를 오류로 기록한다.
 */
export const instant = false;

/** 탭과 보조 기술에서 404임을 구분할 수 있게 한다. */
export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('common');
  return { title: t('notFound') };
};

/**
 * Catch-all 라우트: 존재하지 않는 모든 경로를 처리
 * notFound()를 호출하여 not-found.tsx가 렌더링되도록 함
 *
 * 프리렌더 중에 notFound()를 부르므로 프로덕션은 404로 응답한다.
 * 개발 서버는 요청 시점에 렌더링하므로 200으로 보일 수 있다.
 */
export default function CatchAllPage() {
  notFound();
}
