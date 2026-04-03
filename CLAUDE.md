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

아래 항목은 `필수`와 `권장`으로 구분한다.

- **필수**: 팀 공통 가드레일로 예외 없이 지켜야 하는 규칙
- **권장**: 기본 패턴으로 따르되, 더 단순하고 명확한 대안이 있으면 예외 허용

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
- **에러·로딩 분기 분리**: `isError`와 `isLoading`을 같은 조건문 안에서 혼합 처리 금지. 에러는 별도 분기로 먼저 체크하고, 로딩과 시각적으로 구분할 것 (에러 색상 ≠ 로딩 색상)
  ```tsx
  // ❌ 혼합 분기
  if (isLoading || !data) {
    return <div>{isError ? "에러" : "로딩 중..."}</div>
  }

  // ✅ 별도 분기
  if (isError) {
    return <div style={{ color: "#e74c3c" }}>불러올 수 없습니다.</div>
  }
  if (isLoading || !data) {
    return <div>불러오는 중...</div>
  }
  ```

## 3. 에러 처리: 빈 catch 블록 금지

- **금지**: `catch { }`, `catch { /* noop */ }`, `catch { // 주석 }` — 어떤 형태든 err 바인딩 없는 catch 금지
- **필수**: 최소 `console.error('[컴포넌트명] 동작 실패:', err)` 로깅. 유틸 함수(localStorage 래퍼 등)도 예외 없이 최소 `console.warn` 필수
- **권장**: mutation은 사용자 피드백이 필요한 흐름에서 `mutateAsync` + `try/catch`를 우선 사용한다. 단순 토글/낙관적 업데이트처럼 `onSuccess`/`onError`만으로 충분한 경우 `mutate()` 사용 가능
- **권장**: `onError` 콜백에도 `console.error` 로깅을 남긴다
- **Promise 체인**: `.then()` 사용 시 반드시 `.catch()` 추가
- **필수**: Alert, Popup, BottomSheet, store callback처럼 컴포넌트 경계를 넘는 외부 제공 콜백은 `try/catch`로 감싸서 에러 전파를 막는다. 닫기 타이밍은 용도에 따라 구분:
  - **결과 확인형** (Alert onConfirm — 저장/삭제 등 비동기 작업): `await` + `try/catch`, 성공 시에만 닫기. 실패 시 팝업 유지하여 사용자가 재시도 가능
  - **UI 입력형** (바텀시트 onSelect — 시간 선택, 검색 등): `try/catch/finally`, finally에서 항상 닫기. 시트가 고착되면 앱이 멈춘 것으로 인식됨
  ```tsx
  // ✅ 결과 확인형 (Alert)
  try {
    await onConfirm?.();
    closeAlert();
  } catch (err) {
    console.error('[Alert] 실패:', err);
    // 팝업 유지 — 사용자가 재시도 가능
  }

  // ✅ UI 입력형 (바텀시트)
  try {
    onTimeSelect?.(time);
  } catch (err) {
    console.error('[TimePickerSheet] 실패:', err);
  } finally {
    handleClose(); // 항상 닫기
  }
  ```

## 4. 타입 안전성

- **권장**: 상호 배타적 필드 조합은 discriminated union으로 제약 (예: `hasPeriod: true → endDate 필수`, `hasPeriod: false → endDate?: never`)
- **이중 부재 표현 금지**: `headOfficeId?: number | null`처럼 optional + null을 동시에 사용하지 않음. optional(`?:`)이면 `number`만, required면 `number | null`만 사용
- **권장**: 미사용 타입/인터페이스는 주기적으로 정리한다
- **권장**: deprecated API는 새 코드에서 사용하지 말고, 호출부 마이그레이션이 끝나면 제거한다
- **필수**: 다른 파일에서 사용될 수 있는 타입은 `export` 선언 (예: `AlertOptions`)

## 5. 상태 관리: stale 값 주의

- **금지**: `useMemo(() => new Date(), [])` 등 시간 기반 값의 빈 의존성 메모이제이션
- **금지**: 모듈 레벨에서 `new Date()` 호출하여 상수로 사용 (예: `const defaultTo = new Date().toISOString()`)
- **필수**: 날짜/시간 기반 값은 함수로 감싸서 호출 시점에 생성 (`function getDefaultTo() { return new Date().toISOString().slice(0, 10) }`)
- **이유**: 자정 이후 stale 값으로 비교/표시 오류 발생
- **권장**: 비용이 작고 단순한 파생 값은 불필요한 메모이제이션보다 직접 계산을 우선한다

## 6. 매직넘버/매직스트링 금지

- **필수**: 의미 설명이 필요한 값이나 반복 사용되는 도메인 값은 상수(`const SWIPE_THRESHOLD = 50`)로 선언
- **권장**: 여러 파일에서 같은 값이 3곳 이상 반복되면 공통 상수/유틸 추출을 검토한다
- **권장**: 아주 짧은 UI 문자열이나 1회성 리터럴까지 기계적으로 상수화하지 않는다

## 7. pathname 하드코딩 최소화

- **권장**: 전역 UI 상태(헤더 버튼, 레이아웃 표시/숨김 등)는 pathname 분기보다 store 플래그로 제어
- **허용**: 단순 페이지 조건 분기나 1~2곳의 국소적인 라우트 체크는 `usePathname()` 등 직접 사용 가능
- **권장**: 페이지 제목 매핑은 `getPageTitle()`처럼 한 곳에 모으고, 조건이 커지면 store 기반 패턴으로 전환

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
- **권장**: useCallback이 헤더 버튼 연동(`setOnSave`) 등 다른 Hook의 의존성으로 연결될 때는 재생성 비용을 특히 주의한다

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
- **에러 UI에 행동 경로 제공**: 에러 메시지만 표시하고 끝내지 않을 것. 사용자가 다음에 무엇을 할 수 있는지 안내 (뒤로가기 버튼, 재시도 버튼, 또는 자동 리다이렉트 등)

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

- **권장**: 동일 `useEffect` 안에서 `setField`를 여러 번 반복해야 하면 `setFields(partial)` 같은 배치 액션으로 묶는 쪽을 우선 검토한다
  ```tsx
  // ❌ 비권장 (12회 호출 → 최대 12회 리렌더)
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
