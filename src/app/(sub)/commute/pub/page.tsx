import Image from "next/image";

export default function CommuteDetail() {
  return (
    <div className="container sub">
      <div className="sub-content-body">
        <div className="commute-profile">
          <div className="profile-img">
            <Image
              src="/assets/images/layout/avatar01.svg"
              alt="profile-img"
              width={64}
              height={64}
            />
          </div>
          <div className="profile-info">
            <div className="profile-name">김길수님</div>
            <div className="profile-job">
              <span>팀장</span>
              <span>Manager</span>
            </div>
          </div>
          <div className="profile-data ">
            <span className="badge grey">BIM1001</span>
            <span className="badge grey">본사직원</span>
            <span className="badge grey">정규직</span>
            <span className="badge d-green line">근무</span>
          </div>
        </div>
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "70px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>본사</th>
                    <td>주식회사 따름인</td>
                  </tr>
                  <tr>
                    <th>가맹점</th>
                    <td>힘이나는커피생활 을지로3가점</td>
                  </tr>
                  <tr>
                    <th>점포</th>
                    <td>힘이나는커피생활 을지로3가점</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">근무시간</div>
            </div>
            <div className="sub-item-bx">
              <div className="commute-time-wrap">
                <div className="commute-time-tit">평일</div>
                <div className="commute-time-data">
                  <div className="commute-time-data-time">
                    <span>10:00~15:00</span>
                    <span>5시간</span>
                  </div>
                  <div className="commute-time-data-work">
                    <div className="commute-time-data-work-item">
                      <span className="badge d-green">근무</span>
                      <span className="time">4.5h</span>
                    </div>
                    <div className="commute-time-data-work-item">
                      <span className="badge brown">휴계</span>
                      <span className="time">0.5h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sub-item-bx">
              <div className="commute-time-wrap">
                <div className="commute-time-tit">토요일</div>
                <div className="commute-time-data">
                  <div className="commute-time-data-time">
                    <span>10:00~15:00</span>
                    <span>5시간</span>
                  </div>
                  <div className="commute-time-data-work">
                    <div className="commute-time-data-work-item">
                      <span className="badge d-green">근무</span>
                      <span className="time">4.5h</span>
                    </div>
                    <div className="commute-time-data-work-item">
                      <span className="badge brown">휴계</span>
                      <span className="time">0.5h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">
                근무현황<span className="imp"> *</span>
              </div>
            </div>
            <div className="commute-date-search">
              <div className="flex g8 mb8">
                <div className="date-picker-custom">
                  <input
                    type="text"
                    className="date-picker-input"
                    defaultValue="2025.10.28"
                  />
                </div>
                <span>~</span>
                <div className="date-picker-custom">
                  <input
                    type="text"
                    className="date-picker-input"
                    defaultValue="2025.10.28"
                  />
                </div>
              </div>
              <div className="block">
                <button className="btn-form block grey">검색</button>
              </div>
            </div>
            <div className="commute-list-wrap">
              <div className="commute-list-item">
                <div className="commute-list-tit">12.22 월</div>
                <div className="commute-list-data">
                  <div className="commute-list-data-item">
                    <div className="commute-list-data-time">10:00~15:00</div>
                    <div className="commute-list-data-work">
                      <span className="time">5시간</span>
                      <span className="badge d-green">근무</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="commute-list-item">
                <div className="commute-list-tit">12.23 화</div>
                <div className="commute-list-data">
                  <div className="commute-list-data-item">
                    <div className="commute-list-data-work">
                      <span className="badge d-red">결근</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="commute-list-item">
                <div className="commute-list-tit">12.22 월</div>
                <div className="commute-list-data">
                  <div className="commute-list-data-item">
                    <div className="commute-list-data-time">10:00~15:00</div>
                    <div className="commute-list-data-work">
                      <span className="time">4시간50분</span>
                      <span className="badge d-green">근무</span>
                    </div>
                  </div>
                  <div className="commute-list-data-item">
                    <div className="commute-list-data-time">10:00~15:00</div>
                    <div className="commute-list-data-work">
                      <span className="time">5시간</span>
                      <span className="badge d-green">근무</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="commute-list-item rest">
                <div className="commute-list-tit">
                  <span className="badge grey">휴일</span>
                  <span>12.22 월</span>
                </div>
              </div>
              <div className="commute-list-item rest">
                <div className="commute-list-tit">
                  <span className="badge grey">휴일</span>
                  <span>12.22 월</span>
                </div>
                <div className="commute-list-data">
                  <div className="commute-list-data-item">
                    <div className="commute-list-data-time">10:00~15:00</div>
                    <div className="commute-list-data-work">
                      <span className="time">4시간50분</span>
                      <span className="badge d-green">근무</span>
                    </div>
                  </div>
                  <div className="commute-list-data-item">
                    <div className="commute-list-data-time">10:00~15:00</div>
                    <div className="commute-list-data-work">
                      <span className="time">5시간</span>
                      <span className="badge d-green">근무</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
