'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStoreStore } from '@/store/useStoreStore'
import { useHeadOffices, useStoreOptions } from '@/hooks/queries/use-store-queries'
import { Sheet } from 'react-modal-sheet'

export default function StoreSelectSheet() {
  const storeSelectSheet = useBottomSheetControler(
    (state) => state.storeSelectSheet,
  )
  const setStoreSelectSheet = useBottomSheetControler(
    (state) => state.setStoreSelectSheet,
  )
  const {
    selectedHeadOffice,
    selectedStore,
    setSelectedHeadOffice,
    setSelectedStore,
    reset: resetStore,
  } = useStoreStore()

  // 로컬 상태 (확정 전)
  const [localOfficeId, setLocalOfficeId] = useState<number | undefined>(
    selectedHeadOffice?.id,
  )
  const [localStoreId, setLocalStoreId] = useState<number | undefined>(
    selectedStore?.id,
  )

  // 시트 열릴 때 현재 선택 값 동기화
  const [prevOpen, setPrevOpen] = useState(false)
  if (storeSelectSheet && !prevOpen) {
    setPrevOpen(true)
    setLocalOfficeId(selectedHeadOffice?.id)
    setLocalStoreId(selectedStore?.id)
  }
  if (!storeSelectSheet && prevOpen) {
    setPrevOpen(false)
  }

  // API
  const { data: headOffices = [] } = useHeadOffices()
  const { data: storeOptions = [], isLoading: isStoresLoading } =
    useStoreOptions(localOfficeId)

  const handleClose = () => {
    setStoreSelectSheet(false)
  }

  const handleOfficeSelect = (id: number) => {
    if (localOfficeId === id) return
    setLocalOfficeId(id)
    setLocalStoreId(undefined) // 본사 변경 시 점포 초기화
  }

  const handleSelect = () => {
    const office = headOffices.find((o) => o.id === localOfficeId) ?? null
    const store = storeOptions.find((s) => s.id === localStoreId) ?? null
    setSelectedHeadOffice(office)
    setSelectedStore(store)
    handleClose()
  }

  const handleReset = () => {
    setLocalOfficeId(undefined)
    setLocalStoreId(undefined)
    resetStore()
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
                {/* Step 1: 본사 선택 */}
                <div className="sheet-data-filed">
                  <div className="filed-tit">본사</div>
                  <div className="store-list">
                    {headOffices.map((office) => (
                      <div
                        className={`store-item${localOfficeId === office.id ? ' act' : ''}`}
                        key={office.id}
                      >
                        <button onClick={() => handleOfficeSelect(office.id)}>
                          {office.companyName}
                          {office.brandName ? ` (${office.brandName})` : ''}
                        </button>
                      </div>
                    ))}
                    {headOffices.length === 0 && (
                      <div
                        style={{
                          padding: '12px',
                          color: '#999',
                          fontSize: '14px',
                        }}
                      >
                        본사가 없습니다.
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: 점포 선택 */}
                <div className="sheet-data-filed">
                  <div className="filed-tit">점포</div>
                  {!localOfficeId && (
                    <div className="block">
                      <div
                        style={{
                          padding: '12px',
                          color: '#999',
                          fontSize: '14px',
                        }}
                      >
                        본사를 먼저 선택해주세요.
                      </div>
                    </div>
                  )}
                  {localOfficeId && isStoresLoading && (
                    <div className="block">
                      <div
                        style={{
                          padding: '12px',
                          color: '#999',
                          fontSize: '14px',
                        }}
                      >
                        불러오는 중...
                      </div>
                    </div>
                  )}
                  {localOfficeId && !isStoresLoading && storeOptions.length === 0 && (
                    <div className="block">
                      <div
                        style={{
                          padding: '12px',
                          color: '#999',
                          fontSize: '14px',
                        }}
                      >
                        등록된 점포가 없습니다.
                      </div>
                    </div>
                  )}
                  {localOfficeId && !isStoresLoading && storeOptions.length > 0 && (
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
                disabled={!localOfficeId}
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
