# 초과근무 수당명세서 API 연동 구현 계획

## 개요
- **목표**: official-app(모바일)의 초과근무 수당명세서 화면에 API 연동
- **현재 상태**: 4개 컴포넌트 모두 하드코딩된 퍼블리싱 목업 수준, API 호출 없음
- **참조**: whale-erp-front의 OvertimePayStub.tsx, OvertimeWorkTimeEdit.tsx
- **API 기본 경로**: `/api/v1/employee/payroll/overtime`
- **참고 구현**: 파트타이머 급여명세서 (parttime-payroll-implementation.md)와 동일한 패턴 적용

## 파트타이머와의 주요 차이점

| 구분 | 파트타이머 | 초과근무 |
|------|-----------|----------|
| 급여 기반 | 일별 근무시간 × 시급 | 일별 연장근무시간 × 연장시급 |
| 지급항목 단위 | 날짜별 근무 기록 (workDay) | 날짜별 연장근무 기록 (workDay) |
| 주휴수당 | 있음 (주 15시간 이상) | 없음 |
| 공제 방식 | 3.3% 원천징수 + 4대보험 (별도 deductionItems) | 3.3% (소득세 3% + 지방소득세 0.3%, 항목별 deductionAmount) |
| 시급 구분 | 평일/주말 | 연장/야간/휴일 구분 |
| 엔티티명 | PartTimerPayrollStatement | OvertimeAllowanceStatement |
| 필드명 | payrollYearMonth | allowanceYearMonth |
| 기간 필드 | settlementStartDate/EndDate | calculationStartDate/EndDate |

## API 엔드포인트

| 동작 | 메서드 | URL |
|------|--------|-----|
| 목록 조회 | GET | `/api/v1/employee/payroll/overtime` |
| 상세 조회 | GET | `/api/v1/employee/payroll/overtime/{id}` |
| 등록 | POST | `/api/v1/employee/payroll/overtime` |
| 수정 | PUT | `/api/v1/employee/payroll/overtime/{id}` |
| 삭제 | DELETE | `/api/v1/employee/payroll/overtime/{id}` |
| 이메일 전송 | POST | `/api/v1/employee/payroll/overtime/{id}/send-email` |
| 엑셀 다운로드 | GET | `/api/v1/employee/payroll/overtime/{id}/download-excel` |
| 일별 연장근무 시간 조회 | GET | `/api/v1/employee/payroll/overtime/daily-overtime-hours` |

## 구현 단계

### Phase 1: 타입 정의 + API 레이어

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 1-1 | 초과근무 수당 타입 정의 (Item, Detail, ListItem, SearchParams, Request, DailyOvertimeHours) | `src/types/overtime.ts` (신규) | ✅ |
| 1-2 | 초과근무 수당 API 함수 확장 + 기존 인라인 타입(OvertimeListItem 등) → `types/overtime.ts`로 이관 | `src/lib/api/overtime.ts` (수정) | ✅ |
| 1-3 | React Query 훅 | `src/hooks/queries/use-overtime-queries.ts` (신규) | ✅ |

### Phase 2: 신규/수정 라우트 + 목록 화면

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 2-1 | 신규 등록 페이지 | `overtime/new/page.tsx` (신규) | ✅ |
| 2-2 | 신규 미리보기 페이지 | `overtime/new/stub/page.tsx` (신규) | ✅ |
| 2-3 | 신규 근무시간 편집 페이지 | `overtime/new/time/page.tsx` (신규) | ✅ |
| 2-4 | Header getPageTitle에 overtime 타이틀 추가 | `src/components/ui/Header.tsx` (수정) | ✅ |
| 2-5 | 검색 상태 Zustand 스토어 | `useOvertimeSearchStore.ts` (신규) | ✅ |
| 2-6 | 검색 바텀시트 API 연동 | `OverTimeSearchSheet.tsx` (수정) | ✅ |
| 2-7 | 목록 API 연동 (하드코딩 제거) | `OverTimeList.tsx` | ✅ |
| 2-8 | 본사/가맹점/점포 계단식 선택 연동 | `OverTimeList.tsx` | ✅ |

