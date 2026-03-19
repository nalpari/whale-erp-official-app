"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useRouter } from "next/navigation";

export default function PlanTable() {
  const router = useRouter();
  const setPlanSearchSheet = useBottomSheetControler(
    (state) => state.setPlanSearchSheet
  );
  return (
    <div className="container">
      <div className="sub-tit-wrap ">
        <div className="sub-tit">점포별 근무 계획표</div>
        <div className="sub-btn-wrap">
          <button
            className="btn-s black"
            onClick={() => router.push("/plan/1")}
          >
            <i className="plan-create"></i>
            계획 수립
          </button>
        </div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx staff">
          <div className="search-count">
            검색결과 <span>128건</span>
          </div>
          <button
            className="search-btn"
            onClick={() => setPlanSearchSheet(true)}
          >
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>
        <div className="plan-table-wrap">
          <div className="plan-table-item">
            <div className="plan-table-header">
              <div className="plan-table-day">2025.12.26 월</div>
              <div className="auto-right">
                <button className="sub-edit-btn" onClick={() => router.push("/plan/1")}></button>
              </div>
            </div>
            <div className="plan-table-content">
              <div className="sub-item-bx full">
                <div className="plan-staff-head">
                  <div className="plan-staff-info">
                    <span className="badge blue">정직원</span>
                    <span className="name">김직원</span>
                    <span className="time">07:00-15:00</span>
                  </div>
                  <div className="auto-right">
                    <div className="work-time">8h</div>
                  </div>
                </div>
                <div className="plan-table">
                  <div className="time-wrap">
                    <div className="time-hour-wrap">
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                    </div>
                    <div className="time-num">
                      <span className="hour">06</span>
                      <span className="hour">07</span>
                      <span className="hour">08</span>
                      <span className="hour">09</span>
                      <span className="hour">10</span>
                      <span className="hour">11</span>
                      <span className="hour">12</span>
                      <span className="hour">13</span>
                      <span className="hour">14</span>
                      <span className="hour">15</span>
                      <span className="hour">16</span>
                      <span className="hour">17</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx part">
                <div className="plan-staff-head">
                  <div className="plan-staff-info">
                    <span className="badge green">파트</span>
                    <span className="name">김직원</span>
                    <span className="time">07:00-15:00</span>
                  </div>
                  <div className="auto-right">
                    <div className="work-time">8h</div>
                  </div>
                </div>
                <div className="plan-table">
                  <div className="time-wrap">
                    <div className="time-hour-wrap">
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                    </div>
                    <div className="time-num">
                      <span className="hour">06</span>
                      <span className="hour">07</span>
                      <span className="hour">08</span>
                      <span className="hour">09</span>
                      <span className="hour">10</span>
                      <span className="hour">11</span>
                      <span className="hour">12</span>
                      <span className="hour">13</span>
                      <span className="hour">14</span>
                      <span className="hour">15</span>
                      <span className="hour">16</span>
                      <span className="hour">17</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx temporary">
                <div className="plan-staff-head">
                  <div className="plan-staff-info">
                    <span className="badge brown">임시</span>
                    <span className="name">김직원</span>
                    <span className="time">07:00-15:00</span>
                  </div>
                  <div className="auto-right">
                    <div className="work-time">8h</div>
                  </div>
                </div>
                <div className="plan-table">
                  <div className="time-wrap">
                    <div className="time-hour-wrap">
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                    </div>
                    <div className="time-num">
                      <span className="hour">06</span>
                      <span className="hour">07</span>
                      <span className="hour">08</span>
                      <span className="hour">09</span>
                      <span className="hour">10</span>
                      <span className="hour">11</span>
                      <span className="hour">12</span>
                      <span className="hour">13</span>
                      <span className="hour">14</span>
                      <span className="hour">15</span>
                      <span className="hour">16</span>
                      <span className="hour">17</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="plan-table-item">
            <div className="plan-table-header">
              <div className="plan-table-day">2025.12.27 화</div>
              <div className="auto-right">
                <button className="sub-edit-btn"></button>
              </div>
            </div>
            <div className="plan-table-content">
              <div className="sub-item-bx full">
                <div className="plan-staff-head">
                  <div className="plan-staff-info">
                    <span className="badge blue">정직원</span>
                    <span className="name">김직원</span>
                    <span className="time">07:00-15:00</span>
                  </div>
                  <div className="auto-right">
                    <div className="work-time">8h</div>
                  </div>
                </div>
                <div className="plan-table">
                  <div className="time-wrap">
                    <div className="time-hour-wrap">
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                    </div>
                    <div className="time-num">
                      <span className="hour">06</span>
                      <span className="hour">07</span>
                      <span className="hour">08</span>
                      <span className="hour">09</span>
                      <span className="hour">10</span>
                      <span className="hour">11</span>
                      <span className="hour">12</span>
                      <span className="hour">13</span>
                      <span className="hour">14</span>
                      <span className="hour">15</span>
                      <span className="hour">16</span>
                      <span className="hour">17</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx part">
                <div className="plan-staff-head">
                  <div className="plan-staff-info">
                    <span className="badge green">파트</span>
                    <span className="name">김직원</span>
                    <span className="time">07:00-15:00</span>
                  </div>
                  <div className="auto-right">
                    <div className="work-time">8h</div>
                  </div>
                </div>
                <div className="plan-table">
                  <div className="time-wrap">
                    <div className="time-hour-wrap">
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                    </div>
                    <div className="time-num">
                      <span className="hour">06</span>
                      <span className="hour">07</span>
                      <span className="hour">08</span>
                      <span className="hour">09</span>
                      <span className="hour">10</span>
                      <span className="hour">11</span>
                      <span className="hour">12</span>
                      <span className="hour">13</span>
                      <span className="hour">14</span>
                      <span className="hour">15</span>
                      <span className="hour">16</span>
                      <span className="hour">17</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx temporary">
                <div className="plan-staff-head">
                  <div className="plan-staff-info">
                    <span className="badge brown">임시</span>
                    <span className="name">김직원</span>
                    <span className="time">07:00-15:00</span>
                  </div>
                  <div className="auto-right">
                    <div className="work-time">8h</div>
                  </div>
                </div>
                <div className="plan-table">
                  <div className="time-wrap">
                    <div className="time-hour-wrap">
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half rest"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half rest"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half"></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                      <div className="time-hour">
                        <span className="half"></span>
                        <span className="half "></span>
                      </div>
                    </div>
                    <div className="time-num">
                      <span className="hour">06</span>
                      <span className="hour">07</span>
                      <span className="hour">08</span>
                      <span className="hour">09</span>
                      <span className="hour">10</span>
                      <span className="hour">11</span>
                      <span className="hour">12</span>
                      <span className="hour">13</span>
                      <span className="hour">14</span>
                      <span className="hour">15</span>
                      <span className="hour">16</span>
                      <span className="hour">17</span>
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
