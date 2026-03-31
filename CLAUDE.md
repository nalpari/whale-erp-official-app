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

# Code Review Checklist

아래 항목을 코드 작성 시 반드시 준수한다. 이전 코드 리뷰에서 반복 지적된 패턴을 사전 방지하기 위한 규칙이다.

## 1. 컴포넌트 간 통신: Zustand 전용

- **금지**: `window.dispatchEvent`, `CustomEvent`, `addEventListener` 등 DOM 이벤트 기반 컴포넌트 통신
- **필수**: Zustand store에 콜백/상태를 등록하고 구독하는 패턴 사용
- **이유**: Zustand devtools로 추적 가능, unmount/remount 시 이벤트 유실 방지
- **패턴 예시**: Header ↔ 페이지 간 저장/삭제 버튼은 `useHeaderStore.setOnSave`/`setOnDelete`로 등록

## 2. 데이터 페칭: React Query 일관성

- **금지**: 읽기(read) 쿼리에 수동 `useEffect` + `useState` + `useRef` 캐시 패턴
- **필수**: `useQuery`/`useInfiniteQuery` 사용. 뮤테이션은 `useMutation` 사용
- **이유**: 캐시, 리페치, 에러/로딩 상태, stale 관리를 React Query에 위임
- **예외**: 캘린더 스와이프 등 일회성 직접 호출은 API 함수 직접 호출 허용 (단 try/catch 필수)
- **isLoading/isError 활용 필수**: `useQuery` 반환값의 `isLoading`, `isError` 상태를 UI에 반영하여 로딩 중/에러/빈 상태를 명확히 구분할 것

## 3. 에러 처리: 빈 catch 블록 금지

- **금지**: `catch { }` 또는 `catch { // 빈 주석 }`
- **필수**: 최소 `console.error('[컴포넌트명] 동작 실패:', err)` 로깅
- **뮤테이션 훅**: `onError` 콜백에 `console.error` 로깅 추가
- **Promise 체인**: `.then()` 사용 시 반드시 `.catch()` 추가
- **Alert onConfirm 등 async 콜백**: `await` + `try/catch` 패턴 적용. `finally`에서 무조건 팝업을 닫으면 실패가 성공으로 위장됨 — 성공 시에만 닫을 것
- **onCancel 콜백**: 사용자 제공 콜백이므로 `try/catch`로 감싸서 에러 전파 방지

## 4. 타입 안전성

- **Discriminated union 활용**: 상호 배타적 필드 조합은 union 타입으로 제약 (예: `hasPeriod: true → endDate 필수`, `hasPeriod: false → endDate?: never`)
- **이중 부재 표현 금지**: `headOfficeId?: number | null`처럼 optional + null을 동시에 사용하지 않음. optional(`?:`)이면 `number`만, required면 `number | null`만 사용
- **dead code 제거**: 미사용 타입/인터페이스는 즉시 삭제
- **deprecated API 제거**: deprecated 표기한 함수/속성은 모든 호출부 마이그레이션 후 즉시 삭제 (deprecated 상태로 방치하지 않음)
- **공유 타입 export**: 다른 파일에서 사용될 수 있는 타입은 반드시 `export` 선언 (예: `AlertOptions`)

## 5. 상태 관리: stale 값 주의

- **금지**: `useMemo(() => new Date(), [])` 등 시간 기반 값의 빈 의존성 메모이제이션
- **금지**: 모듈 레벨에서 `new Date()` 호출하여 상수로 사용 (예: `const defaultTo = new Date().toISOString()`)
- **필수**: 날짜/시간 기반 값은 함수로 감싸서 호출 시점에 생성 (`function getDefaultTo() { return new Date().toISOString().slice(0, 10) }`)
- **이유**: 자정 이후 stale 값으로 비교/표시 오류 발생
- **원칙**: 비용이 미미한 연산은 메모이제이션하지 않음

## 6. 매직넘버/매직스트링 금지

- **필수**: 반복 사용되는 숫자/문자열은 상수(`const SWIPE_THRESHOLD = 50`)로 선언
- **여러 파일에서 동일 값 사용 시**: 동일한 상수명 사용 (3곳 이상이면 공통 모듈 추출 고려)
- **중복 함수/상수**: 2곳 이상에서 동일한 유틸 함수(formatDate, STATUS_MAP 등)가 사용되면 `lib/` 공통 모듈로 추출

## 7. pathname 하드코딩 최소화

- **조건부 UI 렌더링** (버튼 표시/숨김 등): pathname 분기 대신 Zustand store 플래그로 제어
- **페이지 제목 매핑**: `getPageTitle()` 등 한 곳에서 관리 (허용하되, 조건이 5개 이상 늘어나면 store 기반 패턴으로 전환)

## 8. React Compiler + useCallback 의존성

- **금지**: mutation 객체 전체를 useCallback 의존성에 포함 (`[createMutation]`) — 매 렌더 새 참조로 콜백 재생성
- **필수**: 구조분해하여 안정적 참조만 의존성에 포함
  ```tsx
  // ✅ 올바른 패턴
  const { mutateAsync: createTodo, isPending: isCreating } = useCreateTodo();
  const handleSubmit = useCallback(async () => {
    if (isCreating) return;
    await createTodo(data);
  }, [isCreating, createTodo, ...]);

  // ❌ 금지 패턴
  const createMutation = useCreateTodo();
  const handleSubmit = useCallback(async () => {
    if (createMutation.isPending) return;
    await createMutation.mutateAsync(data);
  }, [createMutation]); // 매 렌더 재생성
  ```
