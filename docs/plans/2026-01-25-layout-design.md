# Layout Design

## Goal

범용 보일러플레이트를 위한 기본 레이아웃 구조 설계 (헤더-컨텐츠-푸터)

## Architecture

- Header-Content-Footer 구조
- Sticky 헤더, 중앙 정렬 컨텐츠 (max-width: 1280px)
- 반응형: Desktop / Tablet (사이드 드로어) / Mobile (풀스크린 오버레이)

## Breakpoints

| 디바이스 | 범위           | 헤더 구성                    | 메뉴 형태           |
| -------- | -------------- | ---------------------------- | ------------------- |
| Desktop  | 1024px 이상    | 로고 + GNB + 로그인 + Locale | -                   |
| Tablet   | 768px ~ 1023px | 로고 + 햄버거                | 사이드 드로어 320px |
| Mobile   | 767px 이하     | 로고 + 햄버거                | 풀스크린 오버레이   |

## Layout Structure

```
┌─────────────────────────────────────────┐
│  Header (sticky, 상단 고정)              │
│  - Desktop: 로고 | GNB | 로그인 | Locale │
│  - Tablet/Mobile: 로고 | 햄버거          │
├─────────────────────────────────────────┤
│                                         │
│  Content (max-width: 1280px, 중앙 정렬)  │
│  - 좌우 패딩: Desktop 40px / Tablet 24px / Mobile 16px
│                                         │
├─────────────────────────────────────────┤
│  Footer                                 │
│  - 로고 (중앙)                           │
│  - Copyright (중앙)                      │
└─────────────────────────────────────────┘
```

## Header

### Desktop (1024px 이상)

```
┌──────────────────────────────────────────────────────┐
│ [Logo]     [GNB Menu Items...]     [Login] [Locale] │
└──────────────────────────────────────────────────────┘
```

### Tablet/Mobile (1023px 이하)

```
┌────────────────────────────────┐
│ [Logo]              [햄버거 ☰] │
└────────────────────────────────┘
```

## Mobile Menu

### Tablet (768px ~ 1023px) - 사이드 드로어

```
┌──────────────────┬─────────────────────┐
│                  │ [X] [Login][Locale] │
│   (배경 딤처리)   ├─────────────────────┤
│                  │  Menu Item 1        │
│                  │  Menu Item 2        │
│                  │  Menu Item 3        │
│                  │             (320px) │
└──────────────────┴─────────────────────┘
```

### Mobile (767px 이하) - 풀스크린 오버레이

```
┌─────────────────────────────────┐
│ [X 닫기]       [Login] [Locale] │
├─────────────────────────────────┤
│                                 │
│          Menu Item 1            │
│          Menu Item 2            │
│          Menu Item 3            │
│                                 │
└─────────────────────────────────┘
```

### 동작

- 열릴 때: 오른쪽에서 슬라이드 인 (transition)
- 배경 클릭 시: 메뉴 닫힘
- ESC 키: 메뉴 닫힘
- 스크롤 잠금: 메뉴 열린 동안 body 스크롤 방지

## Footer

```
┌─────────────────────────────────────────────────────┐
│                      [Logo]                        │
│         © 2025 Company. All rights reserved.       │
└─────────────────────────────────────────────────────┘
```

## File Structure

```
src/components/layout/
├── Header/
│   ├── index.tsx        # 헤더 컨테이너
│   ├── Logo.tsx         # 로고 (헤더/푸터 공용)
│   ├── GNB.tsx          # 데스크톱 네비게이션
│   ├── HeaderActions.tsx # 로그인 + Locale
│   └── MobileMenu.tsx   # 햄버거 + 드로어/오버레이
├── Footer/
│   └── index.tsx        # 푸터 (로고 + Copyright)
└── Container.tsx        # max-width 래퍼
```

## App Router Integration

```tsx
// src/app/[locale]/layout.tsx
<html>
  <body>
    <Header />
    <main>
      <Container>{children}</Container>
    </main>
    <Footer />
  </body>
</html>
```

## Styling

- Tailwind CSS 유틸리티 클래스 기반
- 브레이크포인트: `md:` (768px), `lg:` (1024px)
- 필요 시 SCSS 모듈로 복잡한 스타일 분리

## Notes

- 다크모드: 현재 미지원, 추후 추가 예정
- GNB 메뉴 항목: 보일러플레이트이므로 예시 데이터로 구성
