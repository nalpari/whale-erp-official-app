'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useContractSearchStore } from '@/store/useContractSearchStore'
import { Sheet } from 'react-modal-sheet'
import type { ContractClassificationType } from '@/types/contract'

// 근무여부
const WORK_STATUS_OPTIONS = [
  { value: 'EMPWK_001', label: '근무' },
  { value: 'EMPWK_002', label: '휴직' },
  { value: 'EMPWK_003', label: '퇴사' },
] as const

// 근무요일
const WORK_DAY_OPTIONS = [
  { value: 'WEEKDAY', label: '평일' },
  { value: 'SATURDAY', label: '토요일' },
  { value: 'SUNDAY', label: '일요일' },
] as const

// 전자계약 여부
const ELECTRONIC_CONTRACT_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'ECNT_002', label: '전자계약' },
  { value: 'ECNT_001', label: '서류계약' },
] as const

export default function ContractSearchSheet() {
  const contractSearchSheet = useBottomSheetControler(
    (state) => state.contractSearchSheet,
  )
  const setContractSearchSheet = useBottomSheetControler(
    (state) => state.setContractSearchSheet,
  )
  const { searchParams, setSearchParams, search, reset } = useContractSearchStore()

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
  const [paymentStartDate, setPaymentStartDate] = useState('')
  const [paymentEndDate, setPaymentEndDate] = useState('')
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
    setPaymentStartDate('')
    setPaymentEndDate('')
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
      contractClassification: (contractClassification as ContractClassificationType) || undefined,
      contractStatus: contractStatus || undefined,
      electronicContract: electronicContract ? [electronicContract] : undefined,
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
                    {WORK_STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={`radio-btn block${workStatus === option.value ? ' act' : ''}`}
                        onClick={() =>
                          setWorkStatus(workStatus === option.value ? '' : option.value)
                        }
                      >
                        {option.label}
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
                      <option value="본사 정직원">본사 정직원</option>
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
                      <option value="CNTCFWK_001">포괄</option>
                      <option value="CNTCFWK_002">비포괄</option>
                      <option value="CNTCFWK_003">파트타임</option>
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
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">전자계약 여부</div>
                  <div className="flex g8">
                    {ELECTRONIC_CONTRACT_OPTIONS.map((option) => (
                      <button
                        key={option.value === '' ? 'all' : option.value}
                        className={`radio-btn block${electronicContract === option.value ? ' act' : ''}`}
                        onClick={() => setElectronicContract(option.value)}
                      >
                        {option.label}
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
