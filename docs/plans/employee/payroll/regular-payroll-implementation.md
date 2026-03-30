# 정직원 급여명세서 구현 계획

## 구현 진행 상황

| Phase | 내용 | 상태 | 커밋 |
|-------|------|------|------|
| Phase 1 | 타입 정의 + API 함수 | ✅ 완료 | `b127165` |
| Phase 2 | React Query 훅 + Zustand 스토어 | ✅ 완료 | `b127165` |
| Phase 3 | 컴포넌트 API 연동 | ✅ 완료 | `b127165` |
| Phase 4 | 신규 등록 라우트 + 빌드 체크 | ✅ 완료 | `b127165` |
| 추가 | 검색 API undefined 파라미터 수정 | ✅ 완료 | `93d5fc6` |
| 추가 | 점포 선택 → 글로벌 헤더로 이동 | ✅ 완료 | `c1e56aa` |
| 추가 | 2단계 점포 선택 (본사→점포) | ✅ 완료 | `1191691` |
| 추가 | 검색 파라미터 API DTO 필드명 일치 | ✅ 완료 | `1191691` |
| 추가 | AuthGuard hydration 불일치 해결 | ✅ 완료 | `1689ef8` |
| 추가 | FullTimerPayList hydration 해결 | ✅ 완료 | `5f1edb4` |
| 추가 | 로그인 응답에 headOfficeId 추가 (API) | ✅ 완료 | `865bb8f8` (api) |
| 추가 | 로그인 시 headOfficeId 저장 (프론트) | ✅ 완료 | `a1bc3bf` |
| 추가 | 본사 ID auth→storeStore fallback | ✅ 완료 | `1a529cd` |
| 추가 | 점포 선택 유지 + 초기화 시 시트 유지 | ✅ 완료 | `4a9b5fc` |
| 리뷰 | 코드 리뷰 1차 이슈 8건 수정 | ✅ 완료 | `a5bac39` |
| 리뷰 | 렌더 중 router.replace → useEffect 이동 | ✅ 완료 | `dbc341d` |
| 리뷰 | FormData Content-Type 수동 설정 제거 | ✅ 완료 | `f9b37c7` |
| 리뷰 | 로그인 headOfficeId를 authorityId로 매칭 | ✅ 완료 | `2be9e97` |
| 리뷰 | StoreSelectSheet onOpenStart 동기화 | ✅ 완료 | `8c97982` |
| 리뷰 | API 에러 상태 표시 (본사/점포) | ✅ 완료 | `6ebcf94` |
| 리뷰 | 미사용 타입 제거, replace 정규식, 0원 항목 유지 | ✅ 완료 | `113133f`~`1613951` |
| 리뷰 | headOfficeId 미선택을 0 → null/undefined | ✅ 완료 | `a56d17f` |
| 리뷰 | FullTimerSearchSheet onOpenStart 동기화 | ✅ 완료 | `95adf2f` |
| 리뷰 | WorkStatus 공통 타입 정의 | ✅ 완료 | `3577c2c` |
| 리뷰 | cleanParams 주석 정확화 | ✅ 완료 | `290e662` |
| 추가 | 상여금(bonuses) 매핑 누락 수정 | ✅ 완료 | - |
| 추가 | 지급 항목 상세 표시 형식 변경 (산출 근거 표시) | ✅ 완료 | - |
| 수정 | 신규 등록 API employeeInfoId 누락 수정 | ✅ 완료 | - |
| 추가 | Header btn-delete에 삭제 연결 (useHeaderStore) | ✅ 완료 | - |
| 추가 | 조회 모드 본사/가맹점/점포 표시 연결 | 🔧 진행중 | - |
| 수정 | bonuses를 지급 항목 추가(paymentItems)로 통합 | ✅ 완료 | - |
| 수정 | 지급 항목 추가 데이터 소스를 bonusCategories API → salaryInfo.bonuses로 변경 | ✅ 완료 | - |
| 수정 | 기본항목 판별에 DPTBS/DDTBS 공통코드 동적 조회 추가 | ✅ 완료 | - |
| 수정 | 수정 모드 저장 시 employmentContractId 체크 제거 | ✅ 완료 | - |
| 수정 | 수정 완료 후 목록 화면으로 이동 | ✅ 완료 | - |
| 수정 | 등록/수정 이력 createdBy → createdByName 필드명 일치 | ✅ 완료 | - |
| 수정 | PaymentConditionSheet 초기화 버튼을 원래 값으로 리셋 | ✅ 완료 | - |

