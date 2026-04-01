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
import { getContractStyle, calcWorkHours, sortWorkers, DAY_LABELS } from '@/lib/schedule-utils'
import type { ScheduleSearchParams, WorkerEditItem, ScheduleRequest, WorkerRequest } from '@/types/schedule'

export default function PlanTableEdit({ storeId }: { storeId: number }) {
  const router = useRouter()
  const searchFrom = usePlanSearchStore((s) => s.from)
  const searchTo = usePlanSearchStore((s) => s.to)
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
    from: searchFrom,
    to: searchTo,
  }), [headOfficeId, storeId, searchFrom, searchTo])

  const { data: scheduleList = [], isError, refetch } = useScheduleList(params, !!headOfficeId)

  // API 데이터 → 초기 EditState 파생 (scheduleList 변경 시 재계산)
  const initialEditState = useMemo(() => {
    const state = new Map<string, WorkerEditItem[]>()
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
      state.set(schedule.date, workers)
    }
    return state
  }, [scheduleList])

  // EditState: 사용자 편집 상태 (초기값은 API 데이터 기반)
  const [editState, setEditState] = useState<Map<string, WorkerEditItem[]>>(new Map())
  const [initialized, setInitialized] = useState(false)

  // initialEditState가 비어있지 않고 아직 초기화되지 않았으면 editState 동기화
  const effectiveEditState = (!initialized && initialEditState.size > 0) ? initialEditState : editState

  // 수립 페이지 필터
  const [filterEmployeeName, setFilterEmployeeName] = useState('')
  const [filterTempName, setFilterTempName] = useState('')

  // 날짜별 근무자 업데이트 헬퍼
  const updateWorkers = useCallback((date: string, updater: (workers: WorkerEditItem[]) => WorkerEditItem[]) => {
    if (!initialized) setInitialized(true)
    setEditState((prev) => {
      const base = prev.size > 0 ? prev : initialEditState
      const next = new Map(base)
      const current = next.get(date) ?? []
      next.set(date, updater(current))
      return next
    })
  }, [initialized, initialEditState])

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
      if (!initialized) setInitialized(true)
      setEditState((prev) => {
        const base = prev.size > 0 ? prev : initialEditState
        const next = new Map(base)
        for (const [date, workers] of next) {
          next.set(date, [...workers, { ...worker }])
        }
        return next
      })
    },
    [initialized, initialEditState],
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
    for (const [date, workers] of effectiveEditState) {
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

  // 저장 (mutateAsync + try/catch 전용)
  const handleSave = async () => {
    if (upsertMutation.isPending) return
    const requests = buildRequests()
    try {
      await upsertMutation.mutateAsync({ storeId, data: requests })
      openAlert({
        message: '근무 계획이 저장되었습니다.',
        onConfirm: () => router.push('/plan'),
      })
    } catch (err) {
      console.error('[PlanTableEdit] 근무 계획 저장 실패:', err)
      openAlert({
        message: '근무 계획 저장에 실패했습니다. 다시 시도해주세요.',
      })
    }
  }

  // 취소 (openAlert 결과 확인형)
  const handleCancel = () => {
    openAlert({
      message: '입력한 내용을 저장하지 않았습니다. 점포별 근무 계획표로 이동하시겠습니까?',
      confirmText: '이동',
      cancelText: '취소',
      onConfirm: () => router.push('/plan'),
    })
  }

  // 날짜 정렬된 EditState entries
  const sortedEntries = useMemo(
    () => [...effectiveEditState.entries()].sort(([a], [b]) => a.localeCompare(b)),
    [effectiveEditState],
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
    const fmtDate = (d: string) => {
      const date = new Date(d)
      return `${d.replace(/-/g, '.')}(${DAY_LABELS[date.getDay()]})`
    }
    return `${fmtDate(first)}~${fmtDate(last)}`
  }, [sortedEntries])

  if (isError) {
    return (
      <div className="container sub">
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <div style={{ color: "#e74c3c", marginBottom: "16px" }}>근무 계획 정보를 불러올 수 없습니다.</div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button className="btn-form outline min" onClick={() => refetch()}>다시 시도</button>
            <button className="btn-form outline min" onClick={() => router.back()}>돌아가기</button>
          </div>
        </div>
      </div>
    )
  }

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
                const days = DAY_LABELS
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
