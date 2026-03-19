import { usePopupControler } from "@/store/usePopupControler";
import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import Image from "next/image";

export default function PhotoPopup() {
  const [active, setActive] = useState(false);
  const popupControler = usePopupControler();

  useEffect(() => {
    // 팝업 열기 시간 필요
    setTimeout(() => {
      setActive(popupControler.photoPopup);
    }, 100);
  }, [popupControler.photoPopup]);

  // 팝업 닫기 시간 필요
  const handleClose = () => {
    setActive(false);
    setTimeout(() => {
      popupControler.setPhotoPopup(false);
    }, 250);
  };
  return (
    <div className={`modal-popup photo ${active ? "act" : ""}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="photo-frame">
              <Swiper
                slidesPerView={1}
                loop={true}
                pagination={{
                  type: "fraction",
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <div className="photo-img">
                    <Image
                      src="/assets/images/popup/dummy02.jpg"
                      alt="review-img"
                      fill
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="photo-img">
                    <Image
                      src="/assets/images/popup/dummy03.jpg"
                      alt="review-img"
                      fill
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
