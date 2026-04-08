'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useHeaderStore } from '@/store/useHeaderStore'
import {
  useCreateOvertime,
  useUpdateOvertime,
  useDeleteOvertime,
  useSendOvertimeEmail,
  useDownloadOvertimeExcel,
} from '@/hooks/queries/use-overtime-queries'
import { getErrorMessage } from '@/lib/api'
import { getDailyOvertimeHours } from '@/lib/api/overtime'
import { useHeadOfficeTree, useStoreOptions } from '@/hooks/queries/use-store-queries'
import { useEmployeeListByType } from '@/hooks/queries/use-employee-queries'
import { getContractsByEmployee } from '@/lib/api/contract'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreStore } from '@/store/useStoreStore'
import { usePopupControler } from '@/store/usePopupControler'
import { formatAmount, safeSessionGet, safeSessionSet, safeSessionRemove } from '@/lib/overtime-utils'
import type {
  OvertimeAllowanceItemDto,
  OvertimeAllowanceDetail,
  OvertimeAllowanceCreateRequest,
  OvertimeAllowanceUpdateRequest,
} from '@/types/overtime'

interface OverTimeDetailProps {
  isNew?: boolean
  initialData?: OvertimeAllowanceDetail
}

/** 급여월 코드: 익월 지급 */
const SALARY_MONTH_NEXT = 'SLRCF_002'

