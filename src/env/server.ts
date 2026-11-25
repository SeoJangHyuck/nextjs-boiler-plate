import 'server-only';
import { parseEnv } from './schema';

/** 서버 전용 환경 변수. 클라이언트 컴포넌트에서 가져오면 빌드가 실패한다. */
export const serverEnv = parseEnv();
