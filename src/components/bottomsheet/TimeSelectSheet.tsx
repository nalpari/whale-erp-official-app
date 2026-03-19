"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function TimeSelectSheet() {
  const timeSelectSheet = useBottomSheetControler(
    (state) => state.timeSelectSheet
  );
  const setTimeSelectSheet = useBottomSheetControler(
    (state) => state.setTimeSelectSheet
  );

  const handleClose = () => {
    setTimeSelectSheet(false);
  };

  return (
    <Sheet
      isOpen={timeSelectSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content disableDrag={true}>
          <div className="bottom-sheet time">
            <div className="bottom-sheet-header">
              <h3>시간설정</h3>
              <div className="bt-sh-btn-wrap">
                <button className="btn-s outline-g">저장</button>
              </div>
            </div>
            <div className=" bottom-sheet-body">
              <div className="time-select-wrap">
                <div className="start-end-time-wrap">
                  <Swiper
                    slidesPerView={3}
                    direction={"vertical"}
                    className="start-end-swiper"
                    centeredSlides={true}
                    spaceBetween={0}
                  >
                    <SwiperSlide>
                      <div className="time-tit">시작시간</div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="time-tit">종료시간</div>
                    </SwiperSlide>
                  </Swiper>
                </div>
                <div className="time-swiper-wrap">
                  <div className="hour-swiper-wrap">
                    <Swiper
                      slidesPerView={3}
                      direction={"vertical"}
                      className="time-swiper"
                      centeredSlides={true}
                      spaceBetween={0}
                      loop={true}
                    >
                      {Array.from({ length: 24 }).map((_, index) => (
                        <SwiperSlide key={index}>
                          <div className="time-num">
                            {index < 10 ? `0${index}` : index}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="time-colon">:</div>
                  <div className="minute-swiper-wrap">
                    <Swiper
                      slidesPerView={3}
                      direction={"vertical"}
                      className="time-swiper"
                      centeredSlides={true}
                      spaceBetween={0}
                    >
                      <SwiperSlide>
                        <div className="time-num">00</div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="time-num">30</div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
