"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";

export default function PlanTableEdit() {
  // 근무자 교체
  const setWorkerChangeSheet = useBottomSheetControler(
    (state) => state.setWorkerChangeSheet
  );
  // 근무자 삭제
  const setWorkerDeleteSheet = useBottomSheetControler(
    (state) => state.setWorkerDeleteSheet
  )
  // 시간 설정
  const setTimeSelectSheet = useBottomSheetControler(
    (state) => state.setTimeSelectSheet
  );
  // 직원 추가
  const setWorkerAddSheet = useBottomSheetControler(
    (state) => state.setWorkerAddSheet
  );
  // 임시 직원 추가
  const setTemporaryWorkerAddSheet = useBottomSheetControler(
    (state) => state.setTemporaryWorkerAddSheet
  );
  // 근무자 검색
  const setWorkerSearchSheet = useBottomSheetControler(
    (state) => state.setWorkerSearchSheet
  );


  return (
    <>
      <div className="container sub">
        <div className="date-read">
          <span className="date-read-icon"></span>
          <span><b>2025.12.08(월)</b>~<b>2025.12.15(일)</b></span>
        </div>
        <div className="pay-head-btn-wrap">
          <button className="pay-head-btn" onClick={() => setWorkerAddSheet(true)}>
            <i className="invite"></i>직원추가
          </button>
          <button className="pay-head-btn" onClick={() => setTemporaryWorkerAddSheet(true)}>
            <i className="add_team"></i>임시 근무자 추가
          </button>
        </div>
        <div className="sub-content-body">
          <div className="search-bx staff">
            <div className="search-count">
              검색결과 <span>128건</span>
            </div>
            <button
              className="search-btn"
              onClick={() => setWorkerSearchSheet(true)}
            >
              <i className="icon-search"></i>
              <span>검색</span>
            </button>
          </div>
          <div className="sub-cont-wrap">
          <div className="plan-table-wrap">
            <div className="plan-table-item">
              <div className="plan-table-header">
                <div className="plan-table-day">2025.12.26 월</div>
              </div>
              <div className="plan-table-content">
                <div className="sub-item-bx full">
                  <div className="plan-staff-head">
                    <div className="plan-staff-info">
                      <span className="badge blue">정직원</span>
                      <span className="name">김직원 </span>
                      <span className="time">8h</span>
                    </div>
                    <div className="auto-right">
                      <div className="flex g8">
                        <button
                          className="change_staff"
                          onClick={() => setWorkerChangeSheet(true)}
                        ></button>
                        <button
                          className="delete_staff"
                          onClick={() => setWorkerDeleteSheet(true)}
                        ></button>
                      </div>
                    </div>
                  </div>
                  <div className="plan-time-form">
                    <div className="plan-time-form-item">
                      <div className="plan-time-form-item-tit">근무시간</div>
                      <div className="flex g8">
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            시작시간
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            종료시간
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="plan-time-form-item">
                      <div className="plan-time-form-item-tit">휴계시간</div>
                      <div className="flex g8">
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            시작시간
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            종료시간
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sub-item-bx part">
                  <div className="plan-staff-head">
                    <div className="plan-staff-info">
                      <span className="badge green">파트</span>
                      <span className="name">김직원 </span>
                      <span className="time">8h</span>
                    </div>
                    <div className="auto-right">
                      <div className="flex g8">
                        <button
                          className="change_staff"
                          onClick={() => setWorkerChangeSheet(true)}
                        ></button>
                        <button
                          className="delete_staff"
                          onClick={() => setWorkerDeleteSheet(true)}
                        ></button>
                      </div>
                    </div>
                  </div>
                  <div className="plan-time-form">
                    <div className="plan-time-form-item">
                      <div className="plan-time-form-item-tit">근무시간</div>
                      <div className="flex g8">
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            시작시간
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            종료시간
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="plan-time-form-item">
                      <div className="plan-time-form-item-tit">휴계시간</div>
                      <div className="flex g8">
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            시작시간
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            종료시간
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sub-item-bx temporary">
                  <div className="plan-staff-head">
                    <div className="plan-staff-info">
                      <span className="badge brown">임시</span>
                      <span className="name">김직원 </span>
                      <span className="time">8h</span>
                    </div>
                    <div className="auto-right">
                      <div className="flex g8">
                        <button
                          className="change_staff"
                          onClick={() => setWorkerChangeSheet(true)}
                        ></button>
                        <button
                          className="delete_staff"
                          onClick={() => setWorkerDeleteSheet(true)}
                        ></button>
                      </div>
                    </div>
                  </div>
                  <div className="plan-time-form">
                    <div className="plan-time-form-item">
                      <div className="plan-time-form-item-tit">근무시간</div>
                      <div className="flex g8">
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            시작시간
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            종료시간
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="plan-time-form-item">
                      <div className="plan-time-form-item-tit">휴계시간</div>
                      <div className="flex g8">
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            시작시간
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => setTimeSelectSheet(true)}
                          >
                            종료시간
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <div className="flex g8">
          <button className="btn-form block sky brd">초기화</button>
          <button className="btn-form block blue">저장</button>
        </div>
      </div>
    </>
  );
}