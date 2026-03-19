"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";

export default function PhotoSelectSheet() {
  const photoSelectSheet = useBottomSheetControler(
    (state) => state.photoSelectSheet
  );
  const setPhotoSelectSheet = useBottomSheetControler(
    (state) => state.setPhotoSelectSheet
  );

  const handleClose = () => {
    setPhotoSelectSheet(false);
  };

  return (
    <Sheet
      isOpen={photoSelectSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>사진등록</h3>
            </div>
            <div className=" bottom-sheet-body">
              <div className="camera-select-wrap">
                <div className="block mb10">
                  <button className="default-tit block al-l">
                    카메라로 촬영하기
                  </button>
                </div>
                <div className="block mb10">
                  <button className="default-tit block al-l">
                    앨범에서 선택하기
                  </button>
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
