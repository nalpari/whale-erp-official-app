'use client'
import { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  useEmployeeDetail,
  useUpdateEmployee,
  useEmployeeCommonCode,
  useMemberDocuments,
} from '@/hooks/queries/use-employee-queries'
import { useHeadOfficeTree, useStoreOptions } from '@/hooks/queries/use-store-queries'
import { useAuthStore } from '@/store/useAuthStore'
import { getErrorMessage } from '@/lib/api'
import { downloadFile } from '@/lib/api/file'
import type {
  EmployeeWorkStatus,
  EmployeeInfoDetailResponse,
  WorkplaceType,
  MemberDocumentType,
} from '@/types/employee'

const WORK_STATUS_OPTIONS: { label: string; value: EmployeeWorkStatus }[] = [
  { label: '근무', value: 'EMPWK_001' },
  { label: '휴직', value: 'EMPWK_002' },
  { label: '퇴사', value: 'EMPWK_003' },
]

const DOCUMENT_TYPE_LABELS: Record<MemberDocumentType, string> = {
  RESIDENT_REGISTRATION: '주민등록등본',
  FAMILY_RELATION: '가족관계증명서',
  HEALTH_CHECK: '건강진단결과서',
  RESUME: '이력서',
}

const DOCUMENT_TYPES: MemberDocumentType[] = [
  'RESIDENT_REGISTRATION',
  'FAMILY_RELATION',
  'HEALTH_CHECK',
  'RESUME',
]

/**
 * 폼 영역을 별도 컴포넌트로 분리하여 employee 데이터를 prop으로 받는다.
 * 이렇게 하면 useState 초기값에서 employee를 직접 참조할 수 있어
 * isInitialized 패턴(렌더 중 setState)을 제거하고 React Compiler와 호환된다.
 */
