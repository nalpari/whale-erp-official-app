'use client'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'

export default function PartTimerPayDetail() {
  const router = useRouter()
  const setDeductionAddSheet = useBottomSheetControler(
    (state) => state.setDeductionAddSheet,
  )
  return (
    <>
      <div className="container sub">
        <div className="pay-head-btn-wrap">
          <button className="pay-head-btn">
            <i className="email-icon"></i>이메일 전송
          </button>
          <button className="pay-head-btn">
            <i className="download-icon"></i>급여명세서 다운로드
          </button>
        </div>
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    소속 <span className="imp">*</span>
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
                  <div className="block mb8">
                    <select name="" id="" className="select-form">
                      <option value="1"> 본사 선택</option>
                    </select>
                  </div>
                  <div className="block mb8">
                    <select name="" id="" className="select-form" disabled>
                      <option value="1"> 가맹점 선택</option>
                    </select>
                  </div>
                  <div className="block">
                    <select name="" id="" className="select-form">
                      <option value="1"> 점포선택</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    급여 지급월 <span className="imp">*</span>
                  </div>
                  <div className="block mb8">
                    <select name="" id="" className="select-form">
                      <option value="1"> 2025.05</option>
                    </select>
                  </div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      defaultValue="지급일 - 2025.06.10"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    직원명 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <select name="" id="" className="select-form" disabled>
                      <option value="1"> 홍길동</option>
                    </select>
                  </div>
                  <div className="s-txt mt10">BIM1001</div>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">
                  근무기간 / 4대보험 공제액 설정 <span className="imp">*</span>
                </div>
                <div className="auto-right ">
                  <button
                    className="sub-edit-btn"
                    onClick={() => setDeductionAddSheet(true)}
                  >
                    <i className="sub-arr-btn"></i>
                  </button>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">근무기간</div>
                  <div className="block">
                    <input
                      type="text"
                      className="input-frame"
                      defaultValue="2025.10.28 ~ 2025.11.28"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">4대보험 공제</div>
                  <div className="pay-data-list">
                    <div className="pay-data-item">
                      <div className="pay-data-item-tit">국민연금(원)</div>
                      <div className="pay-data-item-value">38,000</div>
                    </div>
                    <div className="pay-data-item">
                      <div className="pay-data-item-tit">건강보험(원)</div>
                      <div className="pay-data-item-value">38,000</div>
                    </div>
                    <div className="pay-data-item">
                      <div className="pay-data-item-tit">고용보험(원)</div>
                      <div className="pay-data-item-value">38,000</div>
                    </div>
                    <div className="pay-data-item">
                      <div className="pay-data-item-tit">장기요양보험(원)</div>
                      <div className="pay-data-item-value">38,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination flex g8">
        <button
          className="btn-form block sky brd"
          onClick={() => router.push('/parttimer/1/stub')}
        >
          급여내역 미리보기
        </button>
      </div>
    </>
  )
}
