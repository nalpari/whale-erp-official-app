# 파트타이머 급여명세서 API 연동 구현 계획

## 개요
- **목표**: official-app(모바일)의 파트타이머 급여명세서 화면에 API 연동
- **현재 상태**: 4개 컴포넌트 모두 하드코딩된 퍼블리싱 목업 수준, API 호출 없음
- **참조**: whale-erp-front의 PartTimePayStub.tsx, PartTimeWorkTimeEdit.tsx
- **API 기본 경로**: `/api/v1/employee/payroll/parttime`

## 정직원(FullTimer)과의 주요 차이점

| 구분 | 파트타이머 | 정직원 |
|------|-----------|--------|
| 지급항목 단위 | 날짜별 근무 기록 (일별 시급 × 시간) | 항목 코드별 (BASIC, OVERTIME 등) |
| 급여 산정 | 시급 × 근무시간 | 월급 고정 + 수당 항목 |
| 공제 방식 | 일별 3.3% 자동 + 4대보험 수동 | 소득세/지방소득세/4대보험 코드별 |
| 주휴수당 | 별도 엔티티 자동 계산 (주 15시간 이상) | 없음 |
| 근무시간 편집 | 별도 화면 (날짜별 시간/시급 입력) | 없음 |
| 중복 체크 | member_id + payroll_year_month | employment_contract_id + payroll_year_month |

## API 엔드포인트

| 동작 | 메서드 | URL |
|------|--------|-----|
| 목록 조회 | GET | `/api/v1/employee/payroll/parttime` |
| 상세 조회 | GET | `/api/v1/employee/payroll/parttime/{id}` |
| 등록 | POST | `/api/v1/employee/payroll/parttime` |
| 수정 | PUT | `/api/v1/employee/payroll/parttime/{id}` |
| 삭제 | DELETE | `/api/v1/employee/payroll/parttime/{id}` |
| 이메일 전송 | POST | `/api/v1/employee/payroll/parttime/{id}/send-email` |
| 엑셀 다운로드 | GET | `/api/v1/employee/payroll/parttime/{id}/download-excel` |
| 일별 근무시간 조회 | GET | `/api/v1/employee/payroll/parttime/daily-work-hours` |

## 구현 단계

### Phase 1: 타입 정의 + API 레이어

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 1-1 | 파트타이머 급여 타입 정의 | `src/types/parttime-payroll.ts` (신규) | ✅ 완료 |
| 1-2 | 파트타이머 급여 API 함수 | `src/lib/api/parttime-payroll.ts` (신규) | ✅ 완료 |
| 1-3 | React Query 훅 | `src/hooks/queries/use-parttime-payroll-queries.ts` (신규) | ✅ 완료 |

### Phase 2: 목록 화면 (PartTimerPayList)

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 2-1 | 검색 파라미터 타입 + 검색 바텀시트 연동 | `PartTimerSearchSheet.tsx` | ✅ 완료 |
| 2-2 | 목록 API 연동 (하드코딩 제거) | `PartTimerPayList.tsx` | ✅ 완료 |
| 2-3 | 본사/가맹점/점포 계단식 선택 연동 | `PartTimerPayList.tsx` | ✅ 완료 |

### Phase 3: 상세 조회/등록/수정 (PartTimerPayDetail)

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 3-1 | 상세 조회 API 연동 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 3-2 | 직원 선택 + 계약 정보 로드 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 3-3 | 지급항목 (일별 근무 기록) 표시 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 3-4 | 공제항목 (4대보험) 표시/편집 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 3-5 | 주휴수당 표시 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 3-6 | 등록/수정 API 호출 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 3-7 | 삭제 API 호출 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 3-8 | 이메일 전송 | `PartTimerPayDetail.tsx` | ✅ 완료 |

