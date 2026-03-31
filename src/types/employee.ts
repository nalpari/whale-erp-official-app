// 직원 간단 목록 응답
export interface EmployeeSimpleListItem {
  employeeInfoId: number
  memberId: number | null
  employeeNumber: string
  employeeName: string
  headOfficeName: string
  franchiseName: string | null
  storeName: string | null
  contractClassification: string | null
  contractClassificationName: string | null
  employmentContractId: number | null
  salaryMonth: string | null
  salaryDay: number | null
}

// 직원 타입별 조회 파라미터
export interface GetEmployeeListByTypeParams {
  headOfficeId: number
  franchiseId?: number
  employeeType: 'ALL' | 'FULL_TIME' | 'PART_TIME'
}