### Phase 3: 상세 조회/등록/수정 (OverTimeDetail)

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 3-1 | 상세 조회 API 연동 | `OverTimeDetail.tsx` | ✅ |
| 3-2 | 직원 선택 + 계약 정보 로드 | `OverTimeDetail.tsx` | ✅ |
| 3-3 | 지급항목 (일별 연장근무 기록) 표시 | `OverTimeDetail.tsx` | ✅ |
| 3-4 | 공제항목 표시/편집 | `OverTimeDetail.tsx` | ✅ |
| 3-5 | 등록/수정 API 호출 (isNew prop 분기) | `OverTimeDetail.tsx` | ✅ |
| 3-6 | 삭제 API 호출 (Header 삭제 버튼 연동) | `OverTimeDetail.tsx` | ✅ |
| 3-7 | 이메일 전송 / 엑셀 다운로드 | `OverTimeDetail.tsx` | ✅ |
| 3-8 | 저장 전 검증 (필수값, 0원 체크) | `OverTimeDetail.tsx` | ✅ |
| 3-9 | sessionStorage FormDraft/EditDraft 패턴 | `OverTimeDetail.tsx` | ✅ |
| 3-10 | 급여지급월 변경 시 근무내역 초기화 | `OverTimeDetail.tsx` | ✅ |

### Phase 4: 근무시간 편집 (OverTimeWorkEdit)

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 4-1 | 일별 연장근무 시간/시급 입력 UI 연동 | `OverTimeWorkEdit.tsx` | ✅ |
| 4-2 | 공제 자동 계산 (3.3% = 소득세 3% + 지방소득세 0.3%) | `OverTimeWorkEdit.tsx` | ✅ |
| 4-3 | sessionStorage 기반 로컬 저장 (파트타이머 패턴) | `OverTimeWorkEdit.tsx` | ✅ |
| 4-4 | 계약시간적용 버튼 (contractTimelyAmount × 1.5 → applyTimelyAmount) | `OverTimeWorkEdit.tsx` | ✅ |

### Phase 5: 급여명세서 미리보기 (OverTimeStub)

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 5-1 | 상세 API 데이터로 미리보기 렌더링 | `OverTimeStub.tsx` | ✅ |
| 5-2 | 주간소계 계산 | `OverTimeStub.tsx` | ✅ |
| 5-3 | sessionStorage 기반 (신규/수정 모두 현재 폼 데이터 반영) | `[id]/stub/page.tsx` | ✅ |

### Phase 6: 검증 + 코드 리뷰

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 6-1 | `pnpm lint` + `pnpm build` 체크 | - | ✅ |
| 6-2 | 코드 리뷰 반영 | - | ✅ |

## 타입 구조 설계 (Phase 1)

> **참조**: whale-erp-front의 `src/lib/api/overtimeAllowanceStatement.ts` 필드명과 일치시킴

### OvertimeAllowanceItemDto (지급항목 = 일별 연장근무 기록)
```typescript
interface OvertimeAllowanceItemDto {
  id?: number
  workDay: string                    // YYYY-MM-DD (일별 근무일)
  workHour: number                   // 총 근무시간
  breakTimeHour: number              // 휴게시간
  contractTimelyAmount: number       // 계약 시급
  applyTimelyAmount: number          // 적용 시급
  expectedOvertimeHours?: number     // 예상 연장근무시간
  actualOvertimeHours: number        // 실제 연장근무시간
  overtimeStartTime?: string         // 연장근무 시작시간 (HH:mm)
  overtimeEndTime?: string           // 연장근무 종료시간 (HH:mm)
  deductionAmount: number            // 공제액 = actualPaymentAmount × 0.033
  actualPaymentAmount: number        // 지급액 = actualOvertimeHours × applyTimelyAmount
  remarks?: string
}
```

### OvertimeAllowanceDetail (상세 응답)
```typescript
interface OvertimeAllowanceDetail {
  id: number
  memberId: number
  memberName: string
  workStatus?: string
  headOfficeName?: string
  franchiseName?: string
  storeName?: string
  employeeClassification?: string
  employeeClassificationName?: string
  allowanceYearMonth: string
  calculationStartDate: string
  calculationEndDate: string
  totalWorkDays: number
  totalOvertimeHours: number
  grossOvertimeAmount: number
  totalDeductionAmount: number
  totalAmount: number
  actualOvertimeAmount: number
  paymentDate?: string
  remarks?: string
  isEmailSend: boolean
  details: OvertimeAllowanceItemDto[]
  createdAt?: string
  updatedAt?: string
  createdByName?: string
  updatedByName?: string
}
```

### OvertimeAllowanceListItem (목록 항목)
```typescript
interface OvertimeAllowanceListItem {
  id: number
  memberId: number
  memberName: string
  workStatus?: string
  headOfficeName?: string
  franchiseName?: string
  storeName?: string
  employeeClassification?: string
  employeeClassificationName?: string
  workDays?: string                // 근무요일 (예: "월,수,금") — 계약상 근무요일 표시용
  allowanceYearMonth: string
  paymentDate?: string
  isEmailSend: boolean
  createdAt: string
}
```

