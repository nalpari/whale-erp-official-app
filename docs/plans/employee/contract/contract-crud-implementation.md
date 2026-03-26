# 근로계약 등록/수정/삭제 구현 계획

## 현재 상태

모든 컴포넌트 **100% 퍼블리싱(정적 HTML)**. API 연동, 타입, 상태관리 없음.

### 기존 파일 (퍼블리싱)

| 파일 | 역할 | 상태 |
|------|------|------|
| `app/(sub)/contract/page.tsx` | 목록 래퍼 | 정적 |
| `app/(sub)/contract/[id]/page.tsx` | 상세 래퍼 | 정적 |
| `app/(sub)/contract/[id]/edit/info/page.tsx` | 계약정보 수정 래퍼 | 정적 |
| `app/(sub)/contract/[id]/edit/time/page.tsx` | 근무시간 수정 래퍼 | 정적 |
| `app/(sub)/contract/[id]/employ/page.tsx` | 급여정보 수정 래퍼 | 정적 |
| `components/contract/ContractList.tsx` | 목록 UI | 하드코딩 |
| `components/contract/ContractDetail.tsx` | 상세 UI | 하드코딩 |
| `components/contract/ContractEditInfo.tsx` | 계약정보 수정 폼 | 하드코딩 |
| `components/contract/ContractEditTime.tsx` | 근무시간 수정 폼 | 하드코딩 |
| `components/staff/EmploymentContract.tsx` | 급여정보 수정 폼 | 하드코딩 |
| `bottomsheet/ContractSearchSheet.tsx` | 검색 바텀시트 | 하드코딩 |
| `bottomsheet/ContractOptionSheet.tsx` | 계약 설정 바텀시트 | 하드코딩 |

---

## 사용하는 API (whale-erp-api)

### 조회

| 메소드 | 엔드포인트 | 설명 |
|-------|----------|------|
| GET | `/api/employee/contract` | 목록 조회 (필터, 페이징) |
| GET | `/api/employee/contract/{id}` | 상세 조회 |
| GET | `/api/employee/contract/by-employee-info/{employeeInfoId}` | 직원별 계약 목록 |
| GET | `/api/employee/contract/minimum-wage/{year}` | 최저임금 조회 |
| GET | `/api/employee/contract/common-code` | 공통코드 조회 |

### 등록 (3단계)

| 메소드 | 엔드포인트 | 설명 |
|-------|----------|------|
| POST | `/api/employee/contract/header` | Step 1: 계약 헤더 등록 (FormData) |
| POST | `/api/employee/contract/work-hours` | Step 2: 근무시간 등록 |
| POST | `/api/employee/contract/salary-info` | Step 3: 급여정보 등록 |

### 수정

| 메소드 | 엔드포인트 | 설명 |
|-------|----------|------|
| PUT | `/api/employee/contract/header/{id}` | 계약 헤더 수정 (FormData) |
| PUT | `/api/employee/contract/work-hours/{contractId}` | 근무시간 수정 |
| PUT | `/api/employee/contract/salary-info/{id}` | 급여정보 수정 |

### 삭제

| 메소드 | 엔드포인트 | 설명 |
|-------|----------|------|
| DELETE | `/api/employee/contract/{id}` | 논리 삭제 |

### 전자계약

| 메소드 | 엔드포인트 | 설명 |
|-------|----------|------|
| POST | `/api/employee/contract/{id}/send-email` | 계약서 이메일 전송 |
| POST | `/api/employee/contract/{id}/complete` | 전자서명 완료 |
| GET | `/api/employee/contract/{id}/download/docx` | 계약서 다운로드 |

---

## 구현 계획

### Phase 1: 타입 정의 + API 함수

#### `src/types/contract.ts`

```
- ContractListItem: 목록 항목 (직원명, 계약분류, 상태, 급여일, 근무요일 등)
- ContractDetail: 상세 응답 (헤더, 급여, 근무시간, 이력 포함)
- ContractHeaderRequest: 헤더 등록/수정 요청
- ContractWorkHourRequest: 근무시간 등록/수정 요청
- ContractSalaryInfoRequest: 급여정보 등록/수정 요청
- ContractSearchParams: 검색 파라미터
- Enums: ContractType, ContractClassificationType, ElectronicContractStatus, SalaryCycle, SalaryMonth, DayType
```

#### `src/lib/api/contract.ts`

```
- getContracts(params): 목록 조회
- getContract(id): 상세 조회
- createContractHeader(data, files): Step 1 등록 (FormData)
- createContractWorkHours(data): Step 2 등록
- createContractSalaryInfo(data): Step 3 등록
- updateContractHeader(id, data, files): 헤더 수정
- updateContractWorkHours(contractId, data): 근무시간 수정
- updateContractSalaryInfo(id, data): 급여정보 수정
- deleteContract(id): 삭제
- sendContractEmail(id): 이메일 전송
- getMinimumWage(year): 최저임금 조회
```

### Phase 2: React Query 훅 + Zustand 스토어

#### `src/hooks/queries/use-contract-queries.ts`

