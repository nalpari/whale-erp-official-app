export default function InviteForm01() {
  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-cont-tit-wrap">
          <div className="sub-cont-tit">직원 기본정보</div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              근무장소 <span className="imp">*</span>
            </div>
            <div className="flex g8">
              <button className="radio-btn block act">본사</button>
              <button className="radio-btn block">가맹점</button>
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              본사/가맹점/점포 <span className="imp">*</span>
            </div>
            <div>
              <div className="block mb8">
                <select name="" id="" className="select-form">
                  <option value="1">본사 선택</option>
                </select>
              </div>
              <div className="block mb8">
                <select name="" id="" className="select-form">
                  <option value="1">본사 선택</option>
                </select>
              </div>
              <div className="block">
                <select name="" id="" className="select-form" disabled>
                  <option value="1">가맹점 선택</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              직원명<span className="imp">*</span>
            </div>
            <div className="block">
              <input type="text" className="input-frame" />
            </div>
            <div className="warning mt10">점포명 입력</div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              휴대폰 번호<span className="imp"> *</span>
            </div>
            <div className="block">
              <input type="text" className="input-frame" />
            </div>
            <div className="s-txt mt10">※ 숫자만 입력 가능</div>
          </div>
        </div>
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="tit-head">
              <div className="filed-tit">Partner Office 권한 설정</div>
            </div>
            <div className="block">
              <select name="" id="" className="select-form">
                <option value="1"> 선택</option>
              </select>
            </div>
            <div className="s-txt mt10">
              ※ 직원이 Partner Office에서 관리자로 겸임할 때 사용합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