### OvertimeSearchParams (검색 파라미터)
```typescript
interface OvertimeSearchParams {
  page?: number
  size?: number
  headOfficeId?: number
  franchiseStoreId?: number
  storeId?: number
  workStatus?: string
  memberName?: string
  workDays?: string[]
  contractClassification?: string
  employeeClassification?: string
  allowanceYearMonth?: string
  paymentStartDate?: string
  paymentEndDate?: string
}
```

### PostOvertimeAllowanceRequest (등록 요청)
```typescript
interface PostOvertimeAllowanceRequest {
  employeeInfoId: number
  allowanceYearMonth: string
  calculationStartDate: string
  calculationEndDate: string
  paymentDate?: string
  remarks?: string
  details: Omit<OvertimeAllowanceItemDto, 'id'>[]
}
```

### PutOvertimeAllowanceRequest (수정 요청)
```typescript
// employeeInfoId 제외 (수정 시 직원 변경 불가)
interface PutOvertimeAllowanceRequest {
  allowanceYearMonth: string
  calculationStartDate: string
  calculationEndDate: string
  paymentDate?: string
  remarks?: string
  details: OvertimeAllowanceItemDto[]
}
```

### DailyOvertimeHoursSummaryResponse (일별 연장근무 시간 조회)
```typescript
// 구현 시 discriminated union + 타입 가드로 분리 (CLAUDE.md 규칙 4)
interface DailyOvertimeRecord {
  type: 'DAILY'
  date: string
  dayOfWeek: string
  dayOfWeekKorean: string
  overtimeHours: number
  overtimeStartTime?: string
  overtimeEndTime?: string
  contractTimelyAmount: number
  applyTimelyAmount: number
  paymentAmount: number
  deductionAmount: number
  totalAmount: number
}

interface WeeklyOvertimeSubtotal {
  type: 'WEEKLY_SUBTOTAL'
  weekStartDate: string
  weekEndDate: string
  weekNumber: number
  totalOvertimeHours: number
  totalPaymentAmount: number
  totalDeductionAmount: number
}

type DailyOvertimeHoursItem = DailyOvertimeRecord | WeeklyOvertimeSubtotal

interface DailyOvertimeHoursSummaryResponse {
  employeeInfoId: number
  memberId: number
  memberName: string
  startDate: string
  endDate: string
  applyTimelyAmount: number
  items: DailyOvertimeHoursItem[]
  grandTotalOvertimeHours: number
  grandTotalPaymentAmount: number
  grandTotalDeductionAmount: number
  grandTotalAmount: number
}
```

### Phase 7: 일별 연장근무 시간 자동 조회

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 7-1 | 직원 선택 시 daily-overtime-hours API 호출 → details 자동 채우기 | `OverTimeDetail.tsx` | ✅ 완료 |
| 7-2 | 급여지급월 변경 시 직원 선택 상태면 새 기간으로 재조회 | `OverTimeDetail.tsx` | ✅ 완료 |

## 설계 결정 사항

| 구분 | 결정 |
|------|------|
| 근무시간 편집 데이터 전달 | sessionStorage 경유 (파트타이머와 동일 패턴) |
| 미리보기 데이터 전달 | sessionStorage 우선 → API fallback |
| 저장 방식 (수정 모드) | 로컬 저장 → 메인 폼에서 최종 API 호출 |
| 날짜 파싱 | parseLocalDate() 유틸 사용 (UTC 타임존 이슈 방지) |
| JSON.parse 에러 처리 | 모든 sessionStorage 읽기에 try-catch 적용 |
| 삭제 버튼 | Header setShowDeleteButton(true) + setOnDelete() 패턴 |
| 이메일 전송 | isPending 체크로 중복 클릭 방지 |
| 엑셀 다운로드 | content-type 검증 + try/finally DOM 정리 |
| 공제 계산 방식 | `deductionAmount = actualPaymentAmount × 0.033` (소득세 3% + 지방소득세 0.3%) |
| 계약시급 적용 | `applyTimelyAmount = contractTimelyAmount × 1.5` (연장근무 할증) |
| 신규/수정 분기 | `OverTimeDetail`에 `isNew` prop 전달하여 분기 (파트타이머 패턴) |

## sessionStorage 키 목록

