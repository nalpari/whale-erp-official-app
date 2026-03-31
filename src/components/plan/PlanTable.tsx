'use client'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { usePlanSearchStore } from '@/store/usePlanSearchStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreStore } from '@/store/useStoreStore'
import { useScheduleList } from '@/hooks/queries/use-schedule-queries'
import { useMounted } from '@/hooks/use-mounted'
import TimelineBar from './TimelineBar'
import { useRouter } from 'next/navigation'
import type { ScheduleSearchParams, WorkerResponse } from '@/types/schedule'

// 계약유형 → CSS 클래스/배지 매핑
function getContractStyle(contractType: string) {
  switch (contractType) {
    case '파트타이머':
      return { boxClass: 'part', badgeClass: 'badge green', label: '파트' }
    case '임시근무':
      return { boxClass: 'temporary', badgeClass: 'badge brown', label: '임시' }
    default:
      // 정직원, 계약직, 수습 등
      return { boxClass: 'full', badgeClass: 'badge blue', label: contractType }
  }
}

function calcWorkHours(worker: WorkerResponse): string {
  if (!worker.hasWork || !worker.workStartTime || !worker.workEndTime) return '0h'
  const [sh, sm] = worker.workStartTime.split(':').map(Number)
  const [eh, em] = worker.workEndTime.split(':').map(Number)
  let totalMin = (eh * 60 + em) - (sh * 60 + sm)
  if (totalMin < 0) totalMin += 24 * 60 // 야간근무
  // 휴게시간 차감
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

// 정렬: 근무 시작시간 빠른 순 → 계약유형 순서
const CONTRACT_ORDER: Record<string, number> = {
  '정직원': 1, '계약직': 2, '수습': 3, '파트타이머': 4, '임시근무': 5,
}

function sortWorkers(workers: WorkerResponse[]): WorkerResponse[] {
  return [...workers]
    .filter((w) => !w.isDeleted)
    .sort((a, b) => {
      const timeA = a.workStartTime ?? '99:99'
      const timeB = b.workStartTime ?? '99:99'
      if (timeA !== timeB) return timeA.localeCompare(timeB)
      return (CONTRACT_ORDER[a.contractType] ?? 99) - (CONTRACT_ORDER[b.contractType] ?? 99)
    })
}

export default function PlanTable() {
  const router = useRouter()
  const setPlanSearchSheet = useBottomSheetControler((state) => state.setPlanSearchSheet)
  const searchStore = usePlanSearchStore()
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
    employeeName: searchStore.employeeName || undefined,
    dayType: searchStore.dayType ?? undefined,
    from: searchStore.from,
    to: searchStore.to,
  }

  // 본사/점포 선택 없으면 요청 보내지 않음
  const { data: scheduleList = [], isLoading } = useScheduleList(
    searchParams,
    !!headOfficeId,
  )

  const totalCount = scheduleList.reduce((acc, s) => acc + s.workerList.filter((w) => !w.isDeleted).length, 0)

  // 계획 수립 이동: 인자로 받은 storeId → 선택된 점포 → 순서로 fallback
  const handleGoToEdit = (editStoreId?: number | null) => {
    const targetStoreId = editStoreId ?? selectedStore?.id
    if (targetStoreId) {
      router.push(`/plan/${targetStoreId}`)
    }
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
          <button className="search-btn" onClick={() => setPlanSearchSheet(true)}>
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
              <div key={`${schedule.date}`} className="plan-table-item">
                <div className="plan-table-header">
                  <div className="plan-table-day">
                    {schedule.date.replace(/-/g, '.')} {schedule.day}
                  </div>
                  <div className="auto-right">
                    <button
                      className="sub-edit-btn"
                      onClick={() => {
                        searchStore.setField('from', schedule.date)
                        searchStore.setField('to', schedule.date)
                        handleGoToEdit(schedule.storeId)
                      }}
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
                        className={`sub-item-bx ${style.boxClass}`}
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
