"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function StaffDetail() {
  const router = useRouter();
  return (
    <div className="container sub">
      <div className="sub-tit-wrap">
        <div className="sub-tit">
          <span className="sub-s-txt">근로계약서</span>
        </div>
        <div className="auto-right flex g8">
          <span className="badge green big">진행중</span>
          <button className="contract-arr"></button>
        </div>
      </div>
      <div className="sub-content-body">
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-item-bx">
              <div className="memo-wrap">
                <div className="memo-icon"></div>
                <div className="memo-txt">
                  직원에 대한 메모가 저장되어 있으면 표시되고, 없으면
                  미표시됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="staff-detail-wrap">
              <div className="staff-detail-info-bx">
                <div className="staff-icon">
                  <i className="staff-icon-img request"></i>
                  <Image
                    src="/assets/images/layout/avatar01.svg"
                    alt="staff-icon"
                    width={54}
                    height={54}
                  />
                </div>
                <div className="staff-detail-info">
                  <div className="staff-name">
                    <span>김길수님</span>
                    <div className="staff-job">
                      <span>팀장</span>
                      <span>Manager</span>
                    </div>
                  </div>
                  <div className="staff-data">
                    <span className="badge grey">0026</span>
                    <span className="badge grey">본사직원</span>
                    <span className="badge grey">정규직</span>
                    <span className="badge d-green line w">근무</span>
                  </div>
                </div>
              </div>
              <div className="staff-invite-btn-wrap">
                <button className="staff-invite-btn">
                  <i className="invite"></i>
                  <span>초대링크 재전송</span>
                </button>
                <button
                  className="staff-edit-btn"
                  onClick={() => router.push(`/staff/1/edit`)}
                ></button>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "95px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>입사일</th>
                    <td>2020.05.05</td>
                  </tr>
                  <tr>
                    <th>퇴사일</th>
                    <td>
                      <div className="data-list">
                        <span>2020.05.05</span>
                        <span>개인사유</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>건강진단만료일</th>
                    <td>2020.05.05</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "95px" }} />
                  <col />
                </colgroup>
                <tbody>
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
                  <tr>
                    <th>파트너 오피스 권한</th>
                    <td>관리자</td>
                  </tr>
                  <tr>
                    <th>급여계좌</th>
                    <td>
                      <div>우리은행</div>
                      <div>1002-669-478475</div>
                      <div>홍길동</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "95px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>생일</th>
                    <td>1992년5월1일(33세)</td>
                  </tr>
                  <tr>
                    <th>전화번호</th>
                    <td>010-1234-5678</td>
                  </tr>
                  <tr>
                    <th>이메일</th>
                    <td>Interplug@interplug.co.kr</td>
                  </tr>
                  <tr>
                    <th>주소</th>
                    <td>서울 서대문구 남산로123-55</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "95px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>주민등록등본</th>
                    <td>
                      <button className="down-btn">
                        홍길동_주민등록등본.pdf
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <th>가족관계증명서</th>
                    <td>
                      <button className="down-btn">
                        홍길동_가족관계증명서.pdf
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <th>건강진단결과서</th>
                    <td>
                      <button className="down-btn">
                        홍길동_건강진단결과서.pdf
                      </button>
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
              <div className="sub-cont-tit">로그인 정보</div>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "95px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>로그인ID</th>
                    <td>Abc12345!</td>
                  </tr>
                  <tr>
                    <th>초대요청일</th>
                    <td>2020.05.05</td>
                  </tr>
                  <tr>
                    <th>초대완료일</th>
                    <td>2020.05.05</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
                <li className="career-item">
                  <div className="career-item-tit">메가커피</div>
                  <div className="career-item-desc">
                    <span>2024.03 ~ 재직중</span>
                    <div className="data-list">
                      <span>파트타이머</span>
                      <span>홀서빙 및 음료제조</span>
                    </div>
                  </div>
                </li>
                <li className="career-item">
                  <div className="career-item-tit">현대해상화재보험</div>
                  <div className="career-item-desc">
                    <span>2024.03 ~ 2025.03</span>
                    <div className="data-list">
                      <span>파트타이머</span>
                      <span>홀서빙 및 음료제조</span>
                    </div>
                  </div>
                </li>
                <li className="career-item">
                  <div className="career-item-tit">힘이나는커피생활</div>
                  <div className="career-item-desc">
                    <span>2024.03 ~ 2025.03</span>
                    <div className="data-list">
                      <span>파트타이머</span>
                      <span>홀서빙 및 음료제조</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">자격증 정보</div>
            </div>
            <div className="sub-item-bx">
              <ul className="qualifications-wrap">
                <li className="qualifications-item">
                  <div className="qualifications-item-tit">
                    바리스타자격증 1급
                  </div>
                  <div className="qualifications-item-date">2025.08.06</div>
                </li>
                <li className="qualifications-item">
                  <div className="qualifications-item-tit">
                    정보기기운용기능사
                  </div>
                  <div className="qualifications-item-date">2025.08.06</div>
                </li>
                <li className="qualifications-item">
                  <div className="qualifications-item-tit">
                    1종 대형 운전면허
                  </div>
                  <div className="qualifications-item-date">2025.08.06</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">등록 및 수정이력</div>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "95px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>등록일</th>
                    <td>
                      <div className="data-list">
                        <span>홍길동</span>
                        <span>2025.08.06</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>최근수정일</th>
                    <td>
                      <div className="data-list">
                        <span>홍길동</span>
                        <span>2025.08.06</span>
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
  );
}
