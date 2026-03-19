"use client";
import Image from "next/image";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";

export default function StoreSelect() {
  const setStoreSelectSheet = useBottomSheetControler((state) => state.setStoreSelectSheet);

  const handleClick = () => {
    setStoreSelectSheet(true);
  };

  return (
    <button
      className="store-select"
      onClick={handleClick}
    >
      <div className="select-container">
        <div className="select-icon">
          <Image
            src="/assets/images/layout/location_icon.svg"
            alt="store-select"
            fill
          />
        </div>
        <div className="select-text">
          운영 - (직영점) 힘이나는커피생활 을지로3가점
        </div>
      </div>
    </button>
  );
}
