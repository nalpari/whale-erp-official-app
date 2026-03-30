'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  useEmployeeDetail,
  useUpdateEmployee,
  useUpdateEmployeeWithFiles,
  useCheckEmployeeNumber,
  useEmployeeCommonCode,
} from '@/hooks/queries/use-employee-queries'
import { useAuthStore } from '@/store/useAuthStore'
import { getErrorMessage } from '@/lib/api'
import type { EmployeeWorkStatus, EmployeeFiles } from '@/types/employee'

const WORK_STATUS_OPTIONS: { label: string; value: EmployeeWorkStatus }[] = [
  { label: '근무', value: 'EMPWK_001' },
  { label: '휴직', value: 'EMPWK_002' },
  { label: '퇴사', value: 'EMPWK_003' },
]

const CONTRACT_CLASSIFICATION_OPTIONS = [
  { label: '선택', value: '' },
  { label: '정직원', value: 'CNTCFWK_001' },
  { label: '계약직', value: 'CNTCFWK_002' },
  { label: '파트타이머', value: 'CNTCFWK_003' },
]

export default function StaffEdit() {
  const router = useRouter()
  const params = useParams()
  const employeeId = params.id ? Number(params.id) : null
  const headOfficeId = useAuthStore((state) => state.headOfficeId)

  const { data: employee, isLoading } = useEmployeeDetail(employeeId)
  const { data: commonCode } = useEmployeeCommonCode(headOfficeId ?? undefined)
  const updateMutation = useUpdateEmployee()
  const updateWithFilesMutation = useUpdateEmployeeWithFiles()
  const checkNumberMutation = useCheckEmployeeNumber()

  const employeeClassifications = commonCode?.codeMemoContent?.EMPLOYEE ?? []
  const rankClassifications = commonCode?.codeMemoContent?.RANK ?? []
  const positionClassifications = commonCode?.codeMemoContent?.POSITION ?? []

  // 폼 상태
  const [workStatus, setWorkStatus] = useState<string>('')
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [employeeClassification, setEmployeeClassification] = useState('')
  const [contractClassification, setContractClassification] = useState('')
  const [rank, setRank] = useState('')
  const [position, setPosition] = useState('')
  const [hireDate, setHireDate] = useState('')
  const [resignationDate, setResignationDate] = useState('')
  const [resignationReason, setResignationReason] = useState('')
  const [memo, setMemo] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  // 파일 상태
  const [files, setFiles] = useState<EmployeeFiles>({})
  const hasFiles = Object.values(files).some((f) => f != null)

  // employee 로딩 완료 시 폼 초기화 (한 번만)
  if (employee && !isInitialized) {
    setWorkStatus(employee.workStatus || 'EMPWK_001')
    setEmployeeNumber(employee.employeeNumber || '')
    setEmployeeClassification(employee.employeeClassification || '')
    setContractClassification(employee.contractClassification || '')
    setRank(employee.rank || '')
    setPosition(employee.position || '')
    setHireDate(employee.hireDate || '')
    setResignationDate(employee.resignationDate || '')
    setResignationReason(employee.resignationReason || '')
    setMemo(employee.memo || '')
    setIsInitialized(true)
  }

  const isResigned = workStatus === 'EMPWK_003'

  const handleCheckEmployeeNumber = async () => {
    if (!employeeNumber || !headOfficeId) return
    try {
      const result = await checkNumberMutation.mutateAsync({
        employeeNumber,
        headOfficeOrganizationId: headOfficeId,
        franchiseOrganizationId: employee?.franchiseOrganizationId,
        storeId: employee?.storeId,
      })
      if (result.isDuplicate) {
        alert('이미 사용 중인 사번입니다.')
      } else {
        alert('사용 가능한 사번입니다.')
      }
    } catch (error) {
      alert(getErrorMessage(error, '사번 확인에 실패했습니다.'))
    }
  }

  const handleSave = async () => {
    if (!employeeId) return
    if (!hireDate) {
      alert('입사일은 필수 입력입니다.')
      return
    }
    if (memo.length > 100) {
      alert('100자 이상 입력할 수 없습니다.')
      return
    }

    const data = {
      employeeNumber: employeeNumber || null,
      workStatus: workStatus || null,
      employeeClassification: employeeClassification || null,
      contractClassification: contractClassification || null,
      rank: rank || null,
      position: position || null,
      hireDate,
      resignationDate: isResigned ? (resignationDate || null) : null,
      resignationReason: isResigned ? (resignationReason || null) : null,
      memo: memo || null,
    }

    try {
      if (hasFiles) {
        await updateWithFilesMutation.mutateAsync({ id: employeeId, data, files })
      } else {
        await updateMutation.mutateAsync({ id: employeeId, data })
      }
      alert('저장되었습니다.')
      router.push(`/staff/${employeeId}`)
    } catch (error) {
      alert(getErrorMessage(error, '저장에 실패했습니다.'))
    }
  }

  if (isLoading) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          불러오는 중...
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          직원 정보를 찾을 수 없습니다.
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">직원 기본정보</div>
            </div>

            {/* 근무장소 - read only */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">
                  근무장소 <span className="imp">*</span>
                </div>
                <div className="flex g8">
                  <button
                    className={`radio-btn block${employee.workplaceType === 'HEAD_OFFICE' ? ' act' : ''}`}
                    disabled
                  >
                    본사
                  </button>
                  <button
                    className={`radio-btn block${employee.workplaceType === 'FRANCHISE' ? ' act' : ''}`}
                    disabled
                  >
                    가맹점
                  </button>
                </div>
              </div>
            </div>

            {/* 본사/가맹점/점포 - read only */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">
                  본사/가맹점/점포 <span className="imp">*</span>
                </div>
                <div>
                  <div className="block mb8">
                    <select className="select-form" disabled>
                      <option>{employee.headOfficeOrganizationName || '본사 선택'}</option>
                    </select>
                  </div>
                  {employee.franchiseOrganizationName && (
                    <div className="block mb8">
                      <select className="select-form" disabled>
                        <option>{employee.franchiseOrganizationName}</option>
                      </select>
                    </div>
                  )}
                  {employee.storeName && (
                    <div className="block">
                      <select className="select-form" disabled>
                        <option>{employee.storeName}</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 직원명 - read only */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">
                  직원명<span className="imp">*</span>
                </div>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    value={employee.employeeName}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* 휴대폰 번호 - read only */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">
                  휴대폰 번호<span className="imp"> *</span>
                </div>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    value={employee.mobilePhone || ''}
                    disabled
                  />
                </div>
                <div className="s-txt mt10">※ 숫자만 입력 가능</div>
              </div>
            </div>

            {/* 사번 */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">사번</div>
                <div className="block mb8">
                  <input
                    type="text"
                    className="input-frame"
                    value={employeeNumber}
                    onChange={(e) => setEmployeeNumber(e.target.value)}
                  />
                </div>
                <div className="block">
                  <button
                    className="btn-form block grey"
                    onClick={handleCheckEmployeeNumber}
                  >
                    중복 확인
                  </button>
                </div>
                <div className="s-txt mt10">※ 4~6자리 입력</div>
              </div>
            </div>

            {/* Partner Office 권한 설정 */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">Partner Office 권한 설정</div>
                </div>
                <div className="block">
                  <select className="select-form" disabled>
                    <option>
                      {employee.memberAuthorityNames?.join(', ') || '선택'}
                    </option>
                  </select>
                </div>
                <div className="s-txt mt10">
                  ※ 직원이 Partner Office에서 관리자로 겸임할 때 사용합니다.
                </div>
              </div>
            </div>

            {/* 근무여부 */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">
                  근무여부 <span className="imp">*</span>
                </div>
                <div className="flex g8">
                  {WORK_STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`radio-btn block${workStatus === opt.value ? ' act' : ''}`}
                      onClick={() => setWorkStatus(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 입사일 */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">
                  입사일 <span className="imp">*</span>
                </div>
                <div className="block">
                  <div className="date-picker-custom">
                    <input
                      type="date"
                      className="date-picker-input"
                      value={hireDate}
                      onChange={(e) => setHireDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 퇴사일/퇴사사유 */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">퇴사일/퇴사사유</div>
                <div className="block mb8">
                  <div className="date-picker-custom">
                    <input
                      type="date"
                      className="date-picker-input"
                      value={resignationDate}
                      onChange={(e) => setResignationDate(e.target.value)}
                      disabled={!isResigned}
                    />
                  </div>
                </div>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    value={resignationReason}
                    onChange={(e) => setResignationReason(e.target.value)}
                    disabled={!isResigned}
                    placeholder="퇴사 사유 입력"
                  />
                </div>
              </div>
            </div>

            {/* 직원분류 */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">직원분류</div>
                </div>
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
            </div>

            {/* 계약분류 */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">
                    계약분류 <span className="imp">*</span>
                  </div>
                </div>
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
            </div>

            {/* 직급/직책 */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">직급/직책</div>
                </div>
                <div className="block mb8">
                  <select
                    className="select-form"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                  >
                    <option value="">선택</option>
                    {rankClassifications.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="block">
                  <select
                    className="select-form"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <option value="">선택</option>
                    {positionClassifications.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 증명서 파일 업로드 */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">증명서 파일</div>
                </div>
                <div className="block mb8">
                  <label className="s-txt">주민등록등본</label>
                  <input
                    type="file"
                    className="input-frame"
                    onChange={(e) =>
                      setFiles((prev) => ({
                        ...prev,
                        residentRegistrationFile: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
                <div className="block mb8">
                  <label className="s-txt">가족관계증명서</label>
                  <input
                    type="file"
                    className="input-frame"
                    onChange={(e) =>
                      setFiles((prev) => ({
                        ...prev,
                        familyRelationFile: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
                <div className="block mb8">
                  <label className="s-txt">건강진단결과서</label>
                  <input
                    type="file"
                    className="input-frame"
                    onChange={(e) =>
                      setFiles((prev) => ({
                        ...prev,
                        healthCheckFile: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
                <div className="block">
                  <label className="s-txt">이력서</label>
                  <input
                    type="file"
                    className="input-frame"
                    onChange={(e) =>
                      setFiles((prev) => ({
                        ...prev,
                        resumeFile: e.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* 메모 */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">메모</div>
                </div>
                <div className="block">
                  <textarea
                    className="textarea-form"
                    placeholder="관리자용 메모를 작성할 수 있습니다."
                    maxLength={100}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <div className="">
          <button className="btn-form block blue" onClick={handleSave}>
            저장하기
          </button>
        </div>
      </div>
    </>
  )
}
