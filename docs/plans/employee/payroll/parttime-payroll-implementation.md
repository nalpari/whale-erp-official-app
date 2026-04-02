# 파트타이머 급여명세서 API 연동 구현 계획

## 개요
- **목표**: official-app(모바일)의 파트타이머 급여명세서 화면에 API 연동
- **현재 상태**: ✅ 전체 구현 완료 (Phase 1~6)
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
  workHour: number             // 총근무시간 (출근~퇴근)
  breakTimeHour: number        // 휴게시간
  contractTimelyAmount: number // 계약 시급
  applyTimelyAmount: number    // 적용 시급 (평일/주말 시급 다를 수 있음)
  totalAmount: number          // 지급액 = (workHour - breakTimeHour) * applyTimelyAmount
  deductionAmount: number      // 공제액 = totalAmount * 0.033 (3.3% 원천징수)
  remarks?: string
}
// netWorkHour = workHour - breakTimeHour (실근무시간)
```

### PartTimerDeductionItem (공제항목)
```typescript
interface PartTimerDeductionItem {
  id?: number
  itemCode: string     // NATIONAL_PENSION, HEALTH_INSURANCE 등
  itemOrder: number
  amount: number
  remarks?: string
  displayName?: string
}
```

### WeeklyPaidHolidayAllowance (주휴수당)
```typescript
interface WeeklyPaidHolidayAllowance {
  id: number
  workWeek: number              // 주 차수
  workTime: number              // 주휴수당 인정 시간
  applyTimelyAmount: number     // 적용 시급
  totalAmount: number           // 주휴수당 금액
  deductionAmount: number       // 공제액 = totalAmount * 0.033
  netAmount: number             // 차인금액 = totalAmount - deductionAmount
  weekStartDate?: string        // 주 시작일 (주차 매핑 키)
  weekEndDate?: string          // 주 종료일
  isCrossMonth: boolean         // 월 경계 여부
}
```

## Phase 6: 신규/수정 흐름 개선

### 6-1. 급여내역 미리보기 — 신규/수정 모두 지원

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 6-1-1 | 신규 모드에서 미리보기 버튼 활성화 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 6-1-2 | 신규 미리보기 페이지 생성 (sessionStorage 기반) | `parttimer/new/stub/page.tsx` (신규) | ✅ 완료 |
| 6-1-3 | 수정 모드 미리보기도 현재 폼 데이터 반영 (API 원본 → sessionStorage) | `[id]/stub/page.tsx` | ✅ 완료 |
| 6-1-4 | PartTimerPayStub에 isPreview prop 추가 (미리보기 모드 분기) | `PartTimerPayStub.tsx` | ✅ 완료 |

### 6-2. 근무시간 편집 — 로컬 저장 방식으로 통일

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 6-2-1 | 신규 모드 근무시간 편집 페이지 생성 | `parttimer/new/time/page.tsx` (신규) | ✅ 완료 |
| 6-2-2 | 수정 모드 근무시간 편집 — API 직접 저장 → 로컬 저장으로 변경 | `[id]/time/page.tsx` | ✅ 완료 |
| 6-2-3 | PartTimerTimeEdit에 isPreview/onPreviewSave prop 추가 | `PartTimerTimeEdit.tsx` | ✅ 완료 |
| 6-2-4 | 메인 폼에서 "근무시간 편집" 버튼 제거 (미리보기 경유로 접근) | `PartTimerPayDetail.tsx` | ✅ 완료 |

### 6-3. 계약시간적용 — 등록/수정 분기 처리

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 6-3-1 | 등록 시: 근로계약 workHours 기반 요일별 근무시간/시급 자동 채움 | `PartTimerTimeEdit.tsx` | ✅ 완료 |
| 6-3-2 | 수정 시: 서버 원본 데이터(initialData.paymentItems)로 초기화 | `PartTimerTimeEdit.tsx` | ✅ 완료 |
| 6-3-3 | contractWorkHours/contractSalaryInfo를 sessionStorage 경유 전달 | `PartTimerPayDetail.tsx`, `new/time/page.tsx` | ✅ 완료 |
| 6-3-4 | 버튼 금액 표시 제거 | `PartTimerTimeEdit.tsx` | ✅ 완료 |

### 6-4. 폼 상태 보존 (sessionStorage 기반)

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 6-4-1 | 신규: 미리보기 이동/복귀 시 폼 데이터 보존 (FormDraft) | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 6-4-2 | 수정: 미리보기/근무시간 편집 복귀 시 paymentItems + deductionItems 보존 (EditDraft) | `PartTimerPayDetail.tsx` | ✅ 완료 |

### 6-5. 기타 개선

| 순서 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 6-5-1 | 급여지급월 변경 시 paymentItems/deductionItems 초기화 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 6-5-2 | 총 지급액 0원이면 저장 차단 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 6-5-3 | 근무일수 표시 제거 | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 6-5-4 | daily-work-hours API 필드명 매핑 수정 (date→workDay, workHours→workHour 등) | `PartTimerPayDetail.tsx` | ✅ 완료 |
| 6-5-5 | PartTimerPayStub workDay undefined 방어 코드 | `PartTimerPayStub.tsx` | ✅ 완료 |

## 설계 결정 사항

| 구분 | whale-erp-front 방식 | official-app 방식 |
|------|----------------------|-------------------|
| 근무시간 편집 데이터 전달 | localStorage 경유 | sessionStorage 경유 (EditDraft/FormDraft) |
| 미리보기 데이터 전달 | API 조회 (ID 기반) | sessionStorage 우선 → API fallback |
| 주휴수당 계산 | 프론트 + 백엔드 양쪽 | 백엔드 위임 (API 저장 시 자동 계산) |
| 공제 3.3% 계산 | 프론트에서 계산 | 프론트에서 계산 (0이면 백엔드 자동) |
| 계약시간적용 (등록) | 시급 일괄 변경 | workHours 기반 요일별 근무시간/시급 자동 채움 |
| 계약시간적용 (수정) | 시급 일괄 변경 | 서버 원본 데이터로 초기화 |
| 근무시간 저장 (수정) | API 직접 호출 | 로컬 저장 → 메인 폼에서 최종 API 호출 |

## sessionStorage 키 목록

| 키 | 용도 | 저장 시점 | 삭제 시점 |
|----|------|-----------|-----------|
| `partTimerStubPreview` | 미리보기 데이터 (paymentItems, deductionItems 포함) | 미리보기 클릭 시 | stub 페이지 로드 후 (new는 유지) |
| `partTimerFormDraft` | 신규 폼 상태 복원용 (조직, 직원, 기간, 계약 정보 포함) | 미리보기 클릭 시 | 로드 후 삭제 |
| `partTimerEditDraft` | 수정 폼 상태 복원용 (paymentItems + deductionItems) | 미리보기/근무시간편집 클릭 시 | 로드 후 삭제 |

## 생성/수정 파일 목록

| 구분 | 파일 | 설명 |
|------|------|------|
| 생성 | `src/types/parttime-payroll.ts` | 파트타이머 급여 타입 |
| 생성 | `src/lib/api/parttime-payroll.ts` | 파트타이머 급여 API |
| 생성 | `src/hooks/queries/use-parttime-payroll-queries.ts` | React Query 훅 |
| 생성 | `src/app/(sub)/parttimer/new/stub/page.tsx` | 신규 미리보기 페이지 |
| 생성 | `src/app/(sub)/parttimer/new/time/page.tsx` | 신규 근무시간 편집 페이지 |
| 수정 | `src/components/parttimer/PartTimerPayList.tsx` | 목록 API 연동 |
| 수정 | `src/components/parttimer/PartTimerPayDetail.tsx` | 상세/등록/수정 + sessionStorage 기반 폼 보존 |
| 수정 | `src/components/parttimer/PartTimerTimeEdit.tsx` | 근무시간 편집 + 계약시간적용 분기 |
| 수정 | `src/components/parttimer/PartTimerPayStub.tsx` | 미리보기 + isPreview 모드 |
| 수정 | `src/components/bottomsheet/DeductionAddSheet.tsx` | 4대보험 공제 바텀시트 |
| 수정 | `src/app/(sub)/parttimer/[id]/stub/page.tsx` | sessionStorage 우선 → API fallback |
| 수정 | `src/app/(sub)/parttimer/[id]/time/page.tsx` | API 직접 저장 → 로컬 저장 |
