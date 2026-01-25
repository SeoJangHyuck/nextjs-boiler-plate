import { notFound } from 'next/navigation';

/**
 * Catch-all 라우트: 존재하지 않는 모든 경로를 처리
 * notFound()를 호출하여 not-found.tsx가 렌더링되도록 함
 */
export default function CatchAllPage() {
  notFound();
}
