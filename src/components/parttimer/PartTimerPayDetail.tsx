'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useHeaderStore } from '@/store/useHeaderStore'
import {
  useCreatePartTimerPayroll,
  useUpdatePartTimerPayroll,
  useDeletePartTimerPayroll,
  useSendPartTimerPayrollEmail,
  useDownloadPartTimerPayrollExcel,
} from '@/hooks/queries/use-parttime-payroll-queries'
import { getErrorMessage } from '@/lib/api'
import { useHeadOfficeTree, useStoreOptions } from '@/hooks/queries/use-store-queries'
import { useEmployeeListByType } from '@/hooks/queries/use-employee-queries'
import { useContractsByEmployee } from '@/hooks/queries/use-contract-queries'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreStore } from '@/store/useStoreStore'
import DeductionAddSheet from '@/components/bottomsheet/DeductionAddSheet'
import type {
  PartTimerPaymentItem,
  PartTimerDeductionItem,
  PartTimerPayrollDetail,
  PartTimerPayrollCreateRequest,
  PartTimerPayrollUpdateRequest,
} from '@/types/parttime-payroll'

interface PartTimerPayDetailProps {
  isNew?: boolean
  initialData?: PartTimerPayrollDetail
}

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR')

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

const computePaymentDate = (ym: string, salaryDay?: number, nextMonth?: boolean): string => {
  if (!ym || ym.length !== 6 || !salaryDay) return ''
  const year = Number(ym.slice(0, 4))
  const month = Number(ym.slice(4)) - 1
  const offset = nextMonth ? 1 : 0
  const d = new Date(year, month + offset, salaryDay)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

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

const payrollMonthOptions = getPayrollMonthOptions()

const DEDUCTION_LABELS: Record<string, string> = {
  NATIONAL_PENSION: '국민연금',
  HEALTH_INSURANCE: '건강보험',
  EMPLOYMENT_INSURANCE: '고용보험',
  LONG_TERM_CARE_INSURANCE: '장기요양보험',
}

export default function PartTimerPayDetail({ isNew = false, initialData }: PartTimerPayDetailProps) {
  const router = useRouter()
  const id = initialData?.id

  const setDeductionAddSheet = useBottomSheetControler(
    (state) => state.setDeductionAddSheet,
  )

  // DeductionAddSheet 저장 콜백
  const handleDeductionSheetSave = (data: {
    settlementStartDate: string
    settlementEndDate: string
    deductionItems: PartTimerDeductionItem[]
  }) => {
    setSettlementStartDate(data.settlementStartDate)
    setSettlementEndDate(data.settlementEndDate)
    setDeductionItems(data.deductionItems)
  }

  const createMutation = useCreatePartTimerPayroll()
  const updateMutation = useUpdatePartTimerPayroll()
  const deleteMutation = useDeletePartTimerPayroll()
  const sendEmailMutation = useSendPartTimerPayrollEmail()
  const downloadExcelMutation = useDownloadPartTimerPayrollExcel()

  // 조직 선택
  const authHeadOfficeId = useAuthStore((s) => s.headOfficeId)
  const globalHeadOffice = useStoreStore((s) => s.selectedHeadOffice)
  const { data: headOfficeTree = [] } = useHeadOfficeTree()
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | undefined>(
    initialData?.headOfficeName ? undefined : (globalHeadOffice?.id ?? authHeadOfficeId ?? undefined),
  )
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | undefined>()
  const [selectedStoreId, setSelectedStoreId] = useState<number | undefined>()

  const selectedOffice = headOfficeTree.find((o) => o.id === selectedOfficeId)
  const franchises = selectedOffice?.franchises ?? []
  const { data: storeOptions = [] } = useStoreOptions(selectedOfficeId, selectedFranchiseId)

  // 직원 목록
  const { data: employeeList = [] } = useEmployeeListByType(
    { headOfficeId: selectedOfficeId ?? 0, franchiseId: selectedFranchiseId, employeeType: 'PART_TIME' },
    isNew && !!selectedOfficeId,
  )

  const [selectedEmployeeInfoId, setSelectedEmployeeInfoId] = useState<number | undefined>()

  // 직원 선택 시 계약 정보 자동 조회
  const { data: employeeContracts = [] } = useContractsByEmployee(
    selectedEmployeeInfoId ?? 0,
    !!selectedEmployeeInfoId,
  )
  const employeeContract = employeeContracts[0] ?? null
  const contractHeader = employeeContract?.employmentContractHeader
  const isNextMonth = contractHeader?.salaryMonth === 'SLRCF_002'

  // 폼 상태
  const [payrollYearMonth, setPayrollYearMonth] = useState(
    initialData?.payrollYearMonth ?? payrollMonthOptions[0]?.value ?? '',
  )
  const defaultRange = computeSettlementRange(initialData?.payrollYearMonth ?? payrollMonthOptions[0]?.value ?? '')
  const [settlementStartDate, setSettlementStartDate] = useState(initialData?.settlementStartDate ?? defaultRange?.start ?? '')
  const [settlementEndDate, setSettlementEndDate] = useState(initialData?.settlementEndDate ?? defaultRange?.end ?? '')
  const [paymentDate, setPaymentDate] = useState(initialData?.paymentDate ?? '')
  const [remarks, setRemarks] = useState(initialData?.remarks ?? '')
  const [paymentItems, setPaymentItems] = useState<PartTimerPaymentItem[]>(initialData?.paymentItems ?? [])
  const [deductionItems, setDeductionItems] = useState<PartTimerDeductionItem[]>(initialData?.deductionItems ?? [])

  // 급여지급월 변경 시 지급일/정산기간을 함께 계산
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

  // 직원 선택 시 계약 정보 기반으로 급여지급월/지급일 자동 설정
  const prevMonthValue = payrollMonthOptions[1]?.value ?? ''
  useEffect(() => {
    if (!isNew || !employeeContract) return

    const ym = isNextMonth && prevMonthValue ? prevMonthValue : payrollYearMonth
    setPayrollYearMonth(ym)

    const date = computePaymentDate(ym, contractHeader?.salaryDay, isNextMonth)
    if (date) setPaymentDate(date)
    const range = computeSettlementRange(ym)
    if (range) {
      setSettlementStartDate(range.start)
      setSettlementEndDate(range.end)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- employeeContract 변경 시에만 실행
  }, [employeeContract?.id])

  // 금액 계산
  const totalPayment = paymentItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
  const totalPaymentDeduction = paymentItems.reduce((sum, item) => sum + (item.deductionAmount || 0), 0)
  const weeklyHolidayTotal = initialData?.weeklyPaidHolidayAllowances?.reduce((sum, w) => sum + (w.totalAmount || 0), 0) ?? 0
  const insuranceDeduction = deductionItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const totalDeduction = totalPaymentDeduction + insuranceDeduction
  const actualPayment = totalPayment + weeklyHolidayTotal - totalDeduction

  // 삭제 핸들러 등록
  const setOnDelete = useHeaderStore((s) => s.setOnDelete)
  useEffect(() => {
    if (!isNew && id) {
      setOnDelete(async () => {
        if (!confirm('급여명세서를 삭제하시겠습니까?')) return
        try {
          await deleteMutation.mutateAsync(id)
          alert('삭제되었습니다.')
          router.push('/parttimer')
        } catch (error) {
          alert(getErrorMessage(error, '삭제에 실패했습니다.'))
        }
      })
    }
    return () => setOnDelete(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deleteMutation은 매 렌더마다 새 참조
  }, [isNew, id, setOnDelete, router])

  // 저장
  const handleSave = async () => {
    if (isNew && !selectedEmployeeInfoId) {
      alert('직원을 선택해주세요.')
      return
    }
    if (!payrollYearMonth) {
      alert('급여 지급월을 선택해주세요.')
      return
    }
    if (paymentItems.length === 0) {
      alert('근무시간을 입력해주세요.')
      return
    }

    try {
      if (isNew) {
        const request: PartTimerPayrollCreateRequest = {
          employeeInfoId: selectedEmployeeInfoId!,
          payrollYearMonth,
          settlementStartDate,
          settlementEndDate,
          paymentDate,
          paymentItems: paymentItems.map(({ workDay, workHour, breakTimeHour, contractTimelyAmount, applyTimelyAmount, totalAmount, deductionAmount, remarks: r }) => ({
            workDay, workHour, breakTimeHour, contractTimelyAmount, applyTimelyAmount, totalAmount, deductionAmount, remarks: r,
          })),
          deductionItems: deductionItems.length > 0 ? deductionItems.map(({ itemCode, itemOrder, amount, remarks: r }) => ({
            itemCode, itemOrder, amount, remarks: r,
          })) : undefined,
          remarks: remarks || undefined,
        }
        await createMutation.mutateAsync(request)
        alert('급여명세서가 등록되었습니다.')
        router.push('/parttimer')
      } else if (id) {
        const request: PartTimerPayrollUpdateRequest = {
          payrollYearMonth,
          settlementStartDate,
          settlementEndDate,
          paymentDate,
          paymentItems,
          deductionItems: deductionItems.length > 0 ? deductionItems : undefined,
          remarks: remarks || undefined,
        }
        await updateMutation.mutateAsync({ id, data: request })
        alert('급여명세서가 수정되었습니다.')
        router.push('/parttimer')
      }
    } catch (error) {
      alert(getErrorMessage(error, '저장에 실패했습니다.'))
    }
  }

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

  const handleDownload = async () => {
    if (!id) return
    try {
      await downloadExcelMutation.mutateAsync(id)
    } catch (error) {
      alert(getErrorMessage(error, '다운로드에 실패했습니다.'))
    }
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
                          onChange={(e) => {
                            setSelectedOfficeId(Number(e.target.value) || undefined)
                            setSelectedFranchiseId(undefined)
                            setSelectedStoreId(undefined)
                          }}
                          disabled={!!authHeadOfficeId}
                        >
                          <option value="">본사 선택</option>
                          {headOfficeTree.map((office) => (
                            <option key={office.id} value={office.id}>{office.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="block mb8">
                        <select
                          className="select-form"
                          value={selectedFranchiseId ?? ''}
                          onChange={(e) => {
                            setSelectedFranchiseId(Number(e.target.value) || undefined)
                            setSelectedStoreId(undefined)
                          }}
                          disabled={!selectedOfficeId || franchises.length === 0}
                        >
                          <option value="">가맹점 선택</option>
                          {franchises.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
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
                            <option key={store.id} value={store.id}>{store.storeName}</option>
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
                  <div className="block">
                    {isNew ? (
                      <select
                        className="select-form"
                        value={selectedEmployeeInfoId ?? ''}
                        onChange={(e) => setSelectedEmployeeInfoId(Number(e.target.value) || undefined)}
                        disabled={!selectedOfficeId}
                      >
                        <option value="">직원 선택</option>
                        {employeeList.map((emp) => (
                          <option key={emp.employeeInfoId} value={emp.employeeInfoId}>
                            {emp.employeeName} ({emp.employeeNumber})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" className="input-frame" value={initialData?.memberName ?? '-'} readOnly />
                    )}
                  </div>
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
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
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
            </div>
          </div>

          {/* 근무기간 / 4대보험 */}
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">
                  근무기간 / 4대보험 공제액 설정 <span className="imp">*</span>
                </div>
                <div className="auto-right">
                  <button
                    className="sub-edit-btn"
                    onClick={() => setDeductionAddSheet(true)}
                  >
                    <i className="sub-arr-btn"></i>
                  </button>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">근무기간</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      value={settlementStartDate && settlementEndDate
                        ? `${settlementStartDate.replace(/-/g, '.')} ~ ${settlementEndDate.replace(/-/g, '.')}`
                        : '설정해주세요'}
                      readOnly
                      onClick={() => setDeductionAddSheet(true)}
                    />
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">4대보험 공제</div>
                  <div className="pay-data-list">
                    {deductionItems.map((item) => (
                      <div className="pay-data-item" key={item.itemCode}>
                        <div className="pay-data-item-tit">
                          {item.displayName || item.remarks || DEDUCTION_LABELS[item.itemCode] || item.itemCode}(원)
                        </div>
                        <div className="pay-data-item-value">
                          {formatAmount(item.amount)}
                        </div>
                      </div>
                    ))}
                    {deductionItems.length === 0 && (
                      <div style={{ padding: '8px 0', color: '#999', fontSize: '13px' }}>
                        4대보험 공제 항목이 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 급여 요약 */}
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">급여 요약</div>
                <div className="auto-right">
                  <button
                    className="flex g8"
                    onClick={() => {
                      if (id) router.push(`/parttimer/${id}/time`)
                      else alert('근무시간을 입력하려면 먼저 명세서를 저장해주세요.')
                    }}
                  >
                    <span className="sub-btn-txt">근무시간 편집</span>
                    <i className="sub-arr-btn"></i>
                  </button>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="pay-data-list">
                  <div className="pay-data-item top">
                    <div className="pay-data-item-tit">실지급액</div>
                    <div className="pay-data-item-value">{formatAmount(actualPayment)}원</div>
                  </div>
                  <div className="pay-data-item">
                    <div className="pay-data-item-tit">지급총액</div>
                    <div className="pay-data-item-value">{formatAmount(totalPayment)}원</div>
                  </div>
                  {weeklyHolidayTotal > 0 && (
                    <div className="pay-data-item">
                      <div className="pay-data-item-tit">주휴수당</div>
                      <div className="pay-data-item-value">{formatAmount(weeklyHolidayTotal)}원</div>
                    </div>
                  )}
                  <div className="pay-data-item">
                    <div className="pay-data-item-tit">공제총액</div>
                    <div className="pay-data-item-value">{formatAmount(totalDeduction)}원</div>
                  </div>
                </div>
              </div>
              {paymentItems.length > 0 && (
                <div className="sub-item-bx">
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    근무일수: {paymentItems.length}일 / 총 근무시간: {paymentItems.reduce((sum, i) => sum + i.workHour, 0)}시간
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 등록/수정 이력 */}
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
      <div className="content-pagination flex g8">
        {!isNew && id && (
          <button
            className="btn-form block sky brd"
            onClick={() => router.push(`/parttimer/${id}/stub`)}
          >
            급여내역 미리보기
          </button>
        )}
        <button
          className="btn-form block blue"
          onClick={handleSave}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending ? '저장 중...' : '저장하기'}
        </button>
      </div>
      <DeductionAddSheet
        settlementStartDate={settlementStartDate}
        settlementEndDate={settlementEndDate}
        deductionItems={deductionItems}
        onSave={handleDeductionSheetSave}
      />
    </>
  )
}
