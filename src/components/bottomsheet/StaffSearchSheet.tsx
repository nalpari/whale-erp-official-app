'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useEmployeeSearchStore } from '@/store/useEmployeeSearchStore'
import { useEmployeeCommonCode } from '@/hooks/queries/use-employee-queries'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreStore } from '@/store/useStoreStore'
import { Sheet } from 'react-modal-sheet'
import type { EmployeeWorkStatus } from '@/types/employee'

const WORK_STATUS_OPTIONS: { label: string; value: EmployeeWorkStatus }[] = [
  { label: '근무', value: 'EMPWK_001' },
  { label: '휴직', value: 'EMPWK_002' },
  { label: '퇴사', value: 'EMPWK_003' },
]

const MEMBER_STATUS_OPTIONS = [
  { label: '선택', value: '' },
  { label: '가입요청전', value: '가입요청전' },
  { label: '가입요청', value: '가입요청' },
  { label: '가입완료', value: '가입완료' },
  { label: '회원탈퇴', value: '회원탈퇴' },
]

const CONTRACT_CLASSIFICATION_OPTIONS = [
  { label: '선택', value: '' },
  { label: '정직원', value: 'CNTCFWK_001' },
  { label: '계약직', value: 'CNTCFWK_002' },
  { label: '파트타이머', value: 'CNTCFWK_003' },
]

export default function StaffSearchSheet() {
  const staffSearchSheet = useBottomSheetControler(
    (state) => state.staffSearchSheet,
  )
  const setStaffSearchSheet = useBottomSheetControler(
    (state) => state.setStaffSearchSheet,
  )
  const { searchParams, setSearchParams, search, reset } = useEmployeeSearchStore()
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId)
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice)
  const effectiveHeadOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? undefined

  const { data: commonCode } = useEmployeeCommonCode(effectiveHeadOfficeId)
  const employeeClassifications = commonCode?.codeMemoContent?.EMPLOYEE ?? []

  // 로컬 필터 상태 — 스토어 값을 초기값으로 사용
  const [workStatus, setWorkStatus] = useState<EmployeeWorkStatus | undefined>(undefined)
  const [employeeName, setEmployeeName] = useState('')
  const [employeeClassification, setEmployeeClassification] = useState('')
  const [contractClassification, setContractClassification] = useState('')
  const [adminAuthority, setAdminAuthority] = useState('')
  const [memberStatus, setMemberStatus] = useState('')
  const [hireDateFrom, setHireDateFrom] = useState('')
  const [hireDateTo, setHireDateTo] = useState('')
  const [healthCheckExpiryFrom, setHealthCheckExpiryFrom] = useState('')
  const [healthCheckExpiryTo, setHealthCheckExpiryTo] = useState('')

  // 바텀시트 열릴 때 스토어 값으로 동기화 (key 리마운트 방식)
  const syncFromStore = () => {
    setWorkStatus(searchParams.workStatus)
    setEmployeeName(searchParams.employeeName ?? '')
    setEmployeeClassification(searchParams.employeeClassification ?? '')
    setContractClassification(searchParams.contractClassification ?? '')
    setAdminAuthority(searchParams.adminAuthority ?? '')
    setMemberStatus(searchParams.memberStatus ?? '')
    setHireDateFrom(searchParams.hireDateFrom ?? '')
    setHireDateTo(searchParams.hireDateTo ?? '')
    setHealthCheckExpiryFrom(searchParams.healthCheckExpiryFrom ?? '')
    setHealthCheckExpiryTo(searchParams.healthCheckExpiryTo ?? '')
  }

  const handleClose = () => {
    setStaffSearchSheet(false)
  }

  const handleSearch = () => {
    setSearchParams({
      workStatus,
      employeeName: employeeName || undefined,
      employeeClassification: employeeClassification || undefined,
      contractClassification: contractClassification || undefined,
      adminAuthority: adminAuthority || undefined,
      memberStatus: memberStatus || undefined,
      hireDateFrom: hireDateFrom || undefined,
      hireDateTo: hireDateTo || undefined,
      healthCheckExpiryFrom: healthCheckExpiryFrom || undefined,
      healthCheckExpiryTo: healthCheckExpiryTo || undefined,
    })
    search()
    handleClose()
  }

  const handleReset = () => {
    reset()
    handleClose()
  }

  return (
    <Sheet
      isOpen={staffSearchSheet}
      onClose={handleClose}
      onOpenEnd={syncFromStore}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>검색조건</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">근무여부</div>
                  <div className="flex g8">
                    {WORK_STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`radio-btn block${workStatus === opt.value ? ' act' : ''}`}
                        onClick={() =>
                          setWorkStatus(workStatus === opt.value ? undefined : opt.value)
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원명</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      placeholder="직원명 입력"
                    />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원 분류</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={employeeClassification}
                      onChange={(e) => setEmployeeClassification(e.target.value)}
                    >
                      <option value="">선택</option>
                      {employeeClassifications.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">계약분류</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={contractClassification}
                      onChange={(e) => setContractClassification(e.target.value)}
                    >
                      {CONTRACT_CLASSIFICATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">관리자 권한</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={adminAuthority}
                      onChange={(e) => setAdminAuthority(e.target.value)}
                    >
                      <option value="">선택</option>
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원 회원 상태</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={memberStatus}
                      onChange={(e) => setMemberStatus(e.target.value)}
                    >
                      {MEMBER_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">입사일</div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={hireDateFrom}
                        onChange={(e) => setHireDateFrom(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={hireDateTo}
                        onChange={(e) => setHireDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">건강진단만료일</div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={healthCheckExpiryFrom}
                        onChange={(e) => setHealthCheckExpiryFrom(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={healthCheckExpiryTo}
                        onChange={(e) => setHealthCheckExpiryTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky" onClick={handleReset}>
                초기화
              </button>
              <button className="btn-form blue" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