---

## 생성/수정된 파일 (전체)

| 구분 | 파일 경로 | 역할 |
|------|---------|------|
| 생성 | `src/types/payroll.ts` | 급여명세서 타입, 상수 (지급/공제 항목 코드) |
| 생성 | `src/types/store.ts` | 점포/본사 타입 (StoreOption, HeadOffice) |
| 생성 | `src/lib/api/payroll.ts` | 급여명세서 API (CRUD, 이메일, cleanParams) |
| 생성 | `src/lib/api/store.ts` | 본사 목록 + 점포 드롭다운 API |
| 생성 | `src/hooks/queries/use-payroll-queries.ts` | 급여 React Query 훅 7개 |
| 생성 | `src/hooks/queries/use-store-queries.ts` | 본사 목록 + 점포 옵션 훅 |
| 생성 | `src/hooks/use-mounted.ts` | hydration 안전 훅 (useSyncExternalStore) |
| 생성 | `src/store/usePayrollSearchStore.ts` | 검색 상태 Zustand 스토어 |
| 생성 | `src/store/useStoreStore.ts` | 점포/본사 선택 글로벌 스토어 (persist) |
| 생성 | `src/app/(sub)/fulltimer/new/page.tsx` | 신규 등록 라우트 |
| 수정 | `src/app/(sub)/fulltimer/[id]/page.tsx` | 상세 페이지 (key 패턴) |
| 수정 | `src/components/fulltimer/FullTimerPayList.tsx` | 목록 API 연동 + hydration 대응 |
| 수정 | `src/components/fulltimer/FullTimerPayDetail.tsx` | 상세/등록/수정 API 연동 |
| 수정 | `src/components/bottomsheet/FullTimerSearchSheet.tsx` | 검색 바텀시트 연동 |
| 수정 | `src/components/bottomsheet/PaymentConditionSheet.tsx` | 지급/공제 항목 동적 연동 |
| 수정 | `src/components/bottomsheet/StoreSelectSheet.tsx` | 2단계 본사→점포 선택 |
| 수정 | `src/components/ui/StoreSelect.tsx` | 선택된 점포명 표시 + hydration 대응 |
| 수정 | `src/components/ui/BottomSheetControler.tsx` | PaymentConditionSheet 분리 |
| 수정 | `src/components/auth/AuthGuard.tsx` | hydration 불일치 해결 |
| 수정 | `src/store/useAuthStore.ts` | headOfficeId 상태 추가 |
| 수정 | `src/types/auth.ts` | LoginResponse에 headOfficeId 타입 추가 |
| 수정 | `src/components/login/Login.tsx` | 로그인 시 headOfficeId 저장 |
| 생성 | `src/hooks/queries/use-common-code-queries.ts` | 공통코드 계층 조회 훅 |
| 생성 | `src/hooks/queries/use-employee-queries.ts` | 직원 목록 조회 훅 |
| 생성 | `src/hooks/queries/use-contract-queries.ts` | 고용계약 조회 훅 |
| 생성 | `src/lib/api/common-code.ts` | 공통코드 API |
| 생성 | `src/lib/api/employee.ts` | 직원 API |
| 생성 | `src/lib/api/overtime.ts` | 초과근무수당 API |
| 생성 | `src/lib/api/contract.ts` | 고용계약 API |
| 생성 | `src/store/useHeaderStore.ts` | 헤더 삭제 버튼 핸들러 스토어 |
| 생성 | `src/types/common-code.ts` | 공통코드 타입 |
| 생성 | `src/types/employee.ts` | 직원 타입 |
| 생성 | `src/types/contract.ts` | 고용계약 타입 |
| 수정 | `src/components/ui/Header.tsx` | 삭제 버튼 useHeaderStore 연동 |
| 수정 | `src/types/payroll.ts` | createdByName/updatedByName 필드명 수정 |

### whale-erp-api 수정

