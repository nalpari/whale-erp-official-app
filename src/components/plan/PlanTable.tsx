'use client'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { usePlanSearchStore } from '@/store/usePlanSearchStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreStore } from '@/store/useStoreStore'
import { useScheduleList } from '@/hooks/queries/use-schedule-queries'
import { useMounted } from '@/hooks/use-mounted'
import { getContractStyle, calcWorkHours, sortWorkers, getMonday, getSunday } from '@/lib/schedule-utils'
import '@/components/storeinfo/css/store-search-btn.scss'
import TimelineBar from './TimelineBar'
import type { ScheduleSearchParams } from '@/types/schedule'

export default function PlanTable() {
  const router = useRouter()
  const setPlanSearchSheet = useBottomSheetControler((state) => state.setPlanSearchSheet)
  const searchEmployeeName = usePlanSearchStore((s) => s.employeeName)
  const searchDayType = usePlanSearchStore((s) => s.dayType)
  const storeFrom = usePlanSearchStore((s) => s.from)
  const storeTo = usePlanSearchStore((s) => s.to)
  // store가 빈 값(초기 상태)이면 이번 주로 폴백 — stale 날짜 방지
  const searchFrom = storeFrom || getMonday()
  const searchTo = storeTo || getSunday()
  // 기간/직원명/요일 등 검색 조건이 하나라도 있으면 하이라이트
  const hasFilter = !!(storeFrom || storeTo || searchEmployeeName || searchDayType)
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId)
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice)
  const selectedStore = useStoreStore((state) => state.selectedStore)
  const mounted = useMounted()

  // 본사 ID: 점포 선택 바텀시트 > authStore 순 fallback, hydration 전에는 null
  const effectiveHeadOfficeId = selectedHeadOffice?.id ?? authHeadOfficeId ?? null
  const headOfficeId = mounted ? effectiveHeadOfficeId : null
  const storeId = mounted ? selectedStore?.id ?? undefined : undefined

  const searchParams: ScheduleSearchParams = {
    officeId: headOfficeId ?? 0,
    storeId,
    employeeName: searchEmployeeName || undefined,
    dayType: searchDayType ?? undefined,
    from: searchFrom,
    to: searchTo,
  }

  // 본사/점포 선택 없으면 요청 보내지 않음
  const { data: scheduleList = [], isLoading, isError, refetch } = useScheduleList(
    searchParams,
    !!headOfficeId,
  )

  const totalCount = scheduleList.reduce((acc, s) => acc + s.workerList.filter((w) => !w.isDeleted).length, 0)

  // 계획 수립 이동
  const handleGoToEdit = (editStoreId?: number | null, date?: string) => {
    const targetStoreId = editStoreId ?? selectedStore?.id
    if (targetStoreId) {
      const params = new URLSearchParams({ storeId: String(targetStoreId) })
      if (date) params.set('date', date)
      router.push(`/plan/edit?${params.toString()}`)
    }
  }

  if (isError) {
    return (
      <div className="container">
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <div style={{ color: "#e74c3c", marginBottom: "16px" }}>근무 계획 정보를 불러올 수 없습니다.</div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button className="btn-form outline min" onClick={() => refetch()}>다시 시도</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="sub-tit-wrap">
        <div className="sub-tit">점포별 근무 계획표</div>
        <div className="sub-btn-wrap">
          <button className="btn-s black" onClick={() => handleGoToEdit()}>
            <i className="plan-create"></i>
            계획 수립
          </button>
        </div>
      </div>
      <div className="sub-content-body">
        <div className="search-bx staff">
          <div className="search-count">
            검색결과 <span>{totalCount}건</span>
          </div>
          <button className={`search-btn${hasFilter ? ' filtered' : ''}`} onClick={() => setPlanSearchSheet(true)}>
            <i className="icon-search"></i>
            <span>검색</span>
          </button>
        </div>

        {isLoading && (
          <div className="loading-wrap">
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        )}

        <div className="plan-table-wrap">
          {scheduleList.map((schedule) => {
            const activeWorkers = sortWorkers(schedule.workerList)
            if (activeWorkers.length === 0) return null

            return (
              <div key={`${schedule.storeId ?? 'unknown'}-${schedule.date}`} className="plan-table-item">
                <div className="plan-table-header">
                  <div className="plan-table-day">
                    {schedule.date.replace(/-/g, '.')} {schedule.day}
                  </div>
                  <div className="auto-right">
                    <button
                      className="sub-edit-btn"
                      onClick={() => handleGoToEdit(schedule.storeId, schedule.date)}
                    />
                  </div>
                </div>
                <div className="plan-table-content">
                  {activeWorkers.map((worker) => {
                    const style = getContractStyle(worker.contractType)
                    const hours = calcWorkHours(worker)
                    const timeRange =
                      worker.workStartTime && worker.workEndTime
                        ? `${worker.workStartTime.slice(0, 5)}-${worker.workEndTime.slice(0, 5)}`
                        : ''

                    return (
                      <div
                        key={`${worker.shiftId ?? worker.workerId ?? worker.workerName}`}
                        className={`sub-item-bx ${style.wrapClass}`}
                      >
                        <div className="plan-staff-head">
                          <div className="plan-staff-info">
                            <span className={style.badgeClass}>{style.label}</span>
                            <span className="name">{worker.workerName}</span>
                            <span className="time">{timeRange}</span>
                          </div>
                          <div className="auto-right">
                            <div className="work-time">{hours}</div>
                          </div>
                        </div>
                        <TimelineBar
                          workStartTime={worker.workStartTime}
                          workEndTime={worker.workEndTime}
                          breakStartTime={worker.breakStartTime}
                          breakEndTime={worker.breakEndTime}
                          hasWork={worker.hasWork}
                          hasBreak={worker.hasBreak}
                        />
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
  )
}
