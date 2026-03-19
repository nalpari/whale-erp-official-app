"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";

export default function PaymentConditionSheet() {
  const paymentConditionSheet = useBottomSheetControler(
    (state) => state.paymentConditionSheet
  );
  const setPaymentConditionSheet = useBottomSheetControler(
    (state) => state.setPaymentConditionSheet
  );

  const handleClose = () => {
    setPaymentConditionSheet(false);
  };

  return (
    <Sheet
      isOpen={paymentConditionSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>급여 지급 조건</h3>
            </div>
            <div className=" bottom-sheet-body">
              <div className="sheet-data-wrap">
                <table className="payment-table">
                  <thead>
                    <tr>
                      <th>지급항목</th>
                      <th>공제항목</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="payment-data-list">
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              기본급 <span className="imp">*</span>
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">식대</div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              자가운전 보조금
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              육아수당
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              야간수당
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              월간 휴일근무 수당
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              추가 근무수당
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              직책상여
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              인센티브
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="payment-data-list">
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              국민연금
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              건강보험
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              고용보험
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              장기요양보험
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">소득세</div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-tit">
                              지방소득세
                            </div>
                            <div className="payment-data-item-value">
                              <input type="text" className="input-frame al-r" />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-value">
                              <select name="" id="" className="select-form">
                                <option value="1"> 선택</option>
                              </select>
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-value">
                              <input
                                type="text"
                                className="input-frame al-r"
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-value">
                              <select name="" id="" className="select-form">
                                <option value="1"> 선택</option>
                              </select>
                            </div>
                          </div>
                          <div className="payment-data-item">
                            <div className="payment-data-item-value">
                              <input
                                type="text"
                                className="input-frame al-r"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="total">
                      <td>
                        <div className="payment-td-total">
                          <div className="payment-td-total-tit">
                            지급총액 (+)
                          </div>
                          <div className="payment-td-total-val">
                            2,297,784 원
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="payment-td-total">
                          <div className="payment-td-total-tit">
                            공제총액 (-)
                          </div>
                          <div className="payment-td-total-val">97,784 원</div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}>
                        <div className="payment-total">
                          <div className="payment-total-tit">실지급액</div>
                          <div className="payment-total-val">2,297,784원</div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky">초기화</button>
              <button className="btn-form blue">저장</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
