'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePopupControler } from '@/store/usePopupControler'
import {
  useSendContractEmail,
  useDownloadContractDocx,
  useContractsByEmployee,
} from '@/hooks/queries/use-contract-queries'
import { useEmployeeDetail } from '@/hooks/queries/use-employee-queries'
import { downloadFile } from '@/lib/api/file'
import { getErrorMessage } from '@/lib/api'
import { CONTRACT_STATUS_BADGE } from '@/lib/constants'
import { CONTRACT_COMPREHENSIVE, CONTRACT_NON_COMPREHENSIVE, CONTRACT_PART_TIME, NO_END_DATE } from '@/types/contract'
import BonusTable from '@/components/contract/BonusTable'
import type { ContractDetail as ContractDetailType, DayType } from '@/types/contract'

interface ContractDetailProps {
  initialData?: ContractDetailType
}

const formatDate = (date?: string) => {
  if (!date) return '-'
  return date.slice(0, 10).replace(/-/g, '.')
}

const formatAmount = (amount?: number) => {
  if (amount === undefined || amount === null) return '0'
  return amount.toLocaleString('ko-KR')
}


const DAY_LABEL: Record<DayType, string> = {
  WEEKDAY: '평일',
  SATURDAY: '토요일',
  SUNDAY: '일요일',
  MONDAY: '월요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
  THURSDAY: '목요일',
  FRIDAY: '금요일',
  WEEKEND: '주말',
}

const AVATAR_IMAGES = [
  '/assets/images/layout/avatar01.svg',
  '/assets/images/layout/avatar02.svg',
  '/assets/images/layout/avatar03.svg',
]

function getAvatarSrc(employeeInfoId?: number) {
  if (!employeeInfoId) return AVATAR_IMAGES[0]
  return AVATAR_IMAGES[employeeInfoId % AVATAR_IMAGES.length]
}

