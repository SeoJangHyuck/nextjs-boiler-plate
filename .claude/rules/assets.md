---
paths:
  - 'public/**/*'
  - 'src/app/**/*.tsx'
  - 'src/components/**/*.tsx'
  - 'src/**/*.scss'
---

# 이미지·아이콘·비디오 파일 컨벤션

`public/`과 `src/`에서 접두사, kebab-case, 확장자, 폴더 위치를 `pnpm lint:assets`가 검사하고, 어기면 커밋이 막힌다.

## 접두사와 폴더

| 종류   | 접두사  | 폴더                  | 확장자                                 | 예시                  |
| ------ | ------- | --------------------- | -------------------------------------- | --------------------- |
| 이미지 | `img-`  | `public/images/`      | `webp` `avif` `png` `jpg` `jpeg` `gif` | `img-home-hero.webp`  |
| SVG    | `icon-` | `public/icons/`       | `svg`                                  | `icon-arrow-left.svg` |
| 비디오 | `vid-`  | `public/videos/`      | `mp4` `webm`                           | `vid-home-intro.mp4`  |
| 배경   | `bg-`   | `public/backgrounds/` | 이미지 확장자와 `svg`                  | `bg-login.webp`       |

종류는 이 순서로 정한다.

1. 배경으로 쓰면 확장자와 관계없이 `bg-`
2. SVG면 로고와 일러스트도 `icon-`
3. 비디오면 `vid-` (포스터 이미지는 `img-`)
4. 나머지는 `img-`

## 이름

`<접두사><영역>-<설명>[-<상태>][-<기기>][-<locale>].<확장자>`

```text
✅ img-home-hero.webp
✅ img-home-hero-dark-mobile.webp
✅ img-event-banner-ko.webp
✅ icon-arrow-left.svg
❌ hero.webp                (접두사 없음)
❌ img-HomeHero.png         (대문자)
❌ img_home_hero.png        (밑줄)
❌ img-메인.webp            (한글)
❌ img-home-hero@2x.png     (배율 표기. next/image가 크기를 처리한다)
```

- 소문자 영문, 숫자, 하이픈만 쓴다(kebab-case).
- `final`, `v2`, 날짜 같은 버전 표기를 붙이지 않는다. 이력은 git이 관리한다.
- 영역은 화면이나 기능 이름이다(`home`, `login`, `event`). 여러 화면이 함께 쓰면 `common`을 쓴다.
- 상태는 `dark`, `light`, `hover`, `active`, `disabled`, 기기는 `mobile`, `tablet`, `desktop`만 쓴다.
- 한 폴더의 파일이 20개를 넘으면 영역별 폴더로 나눈다: `public/images/home/img-home-hero.webp`

## 사용

```tsx
import Image from 'next/image';

<Image src="/images/img-home-hero.webp" alt={t('heroAlt')} width={1200} height={630} />
<Image src="/icons/icon-arrow-left.svg" alt="" width={24} height={24} />
<video src="/videos/vid-home-intro.mp4" poster="/images/img-home-intro-poster.webp" muted playsInline />
```

```scss
.login {
  background-image: url('/backgrounds/bg-login.webp');
}
```

- 의미가 있는 이미지의 `alt`는 번역 메시지를 쓰고, 장식이면 빈 문자열을 쓴다.
- 첫 화면의 가장 큰 이미지에는 `loading="eager"`와 `fetchPriority="high"`를 함께 쓴다. 테마·기기별 이미지를 함께 두고 CSS로 하나만 보일 때는 `fetchPriority="high"`만 쓴다(모두 내려받지 않게 한다).
- 새 이미지는 `webp`나 `avif`를 우선한다. `mov`, `heic`, `bmp` 등은 변환해서 넣는다.
- 글자색을 따라 바뀌어야 하는 아이콘은 파일 대신 `currentColor`를 쓰는 SVG 컴포넌트로 만든다.

## 예외

- Next.js 메타데이터 파일. `public/`에는 두지 않는다.
  - `src/app/favicon.ico` (최상위만)
  - `src/app/**/icon.(ico|jpg|jpeg|png|svg)`, `apple-icon.(jpg|jpeg|png)`
  - `src/app/**/opengraph-image.(jpg|jpeg|png|gif)`, `twitter-image.(jpg|jpeg|png|gif)`
- 표준이 경로를 정한 파일: `public/.well-known/`
- 글꼴: `src/fonts/`
