'use client'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { usePlanSearchStore } from '@/store/usePlanSearchStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreStore } from '@/store/useStoreStore'
import { usePopupControler } from '@/store/usePopupControler'
import { useHeaderStore } from '@/store/useHeaderStore'
import { useScheduleList, useUpsertSchedule } from '@/hooks/queries/use-schedule-queries'
import { useEmployeeOptions } from '@/hooks/queries/use-todo-queries'
import { useMounted } from '@/hooks/use-mounted'
import { getContractStyle, calcWorkHours, sortWorkers, toContractType, DAY_LABELS, getMonday, getSunday, parseDateLocal, DEFAULT_WORK_START, DEFAULT_WORK_END, DEFAULT_BREAK_START, DEFAULT_BREAK_END } from '@/lib/schedule-utils'
import '@/components/storeinfo/css/store-search-btn.scss'
import type { ScheduleSearchParams, WorkerEditItem, ScheduleRequest, WorkerRequest, ScheduleContractType } from '@/types/schedule'

const PLAN_LIST_PATH = '/plan'

function createDateRange(from: string, to: string) {
  if (!from || !to || from > to) return []

  const dates: string[] = []
  const current = new Date(`${from}T00:00:00`)
  const end = new Date(`${to}T00:00:00`)

  while (current <= end) {
    const year = current.getFullYear()
    const month = String(current.getMonth() + 1).padStart(2, '0')
    const day = String(current.getDate()).padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export default function PlanTableEdit() {
  const router = useRouter()
  const queryParams = useSearchParams()
  const urlStoreId = Number(queryParams.get('storeId')) || 0
  const editDate = queryParams.get('date')
  const storeFrom = usePlanSearchStore((s) => s.from)
  const storeTo = usePlanSearchStore((s) => s.to)
  const searchFrom = storeFrom || getMonday()
  const searchTo = storeTo || getSunday()
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId)
  const selectedHeadOfficeId = useStoreStore((state) => state.selectedHeadOffice?.id ?? null)
  const selectedStoreId = useStoreStore((state) => state.selectedStore?.id ?? null)
  const mounted = useMounted()
  const openWorkerAddSheet = useBottomSheetControler((state) => state.openWorkerAddSheet)
  const openTempWorkerAddSheet = useBottomSheetControler((state) => state.openTempWorkerAddSheet)
  const openWorkerChangeSheet = useBottomSheetControler((state) => state.openWorkerChangeSheet)
  const openWorkerDeleteSheet = useBottomSheetControler((state) => state.openWorkerDeleteSheet)
  const openWorkerSearchSheet = useBottomSheetControler((state) => state.openWorkerSearchSheet)
  const openTimePicker = useBottomSheetControler((state) => state.openTimePicker)
  const openAlert = usePopupControler((state) => state.openAlert)
  const setTitle = useHeaderStore((state) => state.setTitle)
  const setOnBack = useHeaderStore((state) => state.setOnBack)
  const setWorkerSheetEmployees = useBottomSheetControler((state) => state.setWorkerSheetEmployees)

  const { mutateAsync: upsertSchedule, isPending: isUpserting } = useUpsertSchedule()

  // 본사 ID: 점포 선택 바텀시트 > authStore 순 fallback
  const effectiveHeadOfficeId = selectedHeadOfficeId ?? authHeadOfficeId ?? null
  const headOfficeId = mounted ? effectiveHeadOfficeId : null
  const storeId = mounted ? (selectedStoreId ?? urlStoreId) : urlStoreId
  const authFranchiseId = useAuthStore((state) => state.franchiseId)

  // 헤더 제목 설정
  useEffect(() => {
    setTitle(editDate ? '근무계획표 수정' : '근무계획표 등록')
    setOnBack(() => {
      openAlert({
        message: '입력한 내용을 저장하지 않았습니다. 점포별 근무 계획표로 이동하시겠습니까?',
        confirmText: '이동',
        cancelText: '취소',
        onConfirm: () => router.push(PLAN_LIST_PATH),
      })
    })
    return () => {
      setTitle('')
      setOnBack(null)
    }
  }, [setTitle, setOnBack, openAlert, router, editDate])

  // 직원 목록 API 연동
  const { data: employeeList = [], isLoading: isEmployeeLoading, isError: isEmployeeError, refetch: refetchEmployees } = useEmployeeOptions({
    purpose: 'BROAD',
    headOfficeId: headOfficeId ?? undefined,
    franchiseId: authFranchiseId ?? undefined,
    storeId: storeId ?? undefined,
  }, !!headOfficeId)

  // 직원 목록을 바텀시트 store에 동기화 (빈 목록도 반영하여 stale 방지)
  useEffect(() => {
    setWorkerSheetEmployees(employeeList.map((e) => ({
      id: e.employeeInfoId,
      memberId: e.memberId,
      name: e.employeeName,
      contractType: toContractType(e.contractType),
      employeeNumber: e.employeeNumber,
    })))
  }, [employeeList, setWorkerSheetEmployees])

  // 검색 조건: date 쿼리 파라미터가 있으면 해당 날짜만, 없으면 목록 검색 조건 상속
  const params: ScheduleSearchParams = useMemo(() => ({
    officeId: headOfficeId ?? 0,
    storeId,
    from: editDate ?? searchFrom,
    to: editDate ?? searchTo,
  }), [headOfficeId, storeId, editDate, searchFrom, searchTo])

  const { data: scheduleList = [], isLoading, isError, refetch } = useScheduleList(params, !!headOfficeId)

  // API 데이터 → 초기 EditState 파생 (scheduleList 또는 검색 기간 변경 시 재계산)
  const initialEditState = useMemo(() => {
    const state = new Map<string, WorkerEditItem[]>()

    for (const date of createDateRange(params.from, params.to)) {
      state.set(date, [])
    }

    for (const schedule of scheduleList) {
      const workers: WorkerEditItem[] = schedule.workerList.map((w) => ({
        ...w,
        isNew: false,
      }))
      state.set(schedule.date, workers)
    }
    return state
  }, [scheduleList, params.from, params.to])

  // EditState: 사용자 편집 상태 (초기값은 API 데이터 기반)
  const [editState, setEditState] = useState<Map<string, WorkerEditItem[]>>(new Map())
  const [initialized, setInitialized] = useState(false)

  // 사용자가 아직 편집하지 않았으면 서버 데이터(initialEditState)를 그대로 표시
  const effectiveEditState = (!initialized && initialEditState.size > 0) ? initialEditState : editState

  // 수립 페이지 필터
  const [filterEmployeeName, setFilterEmployeeName] = useState('')
  const [filterTempName, setFilterTempName] = useState('')

  // 날짜별 근무자 업데이트 헬퍼
  const updateWorkers = useCallback((date: string, updater: (workers: WorkerEditItem[]) => WorkerEditItem[]) => {
    setInitialized(true)
    setEditState((prev) => {
      const base = prev.size > 0 ? prev : initialEditState
      const next = new Map(base)
      const current = next.get(date) ?? []
      next.set(date, updater(current))
      return next
    })
  }, [initialEditState])

  // 근무자 필드 업데이트
  const updateWorkerField = useCallback(
    (date: string, index: number, field: keyof WorkerEditItem, value: WorkerEditItem[keyof WorkerEditItem]) => {
      updateWorkers(date, (workers) =>
        workers.map((w, i) => (i === index ? { ...w, [field]: value } : w)),
      )
    },
    [updateWorkers],
  )

  // 근무자 복수 필드 동시 업데이트
  const updateWorkerFields = useCallback(
    (date: string, index: number, fields: Partial<WorkerEditItem>) => {
      updateWorkers(date, (workers) =>
        workers.map((w, i) => (i === index ? { ...w, ...fields } : w)),
      )
    },
    [updateWorkers],
  )

  // 근무자 추가 (기간 내 날짜에만 추가)
  const handleAddWorker = useCallback(
    (worker: WorkerEditItem, fromDate: string, toDate: string) => {
      setInitialized(true)
      setEditState((prev) => {
        const base = prev.size > 0 ? prev : initialEditState
        const next = new Map(base)
        for (const [date, workers] of next) {
          if (date >= fromDate && date <= toDate) {
            next.set(date, [...workers, { ...worker }])
          }
        }
        return next
      })
    },
    [initialEditState],
  )

  // 근무자 교체
  const handleReplaceWorker = useCallback(
    (date: string, index: number, newWorkerId: number, newWorkerName: string, newContractType: ScheduleContractType) => {
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
      const workerRequests: WorkerRequest[] = workers.map((w) => {
        const base = {
          shiftId: w.shiftId ?? undefined,
          hasWork: w.hasWork,
          workStartTime: w.workStartTime ?? undefined,
          workEndTime: w.workEndTime ?? undefined,
          hasBreak: w.hasBreak,
          breakStartTime: w.breakStartTime ?? undefined,
          breakEndTime: w.breakEndTime ?? undefined,
          iconType: w.iconType,
          isDeleted: w.isDeleted,
        }
        if (w.workerId !== null) {
          return { ...base, workerId: w.workerId }
        }
        return { ...base, tempWorkerName: w.workerName }
      })
      requests.push({ date, workerRequests })
    }
    return requests
  }

  // 저장 (mutateAsync + try/catch 전용)
  const handleSave = async () => {
    if (isUpserting) return
    if (!storeId) {
      openAlert({ message: '점포가 선택되지 않았습니다.' })
      return
    }
    const requests = buildRequests()
    try {
      await upsertSchedule({ storeId, data: requests })
      openAlert({
        message: '근무 계획이 저장되었습니다.',
        onConfirm: () => router.push(PLAN_LIST_PATH),
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
      onConfirm: () => router.push(PLAN_LIST_PATH),
    })
  }

  // 날짜 정렬된 EditState entries
  const sortedEntries = useMemo(
    () => [...effectiveEditState.entries()].sort(([a], [b]) => a.localeCompare(b)),
    [effectiveEditState],
  )

  // 검색 필터 적용 여부
  const hasWorkerFilter = !!(filterEmployeeName || filterTempName)

  // 검색 필터
  const filterWorkers = useCallback(
    (workers: WorkerEditItem[]) => {
      const sorted = sortWorkers(workers)
      if (!filterEmployeeName && !filterTempName) return sorted

      return sorted.filter((w) => {
        const isEmployee = !!w.workerId
        const isTemp = !w.workerId

        // 직원명 필터: 등록된 직원 대상 (workerId가 있는 근무자)
        if (filterEmployeeName && isEmployee) {
          return w.workerName === filterEmployeeName
        }
        // 임시근무자명 필터: workerId 없는 임시근무만 대상
        if (filterTempName && isTemp) {
          return w.workerName.includes(filterTempName)
        }
        // 필터 대상이 아닌 유형은 필터가 해당 유형만 걸렸을 때 숨김
        if (filterEmployeeName && isTemp) return !filterTempName // 임시 필터 없으면 표시
        if (filterTempName && isEmployee) return !filterEmployeeName // 직원 필터 없으면 표시
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
      const date = parseDateLocal(d)
      return `${d.replace(/-/g, '.')}(${DAY_LABELS[date.getDay()]})`
    }
    return `${fmtDate(first)}~${fmtDate(last)}`
  }, [sortedEntries])

  // 본사/점포 미선택 시 안내
  if (mounted && (!headOfficeId || !storeId)) {
    return (
      <div className="container sub">
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <div style={{ color: "#888", marginBottom: "16px" }}>점포가 선택되지 않았습니다.</div>
          <button className="btn-form outline min" onClick={() => router.push(PLAN_LIST_PATH)}>
            점포 선택으로 이동
          </button>
        </div>
      </div>
    )
  }

  if (isError || isEmployeeError) {
    return (
      <div className="container sub">
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <div style={{ color: "#e74c3c", marginBottom: "16px" }}>근무 계획 정보를 불러올 수 없습니다.</div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button className="btn-form outline min" onClick={() => { refetch(); refetchEmployees() }}>다시 시도</button>
            <button className="btn-form outline min" onClick={() => router.back()}>돌아가기</button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || isEmployeeLoading) {
    return (
      <div className="container sub">
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <p>데이터를 불러오는 중입니다...</p>
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
          <button className="pay-head-btn" onClick={() => openWorkerAddSheet(handleAddWorker, { from: editDate ?? searchFrom, to: editDate ?? searchTo })}>
            <i className="invite"></i>직원추가
          </button>
          <button className="pay-head-btn" onClick={() => openTempWorkerAddSheet(handleAddWorker, { from: editDate ?? searchFrom, to: editDate ?? searchTo })}>
            <i className="add_team"></i>임시 근무자 추가
          </button>
        </div>
        <div className="sub-content-body">
          <div className="search-bx staff">
            <div className="search-count">
              검색결과 <span>{totalCount}건</span>
            </div>
            <button
              className={`search-btn${hasWorkerFilter ? ' filtered' : ''}`}
              onClick={() => openWorkerSearchSheet(
                ({ employeeName, tempWorkerName }) => {
                  setFilterEmployeeName(employeeName)
                  setFilterTempName(tempWorkerName)
                },
                { employeeName: filterEmployeeName, tempWorkerName: filterTempName },
              )}
            >
              <i className="icon-search"></i>
              <span>검색</span>
            </button>
          </div>
          <div className="sub-cont-wrap">
            <div className="plan-table-wrap">
              {sortedEntries.map(([date, workers]) => {
                const displayDate = parseDateLocal(date)
                const dayLabel = DAY_LABELS[displayDate.getDay()]
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
                          <div key={`${worker.shiftId ?? worker.workerId ?? worker.workerName}-${originalIndex}`} className={`sub-item-bx ${style.wrapClass}`}>
                            <div className="plan-staff-head">
                              <div className="plan-staff-info">
                                {!worker.isNew && <span className={style.badgeClass}>{style.label}</span>}
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
                                          worker.workStartTime ?? DEFAULT_WORK_START,
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
                                          worker.workEndTime ?? DEFAULT_WORK_END,
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
                                          worker.breakStartTime ?? DEFAULT_BREAK_START,
                                          (time) => updateWorkerFields(date, originalIndex, { breakStartTime: time, hasBreak: true }),
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
                                          worker.breakEndTime ?? DEFAULT_BREAK_END,
                                          (time) => updateWorkerFields(date, originalIndex, { breakEndTime: time, hasBreak: true }),
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
            disabled={isUpserting}
          >
            {isUpserting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </>
  )
}