function StaffEditForm({ employee }: { employee: EmployeeInfoDetailResponse }) {
  const router = useRouter()
  const employeeId = employee.id
  const headOfficeId = useAuthStore((state) => state.headOfficeId)

  const { data: commonCode } = useEmployeeCommonCode(headOfficeId ?? undefined)
  const { mutateAsync: updateEmployee, isPending: isSaving } = useUpdateEmployee()

  // 본사-가맹점 트리
  const { data: headOfficeTree = [] } = useHeadOfficeTree()

  // 폼 상태 - employee prop에서 초기값 직접 설정
  const [workStatus, setWorkStatus] = useState<string>(employee.workStatus || 'EMPWK_001')
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>(
    employee.workplaceType || 'HEAD_OFFICE',
  )
  const [selectedHeadOfficeId, setSelectedHeadOfficeId] = useState<number>(
    employee.headOfficeOrganizationId,
  )
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(
    employee.franchiseOrganizationId ?? null,
  )
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(
    employee.storeId ?? null,
  )
  const [resignationDate, setResignationDate] = useState(employee.resignationDate || '')
  const [resignationReason, setResignationReason] = useState(employee.resignationReason || '')

  // 점포 옵션 조회 (본사/가맹점 ID 기반)
  const { data: storeOptions = [] } = useStoreOptions(
    selectedHeadOfficeId || undefined,
    selectedFranchiseId ?? undefined,
  )

  // 회원 문서 조회
  const { data: documents = [] } = useMemberDocuments(employee.memberId)

  const employeeClassifications = commonCode?.codeMemoContent?.EMPLOYEE ?? []
  const rankClassifications = commonCode?.codeMemoContent?.RANK ?? []
  const positionClassifications = commonCode?.codeMemoContent?.POSITION ?? []

  const isResigned = workStatus === 'EMPWK_003'

  // 가맹점 옵션 (선택된 본사 기반)
  const franchiseOptions = useMemo(() => {
    const office = headOfficeTree.find((o) => o.id === selectedHeadOfficeId)
    return office?.franchises ?? []
  }, [headOfficeTree, selectedHeadOfficeId])

  // 저장 버튼 활성화 조건: 근무여부, 입사일(읽기전용이므로 이미 존재)
  const canSave = !!workStatus && !!employee.hireDate

  const handleWorkStatusChange = (status: string) => {
    setWorkStatus(status)
    // 퇴사가 아닌 상태로 변경 시 퇴사일/사유 초기화
    if (status !== 'EMPWK_003') {
      setResignationDate('')
      setResignationReason('')
    }
  }

  const handleWorkplaceTypeChange = (type: WorkplaceType) => {
    setWorkplaceType(type)
    // 본사 선택 시 가맹점/점포 초기화
    if (type === 'HEAD_OFFICE') {
      setSelectedFranchiseId(null)
      setSelectedStoreId(null)
    }
  }

  const handleHeadOfficeChange = (value: string) => {
    const id = value ? Number(value) : 0
    setSelectedHeadOfficeId(id)
    setSelectedFranchiseId(null)
    setSelectedStoreId(null)
  }

  const handleFranchiseChange = (value: string) => {
    const id = value ? Number(value) : null
    setSelectedFranchiseId(id)
    setSelectedStoreId(null)
  }

  const handleStoreChange = (value: string) => {
    const id = value ? Number(value) : null
    setSelectedStoreId(id)
  }

  const handleDownloadFile = async (fileId: number) => {
    try {
      await downloadFile(fileId)
    } catch (error) {
      console.error('[StaffEdit] 파일 다운로드 실패:', error)
      alert(getErrorMessage(error, '파일 다운로드에 실패했습니다.'))
    }
  }

  const handleSave = async () => {
    if (!canSave || isSaving) return

    const data = {
      workplaceType,
      headOfficeOrganizationId: selectedHeadOfficeId,
      franchiseOrganizationId: workplaceType === 'FRANCHISE' ? selectedFranchiseId : null,
      storeId: selectedStoreId ?? null,
      workStatus: workStatus || null,
      hireDate: employee.hireDate ?? '',
      resignationDate: isResigned ? resignationDate || null : null,
      resignationReason: isResigned ? resignationReason || null : null,
    }

    try {
      await updateEmployee({ id: employeeId, data })
      alert('저장되었습니다.')
      router.push(`/staff/${employeeId}`)
    } catch (error) {
      alert(getErrorMessage(error, '저장에 실패했습니다.'))
    }
  }

  // 문서 타입별 파일 찾기
  const getDocumentByType = (type: MemberDocumentType) => {
    return documents.find((doc) => doc.documentType === type)
  }

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">직원 기본정보</div>
            </div>

            {/* 근무장소 - editable */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">
                  근무장소 <span className="imp">*</span>
                </div>
                <div className="flex g8">
                  <button
                    className={`radio-btn block${workplaceType === 'HEAD_OFFICE' ? ' act' : ''}`}
                    onClick={() => handleWorkplaceTypeChange('HEAD_OFFICE')}
                  >
                    본사
                  </button>
                  <button
                    className={`radio-btn block${workplaceType === 'FRANCHISE' ? ' act' : ''}`}
                    onClick={() => handleWorkplaceTypeChange('FRANCHISE')}
                  >
                    가맹점
                  </button>
                </div>
              </div>
            </div>

            {/* 본사/가맹점/점포 - editable */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">
                  본사/가맹점/점포 <span className="imp">*</span>
                </div>
                <div>
                  {/* 본사 선택 */}
                  <div className="block mb8">
                    <select
                      className="select-form"
                      value={String(selectedHeadOfficeId || '')}
                      onChange={(e) => handleHeadOfficeChange(e.target.value)}
                    >
                      <option value="">본사 선택</option>
                      {headOfficeTree.map((office) => (
                        <option key={office.id} value={String(office.id)}>
                          {office.name || office.organizationCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 가맹점 선택 (가맹점 모드일 때만) */}
                  {workplaceType === 'FRANCHISE' && (
                    <div className="block mb8">
                      <select
                        className="select-form"
                        value={String(selectedFranchiseId || '')}
                        onChange={(e) => handleFranchiseChange(e.target.value)}
                      >
                        <option value="">가맹점 선택</option>
                        {franchiseOptions.map((franchise) => (
                          <option key={franchise.id} value={String(franchise.id)}>
                            {franchise.name || franchise.organizationCode}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 점포 선택 */}
                  <div className="block">
                    <select
                      className="select-form"
                      value={String(selectedStoreId || '')}
                      onChange={(e) => handleStoreChange(e.target.value)}
                    >
                      <option value="">점포 선택</option>
                      {storeOptions.map((store) => (
                        <option key={store.id} value={String(store.id)}>
                          {store.storeName}
                        </option>
                      ))}
                    </select>
                  </div>
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

            {/* 사번 - read only (disabled, 중복확인 버튼 제거) */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">사번</div>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    value={employee.employeeNumber || ''}
                    disabled
                  />
                </div>
                <div className="s-txt mt10">※ 4~6자리 입력</div>
              </div>
            </div>

            {/* Partner Office 권한 설정 - read only */}
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

            {/* 근무여부 - editable */}
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
                      onClick={() => handleWorkStatusChange(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 입사일 - read only */}
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
                      value={employee.hireDate || ''}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 퇴사일/퇴사사유 - editable when resigned */}
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

            {/* 직원분류 - read only */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">직원분류</div>
                </div>
                <div className="block">
                  <select className="select-form" disabled>
                    <option>
                      {employeeClassifications.find(
                        (item) => item.code === employee.employeeClassification,
                      )?.name ||
                        employee.employeeClassificationName ||
                        '선택'}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* 계약분류 - read only */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">
                    계약분류 <span className="imp">*</span>
                  </div>
                </div>
                <div className="block">
                  <select className="select-form" disabled>
                    <option>
                      {employee.contractClassificationName || '선택'}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* 직급/직책 - read only */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">직급/직책</div>
                </div>
                <div className="block mb8">
                  <select className="select-form" disabled>
                    <option>
                      {rankClassifications.find((item) => item.code === employee.rank)
                        ?.name ||
                        employee.rankName ||
                        '선택'}
                    </option>
                  </select>
                </div>
                <div className="block">
                  <select className="select-form" disabled>
                    <option>
                      {positionClassifications.find(
                        (item) => item.code === employee.position,
                      )?.name ||
                        employee.positionName ||
                        '선택'}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* 생년월일 - read only (33번 보류 항목) */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">생년월일</div>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    value={employee.birthDate || '-'}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* 비상연락처 - read only (33번 보류 항목) */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">비상연락처</div>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    value={employee.emergencyContact || '-'}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* 이메일주소 - read only (33번 보류 항목) */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">이메일주소</div>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    value={employee.email || '-'}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* 주소 - read only (33번 보류 항목) */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">주소</div>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    value={
                      employee.address
                        ? `${employee.address}${employee.addressDetail ? ` ${employee.addressDetail}` : ''}`
                        : '-'
                    }
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* 급여계좌번호 - read only (33번 보류 항목) */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">급여계좌번호</div>
                <div className="block">
                  <input
                    type="text"
                    className="input-frame"
                    value={
                      employee.salaryBank || employee.salaryAccountNumber
                        ? [
                            employee.salaryBank,
                            employee.salaryAccountNumber,
                            employee.salaryAccountHolder,
                          ]
                            .filter(Boolean)
                            .join(' / ')
                        : '-'
                    }
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* 증명서 파일 - read only (useMemberDocuments로 조회) */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">증명서 파일</div>
                </div>
                {DOCUMENT_TYPES.map((type) => {
                  const doc = getDocumentByType(type)
                  return (
                    <div key={type} className="block mb8">
                      <label className="s-txt">{DOCUMENT_TYPE_LABELS[type]}</label>
                      {doc ? (
                        <button
                          className="btn-form block grey"
                          style={{ marginTop: '4px' }}
                          onClick={() => handleDownloadFile(doc.uploadFileId)}
                        >
                          {doc.fileName || '파일 다운로드'}
                        </button>
                      ) : (
                        <input
                          type="text"
                          className="input-frame"
                          value="-"
                          disabled
                          style={{ marginTop: '4px' }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 메모 - read only */}
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">메모</div>
                </div>
                <div className="block">
                  <textarea
                    className="textarea-form"
                    value={employee.memo || ''}
                    disabled
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <div className="">
          <button
            className="btn-form block blue"
            onClick={handleSave}
            disabled={!canSave || isSaving}
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </>
  )
}

export default function StaffEdit() {
  const router = useRouter()
  const params = useParams()
  const employeeId = params.id ? Number(params.id) : null

  const { data: employee, isLoading, isError } = useEmployeeDetail(employeeId)

  if (isError) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#e74c3c' }}>
          직원 정보를 불러올 수 없습니다.
          <div style={{ marginTop: '12px' }}>
            <button className="btn-form grey" onClick={() => router.back()}>
              뒤로 가기
            </button>
          </div>
        </div>
      </div>
    )
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

  // key={employee.id}로 employee 데이터가 변경되면 폼을 리마운트하여 초기화
  return <StaffEditForm key={employee.id} employee={employee} />
}
