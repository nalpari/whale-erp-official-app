export default function OverTimeWorkEdit() {
  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="block mb15">
                    <div className="s-txt">
                      연장근무 시간을 입력하지 않을 경우 해당 날짜는 연장근무를
                      하지 않은 날짜로 인식합니다.
                    </div>
                    <div className="s-txt">
                      총근무시간은 연장근무 시작시간에서 종료시간까지의 모든
                      시간을 입력하세요.
                    </div>
                    <div className="s-txt">
                      휴게시간은 총연장근무시간에서 제외하고 급여명세서에
                      표시됩니다.
                    </div>
                    <div className="s-txt">
                      예: 총연장근무시간 2시간, 휴게시간 60분일 경우 1시간
                      근무로 표시됩니다.
                    </div>
                  </div>
                  <div className="block mb10">
                    <input
                      type="text"
                      className="input-frame"
                      readOnly
                      defaultValue="홍길동"
                    />
                  </div>
                  <div className="s-txt">BIM1001</div>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit s">2025.11.03 (월)</div>
              </div>
              <div className="sub-item-bx">
                <div className="work-time-info">
                  <div className="work-time-info-item">
                    <div className="work-time-info-badge g">연장근무</div>
                    <div className="work-time-info-val">
                      9시간 30분 (09:00~18:00)
                    </div>
                  </div>
                  <div className="work-time-info-item">
                    <div className="work-time-info-badge r">계약시급</div>
                    <div className="work-time-info-val">11,000원</div>
                  </div>
                </div>
                <div className="work-time-data-wrap">
                  <div className="work-time-data-item">
                    <div className="work-time-data-item-tit">연장 근무시간</div>
                    <div className="block mb8">
                      <select name="" id="" className="select-form">
                        <option value="1">09:00</option>
                      </select>
                    </div>
                    <div className="block">
                      <select name="" id="" className="select-form">
                        <option value="1">09:00</option>
                      </select>
                    </div>
                  </div>
                  <div className="work-time-data-item">
                    <div className="work-time-data-item-tit">휴게시간</div>
                    <div className="block">
                      <select name="" id="" className="select-form">
                        <option value="1">09:00</option>
                      </select>
                    </div>
                  </div>
                  <div className="work-time-data-item">
                    <div className="work-time-data-item-tit">적용시급</div>
                    <div className="block">
                      <input
                        type="text"
                        className="input-frame al-r"
                        defaultValue="11,000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit s">2025-11-08 (토)</div>
              </div>
              <div className="sub-item-bx">
                <div className="work-time-info">
                  <div className="work-time-info-item">
                    <div className="work-time-info-badge g">연장근무</div>
                    <div className="work-time-info-val">-</div>
                  </div>
                  <div className="work-time-info-item">
                    <div className="work-time-info-badge r">계약시급</div>
                    <div className="work-time-info-val">-</div>
                  </div>
                </div>
                <div className="work-time-data-wrap">
                  <div className="work-time-data-item">
                    <div className="work-time-data-item-tit">연장 근무시간</div>
                    <div className="block mb8">
                      <select name="" id="" className="select-form">
                        <option value="1">09:00</option>
                      </select>
                    </div>
                    <div className="block">
                      <select name="" id="" className="select-form">
                        <option value="1">09:00</option>
                      </select>
                    </div>
                  </div>
                  <div className="work-time-data-item">
                    <div className="work-time-data-item-tit">휴게시간</div>

                    <div className="block">
                      <select name="" id="" className="select-form">
                        <option value="1">09:00</option>
                      </select>
                    </div>
                  </div>
                  <div className="work-time-data-item">
                    <div className="work-time-data-item-tit">적용시급</div>
                    <div className="block">
                      <input
                        type="text"
                        className="input-frame al-r"
                        defaultValue="11,000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <button className="btn-form block blue">저장하기</button>
      </div>
    </>
  );
}
