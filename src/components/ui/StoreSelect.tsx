'use client'
import { useSyncExternalStore } from 'react'
import Image from 'next/image'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStoreStore } from '@/store/useStoreStore'

// hydration 불일치 방지: 서버/클라이언트 마운트 상태 감지
const emptySubscribe = () => () => {}
const useMounted = () =>
  useSyncExternalStore(emptySubscribe, () => true, () => false)

export default function StoreSelect() {
  const setStoreSelectSheet = useBottomSheetControler(
    (state) => state.setStoreSelectSheet,
  )
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice)
  const selectedStore = useStoreStore((state) => state.selectedStore)
  const mounted = useMounted()

  const displayText = !mounted
    ? '점포를 선택해주세요'
    : selectedStore
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
