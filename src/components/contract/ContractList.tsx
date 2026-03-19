"use client";

import Image from "next/image";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useRouter } from "next/navigation";

export default function ContractList() {
  const router = useRouter();
  const setContractSearchSheet = useBottomSheetControler(
    (state) => state.setContractSearchSheet
  );
  return (
    <div className="container">
      <div className="sub-tit-wrap ">
        <div className="sub-tit">근로계약 관리</div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx staff">
          <div className="search-count">
            검색결과 <span>128건</span>
          </div>
          <button
            className="search-btn "
            onClick={() => setContractSearchSheet(true)}
          >
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>
        <div className="staff-list-wrap">
          <button
            className="staff-list-item"
            onClick={() => router.push("/contract/1")}
          >
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
                  <Image
                    src="/assets/images/layout/avatar01.svg"
                    alt="staff-icon"
                    width={46}
                    height={46}
                  />
                </div>
                <div className="staff-info-data">
                  <div className="staff-name">
                    <span>김길수</span>
                    <i className="badge blue">작성중</i>
                  </div>
                  <div className="staff-job">점포직원/파트타이머/근무</div>
                </div>
              </div>
            </div>
            <div className="sub-item-bx ">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "90px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>근무요일</th>
                    <td>평일/토/일</td>
                  </tr>
                  <tr>
                    <th>급여일</th>
                    <td>10일</td>
                  </tr>
                  <tr>
                    <th>계약일</th>
                    <td>2025.01.18 (전자계약)</td>
                  </tr>
                  <tr>
                    <th>본사</th>
                    <td>주식회사 따름인</td>
                  </tr>
                  <tr>
                    <th>가맹점</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>점포</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </button>
          <button className="staff-list-item">
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
                  <i className="contract-tip"></i>
                  <Image
                    src="/assets/images/layout/avatar02.svg"
                    alt="staff-icon"
                    width={46}
                    height={46}
                  />
                </div>
                <div className="staff-info-data">
                  <div className="staff-name">
                    <span>홍길동</span>
                    <i className="badge green">진행중</i>
                  </div>
                  <div className="staff-job">점포직원/파트타이머/근무</div>
                </div>
              </div>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "90px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>근무요일</th>
                    <td>평일/토/일</td>
                  </tr>
                  <tr>
                    <th>급여일</th>
                    <td>10일</td>
                  </tr>
                  <tr>
                    <th>계약일</th>
                    <td>2025.01.18 (전자계약)</td>
                  </tr>
                  <tr>
                    <th>본사</th>
                    <td>주식회사 따름인</td>
                  </tr>
                  <tr>
                    <th>가맹점</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>점포</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </button>
          <button className="staff-list-item">
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
                  <Image
                    src="/assets/images/layout/avatar03.svg"
                    alt="staff-icon"
                    width={46}
                    height={46}
                  />
                </div>
                <div className="staff-info-data">
                  <div className="staff-name">
                    <span>김민수</span>
                    <i className="badge red">계약 완료</i>
                  </div>
                  <div className="staff-job">점포직원/파트타이머/근무</div>
                </div>
              </div>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "90px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>근무요일</th>
                    <td>평일/토/일</td>
                  </tr>
                  <tr>
                    <th>급여일</th>
                    <td>10일</td>
                  </tr>
                  <tr>
                    <th>계약일</th>
                    <td>2025.01.18 (전자계약)</td>
                  </tr>
                  <tr>
                    <th>본사</th>
                    <td>주식회사 따름인</td>
                  </tr>
                  <tr>
                    <th>가맹점</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>점포</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
