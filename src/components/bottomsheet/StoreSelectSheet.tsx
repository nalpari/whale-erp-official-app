'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStoreStore } from '@/store/useStoreStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreOptions } from '@/hooks/queries/use-store-queries'
import { Sheet } from 'react-modal-sheet'

export default function StoreSelectSheet() {
  const storeSelectSheet = useBottomSheetControler(
    (state) => state.storeSelectSheet,
  )
  const setStoreSelectSheet = useBottomSheetControler(
    (state) => state.setStoreSelectSheet,
  )
  const { selectedStore, setSelectedStore, setSelectedHeadOffice } = useStoreStore()
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId)

  const [localStoreId, setLocalStoreId] = useState<number | undefined>(
    selectedStore?.id,
  )

  // 시트 열릴 때 현재 선택 값 동기화
  const [prevOpen, setPrevOpen] = useState(false)
  if (storeSelectSheet && !prevOpen) {
    setPrevOpen(true)
    setLocalStoreId(selectedStore?.id)
  }
  if (!storeSelectSheet && prevOpen) {
    setPrevOpen(false)
  }

  // 로그인 사용자의 본사 ID로 점포 목록 조회
  const { data: storeOptions = [], isLoading } = useStoreOptions(authHeadOfficeId ?? undefined)

  const handleClose = () => {
    setStoreSelectSheet(false)
  }

  const handleSelect = () => {
    const store = storeOptions.find((s) => s.id === localStoreId) ?? null
    setSelectedStore(store)
    setSelectedHeadOffice(null)
    handleClose()
  }

  const handleReset = () => {
    setLocalStoreId(undefined)
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
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">점포</div>
                  {!authHeadOfficeId && (
                    <div style={{ padding: '12px', color: '#999', fontSize: '14px' }}>
                      다시 로그인해주세요.
                    </div>
                  )}
                  {authHeadOfficeId && isLoading && (
                    <div style={{ padding: '12px', color: '#999', fontSize: '14px' }}>
                      불러오는 중...
                    </div>
                  )}
                  {authHeadOfficeId && !isLoading && storeOptions.length === 0 && (
                    <div style={{ padding: '12px', color: '#999', fontSize: '14px' }}>
                      등록된 점포가 없습니다.
                    </div>
                  )}
                  {authHeadOfficeId && !isLoading && storeOptions.length > 0 && (
                    <div className="store-list">
                      {storeOptions.map((store) => (
                        <div
                          className={`store-item${localStoreId === store.id ? ' act' : ''}`}
                          key={store.id}
                        >
                          <button onClick={() => setLocalStoreId(store.id)}>
                            {store.storeName}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky" onClick={handleReset}>
                초기화
              </button>
              <button
                className="btn-form blue"
                onClick={handleSelect}
                disabled={!authHeadOfficeId}
              >
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
