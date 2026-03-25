'use client'
import Image from 'next/image'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStoreStore } from '@/store/useStoreStore'

export default function StoreSelect() {
  const setStoreSelectSheet = useBottomSheetControler(
    (state) => state.setStoreSelectSheet,
  )
  const selectedStore = useStoreStore((state) => state.selectedStore)

  const handleClick = () => {
    setStoreSelectSheet(true)
  }

  return (
    <button className="store-select" onClick={handleClick}>
      <div className="select-container">
        <div className="select-icon">
          <Image
            src="/assets/images/layout/location_icon.svg"
            alt="store-select"
            fill
          />
        </div>
        <div className="select-text">
          {selectedStore ? selectedStore.storeName : '점포를 선택해주세요'}
        </div>
      </div>
    </button>
  )
}
