'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import {
  useDeleteContract,
  useSendContractEmail,
} from '@/hooks/queries/use-contract-queries'
import { getErrorMessage } from '@/lib/api'
import type { ContractDetail as ContractDetailType, ElectronicContractStatus, DayType } from '@/types/contract'

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

const CONTRACT_STATUS_BADGE: Record<ElectronicContractStatus, { label: string; className: string }> = {
  WRITING: { label: '작성중', className: 'badge blue' },
  PROGRESS: { label: '진행중', className: 'badge green' },
  COMPLETE: { label: '완료', className: 'badge org' },
  REFUSAL: { label: '거부', className: 'badge red' },
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
  const setPartStaffPaySheet = useBottomSheetControler(
    (state) => state.setPartStaffPaySheet,
  )
  const setBonusPaySheet = useBottomSheetControler(
    (state) => state.setBonusPaySheet,
  )

  const deleteContractMutation = useDeleteContract()
  const sendEmailMutation = useSendContractEmail()

  const id = initialData?.id
  const header = initialData?.employmentContractHeader
  const salary = initialData?.salaryInfo
  const workHours = initialData?.workHours ?? []

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
  const salaryMonthLabel = header?.salaryMonth === 'SLRCF_001' ? '당월' : header?.salaryMonth === 'SLRCF_002' ? '익월' : ''
  const salaryCycleLabel = header?.salaryCycle === 'SLRCC_001' ? '월급' : header?.salaryCycle === 'SLRCC_002' ? '시급' : ''

  const handleDelete = async () => {
    if (!id) return
    if (!confirm('계약서를 삭제하시겠습니까?')) return
    try {
      await deleteContractMutation.mutateAsync(id)
      alert('삭제되었습니다.')
      router.push('/contract')
    } catch (error) {
      alert(getErrorMessage(error, '삭제에 실패했습니다.'))
    }
  }

  const handleSendEmail = async () => {
    if (!id) return
    if (!confirm('직원에게 계약서를 이메일로 전송하시겠습니까?')) return
    try {
      await sendEmailMutation.mutateAsync(id)
      alert('이메일이 전송되었습니다.')
    } catch (error) {
      alert(getErrorMessage(error, '이메일 전송에 실패했습니다.'))
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
                      {initialData?.member && (
                        <div className="staff-job">
                          <span>{initialData.member.name}</span>
                          <span>{initialData.member.loginId}</span>
                        </div>
                      )}
                    </div>
                    <div className="staff-data">
                      {initialData?.member?.loginId && (
                        <span className="badge grey">{initialData.member.loginId}</span>
                      )}
                      {initialData?.workStatusName && (
                        <span className="badge grey">{initialData.workStatusName}</span>
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
                    {header?.workContractFile && (
                      <tr>
                        <th>근로계약서</th>
                        <td>
                          <button className="down-btn">
                            {header.workContractFile.fileName}
                          </button>
                        </td>
                      </tr>
                    )}
                    {header?.wageContractFile && (
                      <tr>
                        <th>임금계약서</th>
                        <td>
                          <button className="down-btn">
                            {header.wageContractFile.fileName}
                          </button>
                        </td>
                      </tr>
                    )}
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
              {salary && (
                <>
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
                        {salary.monthlyOvertimeAllowance !== undefined && (
                          <tr>
                            <td className="tit">연장수당</td>
                            <td className="al-r">{salary.monthlyOvertimeAllowanceTime ?? 0}시간</td>
                            <td className="al-r">{formatAmount(salary.monthlyOvertimeAllowance)}원</td>
                          </tr>
                        )}
                        {salary.monthlyNightAllowance !== undefined && (
                          <tr>
                            <td className="tit">야간수당</td>
                            <td className="al-r">{salary.monthlyNightAllowanceTime ?? 0}시간</td>
                            <td className="al-r">{formatAmount(salary.monthlyNightAllowance)}원</td>
                          </tr>
                        )}
                        {salary.monthlyHolidayAllowance !== undefined && (
                          <tr>
                            <td className="tit">휴일근무수당</td>
                            <td className="al-r">{salary.monthlyHolidayAllowanceTime ?? 0}시간</td>
                            <td className="al-r">{formatAmount(salary.monthlyHolidayAllowance)}원</td>
                          </tr>
                        )}
                        {salary.monthlyAddHolidayAllowance !== undefined && (
                          <tr>
                            <td className="tit">추가휴일근무수당</td>
                            <td className="al-r">{salary.monthlyAddHolidayAllowanceTime ?? 0}시간</td>
                            <td className="al-r">{formatAmount(salary.monthlyAddHolidayAllowance)}원</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {(salary.mealAllowance !== undefined || salary.vehicleAllowance !== undefined || salary.childcareAllowance !== undefined) && (
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
                          {salary.mealAllowance !== undefined && (
                            <tr>
                              <td className="tit">식대</td>
                              <td className="al-r">{formatAmount(salary.mealAllowance)}원</td>
                            </tr>
                          )}
                          {salary.vehicleAllowance !== undefined && (
                            <tr>
                              <td className="tit">자가운전보조금</td>
                              <td className="al-r">{formatAmount(salary.vehicleAllowance)}원</td>
                            </tr>
                          )}
                          {salary.childcareAllowance !== undefined && (
                            <tr>
                              <td className="tit">육아수당</td>
                              <td className="al-r">{formatAmount(salary.childcareAllowance)}원</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {(salary.weekDayAllowanceAmount !== undefined || salary.overtimeDayAllowanceAmount !== undefined || salary.nightDayAllowanceAmount !== undefined) && (
                    <div className="sub-item-bx">
                      <div className="pay-table-header">
                        <div className="pay-table-tit">시급</div>
                        <div className="auto-right">
                          <button
                            className="contract-arr"
                            onClick={() => setPartStaffPaySheet(true)}
                          ></button>
                        </div>
                      </div>
                      <table className="pay-table">
                        <colgroup>
                          <col />
                          <col />
                        </colgroup>
                        <tbody>
                          {salary.weekDayAllowanceAmount !== undefined && (
                            <tr>
                              <td className="tit">평일시급</td>
                              <td className="al-r">{formatAmount(salary.weekDayAllowanceAmount)}원</td>
                            </tr>
                          )}
                          {salary.overtimeDayAllowanceAmount !== undefined && (
                            <tr>
                              <td className="tit">연장근무시급</td>
                              <td className="al-r">{formatAmount(salary.overtimeDayAllowanceAmount)}원</td>
                            </tr>
                          )}
                          {salary.nightDayAllowanceAmount !== undefined && (
                            <tr>
                              <td className="tit">야간근무시급</td>
                              <td className="al-r">{formatAmount(salary.nightDayAllowanceAmount)}원</td>
                            </tr>
                          )}
                          {salary.holidayAllowanceTimeAmount !== undefined && (
                            <tr>
                              <td className="tit">휴일근무시급</td>
                              <td className="al-r">{formatAmount(salary.holidayAllowanceTimeAmount)}원</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {salary.bonuses && salary.bonuses.length > 0 && (
                    <div className="sub-item-bx">
                      <div className="pay-table-header">
                        <div className="pay-table-tit">상여금</div>
                        <div className="auto-right">
                          <button
                            className="contract-arr"
                            onClick={() => setBonusPaySheet(true)}
                          ></button>
                        </div>
                      </div>
                      <table className="pay-table">
                        <colgroup>
                          <col />
                          <col />
                        </colgroup>
                        <tbody>
                          {salary.bonuses.map((bonus, i) => (
                            <tr key={bonus.id ?? i}>
                              <td className="tit">{bonus.bonusName}</td>
                              <td className="al-r">{formatAmount(bonus.bonusAmount)}원</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
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
                            {wh.dayType === 'SATURDAY' && !wh.everySaturdayWork && (
                              <div>격주근무</div>
                            )}
                            {wh.dayType === 'SUNDAY' && !wh.everySundayWork && (
                              <div>격주근무</div>
                            )}
                            {wh.workStartTime && wh.workEndTime && (
                              <div>{wh.workStartTime} ~ {wh.workEndTime}</div>
                            )}
                            {wh.isBreak && wh.breakStartTime && wh.breakEndTime && (
                              <div>{wh.breakStartTime} ~ {wh.breakEndTime}&nbsp; 브레이크타임</div>
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
        <button className="btn-form block sky brd">
          계약서(미날인원본) 다운로드
        </button>
        <button
          className="btn-form block red mt8"
          onClick={handleDelete}
          disabled={deleteContractMutation.isPending}
        >
          {deleteContractMutation.isPending ? '삭제 중...' : '삭제'}
        </button>
      </div>
    </>
  )
}
