'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStoreStore } from '@/store/useStoreStore'
import { useStoreOptions } from '@/hooks/queries/use-store-queries'
import { Sheet } from 'react-modal-sheet'

export default function StoreSelectSheet() {
  const storeSelectSheet = useBottomSheetControler(
    (state) => state.storeSelectSheet,
  )
  const setStoreSelectSheet = useBottomSheetControler(
    (state) => state.setStoreSelectSheet,
  )
  const { selectedStore, setSelectedStore } = useStoreStore()
  const { data: storeOptions = [] } = useStoreOptions()

  const [localSelectedId, setLocalSelectedId] = useState<number | null>(
    selectedStore?.id ?? null,
  )

  // 시트 열릴 때 현재 선택 값 동기화
  const [prevOpen, setPrevOpen] = useState(false)
  if (storeSelectSheet && !prevOpen) {
    setPrevOpen(true)
    setLocalSelectedId(selectedStore?.id ?? null)
  }
  if (!storeSelectSheet && prevOpen) {
    setPrevOpen(false)
  }

  const handleClose = () => {
    setStoreSelectSheet(false)
  }

  const handleSelect = () => {
    const store = storeOptions.find((s) => s.id === localSelectedId) ?? null
    setSelectedStore(store)
    handleClose()
  }

  const handleReset = () => {
    setLocalSelectedId(null)
    setSelectedStore(null)
    handleClose()
  }

  return (
    <Sheet
      isOpen={storeSelectSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>점포 선택</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="store-list">
                {storeOptions.map((store) => (
                  <div
                    className={`store-item${localSelectedId === store.id ? ' act' : ''}`}
                    key={store.id}
                  >
                    <button onClick={() => setLocalSelectedId(store.id)}>
                      {store.storeName}
                    </button>
                  </div>
                ))}
                {storeOptions.length === 0 && (
                  <div className="store-item">
                    <button disabled>점포가 없습니다</button>
                  </div>
                )}
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky" onClick={handleReset}>
                초기화
              </button>
              <button className="btn-form blue" onClick={handleSelect}>
                선택
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