const getAllowanceMonthOptions = () => {
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
  const lastDay = new Date(year, month + offset + 1, 0).getDate()
  const clampedDay = Math.min(salaryDay, lastDay)
  const d = new Date(year, month + offset, clampedDay)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const computeCalculationRange = (ym: string): { start: string; end: string } | null => {
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

const FORM_DRAFT_KEY = 'overtimeFormDraft'
const EDIT_DRAFT_KEY = 'overtimeEditDraft'
const PREVIEW_KEY = 'overtimeStubPreview'

interface EditDraft {
  id: number
  details: OvertimeAllowanceItemDto[]
}

const loadEditDraft = (id?: number): EditDraft | null => {
  if (!id) return null
  const draft = safeSessionGet<EditDraft>(EDIT_DRAFT_KEY)
  if (!draft) return null
  safeSessionRemove(EDIT_DRAFT_KEY)
  if (draft.id !== id) return null
  return draft
}

interface FormDraft {
  selectedOfficeId?: number
  selectedFranchiseId?: number
  selectedStoreId?: number
  selectedEmployeeInfoId?: number
  contractWage?: number
  allowanceYearMonth: string
  calculationStartDate: string
  calculationEndDate: string
  paymentDate: string
  remarks: string
  details: OvertimeAllowanceItemDto[]
}

const loadFormDraft = (): FormDraft | null => {
  const draft = safeSessionGet<FormDraft>(FORM_DRAFT_KEY)
  if (!draft) return null
  safeSessionRemove(FORM_DRAFT_KEY)
  return draft
}

export default function OverTimeDetail({ isNew = false, initialData }: OverTimeDetailProps) {
  const router = useRouter()
  const openAlert = usePopupControler((s) => s.openAlert)
  const id = initialData?.id
  const allowanceMonthOptions = getAllowanceMonthOptions()
  const [draft] = useState(() => isNew ? loadFormDraft() : null)
  const [editDraft] = useState(() => !isNew ? loadEditDraft(id) : null)

  const { mutateAsync: createOvertime, isPending: isCreating } = useCreateOvertime()
  const { mutateAsync: updateOvertime, isPending: isUpdating } = useUpdateOvertime()
  const { mutateAsync: deleteOvertime } = useDeleteOvertime()
  const { mutateAsync: sendEmail, isPending: isSendingEmail } = useSendOvertimeEmail()
  const { mutateAsync: downloadExcel, isPending: isDownloading } = useDownloadOvertimeExcel()

  // 조직 선택 (신규 등록 시에만 필요)
  const authHeadOfficeId = useAuthStore((s) => s.headOfficeId)
  const globalHeadOffice = useStoreStore((s) => s.selectedHeadOffice)
  const { data: headOfficeTree = [] } = useHeadOfficeTree(isNew)
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | undefined>(
    draft?.selectedOfficeId ?? (initialData?.headOfficeName ? undefined : (globalHeadOffice?.id ?? authHeadOfficeId ?? undefined)),
  )
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | undefined>(draft?.selectedFranchiseId)
  const [selectedStoreId, setSelectedStoreId] = useState<number | undefined>(draft?.selectedStoreId)

  const selectedOffice = headOfficeTree.find((o) => o.id === selectedOfficeId)
  const franchises = selectedOffice?.franchises ?? []
  const { data: storeOptions = [] } = useStoreOptions(isNew ? selectedOfficeId : undefined, isNew ? selectedFranchiseId : undefined)

  // 직원 목록 (신규 등록 시에만 조회)
  const { data: employeeList = [] } = useEmployeeListByType(
    { headOfficeId: selectedOfficeId ?? 0, franchiseId: selectedFranchiseId, employeeType: 'ALL' },
    isNew && !!selectedOfficeId,
  )

  const [selectedEmployeeInfoId, setSelectedEmployeeInfoId] = useState<number | undefined>(draft?.selectedEmployeeInfoId)

  // 폼 상태
  const [allowanceYearMonth, setAllowanceYearMonth] = useState(
    draft?.allowanceYearMonth ?? initialData?.allowanceYearMonth ?? allowanceMonthOptions[0]?.value ?? '',
  )
  const initialPeriod = (() => {
    if (initialData?.calculationStartDate && initialData?.calculationEndDate) {
      return { start: initialData.calculationStartDate, end: initialData.calculationEndDate }
    }
    const range = computeCalculationRange(initialData?.allowanceYearMonth ?? allowanceMonthOptions[0]?.value ?? '')
    return range ?? { start: '', end: '' }
  })()
  const [calculationStartDate, setCalculationStartDate] = useState(draft?.calculationStartDate ?? initialPeriod.start)
  const [calculationEndDate, setCalculationEndDate] = useState(draft?.calculationEndDate ?? initialPeriod.end)
  const [paymentDate, setPaymentDate] = useState(draft?.paymentDate ?? initialData?.paymentDate ?? '')
  const [remarks, setRemarks] = useState(draft?.remarks ?? initialData?.remarks ?? '')
  const [contractWage, setContractWage] = useState<number>(
    draft?.contractWage ?? initialData?.details?.[0]?.contractTimelyAmount ?? 0,
  )
  const [details, setDetails] = useState<OvertimeAllowanceItemDto[]>(
    editDraft?.details ?? draft?.details ?? initialData?.details ?? [],
  )

  // 급여지급월 변경 시 기간/근무내역 초기화 + 재조회
  const handleAllowanceYearMonthChange = async (ym: string) => {
    setAllowanceYearMonth(ym)
    const range = computeCalculationRange(ym)
    if (range) {
      setCalculationStartDate(range.start)
      setCalculationEndDate(range.end)
    }
    setDetails([])

    // 직원이 선택된 상태면 새 기간으로 재조회
    if (selectedEmployeeInfoId && range) {
      await fetchOvertimeDetails(selectedEmployeeInfoId, range.start, range.end)
    }
  }

  // 일별 연장근무 시간 조회 → details 자동 채우기
  const fetchOvertimeDetails = async (empId: number, startDt: string, endDt: string) => {
    try {
      const result = await getDailyOvertimeHours({
        employeeInfoId: empId,
        startDate: startDt,
        endDate: endDt,
        headOfficeId: selectedOfficeId,
        franchiseStoreId: selectedFranchiseId,
        storeId: selectedStoreId,
      })
      if (result?.items) {
        const dailyItems: OvertimeAllowanceItemDto[] = result.items
          .filter((item): item is Extract<typeof item, { type: 'DAILY' }> => item.type === 'DAILY')
          .map((item) => ({
            workDay: item.date,
            workHour: item.overtimeHours,
            breakTimeHour: 0,
            contractTimelyAmount: item.contractTimelyAmount,
            applyTimelyAmount: item.applyTimelyAmount,
            actualOvertimeHours: item.overtimeHours,
            deductionAmount: item.deductionAmount,
            actualPaymentAmount: item.paymentAmount,
          }))
        setDetails(dailyItems)
      }
    } catch (error) {
      console.error('[OverTimeDetail] 연장근무 시간 조회 실패:', error)
      openAlert({ message: getErrorMessage(error, '연장근무 내역을 불러오는데 실패했습니다.') })
    }
  }

  // 직원 선택 시 계약 기반 지급일 자동 설정 + 연장근무 내역 조회
  const prevMonthValue = allowanceMonthOptions[1]?.value ?? ''
  const handleEmployeeChange = async (employeeInfoId: number | undefined) => {
    setSelectedEmployeeInfoId(employeeInfoId)
    if (!isNew || !employeeInfoId) return

    let resolvedStartDate = calculationStartDate
    let resolvedEndDate = calculationEndDate

    try {
      const contracts = await getContractsByEmployee(employeeInfoId)
      const contract = contracts[0]
      if (!contract) return
      const header = contract.employmentContractHeader
      const nextMonth = header?.salaryMonth === SALARY_MONTH_NEXT
      const ym = nextMonth && prevMonthValue ? prevMonthValue : allowanceYearMonth
      setAllowanceYearMonth(ym)

      const date = computePaymentDate(ym, header?.salaryDay, nextMonth)
      if (date) {
        setPaymentDate(date)
      }
      const range = computeCalculationRange(ym)
      if (range) {
        setCalculationStartDate(range.start)
        setCalculationEndDate(range.end)
        resolvedStartDate = range.start
        resolvedEndDate = range.end
      }
      // 계약 시급 저장
      const wage = contract.salaryInfo?.timelySalary ?? 0
      setContractWage(wage)
    } catch (error) {
      console.error('[OverTimeDetail] 계약 정보 조회 실패:', error)
      openAlert({ message: '계약 정보를 불러올 수 없습니다. 시급이 기본값(0원)으로 설정됩니다.' })
    }

    // 기간이 설정된 경우 연장근무 내역 자동 조회
    if (resolvedStartDate && resolvedEndDate) {
      await fetchOvertimeDetails(employeeInfoId, resolvedStartDate, resolvedEndDate)
    }
  }

  // 금액 계산
  const totalPayment = details.reduce((sum, item) => sum + (item.actualPaymentAmount || 0), 0)
  const totalDeduction = details.reduce((sum, item) => sum + (item.deductionAmount || 0), 0)
  const actualPayment = totalPayment - totalDeduction

  // 삭제 핸들러 등록
  const setOnDelete = useHeaderStore((s) => s.setOnDelete)
  const setShowDeleteButton = useHeaderStore((s) => s.setShowDeleteButton)
  useEffect(() => {
    if (!isNew && id) {
      setShowDeleteButton(true)
      setOnDelete(() => {
        openAlert({
          message: '수당명세서를 삭제하시겠습니까?',
          confirmText: '삭제',
          cancelText: '취소',
          onConfirm: async () => {
            try {
              await deleteOvertime(id)
              openAlert({
                message: '삭제되었습니다.',
                onConfirm: () => router.push('/overtime'),
              })
            } catch (error) {
              openAlert({ message: getErrorMessage(error, '삭제에 실패했습니다.') })
            }
          },
        })
      })
    }
    return () => {
      setOnDelete(null)
      setShowDeleteButton(false)
    }
  }, [isNew, id, setOnDelete, setShowDeleteButton, router, deleteOvertime, openAlert])

  // 저장
  const handleSave = async () => {
    if (isNew && !selectedEmployeeInfoId) {
      openAlert({ message: '직원을 선택해주세요.' })
      return
    }
    if (!allowanceYearMonth) {
      openAlert({ message: '급여 지급월을 선택해주세요.' })
      return
    }
    if (!calculationStartDate || !calculationEndDate) {
      openAlert({ message: '연장근무 기간을 설정해주세요.' })
      return
    }
    // API 저장 시 근무시간이 0보다 큰 항목만 전송
    const validDetails = details.filter((item) => (item.workHour || 0) > 0)
    if (validDetails.length === 0) {
      openAlert({ message: '근무시간을 입력해주세요.' })
      return
    }
    const validTotalPayment = validDetails.reduce((sum, item) => sum + (item.actualPaymentAmount || 0), 0)
    if (validTotalPayment === 0) {
      openAlert({ message: '급여내역이 0원입니다. 근무시간을 확인해주세요.' })
      return
    }

    try {
      if (isNew) {
        if (!selectedEmployeeInfoId) return
        const request: OvertimeAllowanceCreateRequest = {
          employeeInfoId: selectedEmployeeInfoId,
          allowanceYearMonth,
          calculationStartDate,
          calculationEndDate,
          paymentDate: paymentDate || undefined,
          remarks: remarks || undefined,
          details: validDetails.map(({ workDay, workHour, breakTimeHour, contractTimelyAmount, applyTimelyAmount, actualOvertimeHours, deductionAmount, actualPaymentAmount }) => ({
            workDay, workHour, breakTimeHour, contractTimelyAmount, applyTimelyAmount, actualOvertimeHours, deductionAmount, actualPaymentAmount,
          })),
        }
        await createOvertime(request)
        openAlert({
          message: '수당명세서가 등록되었습니다.',
          onConfirm: () => router.push('/overtime'),
        })
      } else if (id) {
        const request: OvertimeAllowanceUpdateRequest = {
          allowanceYearMonth,
          calculationStartDate,
          calculationEndDate,
          paymentDate: paymentDate || undefined,
          remarks: remarks || undefined,
          details: validDetails,
        }
        await updateOvertime({ id, data: request })
        openAlert({
          message: '수당명세서가 수정되었습니다.',
          onConfirm: () => router.push('/overtime'),
        })
      }
    } catch (error) {
      openAlert({ message: getErrorMessage(error, '저장에 실패했습니다.') })
    }
  }

  const handleSendEmail = async () => {
    if (!id || isSendingEmail) return
    openAlert({
      message: '수당명세서를 이메일로 전송하시겠습니까?',
      confirmText: '전송',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await sendEmail(id)
          openAlert({ message: '이메일이 전송되었습니다.' })
        } catch (error) {
          openAlert({ message: getErrorMessage(error, '이메일 전송에 실패했습니다.') })
        }
      },
    })
  }

  const handleDownload = async () => {
    if (!id) return
    try {
      await downloadExcel(id)
    } catch (error) {
      openAlert({ message: getErrorMessage(error, '다운로드에 실패했습니다.') })
    }
  }

  // 미리보기
  const handlePreview = () => {
    if (isNew) {
      const selectedEmployee = employeeList.find((emp) => emp.employeeInfoId === selectedEmployeeInfoId)
      const previewData: Partial<OvertimeAllowanceDetail> = {
        memberId: selectedEmployee?.employeeInfoId ?? 0,
        memberName: selectedEmployee ? `${selectedEmployee.employeeName} (${selectedEmployee.employeeNumber})` : '',
        allowanceYearMonth,
        calculationStartDate,
        calculationEndDate,
        paymentDate,
        grossOvertimeAmount: totalPayment,
        totalDeductionAmount: totalDeduction,
        actualOvertimeAmount: actualPayment,
        totalAmount: actualPayment,
        totalWorkDays: details.length,
        totalOvertimeHours: details.reduce((sum, d) => sum + (d.actualOvertimeHours || 0), 0),
        remarks,
        details,
      }
      const formDraft: FormDraft = {
        selectedOfficeId,
        selectedFranchiseId,
        selectedStoreId,
        selectedEmployeeInfoId,
        contractWage,
        allowanceYearMonth,
        calculationStartDate,
        calculationEndDate,
        paymentDate,
        remarks,
        details,
      }
      safeSessionSet(FORM_DRAFT_KEY, formDraft)
      safeSessionSet(PREVIEW_KEY, previewData)
      router.push('/overtime/new/stub')
    } else {
      const previewData: Partial<OvertimeAllowanceDetail> = {
        ...initialData,
        allowanceYearMonth,
        calculationStartDate,
        calculationEndDate,
        paymentDate,
        grossOvertimeAmount: totalPayment,
        totalDeductionAmount: totalDeduction,
        actualOvertimeAmount: actualPayment,
        totalAmount: actualPayment,
        totalWorkDays: details.length,
        totalOvertimeHours: details.reduce((sum, d) => sum + (d.actualOvertimeHours || 0), 0),
        remarks,
        details,
      }
      safeSessionSet(PREVIEW_KEY, previewData)
      safeSessionSet(EDIT_DRAFT_KEY, { id, details })
      router.push(`/overtime/${id}/stub`)
    }
  }

  return (
    <>
      <div className="container sub">
        {!isNew && (
          <div className="pay-head-btn-wrap">
            <button className="pay-head-btn" onClick={handleSendEmail} disabled={isSendingEmail}>
              <i className="email-icon"></i>{isSendingEmail ? '전송 중...' : '이메일 전송'}
            </button>
            <button className="pay-head-btn" onClick={handleDownload} disabled={isDownloading}>
              <i className="download-icon"></i>{isDownloading ? '다운로드 중...' : '급여명세서 다운로드'}
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
                        onChange={(e) => handleEmployeeChange(Number(e.target.value) || undefined)}
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
                      value={allowanceYearMonth}
                      onChange={(e) => handleAllowanceYearMonthChange(e.target.value)}
                    >
                      <option value="">선택</option>
                      {allowanceMonthOptions.map((opt) => (
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
                  <div className="filed-tit">
                    연장근무 기간 <span className="imp">*</span>
                  </div>
                  <div className="flex g6 mb8">
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={calculationStartDate}
                        onChange={(e) => setCalculationStartDate(e.target.value)}
                      />
                    </div>
                    <span>~</span>
                    <div className="date-picker-custom">
                      <input
                        type="date"
                        className="date-picker-input"
                        value={calculationEndDate}
                        onChange={(e) => setCalculationEndDate(e.target.value)}
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
            </div>
          </div>

          {/* 급여 요약 */}
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">급여 요약</div>
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
                  <div className="pay-data-item">
                    <div className="pay-data-item-tit">공제총액 (3.3%)</div>
                    <div className="pay-data-item-value">{formatAmount(totalDeduction)}원</div>
                  </div>
                  <div className="pay-data-item">
                    <div className="pay-data-item-tit">근무일수</div>
                    <div className="pay-data-item-value">{details.length}일</div>
                  </div>
                </div>
              </div>
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
        <button
          className="btn-form block sky brd"
          disabled={isNew ? (!selectedEmployeeInfoId || !calculationStartDate || !calculationEndDate) : (!calculationStartDate || !calculationEndDate)}
          onClick={handlePreview}
        >
          급여내역 미리보기
        </button>
        <button
          className="btn-form block blue"
          onClick={handleSave}
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </>
  )
}
