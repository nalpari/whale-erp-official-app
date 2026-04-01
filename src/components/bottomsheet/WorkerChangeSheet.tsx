'use client'
import { useState } from 'react'
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

export default function WorkerChangeSheet() {
  const workerChangeSheet = useBottomSheetControler((state) => state.workerChangeSheet)
  const setWorkerChangeSheet = useBottomSheetControler((state) => state.setWorkerChangeSheet)
  const context = useBottomSheetControler((state) => state.workerSheetContext)
  const onWorkerReplace = useBottomSheetControler((state) => state.onWorkerReplace)
  const employees = useBottomSheetControler((state) => state.workerSheetEmployees)

  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleClose = () => {
    setWorkerChangeSheet(false)
  }

  const handleOpenStart = () => {
    setSelectedId(null)
  }

  const handleReplace = () => {
    if (selectedId === null) return
    const emp = employees.find((e) => e.id === selectedId)
    if (!emp) return
    onWorkerReplace?.(emp.memberId ?? emp.id, emp.name, emp.contractType)
    handleClose()
  }

  const worker = context.worker
  const badge = worker ? getContractBadge(worker.contractType) : null

  return (
    <Sheet
      isOpen={workerChangeSheet}
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
              <h3>근무자 교체</h3>
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
                        <span className={`${badge.badgeClass} ml5`}>{badge.label}</span>
                      </div>
                      <div className="worker-name">교체 근무자를 선택하세요.</div>
                    </div>
                  </div>
                )}
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    교체 근무자<span className="imp"> *</span>
                  </div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={selectedId ?? ''}
                      onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
                    >
                      <option value="">선택</option>
                      {employees
                        .filter((e) => e.id !== worker?.workerId)
                        .map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}{emp.employeeNumber ? ` (${emp.employeeNumber})` : ''}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button
                className="btn-form blue"
                onClick={handleReplace}
                disabled={selectedId === null}
              >
                교체
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
