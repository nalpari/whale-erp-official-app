@AGENTS.md

# Whale ERP - Partner Office App

Whale ERP 시스템의 **파트너 오피스(가맹점/본사) 전용 모바일 웹 애플리케이션**.
가맹점주 및 본사 관리자가 점포 관리, 직원 관리, 급여 명세서, 근무 계획표, 출퇴근 현황, TODO 등을 모바일 환경에서 운영할 수 있도록 지원한다.

- **대상 사용자**: 본사 마스터, 가맹점 마스터, 점포 관리자
- **플랫폼**: 모바일 최적화 웹앱 (반응형 아님, 모바일 전용 UI)
- **백엔드**: Whale ERP API 서버 (Spring Boot, `/api/v1/*`)
- **인증**: JWT 기반 (Access Token + Refresh Token), Zustand persist로 클라이언트 보관

## Commands

```bash
pnpm dev       # 개발 서버 (localhost:3000)
pnpm build     # 프로덕션 빌드
pnpm start     # 프로덕션 서버 실행
pnpm lint      # ESLint 검사 (flat config, eslint.config.mjs)
```

# Tech Stack

- **Framework**: Next.js 16.2.0 (App Router, React Compiler 활성화)
- **Language**: TypeScript 5
- **UI**: React 19.2.4
- **State Management**: Zustand 5 (devtools 미들웨어 사용)
- **Styling**: SCSS + Tailwind CSS 4 (PostCSS)
- **UI Libraries**: react-modal-sheet, react-tooltip, Swiper 12

