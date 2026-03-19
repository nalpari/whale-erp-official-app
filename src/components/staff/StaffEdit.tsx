export default function StaffEdit() {
  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
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
                <div className="filed-tit">사번</div>
                <div className="block mb8">
                  <input type="text" className="input-frame" />
                </div>
                <div className="block">
                  <button className="btn-form block grey">중복 확인</button>
                </div>
                <div className="s-txt mt10">※ 4~6자리 입력</div>
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
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">
                  근무여부 <span className="imp">*</span>
                </div>
                <div className="flex g8">
                  <button className="radio-btn block act">본사</button>
                  <button className="radio-btn block">휴직</button>
                  <button className="radio-btn block">퇴사</button>
                </div>
              </div>
            </div>
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="filed-tit">
                  입사일 <span className="imp">*</span>
                </div>
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
                <div className="filed-tit">
                  퇴사일/퇴사사유 <span className="imp">*</span>
                </div>
                <div className="block mb8">
                  <div className="date-picker-custom">
                    <input
                      type="text"
                      className="date-picker-input"
                      defaultValue="2025.10.28"
                      disabled
                    />
                  </div>
                </div>
                <div className="block">
                  <input type="text" className="input-frame" disabled />
                </div>
              </div>
            </div>
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">직원분류</div>
                </div>
                <div className="block">
                  <select name="" id="" className="select-form">
                    <option value="1"> 본사직원</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">
                    계약분류 <span className="imp">*</span>
                  </div>
                </div>
                <div className="block">
                  <select name="" id="" className="select-form">
                    <option value="1"> 정직원</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="sub-item-bx">
              <div className="data-filed">
                <div className="tit-head">
                  <div className="filed-tit">직급/직책</div>
                </div>
                <div className="block mb8">
                  <select name="" id="" className="select-form">
                    <option value="1"> 과장</option>
                  </select>
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
                <div className="tit-head">
                  <div className="filed-tit">메모</div>
                </div>
                <div className="block">
                  <textarea
                    name=""
                    id=""
                    className="textarea-form"
                    placeholder="관리자용 메모를 작성할 수 있습니다."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <div className="">
          <button className="btn-form block blue">저장하기</button>
        </div>
      </div>
    </>
  );
}
