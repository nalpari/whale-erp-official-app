'use client'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStaffInviteStore } from '@/store/useStaffInviteStore'
import { useMinimumWage } from '@/hooks/queries/use-contract-queries'

const CONTRACT_LABEL: Record<string, string> = {
  CNTCFWK_001: '포괄연봉제',
  CNTCFWK_002: '비포괄연봉제',
  CNTCFWK_003: '파트타임',
}

const formatAmount = (val: number) => val.toLocaleString('ko-KR')

export default function InviteForm03() {
  const router = useRouter()
  const setBonusPaySheet = useBottomSheetControler(
    (state) => state.setBonusPaySheet,
  )
  const stepTwo = useStaffInviteStore((s) => s.stepTwo)
  const sal = useStaffInviteStore((s) => s.stepThreeSalary)
  const contractType = stepTwo.contractClassification
  const contractLabel = CONTRACT_LABEL[contractType] ?? '포괄연봉제'
  const isPartTime = contractType === 'CNTCFWK_003'

  // 최저시급 조회
  const currentYear = new Date().getFullYear()
  const { data: minWageData } = useMinimumWage(currentYear)
  const minimumWage = minWageData?.minimumWage ?? 0
  const activeTimely = sal.timelyAmount || minimumWage

  // 급여 계산
  const baseAmount = activeTimely * sal.monthlyTime
  const overtimeAmount = Math.round(activeTimely * 1.5 * sal.overtimeTime)
  const nightAmount = Math.round(activeTimely * 0.5 * sal.nightTime)
  const holidayAmount = Math.round(activeTimely * 1.5 * sal.holidayTime)
  const addHolidayAmount = Math.round(activeTimely * 2.0 * sal.addHolidayTime)
  const nonTaxTotal =
    (sal.mealIncluded ? sal.mealAllowance : 0) +
    (sal.vehicleIncluded ? sal.vehicleAllowance : 0) +
    (sal.childcareIncluded ? sal.childcareAllowance : 0)
  const monthlyTotal = Math.round(
    baseAmount + overtimeAmount + nightAmount + holidayAmount + addHolidayAmount + nonTaxTotal
  )
  const annualTotal = monthlyTotal * 12

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-cont-tit-wrap">
          <div className="sub-cont-tit">급여정보</div>
          <div className="sub-cont-btn-wrap">
            <button
              className="sub-edit-btn"
              onClick={() => router.push('/staff/employment')}
            ></button>
          </div>
        </div>

        {/* 계약분류 표시 */}
        <div className="sub-item-bx">
          <div className="pay-table-header">
            <div className="pay-table-tit">계약분류</div>
            <div className="auto-right">
              <div className="total-pay">{contractLabel}</div>
            </div>
          </div>
        </div>

        {/* 포괄/비포괄 연봉제: 연봉 테이블 */}
        {!isPartTime && (
          <div className="sub-item-bx">
            <div className="pay-table-header">
              <div className="pay-table-tit">연봉총액</div>
              <div className="auto-right">
                <div className="total-pay">{formatAmount(annualTotal)}원</div>
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
                  <td className="bold al-r">{formatAmount(monthlyTotal)}원</td>
                </tr>
                <tr>
                  <td className="bold">통상시급</td>
                  <td></td>
                  <td className="bold al-r">{formatAmount(activeTimely)}원</td>
                </tr>
                <tr>
                  <td className="tit">기본급</td>
                  <td className="al-r">{sal.monthlyTime}시간</td>
                  <td className="al-r">{formatAmount(baseAmount)}원</td>
                </tr>
                {contractType === 'CNTCFWK_001' && (
                  <>
                    <tr>
                      <td className="tit">연장수당</td>
                      <td className="al-r">{sal.overtimeTime}시간</td>
                      <td className="al-r">{formatAmount(overtimeAmount)}원</td>
                    </tr>
                    <tr>
                      <td className="tit">야간수당</td>
                      <td className="al-r">{sal.nightTime}시간</td>
                      <td className="al-r">{formatAmount(nightAmount)}원</td>
                    </tr>
                    <tr>
                      <td className="tit">휴일근무수당</td>
                      <td className="al-r">{sal.holidayTime}시간</td>
                      <td className="al-r">{formatAmount(holidayAmount)}원</td>
                    </tr>
                    <tr>
                      <td className="tit">추가휴일근무수당</td>
                      <td className="al-r">{sal.addHolidayTime}시간</td>
                      <td className="al-r">{formatAmount(addHolidayAmount)}원</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 비과세 항목: 포괄/비포괄만 */}
        {!isPartTime && (
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
                  <td className="al-r">{formatAmount(sal.mealIncluded ? sal.mealAllowance : 0)}원</td>
                </tr>
                <tr>
                  <td className="tit">자가운전보조금</td>
                  <td className="al-r">{formatAmount(sal.vehicleIncluded ? sal.vehicleAllowance : 0)}원</td>
                </tr>
                <tr>
                  <td className="tit">육아수당</td>
                  <td className="al-r">{formatAmount(sal.childcareIncluded ? sal.childcareAllowance : 0)}원</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 추가근무시급: 비포괄만 */}
        {contractType === 'CNTCFWK_002' && (
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
                  <td className="al-r">{formatAmount(sal.weekdayHourlyWage || activeTimely)}원</td>
                </tr>
                <tr>
                  <td className="tit">연장근무시급</td>
                  <td className="al-r">{formatAmount(sal.overtimeHourlyWage || Math.round(activeTimely * 1.5))}원</td>
                </tr>
                <tr>
                  <td className="tit">휴일근무시급</td>
                  <td className="al-r">{formatAmount(sal.holidayHourlyWage || Math.round(activeTimely * 1.5))}원</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 시급: 파트타임만 */}
        {isPartTime && (
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
                  <td className="al-r">{formatAmount(sal.weekdayHourlyWage || minimumWage)}원</td>
                </tr>
                <tr>
                  <td className="tit">연장근무시급</td>
                  <td className="al-r">{formatAmount(sal.overtimeHourlyWage || minimumWage)}원</td>
                </tr>
                <tr>
                  <td className="tit">휴일근무시급</td>
                  <td className="al-r">{formatAmount(sal.holidayHourlyWage || minimumWage)}원</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 상여금 */}
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
              {sal.bonuses.length > 0 ? (
                sal.bonuses.map((b, i) => (
                  <tr key={i}>
                    <td className="tit">{b.bonusType}</td>
                    <td className="al-r">{formatAmount(b.amount)}원</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td className="tit">만근상여</td>
                    <td className="al-r">0원</td>
                  </tr>
                  <tr>
                    <td className="tit">직책상여</td>
                    <td className="al-r">0원</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
