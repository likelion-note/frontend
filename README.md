# 멋사수첩 프론트엔드

지난 기수가 익명으로 남긴 시행착오를 AI가 정리해, 아기사자의 역할·주차에 맞춰 보여주는 서비스의 프론트엔드예요.

## 기술 스택

| 구분       | 사용                                |
| ---------- | ----------------------------------- |
| 프레임워크 | React 19, TypeScript, Vite          |
| 스타일     | Tailwind CSS v4                     |
| 라우팅     | React Router v7                     |
| 서버 상태  | TanStack Query                      |
| 코드 품질  | ESLint, Prettier, EditorConfig      |
| 배포       | Vercel (`main` 머지 시 자동 배포)   |

## 시작하기

```bash
npm install
cp .env.example .env   # 윈도우는 복사해서 .env 로 이름 바꾸기
npm run dev            # http://localhost:5173
```

| 명령어                 | 설명                       |
| ---------------------- | -------------------------- |
| `npm run dev`          | 개발 서버                  |
| `npm run build`        | 타입 검사 + 프로덕션 빌드  |
| `npm run preview`      | 빌드 결과 미리보기         |
| `npm run lint`         | ESLint 검사                |
| `npm run format`       | Prettier 로 전체 포맷      |
| `npm run format:check` | 포맷 검사만 (수정 안 함)   |

VS Code 를 쓰면 `.vscode/extensions.json` 에 있는 확장(ESLint, Prettier, Tailwind, EditorConfig)을 설치해 주세요.

## 환경변수

`.env.example` 을 복사해서 `.env` 를 만들어요. `.env` 는 커밋하지 않아요.

| 이름                    | 설명                                       |
| ----------------------- | ------------------------------------------ |
| `VITE_API_BASE_URL`     | 백엔드 주소                                |
| `VITE_USE_MOCK`         | `true` 면 백엔드 없이 목 데이터로 동작     |
| `VITE_GOOGLE_CLIENT_ID` | 구글 로그인 OAuth 클라이언트 ID            |

## 폴더 구조

```
src/
├─ app/          앱 진입점: App, Providers(React Query), router
├─ features/     기능별 화면·컴포넌트·API·목 데이터 (담당자별로 나눠서 작업)
│  ├─ onboarding/  구글 로그인, 초대코드, 프로필
│  ├─ home/        아기사자 홈, 파트 가이드
│  ├─ meeting/     회의 도우미
│  ├─ note/        노트 게시판
│  ├─ journal/     성장일지, 내 기록, 포트폴리오
│  └─ admin/       운영진: 검토, 멤버, 운영
├─ components/   여러 기능에서 같이 쓰는 UI 컴포넌트
├─ layouts/      화면 틀 (MobileLayout: 가운데 390px 모바일 프레임)
├─ pages/        특정 기능에 속하지 않는 페이지 (NotFound 등)
├─ api/          fetch 래퍼 (공통 응답 형식 처리)
├─ hooks/        공통 훅
├─ lib/          유틸 함수 (cn, delay 등)
├─ mocks/        여러 기능이 같이 쓰는 목 데이터
├─ styles/       전역 CSS, Tailwind 테마 토큰
└─ types/        공통 타입
```

기능 폴더 안은 필요에 따라 이렇게 나눠요.

```
features/admin/
├─ pages/        라우트에 연결되는 화면
├─ components/   이 기능 안에서만 쓰는 컴포넌트
├─ api.ts        API 호출 함수 (지금은 목, 나중에 fetch 로 교체)
├─ mock.ts       목 데이터
├─ types.ts      이 기능의 타입
└─ routes.tsx    라우트 정의 → app/router.tsx 에서 합침
```

## 개발 규칙

### import 경로

`src` 는 `@/` 로 불러와요.

```ts
import { cn } from '@/lib/cn'
import { api } from '@/api/client'
```

### API 호출

백엔드 응답은 모두 아래 형식이고, `@/api/client` 의 `api` 가 `data` 만 풀어서 돌려줘요. 실패하면 `ApiError`(`code`, `message`) 를 던져요.

```json
{ "success": true, "data": {} }
```

```json
{ "success": false, "code": "JOURNAL_NOT_FOUND", "message": "일지를 찾을 수 없어요" }
```

백엔드가 준비되기 전에는 각 기능의 `api.ts` 에서 목 데이터를 돌려주고, 화면은 TanStack Query 로 그 함수를 호출해요. 나중에 함수 안쪽만 `api.get(...)` 으로 바꾸면 화면 코드는 그대로예요.

### 화면

모바일 전용이에요. PC 브라우저에서는 `MobileLayout` 이 가운데 390px 폭으로 보여줘요. 폰트는 Pretendard, 글자 크기는 `text-display` · `text-title1` · `text-title2` · `text-headline` · `text-body1` · `text-body2` · `text-button` · `text-caption` 을 써요 (피그마 디자인 시스템과 같은 이름).

### 익명성

작성자 이름은 운영진의 멤버 목록에서만 보여요. 노트·검토 화면에는 이름이나 프로젝트 id 를 표시하지 않아요.

## 브랜치 / 커밋

```
main ← develop ← feature/#이슈번호-기능명
```

- `develop` 에서 분기해서 작업하고, `develop` 으로 PR 을 올려요. 리뷰어 1명 승인 후 머지해요.
- 커밋 타입: `feat` `fix` `docs` `design` `refactor` `test` `chore` `remove` `rename`
- 예: `feat: 초대코드 입력 화면 구현`, `design: 검토 카드 여백 조정`
- 한 커밋에는 한 가지 작업만. 제목 끝에 마침표 없이, `.env` 와 키는 커밋하지 않아요.
