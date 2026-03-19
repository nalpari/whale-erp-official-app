import Link from "next/link";
import "@/styles/publishpage.scss";

export default function PublishPage() {
  return (
    <div className="publish-list">
      <div className="p-header">
        <h1>Whale ERP</h1>
      </div>
      <div className="p-body">
        <div className="p-contents">
          <div className="p-guide mb15">
            <div className="p-guide-header">Style Guide</div>
            <div className="p-guide-content">
              <div className="p-guide-link-wrap">
                <Link href={"/list/style"}>Style Guide</Link>
              </div>
            </div>
          </div>
          <div className="p-guide">
            <div className="p-guide-header">Publish Guide</div>
            <div className="p-guide-content">
              <p>
                ※ className은 케밥 케이스 사용
                <span> ex) &quot;sample-class&quot;</span>
              </p>
              <p>
                ※ img네이밍은 &quot;_&quot;로 사용, 번호 사용시 01, 02 와 같이
                2자리 숫자 사용 <span>ex) &quot;img_sample01&quot;</span>
              </p>
              <p>
                ※ button, select, checkbox, radio... 등 기본 설정은
                <span> Style Guide</span>에 정의된 내용만 사용
              </p>
              <p>
                ※ scss파일 생성시 &quot;_&quot;를 앞에 붙힌 후 생성, 또한 해당
                카테고리에 적합한 폴더에 생성
              </p>
            </div>
          </div>
          <div className="p-list-wrap">
            <h2>Publish List</h2>
            <div className="p-list-table">
              <table>
                <colgroup>
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "15%" }} />
                  <col />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "13%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Depth01</th>
                    <th>Depth02</th>
                    <th>파일명</th>
                    <th>비고</th>
                    <th>MarkUp</th>
                    <th>완료일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Main</td>
                    <td></td>
                    <td>
                      <Link href={"/"}>Main.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-09</td>
                  </tr>
                  <tr>
                    <td>Change Password</td>
                    <td></td>
                    <td>
                      <Link href={"/changepw"}>ChangePassword.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-19</td>
                  </tr>
                  <tr>
                    <td rowSpan={3}>Login</td>
                    <td></td>
                    <td>
                      <Link href={"/login"}>Login.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2025-12-24</td>
                  </tr>
                  <tr>
                    <td>ID 찾기</td>
                    <td>
                      <Link href={"/login/findid"}>FindId.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-19</td>
                  </tr>
                  <tr>
                    <td>PW 찾기</td>
                    <td>
                      <Link href={"/login/findpw"}>FindPw.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-19</td>
                  </tr>
                  
                  <tr>
                    <td rowSpan={6}>점포 정보</td>
                    <td>점포 정보 리스트</td>
                    <td>
                      <Link href={"/storeinfo"}>StoreInfoList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-09</td>
                  </tr>
                  <tr>
                    <td>점포 정보 상세</td>
                    <td>
                      <Link href={"/storeinfo/1"}>StoreInfoDetail.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-09</td>
                  </tr>
                  <tr>
                    <td>점포 정보 등록</td>
                    <td>
                      <Link href={"/storeinfo/create"}>
                        StoreInfoCreate.tsx
                      </Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-09</td>
                  </tr>
                  <tr>
                    <td>점포 정보 수정</td>
                    <td>
                      <Link href={"/storeinfo/1/edit/store"}>
                        StoreEditInfo.tsx
                      </Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-09</td>
                  </tr>
                  <tr>
                    <td>점포 사진 수정</td>
                    <td>
                      <Link href={"/storeinfo/1/edit/photo"}>
                        StoreEditPhoto.tsx
                      </Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-09</td>
                  </tr>
                  <tr>
                    <td>점포 영업시간 수정</td>
                    <td>
                      <Link href={"/storeinfo/1/edit/time"}>
                        StoreEditTime.tsx
                      </Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-09</td>
                  </tr>
                  <tr>
                    <td rowSpan={5}>직원 정보</td>
                    <td>직원 정보 리스트</td>
                    <td>
                      <Link href={"/staff"}>StaffInfoList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>직원 정보 상세</td>
                    <td>
                      <Link href={"/staff/1"}>StaffInfoDetail.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>직원 정보 수정</td>
                    <td>
                      <Link href={"/staff/1/edit"}>StaffInfoEdit.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>직원 초대</td>
                    <td>
                      <Link href={"/staff/invite"}>StaffInvite.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>직원 근로계약서</td>
                    <td>
                      <Link href={"/staff/employment"}>
                        StaffEmployment.tsx
                      </Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td rowSpan={5}>근로 계약 정보</td>
                    <td>근로 계약 정보 리스트</td>
                    <td>
                      <Link href={"/contract"}>ContractInfoList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>근로 계약 정보 상세</td>
                    <td>
                      <Link href={"/contract/1"}>ContractInfoDetail.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>근로 계약 정보 수정</td>
                    <td>
                      <Link href={"/contract/1/edit/info"}>
                        ContractEditInfo.tsx
                      </Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>근로 계약 근무시간 수정</td>
                    <td>
                      <Link href={"/contract/1/edit/time"}>
                        ContractEditTime.tsx
                      </Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>근로 계약 급여정보</td>
                    <td>
                      <Link href={"/contract/1/employ"}>
                        ContractEmploy.tsx
                      </Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td rowSpan={2}>정직원 급여 명세서</td>
                    <td>정직원 급여 명세서 리스트</td>
                    <td>
                      <Link href={"/fulltimer"}>FullTimerList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>정직원 급여 명세서 상세 / 등록 / 수정</td>
                    <td>
                      <Link href={"/fulltimer/1"}>FullTimerDetail.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td rowSpan={4}>파트타이머 급여 명세서</td>
                    <td>파트타이머 급여 명세서 리스트</td>
                    <td>
                      <Link href={"/parttimer"}>PartTimerList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>파트타이머 급여 명세서 상세 / 등록 / 수정</td>
                    <td>
                      <Link href={"/parttimer/1"}>PartTimerDetail.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>파트타이머 급여 명세서 확인 </td>
                    <td>
                      <Link href={"/parttimer/1/stub"}>PartTimerStub.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>파트타이머 근무시간 수정 </td>
                    <td>
                      <Link href={"/parttimer/1/time"}>PartTimerTime.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-14</td>
                  </tr>
                  <tr>
                    <td rowSpan={4}>연장근무 수당 명세서</td>
                    <td>연장근무 수당 명세서 리스트</td>
                    <td>
                      <Link href={"/overtime"}>OverTimeList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>연장근무 수당 명세서 상세 / 등록 / 수정</td>
                    <td>
                      <Link href={"/overtime/1"}>OverTimeDetail.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>연장근무 수당 명세서 확인 </td>
                    <td>
                      <Link href={"/overtime/1/stub"}>OverTimeStub.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>연장근무 근무시간 수정 </td>
                    <td>
                      <Link href={"/overtime/1/time"}>OverTimeTime.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td rowSpan={2}>출퇴근 현황 관리</td>
                    <td>출퇴근 현황 리스트</td>
                    <td>
                      <Link href={"/commute"}>CommuteList.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>출퇴근 현황 상세 </td>
                    <td>
                      <Link href={"/commute/1"}>CommuteDetail.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td>점포별 근무 계획표 </td>
                    <td>점포별 근무 계획표 </td>
                    <td>
                      <Link href={"/plan"}>PlanTable.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-16</td>
                  </tr>
                  <tr>
                    <td rowSpan={2}>사업자 정보 확인 및 수정</td>
                    <td>사업자 정보 확인</td>
                    <td>
                      <Link href={"/master-info"}>MasterInfo.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-26</td>
                  </tr>
                  <tr>
                    <td>사업자 정보 수정</td>
                    <td>
                      <Link href={"/master-info/1"}>MasterInfoEdit.tsx</Link>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="c red">2026-01-26</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
