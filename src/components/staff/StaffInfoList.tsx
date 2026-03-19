"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function StaffInfoList() {
  const router = useRouter();
  const setStaffSearchSheet = useBottomSheetControler(
    (state) => state.setStaffSearchSheet
  );

  const handleSearchClick = () => {
    setStaffSearchSheet(true);
  };

  return (
    <div className="container">
      <div className="sub-tit-wrap ">
        <div className="sub-tit">직원 관리</div>
        <div className="sub-btn-wrap">
          <button
            className="btn-s black"
            onClick={() => router.push("/staff/invite")}
          >
            <i className="invite"></i>
            직원 초대
          </button>
        </div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx staff">
          <div className="search-count">
            검색결과 <span>128건</span>
          </div>
          <button className="search-btn " onClick={handleSearchClick}>
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>
        <div className="staff-list-wrap">
          <div className="staff-list-item">
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
                    <i className="memo"></i>
                  </div>
                  <div className="staff-job">점포직원/파트타이머/근무</div>
                </div>
              </div>
              <div className="sub-cont-btn-wrap">
                <div className="staff-invite-btn">초대요청</div>
              </div>
            </div>
            <div className="sub-item-bx s">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "92px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>입사일</th>
                    <td>2025.01.01</td>
                  </tr>
                  <tr>
                    <th>건강진단만료일</th>
                    <td>2025.12.30</td>
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
            <button
              className="contract-link"
              onClick={() => router.push("/staff/1")}
            >
              <div className="contract-inner">
                <div className="contract-tit">근로계약서</div>
                <div className="badge red">
                  <i className="red_icon"></i>계약 완료
                </div>
                <div className="auto-right">
                  <i className="contract-arr"></i>
                </div>
              </div>
            </button>
          </div>
          <div className="staff-list-item">
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
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
                    <i className="memo"></i>
                  </div>
                  <div className="staff-job">점포직원/파트타이머/근무</div>
                </div>
              </div>
              <div className="sub-cont-btn-wrap">
                <button className="staff-invite-btn check">초대요청</button>
              </div>
            </div>
            <div className="sub-item-bx s">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "92px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>입사일</th>
                    <td>2025.01.01</td>
                  </tr>
                  <tr>
                    <th>건강진단만료일</th>
                    <td>2025.12.30</td>
                  </tr>
                  <tr>
                    <th>본사</th>
                    <td>주식회사 따름인</td>
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
            <button className="contract-link">
              <div className="contract-inner">
                <div className="contract-tit">근로계약서</div>
                <div className="badge green">진행중</div>
                <div className="auto-right">
                  <i className="contract-arr"></i>
                </div>
              </div>
            </button>
          </div>
          <div className="staff-list-item">
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
                  </div>
                </div>
              </div>
              <div className="sub-cont-btn-wrap">
                <button className="staff-invite-btn check">초대요청</button>
              </div>
            </div>
            <div className="sub-item-bx s">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "92px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>입사일</th>
                    <td>2025.01.01</td>
                  </tr>
                  <tr>
                    <th>건강진단만료일</th>
                    <td>
                      <span className="imp">2025.12.30</span>
                    </td>
                  </tr>
                  <tr>
                    <th>본사</th>
                    <td>주식회사 따름인</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="contract-link">
              <div className="contract-inner">
                <div className="contract-tit">근로계약서</div>
                <div className="badge blue">작성중</div>
                <div className="auto-right">
                  <i className="contract-arr"></i>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