### Phase 4: 근무시간 편집 (PartTimerTimeEdit)

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 4-1 | 날짜별 근무시간/시급 입력 UI 연동 | `PartTimerTimeEdit.tsx` | ✅ 완료 |
| 4-2 | 3.3% 공제 자동 계산 | `PartTimerTimeEdit.tsx` | ✅ 완료 |
| 4-3 | 주휴수당 자동 계산 (프론트) | 백엔드 위임 (API 저장 시 자동 계산) | ✅ 완료 |
| 4-4 | PartTimerPayDetail ↔ PartTimerTimeEdit 데이터 전달 | 라우트 기반 (API 조회/저장) | ✅ 완료 |

### Phase 5: 급여명세서 미리보기 (PartTimerPayStub)

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 5-1 | 상세 API 데이터로 미리보기 렌더링 | `PartTimerPayStub.tsx` | ✅ 완료 |
| 5-2 | 주간소계/주휴수당/주간합계 계산 | `PartTimerPayStub.tsx` | ✅ 완료 |

## 타입 구조 설계 (Phase 1)

### PartTimerPaymentItem (지급항목 = 일별 근무 기록)
```typescript
interface PartTimerPaymentItem {
  id?: number
  workDay: string              // YYYY-MM-DD
  workHour: number             // 근무시간
  breakTimeHour: number        // 휴게시간
  contractTimelyAmount: number // 계약 시급
  applyTimelyAmount: number    // 적용 시급 (휴일/야간 가산 가능)
  totalAmount: number          // 지급액 = workHour * applyTimelyAmount
  deductionAmount: number      // 공제액 = totalAmount * 0.033
}
```

### PartTimerDeductionItem (공제항목)
```typescript
interface PartTimerDeductionItem {
  id?: number
  itemCode: string   // NATIONAL_PENSION, HEALTH_INSURANCE 등
  itemOrder: number
  amount: number
}
```

### WeeklyPaidHolidayAllowance (주휴수당)
```typescript
interface WeeklyPaidHolidayAllowance {
  id?: number
  weekStartDate: string          // 주 시작일
  weekEndDate: string            // 주 종료일
  totalWeeklyWorkHours: number   // 주 총 근무시간
  previousMonthWorkHours: number // 이전월 근무시간 (월 경계)
  hourlyWage: number             // 시급
  amount: number                 // 주휴수당 = (totalWeeklyWorkHours / 5) * hourlyWage
}
```

## 설계 결정 사항

| 구분 | whale-erp-front 방식 | official-app 방식 (예정) |
|------|----------------------|--------------------------|
| 근무시간 편집 데이터 전달 | localStorage 경유 | Zustand store 또는 route state |
| 주휴수당 계산 | 프론트 + 백엔드 양쪽 | 백엔드 위임 (API 응답에 포함) |
| 공제 3.3% 계산 | 프론트에서 계산 | 프론트에서 계산 (0이면 백엔드 자동) |

## 생성/수정 파일 목록

| 구분 | 파일 | 설명 |
|------|------|------|
| 생성 | `src/types/parttime-payroll.ts` | 파트타이머 급여 타입 |
| 생성 | `src/lib/api/parttime-payroll.ts` | 파트타이머 급여 API |
| 생성 | `src/hooks/queries/use-parttime-payroll-queries.ts` | React Query 훅 |
| 수정 | `src/components/parttimer/PartTimerPayList.tsx` | 목록 API 연동 |
| 수정 | `src/components/parttimer/PartTimerPayDetail.tsx` | 상세/등록/수정 API 연동 |
| 수정 | `src/components/parttimer/PartTimerTimeEdit.tsx` | 근무시간 편집 연동 |
| 수정 | `src/components/parttimer/PartTimerPayStub.tsx` | 미리보기 API 연동 |
| 수정 | `src/components/bottomsheet/PartTimerSearchSheet.tsx` | 검색 파라미터 연동 |
| 수정 | `src/app/(sub)/parttimer/` 하위 page.tsx | 라우트 연동 |
