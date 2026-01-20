import type { NextAuthConfig } from 'next-auth';

/**
 * NextAuth 설정 (구조만 준비)
 *
 * 실제 인증 기능 구현 시:
 * 1. Credentials provider 추가
 * 2. 사용자 검증 로직 구현
 * 3. 세션 콜백 설정
 */
export const authConfig: NextAuthConfig = {
  providers: [
    // TODO: Credentials provider 추가
    // Credentials({
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" }
    //   },
    //   async authorize(credentials) {
    //     // 사용자 검증 로직 구현
    //     return null;
    //   }
    // })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  pages: {
    // TODO: 커스텀 페이지 경로 설정
    // signIn: '/login',
    // signOut: '/logout',
    // error: '/auth/error',
  },
  callbacks: {
    // TODO: 필요한 콜백 구현
    // async jwt({ token, user }) {
    //   return token;
    // },
    // async session({ session, token }) {
    //   return session;
    // },
  },
};
