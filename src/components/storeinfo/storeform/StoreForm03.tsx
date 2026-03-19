"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";

export default function StoreForm03() {
  const setPhotoSelectSheet = useBottomSheetControler(
    (state) => state.setPhotoSelectSheet
  );

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-item-bx">
          <div className="store-img-list-tit">점포사진</div>
          <div className="block mb20">
            <button
              className="btn-form block blue"
              onClick={() => setPhotoSelectSheet(true)}
            >
              <i className="camera"></i>사진 등록하기
            </button>
          </div>
          <div className="store-img-list">
            <div className="store-img-bx">
              <div className="store-img-tit">
                <span className="img-tit">점포 사진 1점포 사진 사진</span>
                <span>.jpg</span>
              </div>
              <div className="store-img-btn-wrap">
                <button className="img-delete"></button>
              </div>
            </div>
            <div className="store-img-bx">
              <div className="store-img-tit">
                <span className="img-tit">점포 사진 1점포 사진 사진</span>
                <span>.jpg</span>
              </div>
              <div className="store-img-btn-wrap">
                <button className="img-delete"></button>
              </div>
            </div>
            <div className="store-img-bx">
              <div className="store-img-tit">
                <span className="img-tit">점포 사진 1점포 사진 사진</span>
                <span>.jpg</span>
              </div>
              <div className="store-img-btn-wrap">
                <button className="img-delete"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
