'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useContractSearchStore } from '@/store/useContractSearchStore'
import { useCommonCodeHierarchy } from '@/hooks/queries/use-common-code-queries'
import { CONTRACT_STATUS_OPTIONS } from '@/lib/constants'
import { useEmployeeCommonCode } from '@/hooks/queries/use-employee-queries'
import { useAuthStore } from '@/store/useAuthStore'
import { Sheet } from 'react-modal-sheet'
import type { ContractClassificationType } from '@/types/contract'

// 근무요일 (도메인 고정값이므로 상수 유지)
const WORK_DAY_OPTIONS = [
  { value: 'WEEKDAY', label: '평일' },
  { value: 'SATURDAY', label: '토요일' },
  { value: 'SUNDAY', label: '일요일' },
] as const

export default function ContractSearchSheet() {
  const contractSearchSheet = useBottomSheetControler(
    (state) => state.contractSearchSheet,
  )
  const setContractSearchSheet = useBottomSheetControler(
    (state) => state.setContractSearchSheet,
  )
  const { searchParams, setSearchParams, search, reset } = useContractSearchStore()
  const headOfficeId = useAuthStore((s) => s.headOfficeId)
  const { data: commonCode } = useEmployeeCommonCode(headOfficeId ?? undefined)
  const employeeClassifications = commonCode?.codeMemoContent?.EMPLOYEE ?? []
  const { data: contractClassifications = [] } = useCommonCodeHierarchy('CNTCFWK')
  const { data: workStatusCodes = [] } = useCommonCodeHierarchy('EMPWK')
  const { data: electronicContractCodes = [] } = useCommonCodeHierarchy('ECNT')

  // 로컬 폼 상태 — store의 현재 검색 조건으로 초기화
  const [workStatus, setWorkStatus] = useState<string>(searchParams.workStatus ?? '')
  const [memberName, setMemberName] = useState(searchParams.memberName ?? '')
  const [workDays, setWorkDays] = useState<string[]>(searchParams.workDays ?? [])
  const [memberClassification, setMemberClassification] = useState(
    searchParams.memberClassification ?? '',
  )
  const [contractClassification, setContractClassification] = useState<string>(
    searchParams.contractClassification ?? '',
  )
  const [contractStatus, setContractStatus] = useState(searchParams.contractStatus ?? '')
  const [electronicContract, setElectronicContract] = useState<string>(
    searchParams.electronicContract?.[0] ?? '',
  )
  const [paymentStartDate, setPaymentStartDate] = useState(searchParams.paymentStartDate ?? '')
  const [paymentEndDate, setPaymentEndDate] = useState(searchParams.paymentEndDate ?? '')
  const [contractStartDt, setContractStartDt] = useState(searchParams.contractStartDt ?? '')
  const [contractEndDt, setContractEndDt] = useState(searchParams.contractEndDt ?? '')

  // 시트 열릴 때 글로벌 스토어와 동기화
  const handleOpenStart = () => {
    setWorkStatus(searchParams.workStatus ?? '')
    setMemberName(searchParams.memberName ?? '')
    setWorkDays(searchParams.workDays ?? [])
    setMemberClassification(searchParams.memberClassification ?? '')
    setContractClassification(searchParams.contractClassification ?? '')
    setContractStatus(searchParams.contractStatus ?? '')
    setElectronicContract(searchParams.electronicContract?.[0] ?? '')
    setPaymentStartDate(searchParams.paymentStartDate ?? '')
    setPaymentEndDate(searchParams.paymentEndDate ?? '')
    setContractStartDt(searchParams.contractStartDt ?? '')
    setContractEndDt(searchParams.contractEndDt ?? '')
  }

  const handleClose = () => {
    setContractSearchSheet(false)
  }

  const handleWorkDayToggle = (value: string) => {
    setWorkDays((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value],
    )
  }

  const handleSearch = () => {
    setSearchParams({
      workStatus: workStatus || undefined,
      memberName: memberName || undefined,
      workDays: workDays.length > 0 ? workDays : undefined,
      memberClassification: memberClassification || undefined,
      contractClassification: (contractClassification || undefined) as ContractClassificationType | undefined,
      contractStatus: contractStatus || undefined,
      electronicContract: electronicContract ? [electronicContract] : undefined,
      paymentStartDate: paymentStartDate || undefined,
      paymentEndDate: paymentEndDate || undefined,
      contractStartDt: contractStartDt || undefined,
      contractEndDt: contractEndDt || undefined,
    })
    search()
    handleClose()
  }

  const handleReset = () => {
    setWorkStatus('')
    setMemberName('')
    setWorkDays([])
    setMemberClassification('')
    setContractClassification('')
    setContractStatus('')
    setElectronicContract('')
    setPaymentStartDate('')
    setPaymentEndDate('')
    setContractStartDt('')
    setContractEndDt('')
    reset()
  }

  return (
    <Sheet
      isOpen={contractSearchSheet}
      onClose={handleClose}
      onOpenStart={handleOpenStart}
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
                    {workStatusCodes.map((item) => (
                      <button
                        key={item.code}
                        className={`radio-btn block${workStatus === item.code ? ' act' : ''}`}
                        onClick={() =>
                          setWorkStatus(workStatus === item.code ? '' : item.code)
                        }
                      >
                        {item.name}
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
                      value={memberName}
                      maxLength={50}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder="직원명을 입력하세요"
                    />
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">근무요일</div>
                  <div className="flex g8">
                    {WORK_DAY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={`radio-btn block${workDays.includes(option.value) ? ' act' : ''}`}
                        onClick={() => handleWorkDayToggle(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">직원 분류</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={memberClassification}
                      onChange={(e) => setMemberClassification(e.target.value)}
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
                      <option value="">선택</option>
                      {contractClassifications.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">계약상태</div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={contractStatus}
                      onChange={(e) => setContractStatus(e.target.value)}
                    >
                      <option value="">선택</option>
                      {CONTRACT_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">전자계약 여부</div>
                  <div className="flex g8">
                    <button
                      className={`radio-btn block${electronicContract === '' ? ' act' : ''}`}
                      onClick={() => setElectronicContract('')}
                    >
                      전체
                    </button>
                    {electronicContractCodes.map((item) => (
                      <button
                        key={item.code}
                        className={`radio-btn block${electronicContract === item.code ? ' act' : ''}`}
                        onClick={() => setElectronicContract(item.code)}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">급여일</div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={paymentStartDate}
                        onChange={(e) => setPaymentStartDate(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={paymentEndDate}
                        onChange={(e) => setPaymentEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">계약일</div>
                  <div className="flex g8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={contractStartDt}
                        onChange={(e) => setContractStartDt(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={contractEndDt}
                        onChange={(e) => setContractEndDt(e.target.value)}
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
