'use client'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import {
  useEmployeeDetail,
  useEmployeeCareers,
  useEmployeeCertificates,
  useMemberDocuments,
  useSendRegistrationEmail,
  useDeleteEmployee,
  useWithdrawEmployeeMember,
} from '@/hooks/queries/use-employee-queries'
import { usePopupControler } from '@/store/usePopupControler'
import { isHealthCheckExpired } from '@/lib/constants'
import { getErrorMessage } from '@/lib/api'
import { downloadFile } from '@/lib/api/file'

export default function StaffDetail() {
  const router = useRouter()
  const params = useParams()
  const employeeId = params.id ? Number(params.id) : null
  const openAlert = usePopupControler((s) => s.openAlert)

  const { data: employee, isLoading, isError } = useEmployeeDetail(employeeId)
  const memberId = employee?.memberId ?? null
  const { data: careers } = useEmployeeCareers(memberId)
  const { data: certificates } = useEmployeeCertificates(memberId)
  const { data: documents } = useMemberDocuments(memberId)
  const sendEmailMutation = useSendRegistrationEmail()
  const deleteMutation = useDeleteEmployee()
  const withdrawMutation = useWithdrawEmployeeMember()

  const handleSendInvite = () => {
    if (!employeeId) return
    openAlert({
      message: '직원 회원 가입 요청을 전송하시겠습니까?',
      confirmText: '전송',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await sendEmailMutation.mutateAsync(employeeId)
          openAlert({ message: '전송되었습니다.', confirmText: '확인' })
        } catch (error) {
          // Alert.tsx에서 에러 시 closeAlert 안 함 — 후속 alert 정상 표시
          openAlert({ message: getErrorMessage(error, '전송에 실패했습니다.'), confirmText: '확인' })
        }
      },
    })
  }

  const handleDelete = () => {
    if (!employeeId) return
    openAlert({
      message: '해당 직원을 삭제하시겠습니까?\n삭제하면 더 이상 매장정보에 접근할 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(employeeId)
          openAlert({
            message: '삭제되었습니다.',
            confirmText: '확인',
            onConfirm: () => router.push('/staff'),
          })
        } catch (error) {
          openAlert({ message: getErrorMessage(error, '삭제에 실패했습니다.'), confirmText: '확인' })
        }
      },
    })
  }

  const handleWithdraw = () => {
    if (!employeeId) return
    openAlert({
      message: '해당 직원을 탈퇴 처리하시겠습니까?\n탈퇴 처리하면 로그인 할 수 없습니다.',
      confirmText: '탈퇴 처리',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await withdrawMutation.mutateAsync(employeeId)
          openAlert({ message: '탈퇴 처리되었습니다.', confirmText: '확인' })
        } catch (error) {
          openAlert({ message: getErrorMessage(error, '탈퇴 처리에 실패했습니다.'), confirmText: '확인' })
        }
      },
    })
  }

  const handleFileDownload = async (fileId: number) => {
    try {
      await downloadFile(fileId)
    } catch (error) {
      openAlert({ message: getErrorMessage(error, '파일 다운로드에 실패했습니다.'), confirmText: '확인' })
    }
  }

  if (isError) {
    return (
      <div className="container sub">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#e74c3c' }}>
          직원 정보를 불러올 수 없습니다.
          <div style={{ marginTop: '12px' }}>
            <button className="btn-form grey" onClick={() => router.push('/staff')}>
              목록으로 돌아가기
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

  const residentDoc = documents?.find((d) => d.documentType === 'RESIDENT_REGISTRATION')
  const familyDoc = documents?.find((d) => d.documentType === 'FAMILY_RELATION')
  const healthDoc = documents?.find((d) => d.documentType === 'HEALTH_CHECK')
  const resumeDoc = documents?.find((d) => d.documentType === 'RESUME')

  const isInviteCompleted = !!employee.memberId
  const inviteStatusText = isInviteCompleted ? '초대완료' : '초대요청'
  const healthExpiryDate = healthDoc?.expiryDate ?? null
  const healthExpired = isHealthCheckExpired(healthExpiryDate)

  return (
    <div className="container sub">
      {/* 근로계약서 */}
      <div className="sub-tit-wrap" onClick={() => router.push('/contract')}>
        <div className="sub-tit">
          <span className="sub-s-txt">근로계약서</span>
        </div>
        <div className="auto-right flex g8">
          {/* TODO: 근로계약관리 PR에서 상태배지 + 갱신알림 아이콘 연동 */}
          <button className="contract-arr"></button>
        </div>
      </div>
      <div className="sub-content-body">
        {/* 메모 */}
        {employee.memo && (
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-item-bx">
                <div className="memo-wrap">
                  <div className="memo-icon"></div>
                  <div className="memo-txt">{employee.memo}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 직원 프로필 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="staff-detail-wrap">
              <div className="staff-detail-info-bx">
                <div className="staff-icon">
                  <i className={`staff-icon-img ${isInviteCompleted ? 'complete' : 'request'}`}></i>
                  <Image
                    src="/assets/images/layout/avatar01.svg"
                    alt="staff-icon"
                    width={54}
                    height={54}
                  />
                </div>
                <div className="staff-detail-info">
                  <div className="staff-name">
                    <span>{employee.employeeName}님</span>
                    <div className="staff-job">
                      {employee.rankName && <span>{employee.rankName}</span>}
                      {employee.positionName && <span>{employee.positionName}</span>}
                    </div>
                  </div>
                  <div className="staff-data">
                    <span className="badge grey">{employee.employeeNumber}</span>
                    {employee.employeeClassificationName && (
                      <span className="badge grey">{employee.employeeClassificationName}</span>
                    )}
                    {employee.contractClassificationName && (
                      <span className="badge grey">{employee.contractClassificationName}</span>
                    )}
                    {employee.workStatusName && (
                      <span className="badge d-green line w">{employee.workStatusName}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="staff-invite-btn-wrap">
                {!isInviteCompleted && (
                  <button className="staff-invite-btn" onClick={handleSendInvite}>
                    <i className="invite"></i>
                    <span>초대링크 재전송</span>
                  </button>
                )}
                {isInviteCompleted && (
                  <div className="staff-invite-btn check">
                    <span>{inviteStatusText}</span>
                  </div>
                )}
                <button
                  className="staff-edit-btn"
                  onClick={() => router.push(`/staff/${employeeId}/edit`)}
                ></button>
              </div>
            </div>
          </div>
        </div>

        {/* 입사일/퇴사일/건강진단만료일 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: '95px' }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>입사일</th>
                    <td>{employee.hireDate || '-'}</td>
                  </tr>
                  {employee.resignationDate && (
                    <tr>
                      <th>퇴사일</th>
                      <td>
                        <div className="data-list">
                          <span>{employee.resignationDate}</span>
                          {employee.resignationReason && (
                            <span>{employee.resignationReason}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  {healthExpiryDate && (
                    <tr>
                      <th>건강진단만료일</th>
                      <td>
                        {healthExpired ? (
                          <span className="imp">{healthExpiryDate}</span>
                        ) : (
                          healthExpiryDate
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 조직 정보 */}
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: '95px' }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>본사</th>
                    <td>{employee.headOfficeOrganizationName || '-'}</td>
                  </tr>
                  <tr>
                    <th>가맹점</th>
                    <td>{employee.franchiseOrganizationName || '-'}</td>
                  </tr>
                  <tr>
                    <th>점포</th>
                    <td>{employee.storeName || '-'}</td>
                  </tr>
                  <tr>
                    <th>Partner Office 권한</th>
                    <td>
                      {employee.memberAuthorityNames && employee.memberAuthorityNames.length > 0
                        ? employee.memberAuthorityNames.join(', ')
                        : '-'}
                    </td>
                  </tr>
                  <tr>
                    <th>급여계좌</th>
                    <td>
                      {employee.salaryBank || employee.salaryAccountNumber ? (
                        <>
                          {employee.salaryBank && <div>{employee.salaryBank}</div>}
                          {employee.salaryAccountNumber && <div>{employee.salaryAccountNumber}</div>}
                          {employee.salaryAccountHolder && <div>{employee.salaryAccountHolder}</div>}
                        </>
                      ) : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 개인정보 */}
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: '95px' }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>생일</th>
                    <td>{employee.birthDate || '-'}</td>
                  </tr>
                  <tr>
                    <th>전화번호</th>
                    <td>{employee.mobilePhone || '-'}</td>
                  </tr>
                  <tr>
                    <th>이메일</th>
                    <td>{employee.email || '-'}</td>
                  </tr>
                  <tr>
                    <th>주소</th>
                    <td>
                      {employee.address
                        ? `${employee.address}${employee.addressDetail ? ` ${employee.addressDetail}` : ''}`
                        : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 증명서 파일 */}
            {(residentDoc || familyDoc || healthDoc) && (
              <div className="sub-item-bx">
                <table className="info-table">
                  <colgroup>
                    <col style={{ width: '95px' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    {residentDoc && (
                      <tr>
                        <th>주민등록등본</th>
                        <td>
                          <button
                            className="down-btn"
                            onClick={() => handleFileDownload(residentDoc.uploadFileId)}
                          >
                            {residentDoc.fileName || '주민등록등본.pdf'}
                          </button>
                        </td>
                      </tr>
                    )}
                    {familyDoc && (
                      <tr>
                        <th>가족관계증명서</th>
                        <td>
                          <button
                            className="down-btn"
                            onClick={() => handleFileDownload(familyDoc.uploadFileId)}
                          >
                            {familyDoc.fileName || '가족관계증명서.pdf'}
                          </button>
                        </td>
                      </tr>
                    )}
                    {healthDoc && (
                      <tr>
                        <th>건강진단결과서</th>
                        <td>
                          <button
                            className="down-btn"
                            onClick={() => handleFileDownload(healthDoc.uploadFileId)}
                          >
                            {healthDoc.fileName || '건강진단결과서.pdf'}
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* 로그인 정보 — TODO: ERP 관리자만 표시 여부 확인 필요 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">로그인 정보</div>
              {isInviteCompleted && (
                <div className="sub-cont-btn-wrap">
                  <button className="btn-s red" onClick={handleWithdraw}>
                    탈퇴 처리
                  </button>
                </div>
              )}
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: '95px' }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>로그인ID</th>
                    <td>{employee.memberLoginId || '-'}</td>
                  </tr>
                  <tr>
                    <th>초대요청일</th>
                    <td>{employee.emailSendDate ? employee.emailSendDate.split('T')[0] : '-'}</td>
                  </tr>
                  <tr>
                    <th>초대완료일</th>
                    <td>{employee.memberCreatedAt ? employee.memberCreatedAt.split('T')[0] : '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 경력정보 */}
        {memberId && (
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">경력정보</div>
              </div>
              {/* 이력서 파일: 경력과 무관하게 표시 */}
              {resumeDoc && (
                <div className="sub-item-bx">
                  <button
                    className="down-btn"
                    onClick={() => handleFileDownload(resumeDoc.uploadFileId)}
                  >
                    {resumeDoc.fileName || '이력서.pdf'}
                  </button>
                </div>
              )}
              {careers && careers.length > 0 ? (
                <>
                  <div className="sub-item-bx">
                    <ul className="career-wrap">
                      {careers.map((career) => (
                        <li className="career-item" key={career.id}>
                          <div className="career-item-tit">{career.companyName}</div>
                          <div className="career-item-desc">
                            <span>
                              {career.startDate} ~{' '}
                              {career.endDate || '재직중'}
                            </span>
                            <div className="data-list">
                              {career.contractClassificationName && (
                                <span>{career.contractClassificationName}</span>
                              )}
                              {career.jobDescription && <span>{career.jobDescription}</span>}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="sub-item-bx">
                  <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                    등록된 정보가 없습니다.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 자격증 정보 */}
        {memberId && (
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">자격증정보</div>
              </div>
              {certificates && certificates.length > 0 ? (
                <div className="sub-item-bx">
                  <ul className="qualifications-wrap">
                    {certificates.map((cert) => (
                      <li className="qualifications-item" key={cert.id}>
                        <div className="qualifications-item-tit">{cert.certificateName}</div>
                        <div className="qualifications-item-date">
                          {cert.acquisitionDate}
                          {cert.validityStartDate && cert.validityEndDate && (
                            <span> ({cert.validityStartDate}~{cert.validityEndDate})</span>
                          )}
                        </div>
                        {cert.certificateFileId != null && cert.certificateFileName && (
                          <button
                            className="down-btn"
                            onClick={() => {
                              if (cert.certificateFileId != null) {
                                handleFileDownload(cert.certificateFileId)
                              }
                            }}
                          >
                            {cert.certificateFileName}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="sub-item-bx">
                  <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                    등록된 정보가 없습니다.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 등록 및 수정 이력 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">등록 및 수정이력</div>
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
                        {employee.createdByName && <span>{employee.createdByName}</span>}
                        <span>{employee.createdAt ? employee.createdAt.split('T')[0] : '-'}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>최근수정일</th>
                    <td>
                      <div className="data-list">
                        {employee.updatedByName && <span>{employee.updatedByName}</span>}
                        <span>{employee.updatedAt ? employee.updatedAt.split('T')[0] : '-'}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 삭제/목록 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="flex g8">
              {(employee.isEmailSend || isInviteCompleted) && (
                <button className="btn-form block red" onClick={handleDelete}>
                  삭제
                </button>
              )}
              <button className="btn-form block grey" onClick={() => router.push('/staff')}>
                목록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
