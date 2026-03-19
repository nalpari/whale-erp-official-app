"use client";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";

export default function EmploymentContract() {
  const setContractOptionSheet = useBottomSheetControler(
    (state) => state.setContractOptionSheet
  );
  return (
    <div className="container sub">
      <div className="sub-content-body">
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <button
              className="employment-header"
              onClick={() => setContractOptionSheet(true)}
            >
              <div className="employment-icon">
                <Image
                  src="/assets/images/layout/avatar01.svg"
                  alt="employment-icon"
                  width={46}
                  height={46}
                />
              </div>
              <div className="employment-info">
                <div className="employment-name">
                  <span className="name">김길수</span>
                  <span className="badge d-org">포괄 연봉제</span>
                </div>
                <div className="employment-job">
                  계약년도/통상시급/한주근무시간 설정
                </div>
                <ul className="employment-contract">
                  <li className="employ-cont-item">2025년</li>
                  <li className="employ-cont-item">15,000원</li>
                  <li className="employ-cont-item">40시간</li>
                </ul>
              </div>
              <div className="employment-btn-wrap">
                <div className="employment-btn"></div>
              </div>
            </button>
            <div className="sub-item-bx">
              <table className="employ-table">
                <colgroup>
                  <col />
                  <col width={"50px"} />
                  <col width={"90px"} />
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <div className="tip-th flex g4">
                        <span>구분</span>
                        <button className="tooltip-btn">
                          <span
                            className="tooltip-icon"
                            id="tooltip-btn-anchor"
                          ></span>
                          <Tooltip
                            className="tooltip-txt"
                            anchorSelect="#tooltip-btn-anchor"
                            opacity={1}
                          >
                            <div>tooltip text</div>
                          </Tooltip>
                        </button>
                      </div>
                    </th>
                    <th>시간</th>
                    <th>금액(원)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tit">한주 근무시간</td>
                    <td>40 </td>
                    <td>3,135,000</td>
                  </tr>
                  <tr>
                    <td className="tit">기본근무</td>
                    <td>240 </td>
                    <td>3,135,000</td>
                  </tr>
                  <tr>
                    <td className="tit">연장근무</td>
                    <td>
                      <div className="block">
                        <input
                          type="number"
                          className="employ-input"
                          defaultValue="48"
                        />
                      </div>
                    </td>
                    <td>3,135,000</td>
                  </tr>
                  <tr>
                    <td className="tit">야간근무</td>
                    <td>
                      <div className="block">
                        <input
                          type="number"
                          className="employ-input"
                          defaultValue="48"
                        />
                      </div>
                    </td>
                    <td>3,135,000</td>
                  </tr>
                  <tr>
                    <td className="tit">휴일근무</td>
                    <td>
                      <div className="block">
                        <input
                          type="number"
                          className="employ-input"
                          defaultValue="48"
                        />
                      </div>
                    </td>
                    <td>3,135,000</td>
                  </tr>
                  <tr>
                    <td className="tit">추가 휴일근무</td>
                    <td>
                      <div className="block">
                        <input
                          type="number"
                          className="employ-input"
                          defaultValue="48"
                        />
                      </div>
                    </td>
                    <td>3,135,000</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>월간 총 근무 시간</td>
                    <td className="al-r">226</td>
                    <td className="over-txt">주52시간 초과</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="sub-item-bx">
              <table className="employ-table">
                <colgroup>
                  <col />
                  <col width={"71px"} />
                  <col width={"105px"} />
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <div className="tip-th flex g4">
                        <span>비과세 항목</span>
                        <button className="tooltip-btn">
                          <span
                            className="tooltip-icon"
                            id="tooltip-btn-anchor"
                          ></span>
                          <Tooltip
                            className="tooltip-txt"
                            anchorSelect="#tooltip-btn-anchor"
                            opacity={1}
                          >
                            <div>tooltip text</div>
                          </Tooltip>
                        </button>
                      </div>
                    </th>
                    <th>급여에 포함</th>
                    <th>금액(원)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tit">식대</td>
                    <td className="al-c">
                      <div className="toggle-btn">
                        <input
                          type="checkbox"
                          className="toggle-input"
                          id="toggle-input"
                        />
                        <label
                          className="slider"
                          htmlFor="toggle-input"
                        ></label>
                      </div>
                    </td>
                    <td>
                      <div className="block">
                        <input
                          type="text"
                          className="employ-input"
                          defaultValue="200,000"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="tit">자가운전보조금</td>
                    <td className="al-c">
                      <div className="toggle-btn">
                        <input
                          type="checkbox"
                          className="toggle-input"
                          id="toggle-input"
                        />
                        <label
                          className="slider"
                          htmlFor="toggle-input"
                        ></label>
                      </div>
                    </td>
                    <td>
                      <div className="block">
                        <input
                          type="text"
                          className="employ-input"
                          defaultValue="200,000"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="tit">육아수당</td>
                    <td className="al-c">
                      <div className="toggle-btn">
                        <input
                          type="checkbox"
                          className="toggle-input"
                          id="toggle-input"
                        />
                        <label
                          className="slider"
                          htmlFor="toggle-input"
                        ></label>
                      </div>
                    </td>
                    <td>
                      <div className="block">
                        <input
                          type="text"
                          className="employ-input"
                          defaultValue="200,000"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="total-pay-wrap">
                <div className="total-pay-bx year">
                  <div className="total-pay-tit">연봉 총액</div>
                  <div className="total-pay-val">59,730,000원</div>
                </div>
                <div className="total-pay-bx">
                  <div className="total-pay-tit">월급여 총액</div>
                  <div className="total-pay-val">3,135,000원</div>
                </div>
              </div>
            </div>
            <div className="flex g8">
              <button className="btn-form sky block brd">다시계산</button>
              <button className="btn-form blue block">저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
