# 제천 키오스크

제천시 키오스크용 미디어 재생 및 관광 포털 연동 Electron 애플리케이션

> 업데이트일: 2026-07-07

---

# 한눈에 보기

- React + Vite 기반 프론트엔드와 Electron 런타임을 함께 사용합니다.
- 운영 서버의 `/smbiz_support` 하위 경로를 기준으로 배포 및 API 호출을 맞춥니다.
- 키오스크 재생 목록 조회, 이미지/영상 재생, QR 오버레이, 관광 포털 연동, 오프라인 재시도, 종료 제어를 포함합니다.

---

# 기술 스택

| 항목            | 내용                               |
| --------------- | ---------------------------------- |
| Framework       | React 19 + Vite 6                  |
| Language        | TypeScript, JavaScript             |
| Desktop Runtime | Electron 36                        |
| UI              | MUI, Emotion                       |
| State           | Context API, React Query           |
| Router          | React Router (`createHashRouter`)  |
| HTTP            | Axios                              |
| Build           | Vite, TypeScript, electron-builder |
| Package Target  | NSIS (`.exe`), DMG (`.dmg`)        |
| Lint / Format   | ESLint 9, Prettier                 |
| Test            | 별도 테스트 러너 미구성            |

---

# 주요 기능

- 키오스크 재생 목록 조회 및 이미지/영상 순차 재생
- QR 오버레이 위치/크기 계산 및 미디어 타입별 렌더링
- 긴급뉴스 재생 후 삭제 처리
- 관광 카테고리에서 외부 관광 포털 창 연동
- 오프라인 화면 및 재시도 처리
- 운영 시간 종료 안내 및 시스템 종료/재시작 단축키 처리

---

# 빠른 시작

## 설치

```bash
npm install
```

## 웹 개발 서버

```bash
npm run dev
```

## Electron 개발 실행

현재 스크립트 이름은 `dev-electron`이 아니라 `dev-elctron`입니다.

```bash
npm run dev-elctron
```

## 린트

```bash
npm run lint
```

## 웹 빌드

```bash
npm run build
```

## Electron 실행

```bash
npm run start
```

## Windows 배포 패키지 생성

```bash
npm run release
```

또는

```bash
npm run release:win
```

- 출력 경로: `release/win`

## macOS 배포 패키지 생성

```bash
npm run release:mac
```

- 출력 경로: `release/mac`

## Windows + macOS 동시 빌드

```bash
npm run release:all
```

- 출력 경로: `release/all`

---

# 개발 환경

| 항목            | 내용           |
| --------------- | -------------- |
| Node            | 20.x           |
| Package Manager | npm            |
| Alias           | `@ -> src`     |
| Dev Server      | `0.0.0.0:5173` |
| Router Mode     | Hash Router    |

- `.nvmrc`: `20`
- `package.json > engines.node`: `20.x`

---

# 경로 규칙

이 프로젝트는 운영 서버의 `/smbiz_support` 하위 경로를 기준으로 동작합니다.

## 웹 배포 경로

- Vite base 기본값: `/smbiz_support/kiosk/`
- 설정 위치: [vite.config.ts](/Users/akim00/projects/jecheon-kiosk/vite.config.ts:12)
- 관련 환경 변수: `VITE_APP_BASE`
- 운영 예시: `https://www.jecheon.go.kr/smbiz_support/kiosk/`

즉 정적 리소스와 앱 진입 경로는 `/smbiz_support/kiosk/` 기준입니다.

## API 경로

- 프론트 기본 API 주소: `VITE_API_BASE`
- 설정 위치: [src/config/appConfig.ts](/Users/akim00/projects/jecheon-kiosk/src/config/appConfig.ts:10)
- Axios 적용 위치: [src/services/api.ts](/Users/akim00/projects/jecheon-kiosk/src/services/api.ts:3)
- 운영 예시: `https://www.jecheon.go.kr/smbiz_support/api`

예를 들어 `/playlist/current` 호출은 최종적으로 아래 주소로 나갑니다.

```text
https://www.jecheon.go.kr/smbiz_support/api/playlist/current
```

이미지/영상 같은 에셋 요청은 `VITE_IMG_API_BASE`를 기준으로 분기합니다.

## Electron이 여는 프론트 URL

Electron은 `env.xml`의 `frontend_url`에 `/smbiz_support/kiosk/`를 붙여 최종 URL을 만듭니다.

- 관련 코드: [electron/main.mjs](/Users/akim00/projects/jecheon-kiosk/electron/main.mjs:397), [electron/main.mjs](/Users/akim00/projects/jecheon-kiosk/electron/main.mjs:413)
- 예시:
  `frontend_url=https://www.jecheon.go.kr`
  최종 URL: `https://www.jecheon.go.kr/smbiz_support/kiosk/`

주의:

- `frontend_url`에는 `/smbiz_support/kiosk/`까지 넣지 않습니다.
- 현재 코드가 이 경로를 별도로 덧붙입니다.

## 개발 프록시

기본 개발 프록시 설정은 아래와 같습니다.

| Prefix | Target                       | Rewrite               |
| ------ | ---------------------------- | --------------------- |
| `/api` | `https://www.jecheon.go.kr/` | `/smbiz_support/api/` |

즉 개발 중 `/api/playlist/current` 요청은 최종적으로 아래 주소로 전달됩니다.

```text
https://www.jecheon.go.kr/smbiz_support/api/playlist/current
```

---

# 환경 설정

