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
  const photoPopup = usePopupControler((state) => state.photoPopup);
  const photoPopupImages = usePopupControler((state) => state.photoPopupImages);
  const photoPopupIndex = usePopupControler((state) => state.photoPopupIndex);
  const setPhotoPopup = usePopupControler((state) => state.setPhotoPopup);

  useEffect(() => {
    setTimeout(() => {
      setActive(photoPopup);
    }, 100);
  }, [photoPopup]);

  const handleClose = () => {
    setActive(false);
    setTimeout(() => {
      setPhotoPopup(false);
    }, 250);
  };

  const images = photoPopupImages.filter(Boolean);

  return (
    <div className={`modal-popup photo ${active ? "act" : ""}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="photo-frame">
              {images.length > 0 ? (
                <Swiper
                  slidesPerView={1}
                  loop={images.length > 1}
                  initialSlide={photoPopupIndex}
                  pagination={{
                    type: "fraction",
                  }}
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  {images.map((url, i) => (
                    <SwiperSlide key={i}>
                      <div className="photo-img">
                        <Image
                          src={url}
                          alt={`store-image-${i + 1}`}
                          fill
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
                  이미지를 불러올 수 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
