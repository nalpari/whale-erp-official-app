'use client'
import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { usePlanSearchStore } from '@/store/usePlanSearchStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreStore } from '@/store/useStoreStore'
import { usePopupControler } from '@/store/usePopupControler'
import { useScheduleList, useUpsertSchedule } from '@/hooks/queries/use-schedule-queries'
import { useMounted } from '@/hooks/use-mounted'
import type { ScheduleSearchParams, WorkerEditItem, ScheduleRequest, WorkerRequest } from '@/types/schedule'

// 계약유형 → CSS 매핑
function getContractStyle(contractType: string) {
  switch (contractType) {
    case '파트타이머':
      return { boxClass: 'part', badgeClass: 'badge green', label: '파트' }
    case '임시근무':
      return { boxClass: 'temporary', badgeClass: 'badge brown', label: '임시' }
    default:
      return { boxClass: 'full', badgeClass: 'badge blue', label: contractType }
  }
}

// 근무시간 계산
function calcWorkHours(worker: WorkerEditItem): string {
  if (!worker.hasWork || !worker.workStartTime || !worker.workEndTime) return '0h'
  const [sh, sm] = worker.workStartTime.split(':').map(Number)
  const [eh, em] = worker.workEndTime.split(':').map(Number)
  let totalMin = (eh * 60 + em) - (sh * 60 + sm)
  if (totalMin < 0) totalMin += 24 * 60
  if (worker.hasBreak && worker.breakStartTime && worker.breakEndTime) {
    const [bsh, bsm] = worker.breakStartTime.split(':').map(Number)
    const [beh, bem] = worker.breakEndTime.split(':').map(Number)
    let breakMin = (beh * 60 + bem) - (bsh * 60 + bsm)
    if (breakMin < 0) breakMin += 24 * 60
    totalMin -= breakMin
  }
  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`
}

// 정렬순서
const CONTRACT_ORDER: Record<string, number> = {
  '정직원': 1, '계약직': 2, '수습': 3, '파트타이머': 4, '임시근무': 5,
}

function sortWorkers(workers: WorkerEditItem[]): WorkerEditItem[] {
  return [...workers]
    .filter((w) => !w.isDeleted)
    .sort((a, b) => {
      const timeA = a.workStartTime ?? '99:99'
      const timeB = b.workStartTime ?? '99:99'
      if (timeA !== timeB) return timeA.localeCompare(timeB)
      return (CONTRACT_ORDER[a.contractType] ?? 99) - (CONTRACT_ORDER[b.contractType] ?? 99)
    })
}

export default function PlanTableEdit({ storeId }: { storeId: number }) {
  const router = useRouter()
  const searchStore = usePlanSearchStore()
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId)
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice)
  const mounted = useMounted()
  const openWorkerAddSheet = useBottomSheetControler((state) => state.openWorkerAddSheet)
  const openTempWorkerAddSheet = useBottomSheetControler((state) => state.openTempWorkerAddSheet)
  const openWorkerChangeSheet = useBottomSheetControler((state) => state.openWorkerChangeSheet)
  const openWorkerDeleteSheet = useBottomSheetControler((state) => state.openWorkerDeleteSheet)
  const openWorkerSearchSheet = useBottomSheetControler((state) => state.openWorkerSearchSheet)
  const openTimePicker = useBottomSheetControler((state) => state.openTimePicker)
  const openAlert = usePopupControler((state) => state.openAlert)

  const upsertMutation = useUpsertSchedule()

  // 본사 ID: 점포 선택 바텀시트 > authStore 순 fallback
  const effectiveHeadOfficeId = selectedHeadOffice?.id ?? authHeadOfficeId ?? null
  const headOfficeId = mounted ? effectiveHeadOfficeId : null

  // 검색 조건 (목록 페이지에서 상속)
  const params: ScheduleSearchParams = useMemo(() => ({
    officeId: headOfficeId ?? 0,
    storeId,
    from: searchStore.from,
    to: searchStore.to,
  }), [headOfficeId, storeId, searchStore.from, searchStore.to])

  const { data: scheduleList = [] } = useScheduleList(params, !!headOfficeId)

  // EditState: Map<date, WorkerEditItem[]>
  const [editState, setEditState] = useState<Map<string, WorkerEditItem[]>>(new Map())
  const [initialized, setInitialized] = useState(false)

  // API 데이터 → EditState 초기화 (한 번만)
  if (scheduleList.length > 0 && !initialized) {
    const newState = new Map<string, WorkerEditItem[]>()
    for (const schedule of scheduleList) {
      const workers: WorkerEditItem[] = schedule.workerList.map((w) => ({
        shiftId: w.shiftId,
        workerId: w.workerId,
        workerName: w.workerName,
        contractType: w.contractType,
        hasWork: w.hasWork,
        workStartTime: w.workStartTime,
        workEndTime: w.workEndTime,
        hasBreak: w.hasBreak,
        breakStartTime: w.breakStartTime,
        breakEndTime: w.breakEndTime,
        isDeleted: w.isDeleted,
        isNew: false,
      }))
      newState.set(schedule.date, workers)
    }
    setEditState(newState)
    setInitialized(true)
  }

  // 수립 페이지 필터
  const [filterEmployeeName, setFilterEmployeeName] = useState('')
  const [filterTempName, setFilterTempName] = useState('')

  // 날짜별 근무자 업데이트 헬퍼
  const updateWorkers = useCallback((date: string, updater: (workers: WorkerEditItem[]) => WorkerEditItem[]) => {
    setEditState((prev) => {
      const next = new Map(prev)
      const current = next.get(date) ?? []
      next.set(date, updater(current))
      return next
    })
  }, [setEditState])

  // 근무자 필드 업데이트
  const updateWorkerField = useCallback(
    (date: string, index: number, field: keyof WorkerEditItem, value: WorkerEditItem[keyof WorkerEditItem]) => {
      updateWorkers(date, (workers) =>
        workers.map((w, i) => (i === index ? { ...w, [field]: value } : w)),
      )
    },
    [updateWorkers],
  )

  // 근무자 추가
  const handleAddWorker = useCallback(
    (worker: WorkerEditItem) => {
      // 모든 날짜에 추가
      setEditState((prev) => {
        const next = new Map(prev)
        for (const [date, workers] of next) {
          next.set(date, [...workers, { ...worker }])
        }
        return next
      })
    },
    [setEditState],
  )

  // 근무자 교체
  const handleReplaceWorker = useCallback(
    (date: string, index: number, newWorkerId: number, newWorkerName: string, newContractType: string) => {
      updateWorkers(date, (workers) =>
        workers.map((w, i) =>
          i === index ? { ...w, workerId: newWorkerId, workerName: newWorkerName, contractType: newContractType } : w,
        ),
      )
    },
    [updateWorkers],
  )

  // 근무자 삭제 (isDeleted 마킹)
  const handleDeleteWorker = useCallback(
    (date: string, index: number) => {
      updateWorkers(date, (workers) =>
        workers.map((w, i) => (i === index ? { ...w, isDeleted: true } : w)),
      )
    },
    [updateWorkers],
  )

  // EditState → ScheduleRequest[] 변환
  const buildRequests = (): ScheduleRequest[] => {
    const requests: ScheduleRequest[] = []
    for (const [date, workers] of editState) {
      const workerRequests: WorkerRequest[] = workers.map((w) => ({
        shiftId: w.shiftId,
        workerId: w.workerId,
        tempWorkerName: w.workerId ? null : w.workerName,
        hasWork: w.hasWork,
        workStartTime: w.workStartTime,
        workEndTime: w.workEndTime,
        hasBreak: w.hasBreak,
        breakStartTime: w.breakStartTime,
        breakEndTime: w.breakEndTime,
        isDeleted: w.isDeleted,
      }))
      requests.push({ date, workerRequests })
    }
    return requests
  }

  // 저장
  const handleSave = () => {
    const requests = buildRequests()
    upsertMutation.mutate(
      { storeId, data: requests },
      {
        onSuccess: () => {
          openAlert({
            message: '근무 계획이 저장되었습니다.',
          })
          router.push('/plan')
        },
        onError: () => {
          openAlert({
            message: '근무 계획 저장에 실패했습니다. 다시 시도해주세요.',
          })
        },
      },
    )
  }

  // 취소 (초기화 확인)
  const handleCancel = () => {
    if (confirm('입력한 내용을 저장하지 않았습니다. 점포별 근무 계획표로 이동하시겠습니까?')) {
      router.push('/plan')
    }
  }

  // 날짜 정렬된 EditState entries
  const sortedEntries = useMemo(
    () => [...editState.entries()].sort(([a], [b]) => a.localeCompare(b)),
    [editState],
  )

  // 검색 필터
  const filterWorkers = useCallback(
    (workers: WorkerEditItem[]) => {
      return sortWorkers(workers).filter((w) => {
        if (filterEmployeeName && !w.workerName.includes(filterEmployeeName)) return false
        if (filterTempName && w.contractType === '임시근무' && !w.workerName.includes(filterTempName)) return false
        return true
      })
    },
    [filterEmployeeName, filterTempName],
  )

  const totalCount = sortedEntries.reduce(
    (acc, [, workers]) => acc + filterWorkers(workers).length,
    0,
  )

  // 기간 표시 텍스트
  const dateRangeText = useMemo(() => {
    if (sortedEntries.length === 0) return ''
    const first = sortedEntries[0][0]
    const last = sortedEntries[sortedEntries.length - 1][0]
    const formatDate = (d: string) => {
      const date = new Date(d)
      const days = ['일', '월', '화', '수', '목', '금', '토']
      return `${d.replace(/-/g, '.')}(${days[date.getDay()]})`
    }
    return `${formatDate(first)}~${formatDate(last)}`
  }, [sortedEntries])

  return (
    <>
      <div className="container sub">
        <div className="date-read">
          <span className="date-read-icon"></span>
          <span><b>{dateRangeText}</b></span>
        </div>
        <div className="pay-head-btn-wrap">
          <button className="pay-head-btn" onClick={() => openWorkerAddSheet(handleAddWorker)}>
            <i className="invite"></i>직원추가
          </button>
          <button className="pay-head-btn" onClick={() => openTempWorkerAddSheet(handleAddWorker)}>
            <i className="add_team"></i>임시 근무자 추가
          </button>
        </div>
        <div className="sub-content-body">
          <div className="search-bx staff">
            <div className="search-count">
              검색결과 <span>{totalCount}건</span>
            </div>
            <button
              className="search-btn"
              onClick={() => openWorkerSearchSheet(({ employeeName, tempWorkerName }) => {
                setFilterEmployeeName(employeeName)
                setFilterTempName(tempWorkerName)
              })}
            >
              <i className="icon-search"></i>
              <span>검색</span>
            </button>
          </div>
          <div className="sub-cont-wrap">
            <div className="plan-table-wrap">
              {sortedEntries.map(([date, workers]) => {
                const displayDate = new Date(date)
                const days = ['일', '월', '화', '수', '목', '금', '토']
                const dayLabel = days[displayDate.getDay()]
                const filtered = filterWorkers(workers)

                if (filtered.length === 0) return null

                return (
                  <div key={date} className="plan-table-item">
                    <div className="plan-table-header">
                      <div className="plan-table-day">
                        {date.replace(/-/g, '.')} {dayLabel}
                      </div>
                    </div>
                    <div className="plan-table-content">
                      {filtered.map((worker) => {
                        // workers 배열에서 원래 인덱스 찾기
                        const originalIndex = workers.indexOf(worker)
                        const style = getContractStyle(worker.contractType)
                        const hours = calcWorkHours(worker)

                        return (
                          <div key={`${worker.shiftId ?? worker.workerId ?? worker.workerName}-${originalIndex}`} className={`sub-item-bx ${style.boxClass}`}>
                            <div className="plan-staff-head">
                              <div className="plan-staff-info">
                                <span className={style.badgeClass}>{style.label}</span>
                                <span className="name">{worker.workerName}</span>
                                <span className="time">{hours}</span>
                              </div>
                              <div className="auto-right">
                                <div className="flex g8">
                                  <button
                                    className="change_staff"
                                    onClick={() =>
                                      openWorkerChangeSheet(worker, date, (newWorkerId, newWorkerName, newContractType) =>
                                        handleReplaceWorker(date, originalIndex, newWorkerId, newWorkerName, newContractType),
                                      )
                                    }
                                  />
                                  <button
                                    className="delete_staff"
                                    onClick={() =>
                                      openWorkerDeleteSheet(worker, date, () => handleDeleteWorker(date, originalIndex))
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="plan-time-form">
                              <div className="plan-time-form-item">
                                <div className="plan-time-form-item-tit">근무시간</div>
                                <div className="flex g8">
                                  <div className="block">
                                    <button
                                      className="select-form al-l"
                                      onClick={() =>
                                        openTimePicker(
                                          '근무 시작시간',
                                          worker.workStartTime ?? '09:00',
                                          (time) => updateWorkerField(date, originalIndex, 'workStartTime', time),
                                        )
                                      }
                                    >
                                      {worker.workStartTime ?? '시작시간'}
                                    </button>
                                  </div>
                                  <div className="block">
                                    <button
                                      className="select-form al-l"
                                      onClick={() =>
                                        openTimePicker(
                                          '근무 종료시간',
                                          worker.workEndTime ?? '18:00',
                                          (time) => updateWorkerField(date, originalIndex, 'workEndTime', time),
                                        )
                                      }
                                    >
                                      {worker.workEndTime ?? '종료시간'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="plan-time-form-item">
                                <div className="plan-time-form-item-tit">휴게시간</div>
                                <div className="flex g8">
                                  <div className="block">
                                    <button
                                      className="select-form al-l"
                                      onClick={() =>
                                        openTimePicker(
                                          '휴게 시작시간',
                                          worker.breakStartTime ?? '12:00',
                                          (time) => {
                                            updateWorkerField(date, originalIndex, 'breakStartTime', time)
                                            updateWorkerField(date, originalIndex, 'hasBreak', true)
                                          },
                                        )
                                      }
                                    >
                                      {worker.breakStartTime ?? '시작시간'}
                                    </button>
                                  </div>
                                  <div className="block">
                                    <button
                                      className="select-form al-l"
                                      onClick={() =>
                                        openTimePicker(
                                          '휴게 종료시간',
                                          worker.breakEndTime ?? '13:00',
                                          (time) => {
                                            updateWorkerField(date, originalIndex, 'breakEndTime', time)
                                            updateWorkerField(date, originalIndex, 'hasBreak', true)
                                          },
                                        )
                                      }
                                    >
                                      {worker.breakEndTime ?? '종료시간'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <div className="flex g8">
          <button className="btn-form block sky brd" onClick={handleCancel}>
            취소
          </button>
          <button
            className="btn-form block blue"
            onClick={handleSave}
            disabled={upsertMutation.isPending}
          >
            {upsertMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </>
  )
}
