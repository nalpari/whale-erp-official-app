'use client'
import { useState } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStoreStore } from '@/store/useStoreStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useHeadOffices, useStoreOptions } from '@/hooks/queries/use-store-queries'
import { useQueryClient } from '@tanstack/react-query'
import { todoKeys } from '@/hooks/queries/use-todo-queries'
import { scheduleKeys } from '@/hooks/queries/use-schedule-queries'
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
    setSelection,
  } = useStoreStore()
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId)
  const authFranchiseId = useAuthStore((state) => state.franchiseId)
  const queryClient = useQueryClient()
  const hasAuthOffice = !!authHeadOfficeId

  // 본사 ID: auth > storeStore 순으로 fallback
  const initialOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? undefined

  const [localOfficeId, setLocalOfficeId] = useState<number | undefined>(initialOfficeId)
  const [localStoreId, setLocalStoreId] = useState<number | undefined>(selectedStore?.id)

  // 시트 열릴 때 글로벌 스토어와 동기화
  const handleOpenStart = () => {
    setLocalOfficeId(authHeadOfficeId ?? selectedHeadOffice?.id ?? undefined)
    setLocalStoreId(selectedStore?.id)
  }

  // API
  const { data: headOffices = [], isError: isHeadOfficesError } = useHeadOffices()
  const { data: storeOptions = [], isLoading: isStoresLoading, isError: isStoresError } =
    useStoreOptions(localOfficeId, authFranchiseId ?? undefined)

  // 본사 이름 찾기
  const selectedOfficeName = headOffices.find((o) => o.id === localOfficeId)

  const handleClose = () => {
    setStoreSelectSheet(false)
  }

  const handleOfficeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value ? Number(e.target.value) : undefined
    setLocalOfficeId(id)
    setLocalStoreId(undefined)
  }

  const handleSelect = () => {
    try {
      const office = headOffices.find((o) => o.id === localOfficeId) ?? null
      const store = storeOptions.find((s) => s.id === localStoreId) ?? null
      setSelection(office, store)
      // 본사/점포 변경 시 관련 캐시 모두 무효화
      queryClient.removeQueries({ queryKey: [...todoKeys.all, 'employees'] })
      queryClient.removeQueries({ queryKey: scheduleKeys.all })
    } catch (err) {
      console.error('[StoreSelectSheet] 점포 선택 실패:', err)
    } finally {
      handleClose()
    }
  }

  const handleReset = () => {
    if (!hasAuthOffice) {
      setLocalOfficeId(undefined)
    }
    setLocalStoreId(undefined)
  }

  return (
    <Sheet
      isOpen={storeSelectSheet}
      onClose={handleClose}
      onOpenStart={handleOpenStart}
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
                {/* 본사 선택 */}
                <div className="sheet-data-filed">
                  <div className="filed-tit">본사</div>
                  {isHeadOfficesError && (
                    <div style={{ padding: '8px 0', color: '#e74c3c', fontSize: '13px' }}>
                      본사 목록을 불러오지 못했습니다. 네트워크를 확인해주세요.
                    </div>
                  )}
                  <div className="block">
                    {hasAuthOffice ? (
                      <select
                        className="select-form"
                        value={localOfficeId ?? ''}
                        disabled
                      >
                        <option value={authHeadOfficeId}>
                          {selectedOfficeName
                            ? `${selectedOfficeName.companyName}${selectedOfficeName.brandName ? ` (${selectedOfficeName.brandName})` : ''}`
                            : `본사 (ID: ${authHeadOfficeId})`}
                        </option>
                      </select>
                    ) : (
                      <select
                        className="select-form"
                        value={localOfficeId ?? ''}
                        onChange={handleOfficeChange}
                      >
                        <option value="">본사를 선택해주세요</option>
                        {headOffices.map((office) => (
                          <option key={office.id} value={office.id}>
                            {office.companyName}
                            {office.brandName ? ` (${office.brandName})` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* 점포 선택 */}
                <div className="sheet-data-filed">
                  <div className="filed-tit">점포</div>
                  {!localOfficeId && (
                    <div style={{ padding: '12px', color: '#999', fontSize: '14px' }}>
                      본사를 먼저 선택해주세요.
                    </div>
                  )}
                  {localOfficeId && isStoresLoading && (
                    <div style={{ padding: '12px', color: '#999', fontSize: '14px' }}>
                      불러오는 중...
                    </div>
                  )}
                  {localOfficeId && isStoresError && (
                    <div style={{ padding: '12px', color: '#e74c3c', fontSize: '13px' }}>
                      점포 목록을 불러오지 못했습니다. 네트워크를 확인해주세요.
                    </div>
                  )}
                  {localOfficeId && !isStoresLoading && !isStoresError && storeOptions.length === 0 && (
                    <div style={{ padding: '12px', color: '#999', fontSize: '14px' }}>
                      등록된 점포가 없습니다.
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
