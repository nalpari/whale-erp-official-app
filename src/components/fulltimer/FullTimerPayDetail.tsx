'use client'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'

export default function FullTimerPayDetail() {
  const setPaymentConditionSheet = useBottomSheetControler(
    (state) => state.setPaymentConditionSheet,
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
                    직원명 <span className="imp">*</span>
                  </div>
                  <div className="block mb8">
                    <button className="btn-form block grey">
                      이전 계약정보 불러오기
                    </button>
                  </div>
                  <div className="block">
                    <select name="" id="" className="select-form" disabled>
                      <option value="1"> 홍길동</option>
                    </select>
                  </div>
                  <div className="s-txt mt10">BIM1001</div>
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
                    정산기간 <span className="imp">*</span>
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
                  <div className="tit-head">
                    <div className="filed-tit">
                      파일로 대체<span className="imp"> *</span>
                    </div>
                    <div className="auto-right">
                      <div className="toggle-btn">
                        <input type="checkbox" id="toggle-btn" />
                        <label className="slider" htmlFor="toggle-btn"></label>
                      </div>
                    </div>
                  </div>
                  <div className="block mb10">
                    <div className="file-btn">
                      <input type="file" id="file-input" />
                      <label
                        className="btn-form block grey"
                        htmlFor="file-input"
                      >
                        <i className="file-icon"></i>
                        <span>파일찾기</span>
                      </label>
                    </div>
                  </div>
                  <div className="store-img-list">
                    <div className="store-img-bx">
                      <div className="store-img-tit">
                        <span className="img-tit">홍길동_임금계약서</span>
                        <span>.pdf</span>
                      </div>
                      <div className="store-img-btn-wrap">
                        <button className="img-delete"></button>
                      </div>
                    </div>
                    <div className="store-img-bx">
                      <div className="store-img-tit">
                        <span className="img-tit">홍길동_임금계약서</span>
                        <span>.pdf</span>
                      </div>
                      <div className="store-img-btn-wrap">
                        <button className="img-delete"></button>
                      </div>
                    </div>
                  </div>
                  <div className="filed-guide">
                    <span>
                      등록가능한 파일 문서파일(PDF), 이미지파일 (PNG,JPG, JPEG)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">
                  급여정보<span className="imp"> *</span>
                </div>
                <div className="auto-right ">
                  <button
                    className="flex g8"
                    onClick={() => setPaymentConditionSheet(true)}
                  >
                    <span className="sub-btn-txt">상세내역 설정</span>
                    <i className="sub-arr-btn"></i>
                  </button>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="pay-data-list">
                  <div className="pay-data-item top">
                    <div className="pay-data-item-tit">실지급액</div>
                    <div className="pay-data-item-value">3,135,000원</div>
                  </div>
                  <div className="pay-data-item">
                    <div className="pay-data-item-tit">지급총액</div>
                    <div className="pay-data-item-value">35,000원</div>
                  </div>
                  <div className="pay-data-item">
                    <div className="pay-data-item-tit">공제총액</div>
                    <div className="pay-data-item-value">35,000원</div>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <dl className="pay-data-guide">
                  <dt>산출식/산출방법 및 지급액</dt>
                  <dd>
                    기본급 : 월간 기본근무 시간 (209시간)  × 통상시급 (10,000원)
                    = 2,297,784
                  </dd>
                  <dd>
                    연장수당 : 연장 근무 시간(2시간) × 통상시급 × 1.5 (15,000원)
                    = 30,000
                  </dd>
                  <dd>
                    야간수당 : 야간 근무 시간(2시간) × 통상시급 × 0.5 (5,000원)
                    = 10,000
                  </dd>
                  <dd>
                    월간 휴일 근무 수당 : 월간 휴일 근무 시간(2시간) × 통상시급
                    × 0.5 (5,000원) = 10,000
                  </dd>
                  <dd>
                    추가근무수당 : 추가 근무 시간(2시간) × 통상시급 × 1.5
                    (15,000원) = 30,000
                  </dd>
                  <dd>
                    만근상여 : 근무 기간 중 지각, 조퇴, 결근이 없는 경우 지급 =
                    30,000
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">등록 및 수정 이력</div>
              </div>
              <div className="sub-item-bx">
                <table className="info-table">
                  <colgroup>
                    <col style={{ width: '95px' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>등록일</th>
                      <td>
                        <div className="data-list">
                          <span>홍길동</span>
                          <span>2025.08.06</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>최근수정일</th>
                      <td>
                        <div className="data-list">
                          <span>홍길동</span>
                          <span>2025.08.06</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <button className="btn-form block blue">저장하기</button>
      </div>
    </>
  )
}
