"use client";
import { useRouter } from "next/navigation";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";

export default function InviteForm03() {
  const router = useRouter();
  const setPartStaffPaySheet = useBottomSheetControler(
    (state) => state.setPartStaffPaySheet
  );
  const setBonusPaySheet = useBottomSheetControler(
    (state) => state.setBonusPaySheet
  );
  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-cont-tit-wrap">
          <div className="sub-cont-tit">급여정보</div>
          <div className="sub-cont-btn-wrap">
            <button
              className="sub-edit-btn"
              onClick={() => router.push("/staff/employment")}
            ></button>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="pay-table-header">
            <div className="pay-table-tit">연봉총액</div>
            <div className="auto-right">
              <div className="total-pay">59,730,000원</div>
            </div>
          </div>
          <table className="pay-table">
            <colgroup>
              <col />
              <col width={"50px"} />
              <col width={"105px"} />
            </colgroup>
            <tbody>
              <tr>
                <td className="bold">월급여 총액</td>
                <td></td>
                <td className="bold al-r">3,135,000원</td>
              </tr>
              <tr>
                <td className="bold">통상시급</td>
                <td></td>
                <td className="bold al-r">15,000원</td>
              </tr>
              <tr>
                <td className="tit">기본급</td>
                <td className="al-r">8시간</td>
                <td className="al-r">35,000원</td>
              </tr>
              <tr>
                <td className="tit">연장수당</td>
                <td className="al-r">8시간</td>
                <td className="al-r">35,000원</td>
              </tr>
              <tr>
                <td className="tit">야간수당</td>
                <td className="al-r">8시간</td>
                <td className="al-r">15,000원</td>
              </tr>
              <tr>
                <td className="tit">휴일근무수당</td>
                <td className="al-r">8시간</td>
                <td className="al-r">35,000원</td>
              </tr>
              <tr>
                <td className="tit">추가휴일근무수당</td>
                <td className="al-r">8시간</td>
                <td className="al-r">135,000원</td>
              </tr>
            </tbody>
          </table>
        </div>
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
                <td className="al-r">35,000원</td>
              </tr>
              <tr>
                <td className="tit">자가운전보조금</td>
                <td className="al-r">35,000원</td>
              </tr>
              <tr>
                <td className="tit">육아수당</td>
                <td className="al-r">15,000원</td>
              </tr>
            </tbody>
          </table>
        </div>
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
                <td className="al-r">20,000원</td>
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
                <td className="al-r">35,000원</td>
              </tr>
              <tr>
                <td className="tit">직책상여</td>
                <td className="al-r">35,000원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