| 키 | 용도 |
|----|------|
| `overtimeStubPreview` | 미리보기 데이터 |
| `overtimeFormDraft` | 신규 폼 상태 복원용 |
| `overtimeEditDraft` | 수정 폼 상태 복원용 (details 포함) |

## 생성/수정 파일 목록

| 구분 | 파일 | 설명 |
|------|------|------|
| 생성 | `src/types/overtime.ts` | 초과근무 수당 타입 |
| 생성 | `src/hooks/queries/use-overtime-queries.ts` | React Query 훅 |
| 생성 | `src/store/useOvertimeSearchStore.ts` | 검색 상태 Zustand 스토어 |
| 생성 | `src/app/(sub)/overtime/new/page.tsx` | 신규 등록 페이지 |
| 생성 | `src/app/(sub)/overtime/new/stub/page.tsx` | 신규 미리보기 페이지 |
| 생성 | `src/app/(sub)/overtime/new/time/page.tsx` | 신규 근무시간 편집 페이지 |
| 수정 | `src/lib/api/overtime.ts` | API 함수 확장 |
| 수정 | `src/components/overtime/OverTimeList.tsx` | 목록 API 연동 |
| 수정 | `src/components/overtime/OverTimeDetail.tsx` | 상세/등록/수정 API 연동 |
| 수정 | `src/components/overtime/OverTimeWorkEdit.tsx` | 근무시간 편집 연동 |
| 수정 | `src/components/overtime/OverTimeStub.tsx` | 미리보기 API 연동 |
| 수정 | `src/app/(sub)/overtime/[id]/page.tsx` | 라우트 연동 |
| 수정 | `src/app/(sub)/overtime/[id]/stub/page.tsx` | sessionStorage 우선 → API fallback 로직 추가 (현재 단순 렌더링만) |
| 수정 | `src/app/(sub)/overtime/[id]/time/page.tsx` | sessionStorage 기반 초기 데이터 로드 + 로컬 저장 로직 추가 (현재 단순 렌더링만) |
| 수정 | `src/components/bottomsheet/OverTimeSearchSheet.tsx` | 검색 바텀시트 API 연동 |
| 수정 | `src/components/ui/Header.tsx` | getPageTitle에 overtime 타이틀 추가 (현재 미포함 확인됨) |

### Phase 7: 코드 리뷰 2차 피드백 반영

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 7-1 | `alert()` → `usePopupControler` openAlert 패턴으로 통일 | `OverTimeWorkEdit.tsx`, `OverTimeDetail.tsx` | ✅ |
| 7-2 | OverTimeSearchSheet handleSearch에 try/catch/finally 추가 (바텀시트 고착 방지) | `OverTimeSearchSheet.tsx` | ✅ |
| 7-3 | 계약 정보 조회 실패 시 Alert로 사용자 알림 | `OverTimeDetail.tsx` | ✅ |
| 7-4 | stub/time 페이지에서 isError 분기 추가 | `[id]/stub/page.tsx`, `[id]/time/page.tsx` | ✅ |
| 7-5 | OverTimeList 에러 UI에 행동 경로 제공 (재시도 버튼) | `OverTimeList.tsx` | ✅ |
| 7-6 | OverTimeList 이메일 전송 isPending 중복 클릭 방지 | `OverTimeList.tsx` | ✅ |
| 7-7 | 중복 유틸 함수 공통 모듈 추출 (formatAmount, DAY_NAMES, parseLocalDate 등) | `src/lib/overtime-utils.ts` (신규) | ✅ |
| 7-8 | sessionStorage 접근에 try/catch 추가 | `[id]/time/page.tsx`, `new/time/page.tsx` | ✅ |
| 7-9 | 매직스트링 상수 추출 (SLRCF_002 → SALARY_MONTH_NEXT) | `OverTimeDetail.tsx` | ✅ |
| 7-10 | `pnpm lint` + `pnpm build` 체크 | - | ✅ (overtime 에러 없음, 기존 TodoCalendar 이슈만 존재) |

## API 에러 코드

| 코드 | 상황 |
|------|------|
| ERR2014 | 연장근무 수당명세서 대상 회원 없음 |
| ERR2015 | 연장근무 수당명세서를 찾을 수 없음 |
| ERR2016 | 연장근무 수당명세서 중복 (동일 회원 + 년월) |
| ERR2025 | 이메일 발송 대상 이메일 정보 없음 |
| ERR2028 | 시작일이 종료일보다 늦음 |
| ERR2200 | 직원 정보를 찾을 수 없음 |
| ERR2207 | 직원에 연결된 회원 정보 없음 |
| ERR2214 | 현재 유효한 근로계약이 없음 |
