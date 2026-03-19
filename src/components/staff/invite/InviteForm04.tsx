"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";

export default function InviteForm04() {
  const setTimeSelectSheet = useBottomSheetControler(
    (state) => state.setTimeSelectSheet
  );

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-cont-tit-wrap">
          <div className="sub-cont-tit">
            계약 근무시간 <span className="imp">*</span>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">평일</div>
            <div>
              <div className="block mb8">
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
          <div className="data-filed">
            <div className="filed-tit sub">휴게시간</div>
            <div>
              <div className="block mb8">
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
          <div className="data-filed">
            <div className="filed-tit sub">근무요일</div>
            <div className="flex g8">
              <button className="day-btn act">월</button>
              <button className="day-btn">화</button>
              <button className="day-btn act">수</button>
              <button className="day-btn act">목</button>
              <button className="day-btn act">금</button>
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">토요일</div>
            <div>
              <div className="block mb8">
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
          <div className="data-filed">
            <div className="filed-tit sub">휴게시간</div>
            <div>
              <div className="block mb8">
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
          <div className="data-filed">
            <div className="filed-tit sub">격주근무 여부</div>
            <div className="flex g8">
              <button className="radio-btn block blue act">매주 근무</button>
              <button className="radio-btn block blue">격주 근무 </button>
            </div>
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">격주근무 시작일</div>
            <div className="block">
              <div className="date-picker-custom">
                <input
                  type="text"
                  className="date-picker-input"
                  defaultValue="2025.10.28"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">일요일</div>
            <div>
              <div className="block mb8">
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
          <div className="data-filed">
            <div className="filed-tit sub">브레이크타임</div>
            <div>
              <div className="block mb8">
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
          <div className="data-filed">
            <div className="filed-tit sub">격주근무 여부</div>
            <div className="flex g8">
              <button className="radio-btn block blue act">매주 근무</button>
              <button className="radio-btn block blue">격주 근무 </button>
            </div>
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">격주근무 시작일</div>
            <div className="block">
              <div className="date-picker-custom">
                <input
                  type="text"
                  className="date-picker-input"
                  defaultValue="2025.10.28"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
