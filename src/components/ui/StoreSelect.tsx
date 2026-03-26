'use client'
import Image from 'next/image'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStoreStore } from '@/store/useStoreStore'

export default function StoreSelect() {
  const setStoreSelectSheet = useBottomSheetControler(
    (state) => state.setStoreSelectSheet,
  )
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice)
  const selectedStore = useStoreStore((state) => state.selectedStore)

  const displayText = selectedStore
    ? selectedStore.storeName
    : selectedHeadOffice
      ? selectedHeadOffice.companyName
      : '점포를 선택해주세요'

  return (
    <button className="store-select" onClick={() => setStoreSelectSheet(true)}>
      <div className="select-container">
        <div className="select-icon">
          <Image
            src="/assets/images/layout/location_icon.svg"
            alt="store-select"
            fill
          />
        </div>
        <div className="select-text">{displayText}</div>
      </div>
    </button>
  )
}
