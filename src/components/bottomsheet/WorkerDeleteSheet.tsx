'use client'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import Image from 'next/image'
import { Sheet } from 'react-modal-sheet'
import { getWorkerAvatar } from '@/lib/schedule-utils'

function getContractBadge(contractType: string) {
  switch (contractType) {
    case '파트타이머':
      return { wrapClass: 'part', badgeClass: 'badge green', label: '파트' }
    case '임시근무':
      return { wrapClass: 'temporary', badgeClass: 'badge brown', label: '임시' }
    default:
      return { wrapClass: 'full', badgeClass: 'badge blue', label: contractType }
  }
}

export default function WorkerDeleteSheet() {
  const workerDeleteSheet = useBottomSheetControler((state) => state.workerDeleteSheet)
  const setWorkerDeleteSheet = useBottomSheetControler((state) => state.setWorkerDeleteSheet)
  const context = useBottomSheetControler((state) => state.workerSheetContext)
  const onWorkerDelete = useBottomSheetControler((state) => state.onWorkerDelete)

  const handleClose = () => {
    setWorkerDeleteSheet(false)
  }

  const handleDelete = () => {
    try {
      onWorkerDelete?.()
    } catch (err) {
      console.error('[WorkerDeleteSheet] 삭제 콜백 실패:', err)
    } finally {
      handleClose()
    }
  }

  const worker = context.worker
  const badge = worker ? getContractBadge(worker.contractType) : null

  return (
    <Sheet
      isOpen={workerDeleteSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>근무자 삭제</h3>
            </div>
            <div className="bottom-sheet-body">
              <div className="sheet-data-wrap">
                {worker && badge && (
                  <div className={`worker-info-wrap ${badge.wrapClass}`}>
                    <div className="worker-img">
                      <Image
                        src={getWorkerAvatar(worker.iconType)}
                        alt="근무자 이미지"
                        width={46}
                        height={46}
                      />
                    </div>
                    <div className="worker-info">
                      <div className="worker-name">
                        <span>{worker.workerName} 님</span>의
                        <b className={`${badge.badgeClass} ml5`}>{badge.label}</b>
                      </div>
                      <div className="worker-name">근무일정을 삭제 하시겠습니까?</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky" onClick={handleClose}>
                취소
              </button>
              <button className="btn-form blue" onClick={handleDelete}>
                삭제
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
