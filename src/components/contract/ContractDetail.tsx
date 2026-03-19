'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'

export default function ContractDetail() {
  const router = useRouter()
  const setPartStaffPaySheet = useBottomSheetControler(
    (state) => state.setPartStaffPaySheet,
  )
  const setBonusPaySheet = useBottomSheetControler(
    (state) => state.setBonusPaySheet,
  )
  return (
    <>
      <div className="container sub">
        <div className="sub-tit-wrap contract">
          <div className="sub-tit">
            <span className="sub-xs-txt">BBT2025040101 / 전자계약</span>
          </div>
          <div className="auto-right">
            <span className="badge blue">작성중</span>
          </div>
        </div>
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="staff-detail-wrap">
                <div className="staff-detail-info-bx">
                  <div className="staff-icon">
                    <Image
                      src="/assets/images/layout/avatar01.svg"
                      alt="staff-icon"
                      width={54}
                      height={54}
                    />
                  </div>
                  <div className="staff-detail-info">
                    <div className="staff-name">
                      <span>김길수님</span>
                      <div className="staff-job">
                        <span>팀장</span>
                        <span>Manager</span>
                      </div>
                    </div>
                    <div className="staff-data">
                      <span className="badge grey">0026</span>
                      <span className="badge grey">본사직원</span>
                      <span className="badge grey">정규직</span>
                      <span className="badge d-green line w">근무</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-item-bx">
                <table className="info-table">
                  <colgroup>
                    <col style={{ width: '90px' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>본사</th>
                      <td>주식회사 따름인</td>
                    </tr>
                    <tr>
                      <th>가맹점</th>
                      <td>
                        <div className="ellipsis">
                          힘이나는커피생활 을지로3가점
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>본사</th>
                      <td>
                        <div className="ellipsis">
                          힘이나는커피생활 을지로3가점
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">계약정보</div>
                <div className="sub-cont-btn-wrap">
                  <button
                    className="sub-edit-btn"
                    onClick={() => router.push('/contract/1/edit/info')}
                  ></button>
                </div>
              </div>
              <div className="sub-item-bx">
                <table className="info-table">
                  <colgroup>
                    <col style={{ width: '90px' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>업무내용</th>
                      <td>
                        <div>메뉴 제조 및 홀서빙</div>
                        <div>매장오픈/마감, 고객응대</div>
                      </td>
                    </tr>
                    <tr>
                      <th>계약분류</th>
                      <td>포괄연봉제</td>
                    </tr>
                    <tr>
                      <th>4대 보험</th>
                      <td>
                        <div>건강보험, 국민연금</div>
                        <div>고용보험, 산재보험</div>
                      </td>
                    </tr>
                    <tr>
                      <th>급여지급일</th>
                      <td>
                        <div className="data-list">
                          <span>월급</span>
                          <span>당월 30일</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>근로계약서</th>
                      <td>
                        <button className="down-btn">
                          홍길동_근로계약서.pdf
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <th>임금계약서</th>
                      <td>
                        <button className="down-btn">
                          홍길동_임금계약서.pdf
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <th>계약일</th>
                      <td>2020.05.05</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">급여정보</div>
                <div className="sub-cont-btn-wrap">
                  <button
                    className="sub-edit-btn"
                    onClick={() => router.push('/contract/1/employ')}
                  ></button>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="pay-table-header">
                  <div className="pay-table-tit">연봉총액</div>
                  <div className="auto-right">
                    <div className="total-pay">59,730,000원</div>
                  </div>
                </div>
                <table className="pay-table">
                  <colgroup>
                    <col />
                    <col width={'50px'} />
                    <col width={'105px'} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="bold">월급여 총액</td>
                      <td></td>
                      <td className="bold al-r">3,135,000원</td>
                    </tr>
                    <tr>
                      <td className="bold">통상시급</td>
                      <td></td>
                      <td className="bold al-r">15,000원</td>
                    </tr>
                    <tr>
                      <td className="tit">기본급</td>
                      <td className="al-r">8시간</td>
                      <td className="al-r">35,000원</td>
                    </tr>
                    <tr>
                      <td className="tit">연장수당</td>
                      <td className="al-r">8시간</td>
                      <td className="al-r">35,000원</td>
                    </tr>
                    <tr>
                      <td className="tit">야간수당</td>
                      <td className="al-r">8시간</td>
                      <td className="al-r">15,000원</td>
                    </tr>
                    <tr>
                      <td className="tit">휴일근무수당</td>
                      <td className="al-r">8시간</td>
                      <td className="al-r">35,000원</td>
                    </tr>
                    <tr>
                      <td className="tit">추가휴일근무수당</td>
                      <td className="al-r">8시간</td>
                      <td className="al-r">135,000원</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="sub-item-bx">
                <div className="pay-table-header">
                  <div className="pay-table-tit">비과세 항목</div>
                </div>
                <table className="pay-table">
                  <colgroup>
                    <col />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="tit">식대</td>
                      <td className="al-r">35,000원</td>
                    </tr>
                    <tr>
                      <td className="tit">자가운전보조금</td>
                      <td className="al-r">35,000원</td>
                    </tr>
                    <tr>
                      <td className="tit">육아수당</td>
                      <td className="al-r">15,000원</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="sub-item-bx">
                <div className="pay-table-header">
                  <div className="pay-table-tit">시급</div>
                  <div className="auto-right">
                    <button
                      className="contract-arr"
                      onClick={() => setPartStaffPaySheet(true)}
                    ></button>
                  </div>
                </div>
                <table className="pay-table">
                  <colgroup>
                    <col />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="tit">평일시급</td>
                      <td className="al-r">20,000원</td>
                    </tr>
                    <tr>
                      <td className="tit">연장근무시급</td>
                      <td className="al-r">0원</td>
                    </tr>
                    <tr>
                      <td className="tit">휴일근무시급</td>
                      <td className="al-r">0원</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="sub-item-bx">
                <div className="pay-table-header">
                  <div className="pay-table-tit">상여금</div>
                  <div className="auto-right">
                    <button
                      className="contract-arr"
                      onClick={() => setBonusPaySheet(true)}
                    ></button>
                  </div>
                </div>
                <table className="pay-table">
                  <colgroup>
                    <col />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="tit">만근상여</td>
                      <td className="al-r">35,000원</td>
                    </tr>
                    <tr>
                      <td className="tit">직책상여</td>
                      <td className="al-r">35,000원</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">계약근무 시간</div>
                <div className="sub-cont-btn-wrap">
                  <button
                    className="sub-edit-btn"
                    onClick={() => router.push('/contract/1/edit/time')}
                  ></button>
                </div>
              </div>
              <div className="sub-item-bx">
                <table className="info-table">
                  <colgroup>
                    <col style={{ width: '60px' }} />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>평일</th>
                      <td>
                        <div>월,화,수,목</div>
                        <div>07:00 ~ 22:00</div>
                        <div>15:00 ~ 17:00  브레이크타임</div>
                      </td>
                    </tr>
                    <tr>
                      <th>토요일</th>
                      <td>
                        <div>격주근무</div>
                        <div>07:00 ~ 22:00</div>
                        <div>15:00 ~ 17:00  브레이크타임</div>
                      </td>
                    </tr>
                    <tr>
                      <th>일요일</th>
                      <td>
                        <div>매주근무</div>
                        <div>07:00 ~ 22:00</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">계약이력</div>
              </div>
              <div className="sub-item-bx">
                <div className="employment-bx">
                  <div className="employment-num">No.3</div>
                  <table className="info-table">
                    <colgroup>
                      <col style={{ width: '95px' }} />
                      <col />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th>계약서 전송일시</th>
                        <td>2025-01-03 02:28:00</td>
                      </tr>
                      <tr>
                        <th>계약서 열람일시</th>
                        <td>2025-01-03 02:28:00</td>
                      </tr>
                      <tr>
                        <th>전자서명 일시</th>
                        <td>2025-01-03 02:28:00</td>
                      </tr>
                      <tr>
                        <th>서명자 정보</th>
                        <td>홍길동(Ka12345)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="employment-bx">
                  <div className="employment-num">No.2</div>
                  <table className="info-table">
                    <colgroup>
                      <col style={{ width: '95px' }} />
                      <col />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th>계약서 전송일시</th>
                        <td>2025-01-03 02:28:00</td>
                      </tr>
                      <tr>
                        <th>계약서 열람일시</th>
                        <td>2025-01-03 02:28:00</td>
                      </tr>
                      <tr>
                        <th>전자서명 일시</th>
                        <td>2025-01-03 02:28:00</td>
                      </tr>
                      <tr>
                        <th>서명자 정보</th>
                        <td>홍길동(Ka12345)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="employment-bx">
                  <div className="employment-num">No.1</div>
                  <table className="info-table">
                    <colgroup>
                      <col style={{ width: '95px' }} />
                      <col />
                    </colgroup>
                    <tbody>
                      <tr>
                        <th>계약서 전송일시</th>
                        <td>2025-01-03 02:28:00</td>
                      </tr>
                      <tr>
                        <th>계약서 열람일시</th>
                        <td>2025-01-03 02:28:00</td>
                      </tr>
                      <tr>
                        <th>전자서명 일시</th>
                        <td>2025-01-03 02:28:00</td>
                      </tr>
                      <tr>
                        <th>서명자 정보</th>
                        <td>홍길동(Ka12345)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="employment-bx">
                  <button className="btn-form block grey">더보기</button>
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
                      <th>등록자/등록일</th>
                      <td>
                        <div className="data-list">
                          <span>홍길동</span>
                          <span>2025.08.06</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>수정자/수정일</th>
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
        <button className="btn-form block blue mb8">
          직원에게 계약서 전송
        </button>
        <button className="btn-form block sky brd">
          계약서(미날인원본) 다운로드
        </button>
      </div>
    </>
  )
}