| 구분 | 파일 경로 | 역할 |
|------|---------|------|
| 수정 | `domain/auth/dto/LoginResponse.kt` | CompanyInfo에 headOfficeId 추가 |
| 수정 | `domain/auth/service/AuthService.kt` | toCompanyInfo에서 본사 ID 결정 로직 |

---

## 사용하는 API

| 메소드 | 엔드포인트 | 설명 | 연동 상태 |
|-------|----------|------|----------|
| GET | `/api/employee/payroll/regular` | 목록 조회 (headOfficeId 필수) | ✅ 연동 |
| GET | `/api/employee/payroll/regular/{id}` | 상세 조회 | ✅ 연동 |
| POST | `/api/employee/payroll/regular` | 신규 등록 (FormData) | ✅ 연동 |
| PUT | `/api/employee/payroll/regular/{id}` | 수정 | ✅ 연동 |
| DELETE | `/api/employee/payroll/regular/{id}` | 삭제 | ✅ 연동 |
| POST | `/api/employee/payroll/regular/{id}/email` | 이메일 전송 | ✅ 연동 |
| GET | `/api/employee/payroll/regular/latest/{employeeInfoId}` | 이전 급여 조회 | ✅ 훅 준비 (UI 미연결) |
| GET | `/api/master/bp/head-offices` | 운영중인 본사 목록 | ✅ 연동 |
| GET | `/api/v1/stores/options` | 점포 드롭다운 조회 (officeId 기반) | ✅ 연동 |

---

## 아키텍처 결정 사항

### React 19 + React Compiler 대응
- `useEffect` 내 `setState` 금지 → **key 패턴** 사용
  - `[id]/page.tsx`에서 `usePayrollDetail()` 조회 후 `<FullTimerPayDetail key={detail?.id} initialData={detail} />`로 전달
- `useRef.current` 렌더 중 접근 금지 → `useState`로 이전 상태 추적

### Hydration 불일치 해결 (핵심)
- **원인**: Zustand `persist`가 localStorage에서 값 복원 → 서버(null) vs 클라이언트(복원값) 불일치
- **해결**: `useMounted()` 공통 훅 (`useSyncExternalStore` 기반)
  - 서버에서는 `false`, 클라이언트 마운트 후 `true`
  - persist 스토어 값은 `mounted` 후에만 렌더링에 사용
- **AuthGuard 수정**: 서버에서 `return null` → `return children`으로 변경
  - 서버/클라이언트 HTML 구조 일치 보장

### 본사/점포 선택 구조
- **본사 ID 우선순위**: `authStore.headOfficeId` → `storeStore.selectedHeadOffice.id`
- **StoreSelectSheet**: authHeadOfficeId 있으면 본사 select disabled(readonly)
- **점포 선택**: 본사 ID 기반으로 `GET /api/v1/stores/options?officeId=` 호출
- **상태 저장**: `useStoreStore` (persist) — `setSelection(office, store)`으로 한번에 설정

### PaymentConditionSheet 분리
- `BottomSheetControler`에서 제거, `FullTimerPayDetail` 내부에서 직접 렌더링 (props 전달)

### 바텀시트 상태 동기화 패턴
- 모든 바텀시트에 `onOpenStart` 콜백 적용 (PaymentConditionSheet, StoreSelectSheet, FullTimerSearchSheet)
- 시트 열릴 때 글로벌 스토어 값으로 로컬 상태 리셋

### API 파라미터
- `cleanParams()`: undefined/null/빈 문자열 필터링
- 검색 파라미터 API DTO 필드명 일치: `memberName`, `paymentStartDate`, `paymentEndDate`, `franchiseStoreId`
- `headOfficeId`: API 필수(Long non-null)이지만 프론트에서는 optional — 미선택 시 params에서 제외
- FormData 전송 시 Content-Type 수동 설정 금지 (Axios 자동 boundary 생성)

### 타입 안전성
- `WorkStatus` 유니온 타입을 `types/payroll.ts`에 공통 정의
- Query 훅에서 `id!` non-null assertion 대신 `id ?? 0` 사용
- 렌더 중 `router.replace()` 금지 → `useEffect`에서 리다이렉트

---

## 미완료 항목 (추가 작업 필요)