```
- useContractList(params, enabled): 목록 조회
- useContractDetail(id): 상세 조회
- useCreateContractHeader(): Step 1 mutation
- useCreateContractWorkHours(): Step 2 mutation
- useCreateContractSalaryInfo(): Step 3 mutation
- useUpdateContractHeader(): 헤더 수정 mutation
- useUpdateContractWorkHours(): 근무시간 수정 mutation
- useUpdateContractSalaryInfo(): 급여정보 수정 mutation
- useDeleteContract(): 삭제 mutation
- useSendContractEmail(): 이메일 전송 mutation
- useMinimumWage(year): 최저임금 조회
```

#### `src/store/useContractSearchStore.ts`

```
- searchParams, hasSearched, setSearchParams, search, reset
```

### Phase 3: 컴포넌트 API 연동 — 목록 + 검색

#### `ContractList.tsx` 수정
- 하드코딩 → `useContractList()` 연동
- `headOfficeId` 자동 주입 (authStore/storeStore fallback)
- 검색 결과 건수 동적 표시
- 계약 카드 목록 렌더링 (직원명, 계약상태 뱃지, 급여일, 본사/가맹점/점포)
- hydration 대응 (useMounted)

#### `ContractSearchSheet.tsx` 수정
- 검색 폼 연동 (근무여부, 직원명, 근무요일, 직원분류, 계약분류, 계약상태, 전자계약여부, 급여일, 계약일)
- `onOpenStart` 동기화
- `useContractSearchStore` 연동

### Phase 4: 컴포넌트 API 연동 — 상세

#### `ContractDetail.tsx` 수정
- `useContractDetail(id)` 연동
- 직원정보, 계약정보, 급여정보, 근무시간, 계약이력 동적 표시
- 삭제 버튼 → `useDeleteContract()` 연동
- 계약서 전송 → `useSendContractEmail()` 연동
- 수정 버튼 라우팅 (edit/info, edit/time, employ)

### Phase 5: 컴포넌트 API 연동 — 수정

#### `ContractEditInfo.tsx` 수정
- 계약 헤더 수정 폼 연동
- 계약기간, 업무내용, 계약분류, 4대보험, 급여지급일
- 파일 업로드 (근로계약서, 임금계약서)
- `useUpdateContractHeader()` 연동

#### `ContractEditTime.tsx` 수정
- 근무시간 수정 폼 연동 (평일/토/일)
- 시작/종료시간, 휴게시간, 격주근무 설정
- `useUpdateContractWorkHours()` 연동

#### `EmploymentContract.tsx` (급여정보 수정) 수정
- 급여 계산 폼 연동
- 통상시급, 근무시간, 수당, 비과세 항목
- `useMinimumWage(year)` 연동
- `useUpdateContractSalaryInfo()` 연동
- `ContractOptionSheet.tsx` 연동

### Phase 6: 등록 플로우 (신규)

- 등록 버튼 라우트 추가 (`/contract/new`)
- 3단계 등록 플로우:
  1. 계약정보 입력 → `useCreateContractHeader()`
  2. 근무시간 입력 → `useCreateContractWorkHours()`
  3. 급여정보 입력 → `useCreateContractSalaryInfo()`
- 각 단계 완료 후 다음 단계로 이동
- `contractId`를 단계 간 전달

---

## 파일 생성/수정 요약

| 구분 | 파일 경로 | 작업 |
|------|---------|------|
| 생성 | `src/types/contract.ts` | 타입 + Enum 정의 |
| 생성 | `src/lib/api/contract.ts` | API 함수 (11개) |
| 생성 | `src/hooks/queries/use-contract-queries.ts` | React Query 훅 (11개) |
| 생성 | `src/store/useContractSearchStore.ts` | 검색 상태 스토어 |
| 생성 | `src/app/(sub)/contract/new/page.tsx` | 신규 등록 라우트 |
| 수정 | `components/contract/ContractList.tsx` | 목록 API 연동 |
| 수정 | `components/contract/ContractDetail.tsx` | 상세 + 삭제 + 이메일 |
| 수정 | `components/contract/ContractEditInfo.tsx` | 계약정보 수정 연동 |
| 수정 | `components/contract/ContractEditTime.tsx` | 근무시간 수정 연동 |
| 수정 | `components/staff/EmploymentContract.tsx` | 급여정보 수정 연동 |
| 수정 | `bottomsheet/ContractSearchSheet.tsx` | 검색 연동 |
| 수정 | `bottomsheet/ContractOptionSheet.tsx` | 계약 설정 연동 |

## 구현 순서

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
타입+API    훅+스토어   목록+검색    상세+삭제   수정(3종)   등록플로우
```

각 Phase 완료 후 `pnpm lint` + `pnpm build` 체크 + 계획 문서 업데이트.

---

## 미리 확인할 사항

- [ ] 계약 목록 API 응답 형식 확인 (Swagger)
- [ ] 3단계 등록 시 `contractId` 전달 방식 (URL params vs state)
- [ ] 파일 업로드 방식 (FormData multipart)
- [ ] 전자계약 플로우 (send → complete 순서)
- [ ] Header의 서브 페이지 제목 매핑 추가 필요
