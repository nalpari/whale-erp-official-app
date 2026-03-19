"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import Image from "next/image";

export default function MainContents() {
  const setGoToOptionSheet = useBottomSheetControler(
    (state) => state.setGoToOptionSheet
  );

  const handleGoToOptionClick = () => {
    setGoToOptionSheet(true);
  };

  return (
    <div className="container main">
      <div className="main-contents-inner">
        <div className="main-contents">
          <div className="day-flow-wrap flex g16">
            <button className="day-flow-btn prev"></button>
            <div className="day-text">2025.12.12 금요일</div>
            <button className="day-flow-btn next"></button>
          </div>
          <div className="total-sales-wrap">
            <div className="update-wrap flex g12">
              <div className="update-tit">총매출</div>
              <div className="update-val">업데이트 2025.12.11 10:20</div>
              <button className="update-reset-btn"></button>
            </div>
            <div className="sales-value-wrap">
              <div className="sales-value">835,860원</div>
              <div className="sales-revenue">
                어제보다 <span>5,000원</span> 늘었어요
              </div>
            </div>
            <div className="total-sales-data">
              <ul className="sales-data-list">
                <li className="sales-data flex">
                  <div className="sales-data-tit">1. 종로점</div>
                  <div className="sales-data-val">5,000,000원</div>
                </li>
                <li className="sales-data flex">
                  <div className="sales-data-tit">2. 을지로</div>
                  <div className="sales-data-val">5,000,000원</div>
                </li>
                <li className="sales-data flex">
                  <div className="sales-data-tit">3. 무교점</div>
                  <div className="sales-data-val">5,000,000원</div>
                </li>
                <li className="sales-data flex">
                  <div className="sales-data-tit">기타</div>
                  <div className="sales-data-val">5,000,000원</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="main-contents">
          <div className="go-to-wrap">
            <div className="go-to-header-wrap flex">
              <div className="go-to-header-tit">바로가기</div>
              <button
                className="go-to-header-btn"
                onClick={handleGoToOptionClick}
              ></button>
            </div>
            <div className="go-to-content">
              <button className="go-to-item">
                <div className="go-to-logo">
                  <Image
                    src="/assets/images/main/go_to_icon01.svg"
                    alt="go-to-logo"
                    width={34}
                    height={34}
                  />
                </div>
                <div className="go-to-name">점포정보 관리</div>
              </button>
              <button className="go-to-item">
                <div className="go-to-logo">
                  <Image
                    src="/assets/images/main/go_to_icon02.svg"
                    alt="go-to-logo"
                    width={34}
                    height={34}
                  />
                </div>
                <div className="go-to-name">직원정보 관리</div>
              </button>
              <button className="go-to-item">
                <div className="go-to-logo">
                  <Image
                    src="/assets/images/main/go_to_icon03.svg"
                    alt="go-to-logo"
                    width={34}
                    height={34}
                  />
                </div>
                <div className="go-to-name">출퇴근현황</div>
              </button>
              <button className="go-to-item">
                <div className="go-to-logo">
                  <Image
                    src="/assets/images/main/go_to_icon04.svg"
                    alt="go-to-logo"
                    width={34}
                    height={34}
                  />
                </div>
                <div className="go-to-name">재무현황</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
