'use client'
import { useRouter } from 'next/navigation'

export default function PartTimerPayStub() {
  const router = useRouter()
  return (
    <div className="container sub">
      <div className="sub-content-body">
        <button
          className="work-time-edit "
          onClick={() => router.push('/parttimer/1/time')}
        >
          <div className="work-time-edit-tit">
            <i className="time-edit-icon"></i>
            <span>근무시간 수정</span>
          </div>
          <div className="auto-right">
            <i className="contract-arr"></i>
          </div>
        </button>
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">
                급여내역<span className="imp"> *</span>
              </div>
            </div>
            <div className="pay-stub-wrap">
              <div className="pay-stub-item last-week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">전주 급여소계</div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item day">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">2025.11.03 (월)</div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item day">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">2025.11.03 (월)</div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">
                    <span>주간소계</span>
                    <span>11.03~11.09</span>
                  </div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">
                    <span>주휴수당</span>
                    <span>11.03~11.09</span>
                  </div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">
                    <span>주간합계</span>
                    <span>11.03~11.09</span>
                  </div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item day">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">2025.11.03 (월)</div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item day">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">2025.11.03 (월)</div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">
                    <span>주간소계</span>
                    <span>11.03~11.09</span>
                  </div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">
                    <span>주휴수당</span>
                    <span>11.03~11.09</span>
                  </div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">
                    <span>주간합계</span>
                    <span>11.03~11.09</span>
                  </div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">8</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">10,100</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">96,960</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item last-week">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">급여소계</div>
                  <div className="pay-stub-item-head-val">78,133.60원</div>
                </div>
                <ul className="pay-stub-table-list">
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시간</div>
                    <div className="pay-stub-table-list-val">202</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">시급</div>
                    <div className="pay-stub-table-list-val">0</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">지급액</div>
                    <div className="pay-stub-table-list-val">2,036,160</div>
                  </li>
                  <li className="pay-stub-table-list-item">
                    <div className="pay-stub-table-list-tit">공제액</div>
                    <div className="pay-stub-table-list-val">67,193</div>
                  </li>
                </ul>
              </div>
              <div className="pay-stub-item last-week s">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">4대보험 공제액</div>
                  <div className="pay-stub-item-head-val">26,000원</div>
                </div>
              </div>
              <div className="pay-stub-item last-week s">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">상여금</div>
                  <div className="pay-stub-item-head-val">29,010원</div>
                </div>
              </div>
              <div className="pay-stub-item day">
                <table className="pay-stub-table">
                  <thead>
                    <tr>
                      <th>항목</th>
                      <th>지급액</th>
                      <th>공제액</th>
                      <th>차인금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="al-c">만근상여</td>
                      <td>30,000</td>
                      <td>990</td>
                      <td>29,010</td>
                    </tr>
                    <tr>
                      <td className="al-c">인센티브</td>
                      <td>30,000</td>
                      <td>990</td>
                      <td>29,010</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pay-stub-item total">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">급여합계</div>
                  <div className="pay-stub-item-head-val">2,066,160 원</div>
                </div>
              </div>
              <div className="pay-stub-item total-real">
                <div className="pay-stub-item-head">
                  <div className="pay-stub-item-head-tit">실지급액</div>
                  <div className="pay-stub-item-head-val">1,997,977 원</div>
                </div>
              </div>
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
  )
}
