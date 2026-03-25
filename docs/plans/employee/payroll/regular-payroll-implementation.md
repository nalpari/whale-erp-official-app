# 정직원 급여명세서 구현 계획

## 현재 상태

퍼블리싱(정적 HTML)만 완성. API 연동, 타입 정의, 상태 관리 없음.

### 기존 파일 (퍼블리싱)
| 파일 | 상태 | 역할 |
|------|------|------|
| `app/(sub)/fulltimer/page.tsx` | 완료 (래퍼) | 목록 페이지 |
| `app/(sub)/fulltimer/[id]/page.tsx` | 완료 (래퍼) | 상세/수정 페이지 |
| `components/fulltimer/FullTimerPayList.tsx` | 하드코딩 | 목록 UI |
| `components/fulltimer/FullTimerPayDetail.tsx` | 하드코딩 | 상세/등록/수정 UI |
| `components/bottomsheet/FullTimerSearchSheet.tsx` | 하드코딩 | 검색 바텀시트 |
| `components/bottomsheet/PaymentConditionSheet.tsx` | 하드코딩 | 지급/공제 항목 바텀시트 |

### 사용하는 API (whale-erp-api)
| 메소드 | 엔드포인트 | 설명 |
|-------|----------|------|
| GET | `/api/employee/payroll/regular` | 목록 조회 (페이지네이션) |
| GET | `/api/employee/payroll/regular/{id}` | 상세 조회 |
| POST | `/api/employee/payroll/regular` | 신규 등록 (FormData) |
| PUT | `/api/employee/payroll/regular/{id}` | 수정 |
| DELETE | `/api/employee/payroll/regular/{id}` | 삭제 |
| POST | `/api/employee/payroll/regular/{id}/email` | 이메일 전송 |
| GET | `/api/employee/payroll/regular/latest/{employeeInfoId}` | 이전 급여 조회 |

---

## 구현 계획

### Phase 1: 타입 정의 + API 함수

**생성 파일:**

#### 1-1. `src/types/payroll.ts` — 타입 정의
```typescript
// 급여명세서 목록 조회 응답
interface PayrollStatementListItem {
  id: number
  employeeInfoId: number
  employeeName: string
  employeeClassification: string  // 직원 분류명
  workStatus: string              // 근무/휴직/퇴사
  payrollYearMonth: string        // 'YYYYMM'
  paymentDate: string             // '2025-01-10'
  totalPaymentAmount: number
  totalDeductionAmount: number
  actualPaymentAmount: number
  isEmailSend: boolean
  headOfficeName: string
  franchiseName?: string
  storeName?: string
  createdAt: string
  // avatar 관련 (API에서 제공하는지 확인 필요)
}

// 급여명세서 상세 조회 응답
interface PayrollStatementDetail {
  id: number
  employmentContractId: number
  employeeInfoId: number
  employeeName: string
  employeeNumber: string
  payrollYearMonth: string
  settlementStartDate: string
  settlementEndDate: string
  paymentDate: string
  totalPaymentAmount: number
  totalDeductionAmount: number
  actualPaymentAmount: number
  attachmentFileId?: number
  remarks?: string
  isEmailSend: boolean
  paymentItems: PaymentItem[]
  deductionItems: DeductionItem[]
  bonuses: BonusItem[]
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}

// 지급 항목
interface PaymentItem {
  id?: number
  itemCode: string    // BASIC, BONUS, MEAL, VEHICLE, CHILD_CARE, OVERTIME, NIGHT, MONTHLY_HOLIDAY, ANNUAL_LEAVE, ADD
  itemOrder: number
  amount: number
  remarks?: string
}

// 공제 항목
interface DeductionItem {
  id?: number
  itemCode: string    // NATIONAL_PENSION, HEALTH_INSURANCE, EMPLOYMENT_INSURANCE, etc.
  itemOrder: number
  amount: number
  remarks?: string
}

// 상여금
interface BonusItem {
  id?: number
  bonusCode?: string
  bonusType: string
  amount: number
  memo?: string
}

// 검색 파라미터
interface PayrollSearchParams {
  headOfficeId?: number
  franchiseId?: number
  storeId?: number
  workStatus?: string
  employeeName?: string
  employeeClassification?: string
  startDate?: string
  endDate?: string
  page: number
  size: number
}

// 등록/수정 요청
interface PayrollStatementRequest {
  employmentContractId: number
  payrollYearMonth: string
  settlementStartDate: string
  settlementEndDate: string
  paymentDate: string
  paymentItems: PaymentItem[]
  deductionItems: DeductionItem[]
  remarks?: string
  attachmentFile?: File
}
```

#### 1-2. `src/lib/api/payroll.ts` — API 함수
```typescript
// 목록 조회
getPayrollStatements(params: PayrollSearchParams): Promise<PaginatedResponse<PayrollStatementListItem>>

// 상세 조회
getPayrollStatement(id: number): Promise<PayrollStatementDetail>

// 신규 등록 (FormData)
createPayrollStatement(data: FormData): Promise<PayrollStatementDetail>

// 수정
updatePayrollStatement(id: number, data: PayrollStatementRequest): Promise<PayrollStatementDetail>

// 삭제
deletePayrollStatement(id: number): Promise<void>

// 이메일 전송
sendPayrollEmail(id: number): Promise<void>

// 이전 급여 조회
getLatestPayroll(employeeInfoId: number): Promise<PayrollStatementDetail>
```

---

### Phase 2: React Query 훅 + Zustand 스토어

**생성 파일:**