프론트엔드는 Vite 환경 변수를 사용하고, Electron은 별도로 `env.xml`을 사용합니다.

## Vite 환경 변수

`.env.development`, `.env.production` 등의 파일에서 관리합니다.

```env
VITE_SERVICE_KEY=your-service-key
VITE_API_BASE=https://example.com/smbiz_support/api
VITE_IMG_API_BASE=https://example.com
VITE_APP_BASE=/smbiz_support/kiosk/
VITE_DEV_PROXY_PATH=/api
VITE_DEV_PROXY_TARGET=https://www.jecheon.go.kr/
VITE_DEV_PROXY_REWRITE_TO=/smbiz_support/api/
```

| 변수                        | 설명                                |
| --------------------------- | ----------------------------------- |
| `VITE_SERVICE_KEY`          | API 요청용 서비스 키                |
| `VITE_API_BASE`             | 백엔드 API 기본 주소                |
| `VITE_IMG_API_BASE`         | 영상/이미지 절대 경로용 베이스 주소 |
| `VITE_APP_BASE`             | Vite 빌드 base 경로                 |
| `VITE_DEV_PROXY_PATH`       | 개발 프록시 prefix                  |
| `VITE_DEV_PROXY_TARGET`     | 개발 프록시 대상 서버               |
| `VITE_DEV_PROXY_REWRITE_TO` | 개발 프록시 rewrite 대상 경로       |

## Electron `env.xml`

- 개발 환경 경로: `./env.xml`
- 패키징 후 경로: `process.resourcesPath/env.xml`

예시:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<env>
  <backend_url>https://www.jecheon.go.kr/smbiz_support/api</backend_url>
  <frontend_url>https://www.jecheon.go.kr</frontend_url>
</env>
```

배포 시 기준:

- `backend_url`은 `/smbiz_support/api`까지 포함합니다.
- `frontend_url`은 도메인 기준으로 두고, `/smbiz_support/kiosk/`는 Electron이 뒤에 붙입니다.

---

# 화면 구성

| 메뉴                   | 경로 |
| ---------------------- | ---- |
| 키오스크 메인 플레이어 | `/`  |

현재 라우팅은 단일 메인 화면 구조입니다.

---

# 프로젝트 구조

```text
.
├── electron/
│   ├── main.mjs
│   ├── preload.cjs
│   ├── portalPreload.cjs
│   ├── readEnv.mjs
│   ├── loading.html
│   ├── offline.html
│   ├── overlay.html
│   └── shutdown.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── contexts/
│   ├── hooks/
│   ├── mappers/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── env.xml
├── package.json
└── vite.config.ts
```

| 경로             | 설명                                                |
| ---------------- | --------------------------------------------------- |
| `electron`       | Electron 메인 프로세스, preload, 오프라인/로딩 HTML |
| `src/pages`      | 실제 화면 페이지                                    |
| `src/components` | 플레이어, 로딩, 종료 다이얼로그 등 UI 컴포넌트      |
| `src/contexts`   | 플레이어/화면 상태 Context                          |
| `src/hooks`      | 키오스크 단축키, 종료 다이얼로그 등 Custom Hook     |
| `src/services`   | API 호출, 파일 다운로드/캐시 처리                   |
| `src/mappers`    | 서버 응답을 화면용 데이터로 변환                    |
| `src/types`      | 플레이어, API 응답 타입 정의                        |
| `src/styles`     | 전역 스타일                                         |
| `src/assets`     | 로고 등 정적 리소스                                 |

---

# 코딩 규칙

- 포맷터는 Prettier, 린터는 ESLint를 사용합니다.
- 경로 alias는 `@`를 사용합니다.
- 플레이어/화면 상태는 Context API와 React Query로 관리합니다.
- 서버 응답은 `mappers`에서 화면용 데이터로 변환합니다.
- Electron 브리지 API는 preload를 통해서만 노출합니다.

---

# 배포

| 항목            | 내용                           |
| --------------- | ------------------------------ |
| Web Build | `npm run build` |
| Windows Package | `npm run release` / `npm run release:win` |
| macOS Package | `npm run release:mac` |
| Multi Platform | `npm run release:all` |
| Output | `dist`, `release/win`, `release/mac`, `release/all` |
| Packager | `electron-builder` |
| Windows Target | NSIS x64 (`.exe`) |
| macOS Target | DMG (`.dmg`) |
| Extra Resource | `env.xml -> resources/env.xml` |

`npm run start`는 웹 빌드 후 Electron 앱을 실행합니다.

산출물 위치:
- `npm run release` / `npm run release:win` -> `release/win`
- `npm run release:mac` -> `release/mac`
- `npm run release:all` -> `release/all`

배포 전에 확인할 항목:

- 정적 파일 배포 위치가 `/smbiz_support/kiosk/`와 일치하는지
- `VITE_APP_BASE`, `VITE_API_BASE`, `env.xml` 값이 운영 환경과 일치하는지
- `npm run lint`, `npm run build`, 필요 시 `npm run release:win` 또는 `npm run release:mac` 순서로 검증했는지

---

# 참고 문서

| 문서                      | 설명                                 |
| ------------------------- | ------------------------------------ |
| `README.md`               | 프로젝트 개요 및 실행 방법           |
| `package.json`            | 의존성, 스크립트, Electron 빌드 설정 |
| `vite.config.ts`          | Vite base path, proxy, alias 설정    |
| `electron/main.mjs`       | Electron 메인 프로세스               |
| `src/config/appConfig.ts` | 필수 Vite 환경 변수 정의             |
