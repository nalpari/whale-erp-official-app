'use client'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStaffInviteStore } from '@/store/useStaffInviteStore'

const CONTRACT_LABEL: Record<string, string> = {
  CNTCFWK_001: '포괄연봉제',
  CNTCFWK_002: '비포괄연봉제',
  CNTCFWK_003: '파트타임',
}

export default function InviteForm03() {
  const router = useRouter()
  const setPartStaffPaySheet = useBottomSheetControler(
    (state) => state.setPartStaffPaySheet,
  )
  const setBonusPaySheet = useBottomSheetControler(
    (state) => state.setBonusPaySheet,
  )
  const { stepTwo } = useStaffInviteStore()
  const contractType = stepTwo.contractClassification
  const contractLabel = CONTRACT_LABEL[contractType] ?? '포괄연봉제'
  const isPartTime = contractType === 'CNTCFWK_003'

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
                <div className="total-pay">0원</div>
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
                  <td className="bold al-r">0원</td>
                </tr>
                <tr>
                  <td className="bold">통상시급</td>
                  <td></td>
                  <td className="bold al-r">0원</td>
                </tr>
                <tr>
                  <td className="tit">기본급</td>
                  <td className="al-r">0시간</td>
                  <td className="al-r">0원</td>
                </tr>
                {contractType === 'CNTCFWK_001' && (
                  <>
                    <tr>
                      <td className="tit">연장수당</td>
                      <td className="al-r">0시간</td>
                      <td className="al-r">0원</td>
                    </tr>
                    <tr>
                      <td className="tit">야간수당</td>
                      <td className="al-r">0시간</td>
                      <td className="al-r">0원</td>
                    </tr>
                    <tr>
                      <td className="tit">휴일근무수당</td>
                      <td className="al-r">0시간</td>
                      <td className="al-r">0원</td>
                    </tr>
                    <tr>
                      <td className="tit">추가휴일근무수당</td>
                      <td className="al-r">0시간</td>
                      <td className="al-r">0원</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 비과세 항목 */}
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
                <td className="al-r">0원</td>
              </tr>
              <tr>
                <td className="tit">자가운전보조금</td>
                <td className="al-r">0원</td>
              </tr>
              <tr>
                <td className="tit">육아수당</td>
                <td className="al-r">0원</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 시급 (파트타임 또는 비포괄) */}
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
              <tr>
                <td className="tit">평일시급</td>
                <td className="al-r">0원</td>
              </tr>
              <tr>
                <td className="tit">연장근무시급</td>
                <td className="al-r">0원</td>
              </tr>
              <tr>
                <td className="tit">휴일근무시급</td>
                <td className="al-r">0원</td>
              </tr>
            </tbody>
          </table>
        </div>

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
              <tr>
                <td className="tit">만근상여</td>
                <td className="al-r">0원</td>
              </tr>
              <tr>
                <td className="tit">직책상여</td>
                <td className="al-r">0원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