#### 2-1. `src/hooks/queries/use-payroll-queries.ts` — TanStack Query 훅
```typescript
// Query Keys
const payrollKeys = {
  all: ['payroll'] as const,
  lists: () => [...payrollKeys.all, 'list'] as const,
  list: (params: PayrollSearchParams) => [...payrollKeys.lists(), params] as const,
  details: () => [...payrollKeys.all, 'detail'] as const,
  detail: (id: number) => [...payrollKeys.details(), id] as const,
  latest: (employeeInfoId: number) => [...payrollKeys.all, 'latest', employeeInfoId] as const,
}

// Hooks
usePayrollList(params)        — 목록 조회 (enabled: hasSearched)
usePayrollDetail(id)          — 상세 조회
useLatestPayroll(employeeId)  — 이전 급여 조회
useCreatePayroll()            — 생성 mutation
useUpdatePayroll()            — 수정 mutation
useDeletePayroll()            — 삭제 mutation
useSendPayrollEmail()         — 이메일 전송 mutation
```

#### 2-2. `src/store/usePayrollSearchStore.ts` — 검색 상태 Zustand 스토어
```typescript
interface PayrollSearchState {
  searchParams: PayrollSearchParams
  hasSearched: boolean
  setSearchParams(params: Partial<PayrollSearchParams>): void
  setPage(page: number): void
  reset(): void
  search(): void   // hasSearched = true + page = 0
}
```

---

### Phase 3: 컴포넌트 API 연동

기존 퍼블리싱 컴포넌트를 수정하여 API 연동. **UI/HTML 구조는 최대한 유지**.

#### 3-1. `FullTimerPayList.tsx` 수정
- 하드코딩 데이터 → `usePayrollList()` 훅 연동
- 검색결과 건수 동적 표시
- 직원 카드 목록을 `payrollList.map()`으로 렌더링
- 이메일 전송 버튼 → `useSendPayrollEmail()` 연동
- 이메일 상태 뱃지 (`isEmailSend` 분기)
- 등록 버튼 → `/fulltimer/new` 라우팅 (현재 `/fulltimer/1`로 하드코딩됨)
- 무한스크롤 또는 페이지네이션 추가

#### 3-2. `FullTimerPayDetail.tsx` 수정
- URL 파라미터에서 `id` 추출 → `usePayrollDetail(id)` 연동
- 신규 등록 모드 (`/fulltimer/new`) vs 수정 모드 (`/fulltimer/[id]`) 분기
- 소속 선택 (본사/가맹점) → API 연동 (조직 조회 필요)
- 직원 선택 → 직원 목록 API 연동
- "이전 계약정보 불러오기" → `useLatestPayroll()` 연동
- 급여 지급월/정산기간/지급일 폼 상태 관리
- 파일 첨부 → FormData 기반 업로드
- 저장 → `useCreatePayroll()` / `useUpdatePayroll()`
- 삭제 기능 추가
- 이메일 전송 → `useSendPayrollEmail()`

#### 3-3. `FullTimerSearchSheet.tsx` 수정
- 근무여부 버튼 → state 연동 (active 토글)
- 직원명 input → controlled input
- 직원 분류 select → 공통코드 API 연동
- 급여일 범위 → date picker 연동
- 검색 버튼 → `payrollSearchStore.search()` 호출
- 초기화 버튼 → `payrollSearchStore.reset()` 호출

#### 3-4. `PaymentConditionSheet.tsx` 수정
- 지급항목 / 공제항목 → `paymentItems[]`, `deductionItems[]` state 연동
- 각 input → controlled (금액 입력, 숫자 포맷팅)
- 공제항목 동적 추가 (select → 항목 선택 → 금액 입력)
- 지급총액 / 공제총액 / 실지급액 자동 계산
- 저장 버튼 → 부모 컴포넌트에 콜백으로 전달

---

### Phase 4: 신규 등록 라우트 추가

**생성 파일:**

#### 4-1. `app/(sub)/fulltimer/new/page.tsx`
```typescript
// 신규 등록 전용 페이지
// FullTimerPayDetail을 isNew=true 모드로 렌더링
```

---

## 파일 생성/수정 요약

| 구분 | 파일 경로 | 작업 |
|------|---------|------|
| 생성 | `src/types/payroll.ts` | 타입 정의 |
| 생성 | `src/lib/api/payroll.ts` | API 함수 |
| 생성 | `src/hooks/queries/use-payroll-queries.ts` | React Query 훅 |
| 생성 | `src/store/usePayrollSearchStore.ts` | 검색 상태 스토어 |
| 생성 | `src/app/(sub)/fulltimer/new/page.tsx` | 신규 등록 페이지 |
| 수정 | `src/components/fulltimer/FullTimerPayList.tsx` | API 연동 |
| 수정 | `src/components/fulltimer/FullTimerPayDetail.tsx` | API 연동 |
| 수정 | `src/components/bottomsheet/FullTimerSearchSheet.tsx` | API 연동 |
| 수정 | `src/components/bottomsheet/PaymentConditionSheet.tsx` | API 연동 |

## 구현 순서

```
Phase 1 → Phase 2 → Phase 3 → Phase 4
타입+API    훅+스토어   컴포넌트연동   신규등록라우트
```

각 Phase 완료 후 `pnpm lint` + `pnpm build` 체크.

## 의존성 확인 사항

- [ ] whale-erp-api의 급여명세서 API 응답 형식 실제 확인 (Swagger/테스트)
- [ ] 조직(본사/가맹점/점포) 조회 API가 official-app에서 이미 구현되어 있는지 확인
- [ ] 직원 목록 조회 API 연동 상태 확인
- [ ] 공통코드(직원 분류) API 연동 상태 확인
- [ ] 파일 업로드/다운로드 (S3 presigned URL) 방식 확인

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