- **useEffect 연쇄 방지**: useCallback이 매 렌더 재생성되면 이를 의존하는 useEffect도 매 렌더 실행됨. 헤더 버튼 연동(`setOnSave`) 등에서 특히 주의

## 9. Zustand store 구독 최적화

- **금지**: 이벤트 핸들러에서만 사용하는 store 값을 컴포넌트 레벨에서 전체 구독 (`const form = useStoreFormStore()`)
- **필수**: 렌더링에 필요한 값만 개별 selector로 구독. 이벤트 핸들러에서만 필요한 값은 `useStore.getState()`로 읽기
  ```tsx
  // ✅ 렌더링에 필요한 값만 구독
  const setField = useStoreFormStore((s) => s.setField);
  // 이벤트 핸들러에서 최신 값 읽기
  const handleSave = () => {
    const form = useStoreFormStore.getState();
    await save(form.storeName, form.ceoName);
  };

  // ❌ 전체 구독 (어떤 필드든 변경 시 리렌더링)
  const form = useStoreFormStore();
  ```

## 10. non-null assertion(`!`) 금지

- **금지**: `value!` non-null assertion 연산자 사용
- **필수**: 명시적 null/undefined 가드 또는 early return으로 대체
  ```ts
  // ❌ 금지
  return officeId!

  // ✅ 대체
  if (!officeId) throw new Error('officeId가 없습니다.')
  return officeId
  ```
- **이유**: 런타임 null 역참조 크래시를 TypeScript 타입 검사가 막지 못함

## 11. 복구 불가 실패의 명시적 처리

- **기준 질문**: "이 catch가 조용히 삼켜지면, 사용자는 잘못된 상태로 계속 진행하는가?" → YES이면 silent swallow 금지
- **`console.error`만으로 부족한 경우**: 해당 실패가 사용자 세션·데이터 정합성에 영향을 주면 반드시 Alert로 사용자에게 알리거나, 안전한 폴백 동작을 명시할 것
- **예시**: 로그인 후 franchiseId 조회 실패 → 사용자에게 재시도 안내 + 인증 초기화
- **이유**: `console.error`는 개발자만 보는 로그. 사용자에게 영향을 주는 실패는 UI에 반영해야 함

## 12. 브라우저 리소스 생명주기 관리

- **동적 스크립트 로드**: `script.onerror` 핸들러 필수. 실패 시 사용자에게 에러 메시지 표시. 프로토콜 상대경로(`//`) 대신 `https://` 명시
  ```ts
  script.src = "https://example.com/sdk.js";
  script.onerror = () => {
    console.error('[컴포넌트명] 외부 스크립트 로드 실패:', script.src);
    // Alert 또는 UI 에러 상태로 처리
  };
  ```
- **`URL.createObjectURL`**: `useMemo` 내부에서 생성 가능하나, 반드시 `useEffect` cleanup에서 `URL.revokeObjectURL`로 해제. 렌더 중 `useRef`에 직접 쓰기는 React Compiler `react-hooks/refs` 규칙 위반이므로 금지
- **파일 입력 검증 필수**: `<input type="file">` onChange 핸들러에서 파일 크기(예: 10MB 초과 거부)·MIME 타입 검증 후 store에 추가. `accept` 속성은 브라우저 힌트일 뿐 강제가 아님

## 13. Zustand 폼 스토어 배치 업데이트 및 초기값 안전성

- **개별 setField 반복 금지**: 동일 useEffect 안에서 `setField`를 5회 이상 개별 호출하면 그만큼 리렌더링이 발생함. 스토어에 `setFields(partial)` 배치 액션을 제공하고 1회 호출로 통합
  ```tsx
  // ❌ 금지 (12회 호출 → 최대 12회 리렌더)
  setField("storeName", ...);
  setField("ceoName", ...);
  // ... 10회 더

  // ✅ 권장
  setFields({ storeName: ..., ceoName: ..., ... });
  ```
- **폼 기본값의 "놀라움 없음" 원칙**: boolean 기본값이 실제 저장 동작을 유발하는 경우(예: `isOperating: true`) `false` 또는 명시적 null로 설정하고, 서버 데이터 로드 후에만 true가 되도록 제한
- **서버 데이터 없이 저장 비활성화**: `useQuery`의 `data`가 undefined인 동안 저장 버튼을 disabled 처리하거나, 로딩/에러 UI를 먼저 표시

# Development Guidelines

## 새 기능 추가 순서

1. `src/types/`에 타입 정의
2. `src/lib/api/`에 API 함수 추가
3. `src/hooks/queries/`에 React Query 훅 추가
4. 컴포넌트 생성
5. `src/app/(sub)/`에 라우트 추가

## React Compiler 규칙

이 프로젝트는 `next.config.ts`에서 `reactCompiler: true`로 React Compiler를 활성화하고 있다.

- **`react-hooks/set-state-in-effect`**: useEffect 안에서 setState 호출 금지. 파생 값으로 직접 계산하거나 `key` prop으로 리마운트 제어
- **`react-hooks/set-state-in-render`**: 렌더링 중 setState 호출 금지
- `eslint-disable`로 무시하지 말 것. `pnpm lint`로 검출되며 규칙에 맞게 코드 수정

## Code Quality

- 커밋 전 `pnpm lint` 실행
- TypeScript strict mode 준수
- `any` 타입 사용 금지
- `unknown` 타입 사용 금지 — 구체적인 타입 또는 제네릭으로 대체
