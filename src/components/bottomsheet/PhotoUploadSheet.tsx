"use client";
import { useRef } from "react";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import "./css/photo-upload-sheet.scss";
import { Sheet } from "react-modal-sheet";

export default function PhotoUploadSheet() {
  const photoUploadSheet = useBottomSheetControler((state) => state.photoUploadSheet);
  const setPhotoUploadSheet = useBottomSheetControler((state) => state.setPhotoUploadSheet);
  const addStoreImage = useStoreFormStore((state) => state.addStoreImage);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setPhotoUploadSheet(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => addStoreImage(file));
    e.target.value = "";
    handleClose();
  };

  const handleCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleAlbum = () => {
    albumInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={albumInputRef}
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Sheet
        isOpen={photoUploadSheet}
        onClose={handleClose}
        detent="content"
        disableScrollLocking={true}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="bottom-sheet">
              <div className="bottom-sheet-header">
                <h3>사진 등록</h3>
              </div>
              <div className="bottom-sheet-body">
                <div className="bottom-sheet-option-list">
                  <button className="bottom-sheet-option-btn" onClick={handleCamera}>
                    카메라로 촬영하기
                  </button>
                  <button className="bottom-sheet-option-btn" onClick={handleAlbum}>
                    앨범에서 선택하기
                  </button>
                </div>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={handleClose} />
      </Sheet>
    </>
  );
}
