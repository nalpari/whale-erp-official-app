# 정직원 급여명세서 구현 계획

## 구현 진행 상황

| Phase | 내용 | 상태 | 커밋 |
|-------|------|------|------|
| Phase 1 | 타입 정의 + API 함수 | ✅ 완료 | `b127165` |
| Phase 2 | React Query 훅 + Zustand 스토어 | ✅ 완료 | `b127165` |
| Phase 3 | 컴포넌트 API 연동 | ✅ 완료 | `b127165` |
| Phase 4 | 신규 등록 라우트 + 빌드 체크 | ✅ 완료 | `b127165` |
| 추가 | 검색 API undefined 파라미터 수정 | ✅ 완료 | `93d5fc6` |
| 추가 | 점포 선택 기능 추가 | ✅ 완료 | `18093a1` |

---

## 생성/수정된 파일 (전체)

| 구분 | 파일 경로 | 역할 |
|------|---------|------|
| 생성 | `src/types/payroll.ts` | 급여명세서 타입, 상수 (지급/공제 항목 코드) |
| 생성 | `src/types/store.ts` | 점포 타입 (StoreOption, StoreListItem) |
| 생성 | `src/lib/api/payroll.ts` | 급여명세서 API (CRUD, 이메일, cleanParams) |
| 생성 | `src/lib/api/store.ts` | 점포 API (GET /api/v1/stores/options) |
| 생성 | `src/hooks/queries/use-payroll-queries.ts` | React Query 훅 7개 |
| 생성 | `src/hooks/queries/use-store-queries.ts` | 점포 옵션 조회 훅 |
| 생성 | `src/store/usePayrollSearchStore.ts` | 검색 상태 Zustand 스토어 |
| 생성 | `src/app/(sub)/fulltimer/new/page.tsx` | 신규 등록 라우트 |
| 수정 | `src/app/(sub)/fulltimer/[id]/page.tsx` | 상세 페이지 (key 패턴으로 리팩토링) |
| 수정 | `src/components/fulltimer/FullTimerPayList.tsx` | 목록 API 연동 |
| 수정 | `src/components/fulltimer/FullTimerPayDetail.tsx` | 상세/등록/수정 API 연동 |
| 수정 | `src/components/bottomsheet/FullTimerSearchSheet.tsx` | 검색 + 점포 선택 연동 |
| 수정 | `src/components/bottomsheet/PaymentConditionSheet.tsx` | 지급/공제 항목 동적 연동 |
| 수정 | `src/components/ui/BottomSheetControler.tsx` | PaymentConditionSheet 분리 |

---

## 사용하는 API

| 메소드 | 엔드포인트 | 설명 | 연동 상태 |
|-------|----------|------|----------|
| GET | `/api/employee/payroll/regular` | 목록 조회 | ✅ 연동 |
| GET | `/api/employee/payroll/regular/{id}` | 상세 조회 | ✅ 연동 |
| POST | `/api/employee/payroll/regular` | 신규 등록 (FormData) | ✅ 연동 |
| PUT | `/api/employee/payroll/regular/{id}` | 수정 | ✅ 연동 |
| DELETE | `/api/employee/payroll/regular/{id}` | 삭제 | ✅ 연동 |
| POST | `/api/employee/payroll/regular/{id}/email` | 이메일 전송 | ✅ 연동 |
| GET | `/api/employee/payroll/regular/latest/{employeeInfoId}` | 이전 급여 조회 | ✅ 훅 준비 (UI 미연결) |
| GET | `/api/v1/stores/options` | 점포 드롭다운 조회 | ✅ 연동 |

---

## 아키텍처 결정 사항

### React 19 + React Compiler 대응
- `useEffect` 내 `setState` 금지 → **key 패턴** 사용
  - `[id]/page.tsx`에서 `usePayrollDetail()` 조회 후 `<FullTimerPayDetail key={detail?.id} initialData={detail} />`로 전달
  - 컴포넌트 리마운트 시 `useState(initialData?.xxx)` 로 자연스럽게 초기화
- `useRef.current` 렌더 중 접근 금지 → `useState`로 이전 상태 추적

### PaymentConditionSheet 분리
- 기존: `BottomSheetControler`에서 글로벌 렌더링 (props 전달 불가)
- 변경: `FullTimerPayDetail` 내부에서 직접 렌더링 (paymentItems/deductionItems props 전달)

### API 파라미터 정리
- `cleanParams()` 유틸: undefined/null/빈 문자열 필터링
- API 서버가 null을 long으로 변환 실패하는 문제 방지

---

## 미완료 항목 (추가 작업 필요)

| 항목 | 설명 | 우선순위 |
|------|------|---------|
| 소속 선택 (본사/가맹점) | 상세 페이지의 본사/가맹점 라디오 + 조직 조회 API 연동 | 높음 |
| 직원 선택 | 상세 페이지의 직원 드롭다운 + 직원 목록 API 연동 | 높음 |
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
