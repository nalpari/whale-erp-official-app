'use client';
import { useRouter } from "next/navigation";

export default function MasterInfomation() {
  const router = useRouter();

  return (
    <div className="container">
      <div className="sub-tit-wrap">
        <div className="sub-tit">사업자 정보 확인 및 수정</div>
        <div className="sub-btn-wrap">
          <button className="btn-s black" onClick={() => router.push(`/master-info/1`)}>
            수정
          </button>
        </div>
      </div>
      <div className="sub-content-body">
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="master-info-header">
              <div className="bp-code">
                <span className="bp-code-tit">BP코드</span>
                <span className="bp-code-txt">BIM1001</span>
              </div>
              <div className="master-info-badge">
                <span className="badge blue brd-w">운영</span>
                <span className="badge red brd-w">미운영</span>
                {/* 본점 가맹점 점포 색상 같음 */}
                <span className="badge l-org brd-w">가맹점</span>
              </div>
            </div>
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "105px" }} />
                  <col />
                </colgroup>
                <tbody>
                  <tr>
                    <th>대표자명</th>
                    <td>김철수</td>
                  </tr>
                  <tr>
                    <th>회사명</th>
                    <td>주식회사 따름인</td>
                  </tr>
                  <tr>
                    <th>브랜드명</th>
                    <td>힘이나는 커피생활</td>
                  </tr>
                  <tr>
                    <th>사업자자등록번호</th>
                    <td>105-87-123450</td>
                  </tr>
                  <tr>
                    <th>휴대번호</th>
                    <td>010-222-4444</td>
                  </tr>
                  <tr>
                    <th>이메일</th>
                    <td>abc@abc.co.kr</td>
                  </tr>
                  <tr>
                    <th>영업분류</th>
                    <td>일반 음식점</td>
                  </tr>
                  <tr>
                    <th>로고 등록</th>
                    <td>
                      <button className="down-btn">
                        힘이나는커피생활 BI.pdf
                      </button>
                    </td>
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