export default function ContractDetail({ initialData }: ContractDetailProps) {
  const router = useRouter()

  const openAlert = usePopupControler((s) => s.openAlert)
  const sendEmailMutation = useSendContractEmail()
  const downloadDocxMutation = useDownloadContractDocx()
  const { data: employeeContracts } = useContractsByEmployee(
    initialData?.employeeInfoId ?? 0,
    !!initialData?.employeeInfoId,
  )

  const { data: employeeDetail } = useEmployeeDetail(initialData?.employeeInfoId ?? null)

  const id = initialData?.id
  const header = initialData?.employmentContractHeader
  const salary = initialData?.salaryInfo
  const workHours = initialData?.workHours ?? []
  const contractClassification = header?.contractClassification

  const statusBadge = header?.electronicContractStatus
    ? CONTRACT_STATUS_BADGE[header.electronicContractStatus]
    : null

  // 4대보험 목록 조합
  const insuranceList: string[] = []
  if (header?.healthInsuranceEnrolled) insuranceList.push('건강보험')
  if (header?.nationalPensionEnrolled) insuranceList.push('국민연금')
  if (header?.employmentInsuranceEnrolled) insuranceList.push('고용보험')
  if (header?.workersCompensationEnrolled) insuranceList.push('산재보험')

  // 급여지급일 텍스트
  const salaryCycleLabel = header?.salaryCycleName ?? ''
  const salaryMonthLabel = header?.salaryMonthName ?? ''

  const handleSendEmail = () => {
    if (!id) return
    if (!initialData?.member) {
      openAlert({ message: '회원 연결이 필요합니다.', confirmText: '확인' })
      return
    }
    if (!initialData.member.email) {
      openAlert({ message: '직원의 이메일 주소가 없습니다.', confirmText: '확인' })
      return
    }
    if (!salary) {
      openAlert({ message: '급여정보를 먼저 등록해주세요.', confirmText: '확인' })
      return
    }
    if (!workHours || workHours.length === 0) {
      openAlert({ message: '근무시간 정보를 먼저 등록해주세요.', confirmText: '확인' })
      return
    }
    openAlert({
      message: '직원에게 계약서를 이메일로 전송하시겠습니까?',
      confirmText: '전송',
      cancelText: '취소',
      onConfirm: async () => {
        if (sendEmailMutation.isPending) return
        try {
          await sendEmailMutation.mutateAsync(id)
          openAlert({ message: '이메일이 전송되었습니다.', confirmText: '확인' })
        } catch (error) {
          openAlert({ message: getErrorMessage(error, '이메일 전송에 실패했습니다.'), confirmText: '확인' })
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

  const handleDownloadDocx = async () => {
    if (!id) return
    try {
      await downloadDocxMutation.mutateAsync(id)
    } catch (error) {
      openAlert({ message: getErrorMessage(error, '계약서 다운로드에 실패했습니다.'), confirmText: '확인' })
    }
  }

  // 근무시간 — 근무하는 요일만 표시
  const activeWorkHours = workHours.filter((w) => w.isWork)

  return (
    <>
      <div className="container sub">
        <div className="sub-tit-wrap contract">
          <div className="sub-tit">
            <span className="sub-xs-txt">
              {header?.contractTypeName ?? '-'}
            </span>
          </div>
          <div className="auto-right">
            {statusBadge && (
              <span className={statusBadge.className}>{statusBadge.label}</span>
            )}
          </div>
        </div>
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="staff-detail-wrap">
                <div className="staff-detail-info-bx">
                  <div className="staff-icon">
                    <Image
                      src={getAvatarSrc(initialData?.employeeInfoId)}
                      alt="staff-icon"
                      width={54}
                      height={54}
                    />
                  </div>
                  <div className="staff-detail-info">
                    <div className="staff-name">
                      <span>
                        {initialData?.employeeInfoName
                          ? `${initialData.employeeInfoName}님`
                          : '-'}
                      </span>
                      {(employeeDetail?.rankName || employeeDetail?.positionName) && (
                        <div className="staff-job">
                          {employeeDetail.rankName && <span>{employeeDetail.rankName}</span>}
                          {employeeDetail.positionName && <span>{employeeDetail.positionName}</span>}
                        </div>
                      )}
                    </div>
                    <div className="staff-data">
                      {employeeDetail?.employeeNumber && (
                        <span className="badge grey">{employeeDetail.employeeNumber}</span>
                      )}
                      {employeeDetail?.employeeClassificationName && (
                        <span className="badge grey">{employeeDetail.employeeClassificationName}</span>
                      )}
                      {header?.contractClassificationName && (
                        <span className="badge grey">{header.contractClassificationName}</span>
                      )}
                      {employeeDetail?.workStatusName && (
                        <span className="badge d-green line w">{employeeDetail.workStatusName}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-item-bx">
                <table className="info-table">
                  <colgroup>
                    <col style={{ width: '90px' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>본사</th>
                      <td>{initialData?.headOfficeOrganizationName ?? '-'}</td>
                    </tr>
                    <tr>
                      <th>가맹점</th>
                      <td>
                        <div className="ellipsis">
                          {initialData?.franchiseOrganizationName ?? '-'}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>점포</th>
                      <td>
                        <div className="ellipsis">
                          {initialData?.storeName ?? '-'}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">계약정보</div>
                <div className="sub-cont-btn-wrap">
                  <button
                    className="sub-edit-btn"
                    onClick={() => router.push(`/contract/${id}/edit/info`)}
                  ></button>
                </div>
              </div>
              <div className="sub-item-bx">
                <table className="info-table">
                  <colgroup>
                    <col style={{ width: '90px' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>업무내용</th>
                      <td>
                        {header?.jobDescription
                          ? header.jobDescription.split('\n').map((line, i) => (
                              <div key={i}>{line}</div>
                            ))
                          : <div>-</div>}
                      </td>
                    </tr>
                    <tr>
                      <th>계약분류</th>
                      <td>{header?.contractClassificationName ?? '-'}</td>
                    </tr>
                    <tr>
                      <th>4대 보험</th>
                      <td>
                        {insuranceList.length > 0 ? (
                          <>
                            {insuranceList.slice(0, 2).length > 0 && (
                              <div>{insuranceList.slice(0, 2).join(', ')}</div>
                            )}
                            {insuranceList.slice(2).length > 0 && (
                              <div>{insuranceList.slice(2).join(', ')}</div>
                            )}
                          </>
                        ) : (
                          <div>-</div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>급여지급일</th>
                      <td>
                        <div className="data-list">
                          {salaryCycleLabel && <span>{salaryCycleLabel}</span>}
                          {salaryMonthLabel && header?.salaryDay !== undefined && (
                            <span>{salaryMonthLabel} {header.salaryDay}일</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>계약기간</th>
                      <td>
                        {header?.contractStartDate
                          ? `${formatDate(header.contractStartDate)} ~ ${header.contractEndDate && header.contractEndDate !== NO_END_DATE ? formatDate(header.contractEndDate) : '정함없음'}`
                          : '-'}
                      </td>
                    </tr>
                    <tr>
                      <th>근로계약서</th>
                      <td>
                        {header?.workContractFile ? (
                          <button
                            className="down-btn"
                            onClick={() => {
                              if (header.workContractFile) handleFileDownload(header.workContractFile.id)
                            }}
                          >
                            {header.workContractFile.fileName}
                          </button>
                        ) : '-'}
                      </td>
                    </tr>
                    <tr>
                      <th>임금계약서</th>
                      <td>
                        {header?.wageContractFile ? (
                          <button
                            className="down-btn"
                            onClick={() => {
                              if (header.wageContractFile) handleFileDownload(header.wageContractFile.id)
                            }}
                          >
                            {header.wageContractFile.fileName}
                          </button>
                        ) : '-'}
                      </td>
                    </tr>
                    <tr>
                      <th>계약일</th>
                      <td>{formatDate(header?.contractDate)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">급여정보</div>
                <div className="sub-cont-btn-wrap">
                  <button
                    className="sub-edit-btn"
                    onClick={() => router.push(`/contract/${id}/employ`)}
                  ></button>
                </div>
              </div>
              {!salary && (
                <div className="sub-item-bx">
                  <div className="empty-data">급여정보가 등록되지 않았습니다.</div>
                </div>
              )}
              {salary && (
                <>
                  {/* 포괄연봉제 / 비포괄연봉제: 연봉총액 + 급여 테이블 */}
                  {contractClassification !== CONTRACT_PART_TIME && (
                    <div className="sub-item-bx">
                      <div className="pay-table-header">
                        <div className="pay-table-tit">연봉총액</div>
                        <div className="auto-right">
                          <div className="total-pay">{formatAmount(salary.annualSalary)}원</div>
                        </div>
                      </div>
                      <table className="pay-table">
                        <colgroup>
                          <col />
                          <col width={'50px'} />
                          <col width={'105px'} />
                        </colgroup>
                        <tbody>
                          <tr>
                            <td className="bold">월급여 총액</td>
                            <td></td>
                            <td className="bold al-r">{formatAmount(salary.monthlyTotalSalary)}원</td>
                          </tr>
                          <tr>
                            <td className="bold">통상시급</td>
                            <td></td>
                            <td className="bold al-r">{formatAmount(salary.timelySalary)}원</td>
                          </tr>
                          <tr>
                            <td className="tit">기본급</td>
                            <td className="al-r">{salary.monthlyTime ?? 0}시간</td>
                            <td className="al-r">{formatAmount(salary.monthlyBaseSalary)}원</td>
                          </tr>
                          {/* 포괄연봉제만: 수당 항목 */}
                          {contractClassification === CONTRACT_COMPREHENSIVE && (
                            <>
                              <tr>
                                <td className="tit">연장수당</td>
                                <td className="al-r">{salary.monthlyOvertimeAllowanceTime ?? 0}시간</td>
                                <td className="al-r">{formatAmount(salary.monthlyOvertimeAllowance ?? 0)}원</td>
                              </tr>
                              <tr>
                                <td className="tit">야간수당</td>
                                <td className="al-r">{salary.monthlyNightAllowanceTime ?? 0}시간</td>
                                <td className="al-r">{formatAmount(salary.monthlyNightAllowance ?? 0)}원</td>
                              </tr>
                              <tr>
                                <td className="tit">휴일근무수당</td>
                                <td className="al-r">{salary.monthlyHolidayAllowanceTime ?? 0}시간</td>
                                <td className="al-r">{formatAmount(salary.monthlyHolidayAllowance ?? 0)}원</td>
                              </tr>
                              <tr>
                                <td className="tit">추가휴일근무수당</td>
                                <td className="al-r">{salary.monthlyAddHolidayAllowanceTime ?? 0}시간</td>
                                <td className="al-r">{formatAmount(salary.monthlyAddHolidayAllowance ?? 0)}원</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 포괄/비포괄: 비과세 항목 */}
                  {contractClassification !== CONTRACT_PART_TIME && (
                    <div className="sub-item-bx">
                      <div className="pay-table-header">
                        <div className="pay-table-tit">비과세 항목</div>
                      </div>
                      <table className="pay-table">
                        <colgroup>
                          <col />
                          <col />
                        </colgroup>
                        <tbody>
                          <tr>
                            <td className="tit">식대</td>
                            <td className="al-r">{formatAmount(salary.mealAllowance ?? 0)}원</td>
                          </tr>
                          <tr>
                            <td className="tit">자가운전보조금</td>
                            <td className="al-r">{formatAmount(salary.vehicleAllowance ?? 0)}원</td>
                          </tr>
                          <tr>
                            <td className="tit">육아수당</td>
                            <td className="al-r">{formatAmount(salary.childcareAllowance ?? 0)}원</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 비포괄연봉제: 추가근무시급 */}
                  {contractClassification === CONTRACT_NON_COMPREHENSIVE && (
                    <div className="sub-item-bx">
                      <div className="pay-table-header">
                        <div className="pay-table-tit">추가근무시급</div>
                      </div>
                      <table className="pay-table">
                        <colgroup>
                          <col />
                          <col />
                        </colgroup>
                        <tbody>
                          <tr>
                            <td className="tit">평일시급</td>
                            <td className="al-r">{formatAmount(salary.weekDayAllowanceAmount ?? 0)}원</td>
                          </tr>
                          <tr>
                            <td className="tit">연장근무시급</td>
                            <td className="al-r">{formatAmount(salary.overtimeDayAllowanceAmount ?? 0)}원</td>
                          </tr>
                          <tr>
                            <td className="tit">휴일근무시급</td>
                            <td className="al-r">{formatAmount(salary.holidayAllowanceTimeAmount ?? 0)}원</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 파트타임: 시급 */}
                  {contractClassification === CONTRACT_PART_TIME && (
                    <div className="sub-item-bx">
                      <div className="pay-table-header">
                        <div className="pay-table-tit">시급</div>
                      </div>
                      <table className="pay-table">
                        <colgroup>
                          <col />
                          <col />
                        </colgroup>
                        <tbody>
                          <tr>
                            <td className="tit">평일시급</td>
                            <td className="al-r">{formatAmount(salary.weekDayAllowanceAmount ?? 0)}원</td>
                          </tr>
                          <tr>
                            <td className="tit">연장근무시급</td>
                            <td className="al-r">{formatAmount(salary.overtimeDayAllowanceAmount ?? 0)}원</td>
                          </tr>
                          <tr>
                            <td className="tit">휴일근무시급</td>
                            <td className="al-r">{formatAmount(salary.holidayAllowanceTimeAmount ?? 0)}원</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                </>
              )}
              {/* 공통: 상여금 (계약분류 무관, salary 유무 무관) */}
              <BonusTable bonuses={salary?.bonuses} />
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">계약근무 시간</div>
                <div className="sub-cont-btn-wrap">
                  <button
                    className="sub-edit-btn"
                    onClick={() => router.push(`/contract/${id}/edit/time`)}
                  ></button>
                </div>
              </div>
              <div className="sub-item-bx">
                <table className="info-table">
                  <colgroup>
                    <col style={{ width: '60px' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    {activeWorkHours.length > 0 ? (
                      activeWorkHours.map((wh, i) => (
                        <tr key={wh.id ?? i}>
                          <th>{DAY_LABEL[wh.dayType] ?? wh.dayType}</th>
                          <td>
                            {wh.dayType === 'SATURDAY' && (
                              <div>{wh.everySaturdayWork ? '매주근무' : '격주근무'}</div>
                            )}
                            {wh.dayType === 'SUNDAY' && (
                              <div>{wh.everySundayWork ? '매주근무' : '격주근무'}</div>
                            )}
                            {wh.workStartTime && wh.workEndTime && (
                              <div>{wh.workStartTime.slice(0, 5)} ~ {wh.workEndTime.slice(0, 5)}</div>
                            )}
                            {wh.isBreak && wh.breakStartTime && wh.breakEndTime && (
                              <div>{wh.breakStartTime.slice(0, 5)} ~ {wh.breakEndTime.slice(0, 5)}&nbsp; 휴게시간</div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2}>-</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* 계약이력 */}
        {employeeContracts && employeeContracts.length > 1 && (
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">계약이력</div>
              </div>
              <div className="sub-item-bx">
                {[...employeeContracts]
                  .sort((a, b) => b.id - a.id)
                  .filter((c) => id != null && c.id !== id)
                  .map((c, i) => {
                    const h = c.employmentContractHeader
                    const badge = h?.electronicContractStatus
                      ? CONTRACT_STATUS_BADGE[h.electronicContractStatus]
                      : null
                    return (
                      <div
                        className="employment-bx"
                        key={c.id}
                        onClick={() => router.push(`/contract/${c.id}`)}
                      >
                        <div className="employment-num">
                          No.{i + 1}
                          {badge && (
                            <span className={badge.className}>{badge.label}</span>
                          )}
                        </div>
                        <table className="info-table">
                          <colgroup>
                            <col style={{ width: '95px' }} />
                            <col />
                          </colgroup>
                          <tbody>
                            <tr>
                              <th>계약분류</th>
                              <td>{h?.contractClassificationName ?? '-'}</td>
                            </tr>
                            <tr>
                              <th>계약기간</th>
                              <td>{formatDate(h?.contractStartDate)} ~ {formatDate(h?.contractEndDate)}</td>
                            </tr>
                            {c.contractSendDate && (
                              <tr>
                                <th>계약서 전송일시</th>
                                <td>{formatDate(c.contractSendDate)}</td>
                              </tr>
                            )}
                            {c.contractViewDate && (
                              <tr>
                                <th>계약서 열람일시</th>
                                <td>{formatDate(c.contractViewDate)}</td>
                              </tr>
                            )}
                            {c.signedDate && (
                              <tr>
                                <th>전자서명 일시</th>
                                <td>{formatDate(c.signedDate)}</td>
                              </tr>
                            )}
                            {c.member && (
                              <tr>
                                <th>서명자 정보</th>
                                <td>{c.member.name}({c.member.loginId})</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
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
                      <th>등록자/등록일</th>
                      <td>
                        <div className="data-list">
                          <span>{initialData?.createdByName ?? '-'}</span>
                          <span>{formatDate(initialData?.createdAt)}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>수정자/수정일</th>
                      <td>
                        <div className="data-list">
                          <span>{initialData?.updatedByName ?? '-'}</span>
                          <span>{formatDate(initialData?.updatedAt)}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <button
          className="btn-form block blue mb8"
          onClick={handleSendEmail}
          disabled={sendEmailMutation.isPending}
        >
          {sendEmailMutation.isPending ? '전송 중...' : '직원에게 계약서 전송'}
        </button>
        <button
          className="btn-form block sky brd"
          onClick={handleDownloadDocx}
          disabled={downloadDocxMutation.isPending}
        >
          {downloadDocxMutation.isPending ? '다운로드 중...' : '계약서(미날인원본) 다운로드'}
        </button>
      </div>
    </>
  )
}
