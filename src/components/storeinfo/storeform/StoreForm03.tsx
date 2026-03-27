"use client";
import { useRef } from "react";
import { useStoreFormStore } from "@/store/useStoreFormStore";

function getFileNameAndExt(fileName: string): { name: string; ext: string } {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) return { name: fileName, ext: "" };
  return { name: fileName.slice(0, lastDot), ext: fileName.slice(lastDot) };
}

export default function StoreForm03() {
  const {
    storeImages, existingImages,
    addStoreImage, removeStoreImage, markDeleteExistingImage,
  } = useStoreFormStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => addStoreImage(file));
    e.target.value = "";
  };

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-item-bx">
          <div className="store-img-list-tit">점포사진</div>
          <div className="block mb20">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              className="btn-form block blue"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="camera"></i>사진 등록하기
            </button>
          </div>
          <div className="store-img-list">
            {/* 기존 이미지 */}
            {existingImages.map((img) => {
              const { name, ext } = getFileNameAndExt(img.originalFileName);
              return (
                <div className="store-img-bx" key={`existing-${img.id}`}>
                  <div className="store-img-tit">
                    <span className="img-tit">{name}</span>
                    <span>{ext}</span>
                  </div>
                  <div className="store-img-btn-wrap">
                    <button
                      className="img-delete"
                      onClick={() => markDeleteExistingImage(img.id)}
                    ></button>
                  </div>
                </div>
              );
            })}
            {/* 새로 추가된 이미지 */}
            {storeImages.map((file, index) => {
              const { name, ext } = getFileNameAndExt(file.name);
              return (
                <div className="store-img-bx" key={`new-${index}`}>
                  <div className="store-img-tit">
                    <span className="img-tit">{name}</span>
                    <span>{ext}</span>
                  </div>
                  <div className="store-img-btn-wrap">
                    <button
                      className="img-delete"
                      onClick={() => removeStoreImage(index)}
                    ></button>
                  </div>
                </div>
              );
            })}
            {existingImages.length === 0 && storeImages.length === 0 && (
              <div className="store-img-empty">
                <div className="s-txt">등록된 이미지가 없습니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
