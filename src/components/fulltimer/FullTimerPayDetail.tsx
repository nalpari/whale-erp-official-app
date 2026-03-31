'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useHeaderStore } from '@/store/useHeaderStore'
import {
  useCreatePayroll,
  useUpdatePayroll,
  useDeletePayroll,
  useSendPayrollEmail,
  useDownloadPayrollExcel,
} from '@/hooks/queries/use-payroll-queries'
import { getErrorMessage } from '@/lib/api'
import { getLatestPayroll } from '@/lib/api/payroll'
import { getOvertimeStatements, getOvertimeStatement } from '@/lib/api/overtime'
import { useHeadOfficeTree, useStoreOptions } from '@/hooks/queries/use-store-queries'
import { useEmployeeListByType } from '@/hooks/queries/use-employee-queries'
import { useContractsByEmployee } from '@/hooks/queries/use-contract-queries'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreStore } from '@/store/useStoreStore'
import PaymentConditionSheet from '@/components/bottomsheet/PaymentConditionSheet'
import type {
  PaymentItem,
  DeductionItem,
  PayrollStatementDetail,
  PayrollStatementCreateRequest,
  PayrollStatementUpdateRequest,
} from '@/types/payroll'

interface FullTimerPayDetailProps {
  isNew?: boolean
  initialData?: PayrollStatementDetail
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

// 급여지급일 계산
const computePaymentDate = (ym: string, salaryDay?: number, nextMonth?: boolean): string => {
  if (!ym || ym.length !== 6 || !salaryDay) return ''
  const year = Number(ym.slice(0, 4))
  const month = Number(ym.slice(4)) - 1
  const offset = nextMonth ? 1 : 0
  const d = new Date(year, month + offset, salaryDay)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 정산기간 계산 (1일~말일)
const computeSettlementRange = (ym: string): { start: string; end: string } | null => {
  if (!ym || ym.length !== 6) return null
  const year = Number(ym.slice(0, 4))
  const month = Number(ym.slice(4))
  const lastDay = new Date(year, month, 0).getDate()
  const mm = String(month).padStart(2, '0')
  return {
    start: `${year}-${mm}-01`,
    end: `${year}-${mm}-${String(lastDay).padStart(2, '0')}`,
  }
}

// 오늘 기준 12개월 옵션 생성 (당월 ~ 11개월 전)
const getPayrollMonthOptions = () => {
  const options: { value: string; label: string }[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    options.push({ value: `${yyyy}${mm}`, label: `${yyyy}. ${mm}` })
  }
  return options
}

const payrollMonthOptions = getPayrollMonthOptions()

export default function FullTimerPayDetail({ isNew = false, initialData }: FullTimerPayDetailProps) {
  const router = useRouter()
  const id = initialData?.id

  const setPaymentConditionSheet = useBottomSheetControler(
    (state) => state.setPaymentConditionSheet,
  )

  const createMutation = useCreatePayroll()
  const updateMutation = useUpdatePayroll()
  const deleteMutation = useDeletePayroll()
  const sendEmailMutation = useSendPayrollEmail()
  const downloadExcelMutation = useDownloadPayrollExcel()

  // 조직 선택 — 헤더 본사 선택(storeStore) → auth fallback
  const authHeadOfficeId = useAuthStore((s) => s.headOfficeId)
  const globalHeadOffice = useStoreStore((s) => s.selectedHeadOffice)
  const { data: headOfficeTree = [] } = useHeadOfficeTree()
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | undefined>(
    globalHeadOffice?.id ?? authHeadOfficeId ?? undefined,
  )
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | undefined>()
  const [selectedStoreId, setSelectedStoreId] = useState<number | undefined>()

  // 선택된 본사의 가맹점 목록
  const selectedOffice = headOfficeTree.find((o) => o.id === selectedOfficeId)
  const franchises = selectedOffice?.franchises ?? []

  // 점포 목록 (가맹점 선택 시 가맹점 기반, 아니면 본사 기반)
  const { data: storeOptions = [] } = useStoreOptions(selectedOfficeId, selectedFranchiseId)

  // 직원 목록 (본사 기반)
  const { data: employeeList = [] } = useEmployeeListByType(
    { headOfficeId: selectedOfficeId ?? 0, franchiseId: selectedFranchiseId, employeeType: 'FULL_TIME' },
    isNew && !!selectedOfficeId,
  )

  // 선택된 직원의 employeeInfoId 추적
  const [selectedEmployeeInfoId, setSelectedEmployeeInfoId] = useState<number | undefined>()

  // 직원 선택 시 계약 정보 자동 조회
  const { data: employeeContracts = [] } = useContractsByEmployee(
    selectedEmployeeInfoId ?? 0,
    !!selectedEmployeeInfoId,
  )

  // 이전 급여 정보 불러오기
  const handleLoadPreviousPayroll = async () => {
    if (!selectedEmployeeInfoId) {
      alert('직원을 먼저 선택해주세요.')
      return
    }
    try {
      const latestPayroll = await getLatestPayroll(selectedEmployeeInfoId)
      if (!latestPayroll) {
        alert('이전 급여 정보가 없습니다.')
        return
      }
      setPayrollYearMonth(latestPayroll.payrollYearMonth)
      setSettlementStartDate(latestPayroll.settlementStartDate)
      setSettlementEndDate(latestPayroll.settlementEndDate)
      setPaymentDate(latestPayroll.paymentDate)
      setPaymentItems(latestPayroll.paymentItems)
      setDeductionItems(latestPayroll.deductionItems)
      setRemarks(latestPayroll.remarks ?? '')
      alert('이전 급여 정보를 불러왔습니다.')
    } catch (error) {
      alert(getErrorMessage(error, '이전 급여 정보를 불러오는데 실패했습니다.'))
    }
  }

  // 추가근무수당 불러오기
  const handleLoadOvertimeAllowance = async () => {
    if (!payrollYearMonth) {
      alert('급여 지급월을 먼저 선택해주세요.')
      return
    }
    if (!selectedEmployeeInfoId) {
      alert('직원을 먼저 선택해주세요.')
      return
    }
    try {
      const overtimeData = await getOvertimeStatements({
        allowanceYearMonth: payrollYearMonth,
        headOfficeId: selectedOfficeId,
      })
      const emp = employeeList.find((item) => item.employeeInfoId === selectedEmployeeInfoId)
      const memberOvertime = overtimeData.content.find((item) => item.memberId === emp?.memberId)
      if (!memberOvertime) {
        const y = payrollYearMonth.slice(0, 4)
        const m = Number(payrollYearMonth.slice(4))
        alert(`${y}년 ${m}월의 연장근무 수당명세서가 없습니다.`)
        return
      }
      const detail = await getOvertimeStatement(memberOvertime.id)
      const overtimeAmount = detail.totalAmount || 0

      setPaymentItems((prev) =>
        prev.map((item) =>
          item.itemCode === 'ADD' ? { ...item, amount: overtimeAmount } : item,
        ),
      )
      alert(`추가근무수당 ${overtimeAmount.toLocaleString()}원을 불러왔습니다.`)
    } catch (error) {
      alert(getErrorMessage(error, '추가근무수당을 불러오는데 실패했습니다.'))
    }
  }

  const handleOfficeChange = (officeId: number | undefined) => {
    setSelectedOfficeId(officeId)
    setSelectedFranchiseId(undefined)
    setSelectedStoreId(undefined)
  }

  const handleFranchiseChange = (franchiseId: number | undefined) => {
    setSelectedFranchiseId(franchiseId)
    setSelectedStoreId(undefined)
  }

  // 폼 상태 — initialData로 초기화 (key 패턴으로 리마운트되므로 안전)
  const [employmentContractId, setEmploymentContractId] = useState(initialData?.employmentContractId)
  const [payrollYearMonth, setPayrollYearMonth] = useState(
    initialData?.payrollYearMonth ?? payrollMonthOptions[0]?.value ?? '',
  )
  const defaultSettlementRange = (() => {
    const ym = initialData?.payrollYearMonth ?? payrollMonthOptions[0]?.value ?? ''
    if (!ym || ym.length !== 6) return { start: '', end: '' }
    const year = Number(ym.slice(0, 4))
    const month = Number(ym.slice(4))
    const lastDay = new Date(year, month, 0).getDate()
    const mm = String(month).padStart(2, '0')
    return {
      start: `${year}-${mm}-01`,
      end: `${year}-${mm}-${String(lastDay).padStart(2, '0')}`,
    }
  })()
  const [settlementStartDate, setSettlementStartDate] = useState(initialData?.settlementStartDate ?? defaultSettlementRange.start)
  const [settlementEndDate, setSettlementEndDate] = useState(initialData?.settlementEndDate ?? defaultSettlementRange.end)
  const [paymentDate, setPaymentDate] = useState(initialData?.paymentDate ?? '')
  const [remarks, setRemarks] = useState(initialData?.remarks ?? '')
  const [attachmentFile, setAttachmentFile] = useState<File | undefined>()
  const [useFileMode, setUseFileMode] = useState(false)
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>(initialData?.paymentItems ?? [])
  const [deductionItems, setDeductionItems] = useState<DeductionItem[]>(initialData?.deductionItems ?? [])

  // 계약 정보에서 급여지급월/급여지급일 자동 설정
  const employeeContract = employeeContracts[0] ?? null
  const contractHeader = employeeContract?.employmentContractHeader
  const isNextMonth = contractHeader?.salaryMonth === 'SLRCF_002'

  const prevMonthValue = payrollMonthOptions[1]?.value ?? ''

  // 급여지급월 변경 시 지급일/정산기간을 함께 계산 (이벤트 핸들러 기반)
  const handlePayrollYearMonthChange = (ym: string) => {
    setPayrollYearMonth(ym)
    const date = computePaymentDate(ym, contractHeader?.salaryDay, isNextMonth)
    if (date) setPaymentDate(date)
    const range = computeSettlementRange(ym)
    if (range) {
      setSettlementStartDate(range.start)
      setSettlementEndDate(range.end)
    }
  }

  // 직원 선택 시 salaryInfo → 지급/공제 항목 + 급여지급월/지급일/정산기간 한번에 매핑
  const salaryInfo = employeeContract?.salaryInfo
  const currentContractId = employeeContract?.id
  useEffect(() => {
    if (!isNew || !currentContractId) return

    // 익월지급이면 급여지급월을 전월로, 아니면 당월 유지
    const ym = isNextMonth && prevMonthValue ? prevMonthValue : payrollYearMonth
    setPayrollYearMonth(ym)

    // 지급일/정산기간 계산
    const date = computePaymentDate(ym, contractHeader?.salaryDay, isNextMonth)
    if (date) setPaymentDate(date)
    const range = computeSettlementRange(ym)
    if (range) {
      setSettlementStartDate(range.start)
      setSettlementEndDate(range.end)
    }

    const si = salaryInfo
    const mappedPaymentItems: PaymentItem[] = [
      { itemCode: 'BASIC', itemOrder: 1, amount: si?.monthlyBaseSalary ?? 0, remarks: '기본급' },
      { itemCode: 'MEAL', itemOrder: 2, amount: si?.mealAllowance ?? 0, remarks: '식대' },
      { itemCode: 'VEHICLE', itemOrder: 3, amount: si?.vehicleAllowance ?? 0, remarks: '자가운전보조금' },
      { itemCode: 'CHILD_CARE', itemOrder: 4, amount: si?.childcareAllowance ?? 0, remarks: '육아수당' },
      { itemCode: 'OVERTIME', itemOrder: 5, amount: si?.monthlyOvertimeAllowance ?? 0, remarks: '연장수당' },
      { itemCode: 'NIGHT', itemOrder: 6, amount: si?.monthlyNightAllowance ?? 0, remarks: '야간수당' },
      { itemCode: 'MONTHLY_HOLIDAY', itemOrder: 7, amount: si?.monthlyHolidayAllowance ?? 0, remarks: '휴일근무수당' },
      { itemCode: 'ADD', itemOrder: 8, amount: si?.monthlyAddHolidayAllowance ?? 0, remarks: '추가근무수당' },
    ]
    setPaymentItems(mappedPaymentItems)

    // 공제 항목 자동 계산 (4대보험 + 소득세)
    const paymentTotal = mappedPaymentItems.reduce((sum, item) => sum + item.amount, 0)
    const nonTaxable = (si?.mealAllowance ?? 0) + (si?.vehicleAllowance ?? 0) + (si?.childcareAllowance ?? 0)
    const taxable = paymentTotal - nonTaxable

    const NATIONAL_PENSION_RATE = 0.045
    const HEALTH_INSURANCE_RATE = 0.03545
    const LONG_TERM_CARE_RATE = 0.1281
    const EMPLOYMENT_INSURANCE_RATE = 0.009

    const nationalPension = contractHeader?.nationalPensionEnrolled ? Math.round(taxable * NATIONAL_PENSION_RATE) : 0
    const healthInsurance = contractHeader?.healthInsuranceEnrolled ? Math.round(taxable * HEALTH_INSURANCE_RATE) : 0
    const longTermCare = contractHeader?.healthInsuranceEnrolled ? Math.round(healthInsurance * LONG_TERM_CARE_RATE) : 0
    const employmentInsurance = contractHeader?.employmentInsuranceEnrolled ? Math.round(taxable * EMPLOYMENT_INSURANCE_RATE) : 0

    const calcIncomeTax = (monthly: number) => {
      if (monthly <= 1060000) return 0
      if (monthly <= 1500000) return Math.round((monthly - 1060000) * 0.06)
      if (monthly <= 3000000) return Math.round(26400 + (monthly - 1500000) * 0.15)
      if (monthly <= 4500000) return Math.round(251400 + (monthly - 3000000) * 0.24)
      if (monthly <= 8700000) return Math.round(611400 + (monthly - 4500000) * 0.35)
      return Math.round(2081400 + (monthly - 8700000) * 0.38)
    }
    const incomeTax = calcIncomeTax(taxable)
    const localIncomeTax = Math.round(incomeTax * 0.1)

    setDeductionItems([
      { itemCode: 'NATIONAL_PENSION', itemOrder: 1, amount: nationalPension, remarks: '국민연금' },
      { itemCode: 'HEALTH_INSURANCE', itemOrder: 2, amount: healthInsurance, remarks: '건강보험' },
      { itemCode: 'EMPLOYMENT_INSURANCE', itemOrder: 3, amount: employmentInsurance, remarks: '고용보험' },
      { itemCode: 'LONG_TERM_CARE_INSURANCE', itemOrder: 4, amount: longTermCare, remarks: '장기요양보험' },
      { itemCode: 'INCOME_TAX', itemOrder: 5, amount: incomeTax, remarks: '소득세' },
      { itemCode: 'LOCAL_INCOME_TAX', itemOrder: 6, amount: localIncomeTax, remarks: '지방소득세' },
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps -- currentContractId 변경 시에만 실행, 파생 객체(salaryInfo/contractHeader) 참조 불안정 방지
  }, [currentContractId])

  // 금액 계산
  const totalPayment = paymentItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const totalDeduction = deductionItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const actualPayment = totalPayment - totalDeduction

  // PaymentConditionSheet 콜백
  const handlePaymentItemsChange = (items: PaymentItem[]) => {
    setPaymentItems(items)
  }

  const handleDeductionItemsChange = (items: DeductionItem[]) => {
    setDeductionItems(items)
  }

  // 저장
  const handleSave = async () => {
    if (isNew && (!employmentContractId || !selectedEmployeeInfoId)) {
      alert('직원을 선택해주세요.')
      return
    }
    if (!payrollYearMonth) {
      alert('급여 지급월을 선택해주세요.')
      return
    }

    try {
      if (isNew) {
        const request: PayrollStatementCreateRequest = {
          employeeInfoId: selectedEmployeeInfoId!,
          employmentContractId: employmentContractId!,
          payrollYearMonth,
          settlementStartDate,
          settlementEndDate,
          paymentDate,
          paymentItems: paymentItems.map(({ itemCode, itemOrder, amount, remarks: r }) => ({
            itemCode,
            itemOrder,
            amount,
            remarks: r,
          })),
          deductionItems: deductionItems.map(({ itemCode, itemOrder, amount, remarks: r }) => ({
            itemCode,
            itemOrder,
            amount,
            remarks: r,
          })),
          remarks: remarks || undefined,
        }
        await createMutation.mutateAsync({ data: request, file: attachmentFile })
        alert('급여명세서가 등록되었습니다.')
        router.push('/fulltimer')
      } else if (id) {
        const request: PayrollStatementUpdateRequest = {
          payrollYearMonth,
          settlementStartDate,
          settlementEndDate,
          paymentDate,
          paymentItems,
          deductionItems,
          remarks: remarks || undefined,
        }
        await updateMutation.mutateAsync({ id, data: request })
        alert('급여명세서가 수정되었습니다.')
        router.push('/fulltimer')
      }
    } catch (error) {
      alert(getErrorMessage(error, '저장에 실패했습니다.'))
    }
  }

  // 급여명세서 다운로드
  const handleDownload = async () => {
    if (!id) return
    try {
      await downloadExcelMutation.mutateAsync(id)
    } catch (error) {
      alert(getErrorMessage(error, '다운로드에 실패했습니다.'))
    }
  }

  // Header btn-delete에 삭제 핸들러 등록
  const setOnDelete = useHeaderStore((s) => s.setOnDelete)
  useEffect(() => {
    if (!isNew && id) {
      setOnDelete(async () => {
        if (!confirm('급여명세서를 삭제하시겠습니까?')) return
        try {
          await deleteMutation.mutateAsync(id)
          alert('삭제되었습니다.')
          router.push('/fulltimer')
        } catch (error) {
          alert(getErrorMessage(error, '삭제에 실패했습니다.'))
        }
      })
    }
    return () => setOnDelete(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- deleteMutation은 매 렌더마다 새 참조, mutateAsync만 사용
  }, [isNew, id, setOnDelete, router])

  // 이메일 전송
  const handleSendEmail = async () => {
    if (!id) return
    if (!confirm('급여명세서를 이메일로 전송하시겠습니까?')) return
    try {
      await sendEmailMutation.mutateAsync(id)
      alert('이메일이 전송되었습니다.')
    } catch (error) {
      alert(getErrorMessage(error, '이메일 전송에 실패했습니다.'))
    }
  }

  // 파일 변경
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAttachmentFile(file)
  }

  return (
    <>
      <div className="container sub">
        {!isNew && (
          <div className="pay-head-btn-wrap">
            <button className="pay-head-btn" onClick={handleSendEmail}>
              <i className="email-icon"></i>이메일 전송
            </button>
            <button className="pay-head-btn" onClick={handleDownload} disabled={downloadExcelMutation.isPending}>
              <i className="download-icon"></i>{downloadExcelMutation.isPending ? '다운로드 중...' : '급여명세서 다운로드'}
            </button>
          </div>
        )}
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    본사/가맹점/점포{isNew && <span className="imp"> *</span>}
                  </div>
                  {isNew ? (
                    <>
                      <div className="block mb8">
                        <select
                          className="select-form"
                          value={selectedOfficeId ?? ''}
                          onChange={(e) => handleOfficeChange(Number(e.target.value) || undefined)}
                          disabled={!!authHeadOfficeId}
                        >
                          <option value="">본사 선택</option>
                          {headOfficeTree.map((office) => (
                            <option key={office.id} value={office.id}>
                              {office.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="block mb8">
                        <select
                          className="select-form"
                          value={selectedFranchiseId ?? ''}
                          onChange={(e) => handleFranchiseChange(Number(e.target.value) || undefined)}
                          disabled={!selectedOfficeId || franchises.length === 0}
                        >
                          <option value="">가맹점 선택</option>
                          {franchises.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="block">
                        <select
                          className="select-form"
                          value={selectedStoreId ?? ''}
                          onChange={(e) => setSelectedStoreId(Number(e.target.value) || undefined)}
                          disabled={!selectedOfficeId}
                        >
                          <option value="">점포 선택</option>
                          {storeOptions.map((store) => (
                            <option key={store.id} value={store.id}>
                              {store.storeName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="block mb8">
                        <input type="text" className="input-frame" value={initialData?.headOfficeName ?? '-'} readOnly />
                      </div>
                      <div className="block mb8">
                        <input type="text" className="input-frame" value={initialData?.franchiseName ?? '-'} readOnly />
                      </div>
                      <div className="block">
                        <input type="text" className="input-frame" value={initialData?.storeName ?? '-'} readOnly />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    직원명{isNew && <span className="imp"> *</span>}
                  </div>
                  {isNew && (
                    <div className="block mb8">
                      <button
                        className="btn-form block grey"
                        onClick={handleLoadPreviousPayroll}
                      >
                        이전 급여정보 불러오기
                      </button>
                    </div>
                  )}
                  <div className="block">
                    {isNew ? (
                      <select
                        className="select-form"
                        value={employmentContractId ?? ''}
                        onChange={(e) => {
                          const contractId = Number(e.target.value) || undefined
                          setEmploymentContractId(contractId)
                          const emp = employeeList.find((item) => item.employmentContractId === contractId)
                          setSelectedEmployeeInfoId(emp?.employeeInfoId)
                        }}
                        disabled={!selectedOfficeId}
                      >
                        <option value="">직원 선택</option>
                        {employeeList.map((emp) => (
                          <option key={emp.employeeInfoId} value={emp.employmentContractId ?? ''}>
                            {emp.employeeName} ({emp.employeeNumber})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" className="input-frame" value={initialData?.memberName ?? '-'} readOnly />
                    )}
                  </div>
                  {!isNew && initialData?.employeeNumber && (
                    <div className="s-txt mt10">{initialData.employeeNumber}</div>
                  )}
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    급여 지급월 <span className="imp">*</span>
                  </div>
                  <div className="block mb8">
                    <select
                      className="select-form"
                      value={payrollYearMonth}
                      onChange={(e) => handlePayrollYearMonthChange(e.target.value)}
                    >
                      <option value="">선택</option>
                      {payrollMonthOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      value={paymentDate ? `지급일 - ${paymentDate.replace(/-/g, '.')}` : ''}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    정산기간 <span className="imp">*</span>
                  </div>
                  <div className="flex g6">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={settlementStartDate}
                        onChange={(e) => setSettlementStartDate(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={settlementEndDate}
                        onChange={(e) => setSettlementEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">비고</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="비고를 입력하세요"
                    />
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">
                      파일로 대체<span className="imp"> *</span>
                    </div>
                    <div className="auto-right">
                      <div className="toggle-btn">
                        <input
                          type="checkbox"
                          id="toggle-btn"
                          checked={useFileMode}
                          onChange={(e) => setUseFileMode(e.target.checked)}
                        />
                        <label className="slider" htmlFor="toggle-btn"></label>
                      </div>
                    </div>
                  </div>
                  {useFileMode && (
                    <>
                      <div className="block mb10">
                        <div className="file-btn">
                          <input
                            type="file"
                            id="file-input"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleFileChange}
                          />
                          <label
                            className="btn-form block grey"
                            htmlFor="file-input"
                          >
                            <i className="file-icon"></i>
                            <span>파일찾기</span>
                          </label>
                        </div>
                      </div>
                      {attachmentFile && (
                        <div className="store-img-list">
                          <div className="store-img-bx">
                            <div className="store-img-tit">
                              <span className="img-tit">
                                {attachmentFile.name.replace(/\.[^.]+$/, '')}
                              </span>
                              <span>
                                .{attachmentFile.name.split('.').pop()}
                              </span>
                            </div>
                            <div className="store-img-btn-wrap">
                              <button
                                className="img-delete"
                                onClick={() => setAttachmentFile(undefined)}
                              ></button>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="filed-guide">
                        <span>
                          등록가능한 파일 문서파일(PDF), 이미지파일 (PNG,JPG,
                          JPEG)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">
                  급여정보<span className="imp"> *</span>
                </div>
                <div className="auto-right ">
                  <button
                    className="flex g8"
                    onClick={() => {
                      if (isNew && !selectedEmployeeInfoId) {
                        alert('직원을 먼저 선택해주세요.')
                        return
                      }
                      setPaymentConditionSheet(true)
                    }}
                  >
                    <span className="sub-btn-txt">상세내역 설정</span>
                    <i className="sub-arr-btn"></i>
                  </button>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="pay-data-list">
                  <div className="pay-data-item top">
                    <div className="pay-data-item-tit">실지급액</div>
                    <div className="pay-data-item-value">
                      {formatAmount(actualPayment)}원
                    </div>
                  </div>
                  <div className="pay-data-item">
                    <div className="pay-data-item-tit">지급총액</div>
                    <div className="pay-data-item-value">
                      {formatAmount(totalPayment)}원
                    </div>
                  </div>
                  <div className="pay-data-item">
                    <div className="pay-data-item-tit">공제총액</div>
                    <div className="pay-data-item-value">
                      {formatAmount(totalDeduction)}원
                    </div>
                  </div>
                </div>
              </div>
              {paymentItems.length > 0 && (
                <div className="sub-item-bx">
                  <dl className="pay-data-guide">
                    <dt>산출식/산출방법 및 지급액</dt>
                    {paymentItems
                      .filter((item) => !['MEAL', 'VEHICLE', 'CHILD_CARE'].includes(item.itemCode))
                      .filter((item) => item.itemCode === 'BASIC' || item.amount > 0)
                      .map((item) => (
                      <dd key={item.itemCode}>
                        {item.itemCode === 'BASIC' && salaryInfo
                          ? `기본급 : 월간 기본근무시간(${formatAmount(salaryInfo.monthlyTime)}시간) × 통상시급(${formatAmount(salaryInfo.timelySalary)}원) = ${formatAmount(item.amount)}원`
                          : item.itemCode === 'OVERTIME' && salaryInfo
                            ? `연장수당 : 연장 근무 시간(${salaryInfo.monthlyOvertimeAllowanceTime ?? 0}시간) × 통상시급 × 1.5 = ${formatAmount(item.amount)}원`
                            : item.itemCode === 'NIGHT' && salaryInfo
                              ? `야간수당 : 야간 근무 시간(${salaryInfo.monthlyNightAllowanceTime ?? 0}시간) × 통상시급 × 0.5 = ${formatAmount(item.amount)}원`
                              : item.itemCode === 'MONTHLY_HOLIDAY' && salaryInfo
                                ? `휴일근무수당 : 휴일 근무 시간(${salaryInfo.monthlyHolidayAllowanceTime ?? 0}시간) × 통상시급 × 0.5 = ${formatAmount(item.amount)}원`
                                : item.itemCode === 'ADD' && salaryInfo
                                  ? `추가근무수당 : 추가 근무 시간(${salaryInfo.monthlyAddHolidayAllowanceTime ?? 0}시간) × 통상시급 × 1.5 = ${formatAmount(item.amount)}원`
                                  : `${item.remarks || item.itemCode}: ${formatAmount(item.amount)}원`}
                      </dd>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
          {!isNew && initialData && (
            <div className="sub-cont-wrap">
              <div className="sub-cont-item-wrap">
                <div className="sub-cont-tit-wrap">
                  <div className="sub-cont-tit">등록 및 수정 이력</div>
                </div>
                <div className="sub-item-bx">
                  <table className="info-table">
                    <colgroup>
                      <col style={{ width: '95px' }} />
                      <col />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th>등록일</th>
                        <td>
                          <div className="data-list">
                            <span>{initialData.createdByName ?? '-'}</span>
                            <span>{initialData.createdAt?.slice(0, 10).replace(/-/g, '.') ?? '-'}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>최근수정일</th>
                        <td>
                          <div className="data-list">
                            <span>{initialData.updatedByName ?? '-'}</span>
                            <span>{initialData.updatedAt?.slice(0, 10).replace(/-/g, '.') ?? '-'}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="content-pagination">
        <button
          className="btn-form block blue"
          onClick={handleSave}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? '저장 중...'
            : '저장하기'}
        </button>
      </div>
      <PaymentConditionSheet
        paymentItems={paymentItems}
        deductionItems={deductionItems}
        availableBonuses={salaryInfo?.bonuses ?? initialData?.bonuses ?? []}
        onPaymentItemsChange={handlePaymentItemsChange}
        onDeductionItemsChange={handleDeductionItemsChange}
        onLoadOvertime={isNew ? handleLoadOvertimeAllowance : undefined}
      />
    </>
  )
}
