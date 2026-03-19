export default function StoreForm01() {
  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              점포소유 <span className="imp">*</span>
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
              본사/가맹점 <span className="imp">*</span>
            </div>
            <div>
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
              점포명<span className="imp">*</span>
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
              운영여부 <span className="imp">*</span>
            </div>
            <div className="flex g8">
              <button className="radio-btn block act">운영</button>
              <button className="radio-btn block">미운영</button>
            </div>
            <div className="s-txt mt10">운영여부 변경일 : 2025.12.28</div>
          </div>
        </div>
      </div>
    </div>
  );
}