# Project Structure

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (Header, Footer, RnbMenu, Popup, BottomSheet)
│   ├── page.tsx            # 메인 페이지
│   ├── (auth)/             # 인증 라우트 그룹
│   │   └── login/          # 로그인, 아이디/비밀번호 찾기
│   ├── (sub)/              # 서브 페이지 라우트 그룹
│   │   ├── contract/       # 계약 관리
│   │   ├── fulltimer/      # 정규직 급여 관리
│   │   ├── parttimer/      # 파트타이머 급여 관리
│   │   ├── overtime/       # 초과근무 관리
│   │   ├── commute/        # 출퇴근 관리
│   │   ├── staff/          # 직원 관리 (초대, 편집, 고용계약)
│   │   ├── storeinfo/      # 매장 정보 관리 (생성, 편집)
│   │   ├── plan/           # 근무 계획표
│   │   ├── master-info/    # 사업자 정보
│   │   └── changepw/       # 비밀번호 변경
│   └── list/               # 퍼블리싱 목록 (개발 참조용)
├── components/
│   ├── ui/                 # 공통 UI (Header, Footer, RnbMenu, PopupControler, BottomSheetControler)
│   ├── popup/              # 팝업 (Alert, AIChat, PhotoPopup, AddressSearchPop)
│   ├── bottomsheet/        # 바텀시트 (검색, 선택, 옵션 등 20+ 시트)
│   ├── main/               # 메인 페이지 컨텐츠
│   ├── login/              # 로그인 관련 컴포넌트
│   ├── contract/           # 계약 관련 컴포넌트
│   ├── fulltimer/          # 정규직 관련 컴포넌트
│   ├── parttimer/          # 파트타이머 관련 컴포넌트
│   ├── overtime/           # 초과근무 관련 컴포넌트
│   ├── commute/            # 출퇴근 관련 컴포넌트
│   ├── staff/              # 직원 관련 컴포넌트
│   ├── storeinfo/          # 매장 관련 컴포넌트
│   ├── plan/               # 근무 계획표 컴포넌트
│   ├── master-info/        # 사업자 정보 컴포넌트
│   ├── changepw/           # 비밀번호 변경 컴포넌트
│   └── publist/            # 퍼블리싱 참조 컴포넌트
├── store/                  # Zustand 스토어
│   ├── useMenuStore.ts           # 메뉴 상태 관리
│   ├── usePopupControler.ts      # 팝업 상태 관리 (AIChat, Alert, Photo, AddressSearch)
│   └── useBottomSheetControler.ts # 바텀시트 상태 관리 (20+ 시트)
├── styles/                 # SCSS 스타일
│   ├── abstracts/          # 변수, 믹스인
│   ├── base/               # 리셋, 폰트, 입력폼, 버튼 등
│   ├── components/         # 컨텐츠, 테이블, 팝업, 바텀시트
│   └── layout/             # 레이아웃, 로그인, 메인, 팝업, 바텀시트
└── public/assets/          # 폰트, 이미지 정적 자원
```

# Architecture Conventions

- **라우팅**: App Router 기반, `(auth)` / `(sub)` 라우트 그룹으로 분리
- **상태 관리**: Zustand store에서 UI 컨트롤 (팝업, 바텀시트, 메뉴)
- **스타일링**: SCSS 모듈 구조 (abstracts → base → components → layout)
- **컴포넌트 구조**: 페이지는 `app/` 라우트, 실제 구현은 `components/` 디렉토리
- **경로 별칭**: `@/*` → `./src/*`

## API Layer

- **`src/lib/api.ts`**: Axios 인스턴스 (request/response 인터셉터)
  - Bearer 토큰 자동 첨부 (auth store에서 읽기)
  - `affiliationId` 헤더 자동 첨부 (다중 조직 지원)
  - 401 응답 시 토큰 자동 갱신 (refresh token)
  - FormData 전송 시 Content-Type 자동 처리
  - Base URL: `NEXT_PUBLIC_API_URL` 환경 변수
- **`src/lib/api/`**: 도메인별 API 함수 (store.ts, todo.ts, contract.ts, employee.ts 등)
- **`src/hooks/queries/`**: React Query 훅 (쿼리 키 팩토리 패턴, 도메인별 분리)

## Authentication Flow

Login supports multi-authority (조직) selection:
1. User submits credentials to `/api/auth/login`
2. If single authority: auto-select and proceed
3. If multiple authorities: modal appears for user selection
4. Selected authority → `affiliationId` 저장 → API 헤더 자동 주입

## State Management

- **서버 데이터**: TanStack React Query (`useQuery`, `useMutation`, `useInfiniteQuery`)
- **클라이언트 상태**: Zustand (`src/store/`)
  - `useAuthStore`: 인증 토큰, 조직 정보 (persist middleware, localStorage)
  - `useHeaderStore`: 헤더 타이틀, 저장/삭제 버튼 콜백
  - `usePopupControler`: Alert, Photo, AddressSearch 팝업
  - `useBottomSheetControler`: 20+ 바텀시트 상태
  - React 외부 접근: `useStore.getState()`

## Styling

- **SCSS**: 복잡한 컴포넌트 스타일 (7-1 패턴)
- **Tailwind CSS 4**: 유틸리티 클래스
- **기존 CSS/Sass 파일 수정 금지**: pub 프로젝트 코드 참조 시에도 새로운 스타일은 Tailwind 또는 컴포넌트 내 인라인 스타일로 처리
- **`src/styles/` 디렉토리 수정 절대 금지**: `src/styles/` 하위의 모든 SCSS 파일(abstracts, base, components, layout)은 어떤 상황에서도 수정하지 않는다. 스타일 변경이 필요하면 Tailwind 유틸리티 클래스 또는 컴포넌트 내 인라인 스타일로 처리한다.

# Code Conventions

현재 문서는 "절대 규칙 목록"보다 "기본 원칙 + 예외 판단 기준"에 가깝게 운영한다.
아래 항목은 새 코드를 작성할 때 우선 적용하되, 더 단순하고 읽기 쉬운 대안이 있으면 그 선택을 허용한다.

## 1. 기본 원칙

- 서버 데이터는 React Query, 클라이언트 UI 상태는 Zustand를 우선 사용한다.
- 한 파일 안에서 해결 가능한 단순한 문제까지 패턴을 과도하게 추상화하지 않는다.
- 규칙 준수 자체보다 유지보수성, 디버깅 용이성, 사용자 영향도를 우선 판단한다.
- 반복해서 문제를 만들었던 항목만 명시적 가드레일로 남긴다.

## 2. 상태 관리와 컴포넌트 통신

- 페이지 간 공통 UI 상태와 콜백 연결은 Zustand store 패턴을 기본으로 사용한다.
- `window.dispatchEvent`, `CustomEvent` 같은 DOM 이벤트 기반 통신은 특별한 이유가 없으면 피한다.
- store는 렌더링에 필요한 값만 selector로 구독하고, 이벤트 핸들러에서만 필요한 값은 `getState()` 접근을 우선 검토한다.
- 여러 필드를 한 번에 초기화해야 하는 경우에는 `setFields(partial)` 같은 배치 업데이트가 더 읽기 쉬운지 먼저 본다.

## 3. 데이터 페칭과 비동기 처리

- 읽기 작업은 React Query를 우선 사용하고, 캐시/로딩/에러 상태를 훅 밖으로 흩뜨리지 않는다.
- 일회성 직접 호출이나 사용자 액션 기반 요청은 API 함수를 바로 호출해도 되지만, 실패 처리 방식은 코드에 드러나야 한다.
- `isLoading`, `isError`, 빈 상태는 가능한 한 분리해서 표현한다.
- mutation은 기본적으로 팀이 읽기 쉬운 형태를 선택한다. 사용자 피드백이 필요한 흐름이면 `mutateAsync` + `try/catch`가 안전하고, 단순 토글이나 낙관적 UI는 `mutate()`도 허용한다.

## 4. 에러 처리

- 빈 `catch` 블록은 사용하지 않는다. 최소한 로그를 남기거나, 의도적으로 무시한 이유를 코드에 표현한다.
- 사용자 진행이 막히거나 데이터 정합성에 영향을 주는 실패는 `console.error`로 끝내지 말고 UI 피드백이나 안전한 폴백을 함께 둔다.
- Alert, Popup, BottomSheet처럼 외부 콜백을 실행하는 지점은 예외 전파로 UI가 깨지지 않도록 감싼다.
- Promise 체인을 유지할 때는 `.catch()`를 생략하지 않는다.

## 5. 타입과 값 표현

- `any`와 불필요한 타입 우회는 피하고, 가능한 범위에서 구체적인 타입이나 Zod 추론 타입을 사용한다.
- `value!` 같은 non-null assertion은 정말 불가피한 경우가 아니면 명시적 가드로 대체한다.
- optional과 `null`을 동시에 써서 부재 상태를 이중 표현하지 않는다.
- 다른 파일에서 재사용될 가능성이 있는 타입은 export해 둔다.
- discriminated union, 공통 유틸 타입, deprecated 정리는 권장하되, 코드 복잡도가 더 커지면 단순한 구조를 선택한다.

## 6. React Compiler와 렌더링 비용

- 시간에 따라 바뀌는 값(`new Date()`, `Date.now()`)은 모듈 상수나 빈 의존성 메모이제이션으로 고정하지 않는다.
- 값 계산 비용이 작다면 `useMemo`, `useCallback`을 습관적으로 쓰지 않는다.
- 반대로 헤더 액션 등록, effect 의존성, memoized child props처럼 참조 안정성이 실제 동작에 영향을 주는 경우에는 `useCallback`과 구조분해를 신경 쓴다.
- mutation 객체 전체를 의존성에 넣어 콜백이 매 렌더 재생성되는 패턴은 피한다.

## 7. 상수, 경로, 리소스

- 의미가 바로 드러나지 않는 도메인 값이나 여러 번 반복되는 값은 상수화한다.
- 짧은 UI 문자열이나 한 번만 쓰는 단순 리터럴까지 기계적으로 상수화할 필요는 없다.
- 전역 레이아웃 제어는 pathname 분기보다 store나 중앙 매핑을 우선 고려하되, 국소적인 라우트 체크는 직접 사용해도 된다.
- `URL.createObjectURL`, 동적 스크립트 로드, 파일 업로드 입력처럼 브라우저 리소스를 다루는 코드는 cleanup과 실패 처리를 함께 둔다.

## 8. 예외보다 중요한 금지 항목

- silent failure를 만드는 빈 `catch`
- 런타임 크래시 위험이 큰 무분별한 non-null assertion
- 서버 상태를 `useEffect + useState`로 임시 캐싱해 React Query와 이중 관리하는 패턴
- 시간 기반 값을 stale하게 고정하는 패턴

# Development Guidelines

## 새 기능 추가 순서

1. `src/types/`에 타입 정의
2. `src/lib/api/` 또는 기존 API 레이어에 함수 추가
3. `src/hooks/queries/`에 React Query 훅 추가
4. 필요한 경우 store, 유틸, 상수 정리
5. 컴포넌트 구현
6. `src/app/(sub)/`에 라우트 연결

## TanStack Query

- 조회 데이터는 React Query 훅에서 관리하고, 컴포넌트는 결과를 소비하는 형태를 우선한다.
- 쿼리 키는 기존 `query-keys` 패턴에 맞춰 도메인별로 일관되게 정의한다.
- 필수 파라미터가 준비되기 전 요청은 `enabled`로 제어한다.
- 로딩, 에러, 빈 상태를 컴포넌트에서 분리해 표현한다.
- 캐시 무효화는 관련 도메인 키 범위를 기준으로 최소한만 수행한다.

## Code Quality

- 작업 마무리 전 `pnpm lint`를 우선 실행한다.
- 타입 검사가 필요한 변경이면 `pnpm exec tsc --noEmit`로 한 번 더 확인한다.
- TypeScript strict mode를 전제로 작성한다.
- `any` 타입은 피하고, 가능한 범위에서 구체적인 타입이나 제네릭으로 대체한다.
- `unknown`도 무조건 배제하기보다, 실제로 필요한 경우에는 좁히는 코드와 함께 명확하게 사용한다.

## React Compiler 규칙

이 프로젝트는 `next.config.ts`에서 `reactCompiler: true`로 React Compiler를 활성화하고 있다.
React Compiler 관련 ESLint 경고는 무시하지 말고, 가능한 한 코드 구조를 맞추는 방향으로 해결한다.

- **`react-hooks/set-state-in-effect`**: useEffect 안에서 setState가 필요해 보이면 먼저 파생 값 계산이나 `key` 기반 리마운트로 풀 수 있는지 확인한다.
- **`react-hooks/set-state-in-render`**: 렌더링 중 setState 호출은 피한다.
- **기타 규칙**: `purity`, `immutability`, `refs`, `globals`, `use-memo`, `static-components` 등은 `pnpm lint` 기준으로 맞춘다.
