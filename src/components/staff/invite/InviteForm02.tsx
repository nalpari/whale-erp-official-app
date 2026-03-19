"use client";
import { Tooltip } from "react-tooltip";

export default function InviteForm02() {
  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-cont-tit-wrap">
          <div className="sub-cont-tit">근로/계약조건</div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              계약기간 <span className="imp">*</span>
            </div>
            <div className="flex g8 mb8">
              <button className="radio-btn block blue act">
                계약기간 있음
              </button>
              <button className="radio-btn block blue">계약기간 미정</button>
            </div>
            <div className="flex g6">
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
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              업무내용 <span className="imp">*</span>
            </div>
            <div className="radio-btn-grid ">
              <button className="radio-btn block blue act">메뉴조리</button>
              <button className="radio-btn block blue ">홀서빙</button>
              <button className="radio-btn block blue ">고객응대</button>
              <button className="radio-btn block blue ">업무보조</button>
              <button className="radio-btn block blue act">매장청소</button>
              <button className="radio-btn block blue act">직접입력</button>
            </div>
            <div className="block">
              <textarea
                name=""
                id=""
                className="textarea-form"
                placeholder="업무 내용을 직접 입력해주세요."
              ></textarea>
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="tit-head">
              <div className="filed-tit">
                계약분류<span className="imp">*</span>
              </div>
              <div className="auto-right">
                <button className="tooltip-btn">
                  <span className="tooltip-icon" id="tooltip-btn-anchor"></span>
                  <Tooltip
                    className="tooltip-txt"
                    anchorSelect="#tooltip-btn-anchor"
                    opacity={1}
                  >
                    <div>tooltip text</div>
                  </Tooltip>
                </button>
              </div>
            </div>
            <div className="block">
              <select name="" id="" className="select-form">
                <option value="1"> 선택</option>
              </select>
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              4대보험 가입여부<span className="imp"> *</span>
            </div>
            <div className="flex g8">
              <button className="radio-btn block blue act">
                건강보험, 국민연금
              </button>
              <button className="radio-btn block blue">
                고용보험, 산재보험
              </button>
            </div>
            <div className="s-txt mt10">
              ※ 적용할 항목 체크 시 급여에 반영됩니다.
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="tit-head">
              <div className="filed-tit">
                급여 지급일 <span className="imp"> *</span>
              </div>
            </div>
            <div className="block mb8">
              <select name="" id="" className="select-form">
                <option value="1"> 월급</option>
              </select>
            </div>
            <div className="block mb8">
              <select name="" id="" className="select-form">
                <option value="1"> 익월</option>
              </select>
            </div>
            <div className="block">
              <select name="" id="" className="select-form">
                <option value="1"> 15일</option>
              </select>
            </div>
            <div className="s-txt mt10">
              ※ 31일로 설정 시, 급여일은 매월 말일 적용됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