| 항목 | 설명 | 우선순위 |
|------|------|---------|
| 소속 선택 (상세 페이지) | 상세 페이지의 본사/가맹점 라디오 + 조직 조회 API 연동 | 높음 |
| 직원 선택 (상세 페이지) | 상세 페이지의 직원 드롭다운 + 직원 목록 API 연동 | 높음 |
| 이전 계약정보 불러오기 | `useLatestPayroll` 훅은 준비됨, UI 버튼 연결 필요 | 중간 |
| 페이지네이션/무한스크롤 | 목록 페이지에 스크롤 기반 페이징 추가 | 중간 |
| 직원 분류 필터 | 검색 시트에 공통코드 기반 직원 분류 select 추가 | 낮음 |
| 파일 업로드/다운로드 확인 | S3 presigned URL 방식 확인 필요 | 낮음 |

---

## 참고: whale-erp-front 패턴과의 차이

| 항목 | whale-erp-front | official-app |
|------|----------------|-------------|
| 목록 UI | ag-grid 테이블 | 카드 리스트 (모바일 최적화) |
| 검색 UI | 인라인 폼 | 바텀시트 |
| 상태관리 | Zustand (search-stores) | Zustand (동일 패턴) |
| 데이터페칭 | TanStack Query | TanStack Query (동일) |
| 스타일링 | Tailwind CSS | SCSS |
| 엑셀 업로드 | 지원 (모달) | 미지원 (모바일 UX 부적합) |
| 엑셀 다운로드 | 지원 | 추후 검토 |
| 상여금 처리 | bonuses 별도 배열 관리 → 저장 시 paymentItems 병합 | salaryInfo.bonuses를 "지급 항목 추가" UI로 수동 선택 |
| 항목 코드 체계 | DPTBS/DDTBS 공통코드 사용 | BASIC/MEAL enum 코드 + DPTBS/DDTBS 공통코드 양쪽 호환 |

---

## 아키텍처 결정 사항 (추가)

### 상여금(bonuses) 처리 (2026-03-27 → 2026-03-30 통합)
- **배경**: whale-erp-front에서는 `salaryInfo.bonuses`를 급여명세서에 반영하지만, official-app에서는 누락
- **1차 해결 (2026-03-27)**: bonuses를 별도 `BonusItem[]` state로 관리, 저장 시 paymentItems에 병합
- **2차 수정 (2026-03-30)**: bonuses가 "지급 항목 추가" UI의 데이터 소스가 되도록 변경
  - **핵심 변경**: `bonusCategories` API 호출 제거 → `salaryInfo.bonuses`가 "지급 항목 추가" 선택 목록으로 대체
  - 직원 선택 시 bonuses 자동 매핑 제거 (사용자가 수동으로 "지급 항목 추가"에서 선택)
  - `PaymentConditionSheet`에 `availableBonuses` props 추가 (`salaryInfo.bonuses` 또는 `initialData.bonuses` 전달)
  - "지급 항목 추가" 버튼 클릭 시 availableBonuses 목록에서 선택 → `PaymentItem`으로 변환하여 추가
  - 이미 추가된 항목은 선택 목록에서 자동 제외
  - `useBonusCategories` 훅/API 호출 제거, `headOfficeId`/`franchiseId` props 제거

### 기본항목 코드 호환 (2026-03-30)
- **배경**: whale-erp-front는 공통코드 `DPTBS_001~008`/`DDTBS_001~006`으로 저장, official-app은 `BASIC`/`MEAL` 등 enum 코드 사용 → 같은 DB 공유로 조회 시 코드 불일치
- **해결**: `useCommonCodeHierarchy('DPTBS')`/`useCommonCodeHierarchy('DDTBS')`로 공통코드를 동적 조회하여 `defaultPaymentCodes`/`defaultDeductionCodes`에 추가
- 하드코딩 없이 양쪽 코드 체계 모두 기본항목으로 인식

### 수정 모드 개선 (2026-03-30)
- 수정 시 `employmentContractId` 검증 제거 (API 상세 응답에 해당 필드 없음)
- 수정 완료 후 목록 화면(`/fulltimer`)으로 이동
- 등록/수정 이력 필드명 `createdBy` → `createdByName` API 응답과 일치
- PaymentConditionSheet 초기화 버튼: 등록 시 salaryInfo 매핑값, 수정 시 API 원본값으로 리셋
