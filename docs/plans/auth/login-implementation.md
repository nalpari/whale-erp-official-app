# 로그인 기능 구현 계획서

## 개요
whale-erp-front의 인증 구현을 참조하여 official-app에 로그인 기능을 구현한다.
동일한 API(`whale-erp-api`)를 사용하므로 인증 흐름, 토큰 관리, 요청 인터셉터 패턴을 동일하게 적용한다.

## 현재 상태 (official-app)
- 로그인 UI만 존재 (Login.tsx) — 폼 입력, 비밀번호 토글, 소셜 로그인 UI
- 로그인 버튼 클릭 시 `router.push("/")` — 실제 인증 없음
- API 클라이언트, auth store, 라우트 보호 모두 미구현
- `src/lib/`, `src/hooks/` 디렉토리 없음

## 참조 (whale-erp-front)
- `src/stores/auth-store.ts` — Zustand + persist (localStorage)
- `src/lib/api.ts` — Axios 인스턴스, 토큰 인터셉터, 401 자동 갱신
- `src/lib/schemas/auth.ts` — Zod 스키마 (로그인 요청/응답)
- `src/hooks/queries/use-login-mutation.ts` — TanStack Query mutation
- `src/app/(auth)/login/page.tsx` — 로그인 페이지 (권한 선택 포함)
- `src/app/(sub)/layout.tsx` — 토큰 없으면 로그인 리다이렉트

## 구현 범위

### Phase 1: 인프라 구축
1. **API 클라이언트** (`src/lib/api.ts`)
   - Axios 인스턴스 생성 (baseURL: `NEXT_PUBLIC_API_URL`)
   - 요청 인터셉터: `Authorization: Bearer {token}` 자동 주입
   - 요청 인터셉터: `affiliationId` 헤더 주입
   - 응답 인터셉터: 401 시 refresh token으로 자동 갱신
   - 갱신 실패 시 `forceLogout()` (store 초기화 + `/login` 리다이렉트)
   - `getErrorMessage()` 헬퍼 함수

2. **Auth Store** (`src/store/useAuthStore.ts`)
   - Zustand + `persist` 미들웨어 (localStorage key: `auth-storage`)
   - 상태: `accessToken`, `refreshToken`, `affiliationId`, `ownerCode`, `loginId`, `name`, `authority`, `passwordChangeRequired`
   - 메서드: `setTokens()`, `setAccessToken()`, `setAuthority()`, `setAffiliationId()`, `setUserInfo()`, `clearAuth()`

3. **환경 변수** (`.env.development`, `.env.production`)
   - `NEXT_PUBLIC_API_URL` 추가

### Phase 2: 로그인 기능
4. **로그인 Mutation** (`src/hooks/queries/use-login-mutation.ts`)
   - `useLoginMutation()` — POST `/api/auth/login`
   - `useAuthoritySelectMutation()` — POST `/api/auth/authority`
   - TanStack Query 설정 (`src/lib/query-client.ts`, `src/providers/query-provider.tsx`)

5. **로그인 타입/스키마**
   - `src/types/auth.ts` — LoginResponse, Authority 타입
   - Zod 스키마는 front 수준에 맞춰 선택적 적용 (official-app은 모바일 앱이라 간소화 가능)

6. **Login.tsx API 연동** (기존 UI 유지, 로직만 추가)
   - 기존 UI/레이아웃/스타일은 그대로 유지
   - 폼 상태 관리 추가 (loginId, password를 state로 바인딩)
   - `useLoginMutation()` 연동 (기존 `router.push("/")` 대체)
   - 로그인 성공 → 토큰 저장 → 메인 페이지 이동
   - 권한이 2개 이상이면 → 선택 UI (바텀시트 활용)
   - ID 저장 기능 (localStorage, 기존 자동 로그인 토글 활용)
   - 에러 처리 (alert 팝업)
   - `passwordChangeRequired` → 비밀번호 변경 페이지 이동

### Phase 3: 라우트 보호
7. **`(sub)/layout.tsx` 수정**
   - 마운트 시 localStorage에서 토큰 확인
   - 토큰 없으면 `/login?returnUrl={현재경로}` 리다이렉트
   - 토큰 삭제(로그아웃) 감지 시 리다이렉트

8. **`(auth)/layout.tsx` 수정**
   - AlertProvider 추가 (에러 팝업용)

9. **root `layout.tsx` 수정**
   - QueryProvider 추가

### Phase 4: 부가 기능
10. **로그아웃**
    - RnbMenu에 로그아웃 버튼 연동
    - `clearAuth()` 호출 → `/login` 이동

11. **비밀번호 변경** (`src/app/(sub)/changepw/`)
    - 기존 UI에 API 연동
    - `useChangePasswordMutation()` 추가

## 파일 구조 (신규 생성)

```text
src/
├── lib/
│   ├── api.ts                    # Axios 인스턴스 + 인터셉터
│   └── query-client.ts           # TanStack Query 설정
├── providers/
│   └── query-provider.tsx        # QueryClientProvider 래퍼
├── hooks/
│   └── queries/
│       └── use-login-mutation.ts # 로그인/권한선택/비밀번호변경 mutation
├── types/
│   └── auth.ts                   # 인증 관련 타입
└── store/
    └── useAuthStore.ts           # 인증 상태 관리 (신규)
```

## 파일 수정 (기존)

```text
src/
├── app/
│   ├── layout.tsx                # QueryProvider 추가
│   ├── (auth)/layout.tsx         # AlertProvider 추가
│   └── (sub)/layout.tsx          # 토큰 체크 + 리다이렉트 로직
├── components/
│   ├── login/Login.tsx           # 실제 로그인 로직 연동
│   └── ui/RnbMenu.tsx            # 로그아웃 버튼 연동
└── .env.development              # API URL 추가
```

## 의존성 추가

```bash
pnpm add axios @tanstack/react-query
```

## 구현 순서

1. 의존성 설치 (axios, @tanstack/react-query)
2. 환경 변수 설정
3. API 클라이언트 생성
4. Auth Store 생성
5. TanStack Query 설정 + Provider
6. 로그인 Mutation 훅 생성
7. Login.tsx 리팩토링
8. (sub)/layout.tsx 라우트 보호
9. 로그아웃 연동
10. 린트/빌드 체크

## 참고 사항
- **기존 UI는 모두 그대로 유지** — 로그인, 메인, 서브 페이지 등 퍼블리싱된 화면을 변경하지 않음
- 변경은 로직(상태 바인딩, API 호출, 라우트 보호)만 추가
- front와 동일한 API를 사용하므로 요청/응답 형식 동일
- official-app은 모바일 최적화 앱이므로 권한 선택 UI는 바텀시트로 구현
- front의 `FindIdPw` 모달 대신 기존 라우트(`/login/findid`, `/login/findpw`) 유지
- 소셜 로그인은 이번 범위에서 제외 (UI만 유지)
