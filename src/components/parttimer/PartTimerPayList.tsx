'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'

export default function PartTimerPayList() {
  const router = useRouter()
  const setPartTimerSearchSheet = useBottomSheetControler(
    (state) => state.setPartTimerSearchSheet,
  )
  return (
    <div className="container">
      <div className="sub-tit-wrap ">
        <div className="sub-tit">파트타이머 급여명세서</div>
        <div className="sub-btn-wrap">
          <button
            className="btn-s black"
            onClick={() => router.push('/parttimer/1')}
          >
            등록
          </button>
        </div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx staff">
          <div className="search-count">
            검색결과 <span>128건</span>
          </div>
          <button
            className="search-btn act"
            onClick={() => setPartTimerSearchSheet(true)}
          >
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>
        <div className="staff-list-wrap">
          <div className="staff-list-item">
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
                  <Image
                    src="/assets/images/layout/avatar01.svg"
                    alt="staff-icon"
                    width={46}
                    height={46}
                  />
                </div>
                <div className="staff-info-data">
                  <div className="staff-name">
                    <span>김길수</span>
                    <button className="badge org">
                      <i className="email_icon"></i>이메일 전송
                    </button>
                  </div>
                  <div className="staff-job">파트타이머/토,일요일/근무</div>
                </div>
              </div>
            </div>
            <button
              className="sub-item-bx "
              onClick={() => router.push('/parttimer/1')}
            >
              <div className="pay-title">2025년 1월 급여</div>
              <table className="info-table">
                <colgroup>
                  <col style={{ width: '90px' }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>급여일</th>
                    <td>2025.01.01</td>
                  </tr>
                  <tr>
                    <th>등록일</th>
                    <td>2025.01.01</td>
                  </tr>
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
                    <th>점포</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </button>
          </div>
          <div className="staff-list-item">
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
                  <Image
                    src="/assets/images/layout/avatar02.svg"
                    alt="staff-icon"
                    width={46}
                    height={46}
                  />
                </div>
                <div className="staff-info-data">
                  <div className="staff-name">
                    <span>홍길동</span>
                    <b className="badge org line">
                      <i className="email_icon"></i>전송완료
                    </b>
                  </div>
                  <div className="staff-job">파트타이머/토,일요일/근무</div>
                </div>
              </div>
            </div>
            <button className="sub-item-bx">
              <div className="pay-title">2025년 1월 급여</div>
              <table className="info-table">
                <colgroup>
                  <col style={{ width: '90px' }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>급여일</th>
                    <td>2025.01.01</td>
                  </tr>
                  <tr>
                    <th>등록일</th>
                    <td>2025.01.01</td>
                  </tr>
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
                    <th>점포</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </button>
          </div>
          <div className="staff-list-item">
            <div className="staff-item-header">
              <div className="head-staff-info">
                <div className="staff-icon">
                  <Image
                    src="/assets/images/layout/avatar03.svg"
                    alt="staff-icon"
                    width={46}
                    height={46}
                  />
                </div>
                <div className="staff-info-data">
                  <div className="staff-name">
                    <span>김민수</span>
                    <button className="badge org">
                      <i className="email_icon"></i>이메일 전송
                    </button>
                  </div>
                  <div className="staff-job">파트타이머/토,일요일/근무</div>
                </div>
              </div>
            </div>
            <button className="sub-item-bx">
              <div className="pay-title">2025년 1월 급여</div>
              <table className="info-table">
                <colgroup>
                  <col style={{ width: '90px' }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>급여일</th>
                    <td>2025.01.01</td>
                  </tr>
                  <tr>
                    <th>등록일</th>
                    <td>2025.01.01</td>
                  </tr>
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
                    <th>점포</th>
                    <td>
                      <div className="ellipsis">
                        힘이나는커피생활 을지로3가점
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
