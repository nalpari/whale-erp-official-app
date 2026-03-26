'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import {
  useCreatePayroll,
  useUpdatePayroll,
  useDeletePayroll,
  useSendPayrollEmail,
} from '@/hooks/queries/use-payroll-queries'
import { getErrorMessage } from '@/lib/api'
import { useHeadOfficeTree, useStoreOptions } from '@/hooks/queries/use-store-queries'
import { useAuthStore } from '@/store/useAuthStore'
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

  // 조직 선택 API
  const authHeadOfficeId = useAuthStore((s) => s.headOfficeId)
  const { data: headOfficeTree = [] } = useHeadOfficeTree()
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | undefined>(authHeadOfficeId ?? undefined)
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | undefined>()
  const [selectedStoreId, setSelectedStoreId] = useState<number | undefined>()

  // 선택된 본사의 가맹점 목록
  const selectedOffice = headOfficeTree.find((o) => o.id === selectedOfficeId)
  const franchises = selectedOffice?.franchises ?? []

  // 점포 목록 (가맹점 선택 시 가맹점 기반, 아니면 본사 기반)
  const { data: storeOptions = [] } = useStoreOptions(selectedOfficeId, selectedFranchiseId)

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
  const [payrollYearMonth, setPayrollYearMonth] = useState(initialData?.payrollYearMonth ?? '')
  const [settlementStartDate, setSettlementStartDate] = useState(initialData?.settlementStartDate ?? '')
  const [settlementEndDate, setSettlementEndDate] = useState(initialData?.settlementEndDate ?? '')
  const [paymentDate, setPaymentDate] = useState(initialData?.paymentDate ?? '')
  const [remarks, setRemarks] = useState(initialData?.remarks ?? '')
  const [attachmentFile, setAttachmentFile] = useState<File | undefined>()
  const [useFileMode, setUseFileMode] = useState(false)
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>(initialData?.paymentItems ?? [])
  const [deductionItems, setDeductionItems] = useState<DeductionItem[]>(initialData?.deductionItems ?? [])

  // 금액 계산
  const totalPayment = paymentItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const totalDeduction = deductionItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const actualPayment = totalPayment - totalDeduction

  // PaymentConditionSheet 콜백
  const handlePaymentItemsChange = useCallback((items: PaymentItem[]) => {
    setPaymentItems(items)
  }, [])

  const handleDeductionItemsChange = useCallback((items: DeductionItem[]) => {
    setDeductionItems(items)
  }, [])

  // 저장
  const handleSave = async () => {
    if (!employmentContractId) {
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
          employmentContractId,
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
      }
    } catch (error) {
      alert(getErrorMessage(error, '저장에 실패했습니다.'))
    }
  }

  // 삭제
  const handleDelete = async () => {
    if (!id) return
    if (!confirm('급여명세서를 삭제하시겠습니까?')) return
    try {
      await deleteMutation.mutateAsync(id)
      alert('삭제되었습니다.')
      router.push('/fulltimer')
    } catch (error) {
      alert(getErrorMessage(error, '삭제에 실패했습니다.'))
    }
  }

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
            <button className="pay-head-btn" onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    본사/가맹점/점포 <span className="imp">*</span>
                  </div>
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
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    직원명 <span className="imp">*</span>
                  </div>
                  <div className="block mb8">
                    <button className="btn-form block grey">
                      이전 계약정보 불러오기
                    </button>
                  </div>
                  <div className="block">
                    <select
                      className="select-form"
                      disabled={!isNew}
                      value={employmentContractId ?? ''}
                      onChange={(e) => setEmploymentContractId(Number(e.target.value) || undefined)}
                    >
                      <option value="">
                        {initialData?.employeeName ?? '직원 선택'}
                      </option>
                    </select>
                  </div>
                  {initialData?.employeeNumber && (
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
                    <input
                      type="month"
                      className="select-form"
                      value={
                        payrollYearMonth
                          ? `${payrollYearMonth.slice(0, 4)}-${payrollYearMonth.slice(4)}`
                          : ''
                      }
                      onChange={(e) => {
                        const val = e.target.value.replace(/-/g, '')
                        if (val.length === 6 || val === '') {
                          setPayrollYearMonth(val)
                        }
                      }}
                    />
                  </div>
                  <div className="block">
                    <input
                      type="date"
                      className="input-frame"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      placeholder="지급일"
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
                    onClick={() => setPaymentConditionSheet(true)}
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
                    <dt>지급 항목 상세</dt>
                    {paymentItems.map((item) => (
                      <dd key={item.itemCode}>
                        {item.remarks || item.itemCode}: {formatAmount(item.amount)}원
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
                            <span>{initialData.createdBy ?? '-'}</span>
                            <span>{initialData.createdAt?.slice(0, 10).replace(/-/g, '.') ?? '-'}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>최근수정일</th>
                        <td>
                          <div className="data-list">
                            <span>{initialData.updatedBy ?? '-'}</span>
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
        onPaymentItemsChange={handlePaymentItemsChange}
        onDeductionItemsChange={handleDeductionItemsChange}
      />
    </>
  )
}
