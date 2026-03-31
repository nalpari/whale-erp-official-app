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
import { getErrorMessage } from '@/lib/api'
import { downloadFile } from '@/lib/api/file'

const formatDate = (date?: string | null) => {
  if (!date) return '-'
  return date.replace(/-/g, '.')
}

export default function StaffDetail() {
  const router = useRouter()
  const params = useParams()
  const employeeId = params.id ? Number(params.id) : null

  const { data: employee, isLoading } = useEmployeeDetail(employeeId)
  const memberId = employee?.memberId ?? null
  const { data: careers } = useEmployeeCareers(memberId)
  const { data: certificates } = useEmployeeCertificates(memberId)
  const { data: documents } = useMemberDocuments(memberId)
  const sendEmailMutation = useSendRegistrationEmail()
  const deleteMutation = useDeleteEmployee()
  const withdrawMutation = useWithdrawEmployeeMember()

  const handleSendInvite = async () => {
    if (!employeeId) return
    if (!confirm('직원 회원 가입 요청을 전송하시겠습니까?')) return
    try {
      await sendEmailMutation.mutateAsync(employeeId)
      alert('전송되었습니다.')
    } catch (error) {
      alert(getErrorMessage(error, '전송에 실패했습니다.'))
    }
  }

  const handleDelete = async () => {
    if (!employeeId) return
    if (!confirm('해당 직원 정보를 삭제하시겠습니까?')) return
    try {
      await deleteMutation.mutateAsync(employeeId)
      alert('삭제되었습니다.')
      router.push('/staff')
    } catch (error) {
      alert(getErrorMessage(error, '삭제에 실패했습니다.'))
    }
  }

  const handleWithdraw = async () => {
    if (!employeeId) return
    if (!confirm('해당 직원을 탈퇴 처리하시겠습니까?\n탈퇴 처리하면 로그인 할 수 없습니다.')) return
    try {
      await withdrawMutation.mutateAsync(employeeId)
      alert('탈퇴 처리되었습니다.')
    } catch (error) {
      alert(getErrorMessage(error, '탈퇴 처리에 실패했습니다.'))
    }
  }

  const handleFileDownload = async (fileId: number) => {
    try {
      await downloadFile(fileId)
    } catch (error) {
      alert(getErrorMessage(error, '파일 다운로드에 실패했습니다.'))
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

  const residentDoc = documents?.find((d) => d.documentType === 'RESIDENT_REGISTRATION')
  const familyDoc = documents?.find((d) => d.documentType === 'FAMILY_RELATION')
  const healthDoc = documents?.find((d) => d.documentType === 'HEALTH_CHECK')
  const resumeDoc = documents?.find((d) => d.documentType === 'RESUME')

  // 초대 상태: 회원 ID가 있으면 초대완료
  const isInviteCompleted = !!employee.memberId
  const inviteStatusText = isInviteCompleted ? '초대완료' : '초대요청'

  return (
    <div className="container sub">
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
                {/* 정의서 #3-1: 초대요청 상태일 때만 표시 */}
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

        {/* 기본 정보 */}
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
                    <td>{formatDate(employee.hireDate)}</td>
                  </tr>
                  {employee.resignationDate && (
                    <tr>
                      <th>퇴사일</th>
                      <td>
                        <div className="data-list">
                          <span>{formatDate(employee.resignationDate)}</span>
                          {employee.resignationReason && (
                            <span>{employee.resignationReason}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  {healthDoc?.expiryDate && (
                    <tr>
                      <th>건강진단만료일</th>
                      <td>{formatDate(healthDoc.expiryDate)}</td>
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
                  {employee.franchiseOrganizationName && (
                    <tr>
                      <th>가맹점</th>
                      <td>
                        <div className="ellipsis">{employee.franchiseOrganizationName}</div>
                      </td>
                    </tr>
                  )}
                  {employee.storeName && (
                    <tr>
                      <th>점포</th>
                      <td>
                        <div className="ellipsis">{employee.storeName}</div>
                      </td>
                    </tr>
                  )}
                  {employee.memberAuthorityNames && employee.memberAuthorityNames.length > 0 && (
                    <tr>
                      <th>파트너 오피스 권한</th>
                      <td>{employee.memberAuthorityNames.join(', ')}</td>
                    </tr>
                  )}
                  {(employee.salaryBank || employee.salaryAccountNumber) && (
                    <tr>
                      <th>급여계좌</th>
                      <td>
                        {employee.salaryBank && <div>{employee.salaryBank}</div>}
                        {employee.salaryAccountNumber && <div>{employee.salaryAccountNumber}</div>}
                        {employee.salaryAccountHolder && <div>{employee.salaryAccountHolder}</div>}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 개인 정보 */}
            {(employee.birthDate || employee.mobilePhone || employee.email || employee.address) && (
              <div className="sub-item-bx">
                <table className="info-table">
                  <colgroup>
                    <col style={{ width: '95px' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    {employee.birthDate && (
                      <tr>
                        <th>생일</th>
                        <td>{formatDate(employee.birthDate)}</td>
                      </tr>
                    )}
                    {employee.mobilePhone && (
                      <tr>
                        <th>전화번호</th>
                        <td>{employee.mobilePhone}</td>
                      </tr>
                    )}
                    {employee.email && (
                      <tr>
                        <th>이메일</th>
                        <td>{employee.email}</td>
                      </tr>
                    )}
                    {employee.address && (
                      <tr>
                        <th>주소</th>
                        <td>
                          {employee.address}
                          {employee.addressDetail ? ` ${employee.addressDetail}` : ''}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 증명서 파일 */}
            {(residentDoc || familyDoc || healthDoc || resumeDoc) && (
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
                    {resumeDoc && (
                      <tr>
                        <th>이력서</th>
                        <td>
                          <button
                            className="down-btn"
                            onClick={() => handleFileDownload(resumeDoc.uploadFileId)}
                          >
                            {resumeDoc.fileName || '이력서.pdf'}
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

        {/* 로그인 정보 및 권한 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">로그인 정보</div>
              {/* 정의서 #1-2: 가입완료 상태일 경우 탈퇴 처리 버튼 활성화 */}
              {isInviteCompleted && (
                <div className="sub-cont-btn-wrap">
                  <button
                    className="btn-s red"
                    onClick={handleWithdraw}
                  >
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
                    <th>승인상태</th>
                    <td>{inviteStatusText}</td>
                  </tr>
                  {employee.memberLoginId && (
                    <tr>
                      <th>로그인ID</th>
                      <td>{employee.memberLoginId}</td>
                    </tr>
                  )}
                  {employee.memberAuthorityNames && employee.memberAuthorityNames.length > 0 && (
                    <tr>
                      <th>권한</th>
                      <td>{employee.memberAuthorityNames.join(', ')}</td>
                    </tr>
                  )}
                  {employee.emailSendDate && (
                    <tr>
                      <th>요청일</th>
                      <td>{formatDate(employee.emailSendDate)}</td>
                    </tr>
                  )}
                  {employee.memberCreatedAt && (
                    <tr>
                      <th>가입일</th>
                      <td>{formatDate(employee.memberCreatedAt)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 근로계약서 링크 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <button
              className="contract-link"
              onClick={() => router.push(`/contract`)}
            >
              <div className="contract-inner">
                <div className="contract-tit">근로계약서</div>
                <div className="auto-right">
                  <i className="contract-arr"></i>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 경력 정보 */}
        {careers && careers.length > 0 && (
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">경력 정보</div>
                <div className="sub-cont-btn-wrap">
                  <button className="sub-down-btn"></button>
                </div>
              </div>
              <div className="sub-item-bx">
                <ul className="career-wrap">
                  {careers.map((career) => (
                    <li className="career-item" key={career.id}>
                      <div className="career-item-tit">{career.companyName}</div>
                      <div className="career-item-desc">
                        <span>
                          {formatDate(career.startDate)} ~{' '}
                          {career.endDate ? formatDate(career.endDate) : '재직중'}
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
            </div>
          </div>
        )}

        {/* 자격증 정보 */}
        {certificates && certificates.length > 0 && (
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">자격증 정보</div>
              </div>
              <div className="sub-item-bx">
                <ul className="qualifications-wrap">
                  {certificates.map((cert) => (
                    <li className="qualifications-item" key={cert.id}>
                      <div className="qualifications-item-tit">{cert.certificateName}</div>
                      <div className="qualifications-item-date">
                        {formatDate(cert.acquisitionDate)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
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
                        <span>{formatDate(employee.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>최근수정일</th>
                    <td>
                      <div className="data-list">
                        {employee.updatedByName && <span>{employee.updatedByName}</span>}
                        <span>{formatDate(employee.updatedAt)}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 삭제/목록 버튼 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="flex g8">
              <button className="btn-form block red" onClick={handleDelete}>
                삭제
              </button>
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
