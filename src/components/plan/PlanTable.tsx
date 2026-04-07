'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { usePlanSearchStore } from '@/store/usePlanSearchStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useStoreStore } from '@/store/useStoreStore'
import { usePopupControler } from '@/store/usePopupControler'
import { useScheduleList, useUpsertSchedule, useValidateScheduleExcel, useDownloadScheduleTemplate } from '@/hooks/queries/use-schedule-queries'
import { useMounted } from '@/hooks/use-mounted'
import { getContractStyle, calcWorkHours, sortWorkers, getMonday, getSunday } from '@/lib/schedule-utils'
import { getErrorMessage, isInterceptorHandled } from '@/lib/api'
import { downloadScheduleExcel } from '@/lib/api/schedule'
import { downloadBlob } from '@/lib/file-utils'
import '@/components/storeinfo/css/store-search-btn.scss'
import TimelineBar from './TimelineBar'
import UploadExcelPopup from './UploadExcelPopup'
import type { ScheduleSearchParams, ExcelValidationResponse } from '@/types/schedule'

export default function PlanTable() {
  const router = useRouter()
  const setPlanSearchSheet = useBottomSheetControler((state) => state.setPlanSearchSheet)
  const searchEmployeeName = usePlanSearchStore((s) => s.employeeName)
  const searchDayType = usePlanSearchStore((s) => s.dayType)
  const storeFrom = usePlanSearchStore((s) => s.from)
  const storeTo = usePlanSearchStore((s) => s.to)
  const hasSearched = usePlanSearchStore((s) => s.hasSearched)
  const defaultFrom = getMonday()
  const defaultTo = getSunday()
  // store가 빈 값(초기 상태)이면 이번 주로 폴백 — stale 날짜 방지
  const searchFrom = storeFrom || defaultFrom
  const searchTo = storeTo || defaultTo
  const hasCustomDateRange = searchFrom !== defaultFrom || searchTo !== defaultTo
  // 기본 조회 기간은 필터로 보지 않고, 사용자가 적용한 추가 조건만 하이라이트
  const hasFilter = hasSearched && !!(searchEmployeeName || searchDayType || hasCustomDateRange)
  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId)
  const selectedHeadOfficeId = useStoreStore((state) => state.selectedHeadOffice?.id ?? null)
  const selectedStoreId = useStoreStore((state) => state.selectedStore?.id ?? null)
  const mounted = useMounted()

  // 본사 ID: 점포 선택 바텀시트 > authStore 순 fallback, hydration 전에는 null
  const effectiveHeadOfficeId = selectedHeadOfficeId ?? authHeadOfficeId ?? null
  const headOfficeId = mounted ? effectiveHeadOfficeId : null
  const storeId = mounted ? selectedStoreId ?? undefined : undefined

  const openAlert = usePopupControler((state) => state.openAlert)

  // 엑셀 업로드 팝업 상태
  const [isUploadOpen, setUploadOpen] = useState(false)
  const [validationResult, setValidationResult] = useState<ExcelValidationResponse | null>(null)
  // TODO: 공통 로딩 화면으로 교체 (엑셀 검증/저장 pending)
  const { mutateAsync: validateExcel, isPending: isValidating } = useValidateScheduleExcel()
  const { mutateAsync: upsertSchedule, isPending: isSavingExcel } = useUpsertSchedule()
  // TODO: 공통 로딩 화면으로 교체 (샘플 다운로드 pending)
  const { mutateAsync: downloadTemplate, isPending: isDownloadingTemplate } = useDownloadScheduleTemplate()

  const handleOpenUpload = () => {
    if (!storeId) {
      openAlert({ message: '점포를 먼저 선택해주세요.' })
      return
    }
    setValidationResult(null)
    setUploadOpen(true)
  }

  // 1단계: 엑셀 검증
  const handleValidateExcel = async (file: File) => {
    if (!storeId) {
      openAlert({ message: '점포를 먼저 선택해주세요.' })
      return
    }
    try {
      const result = await validateExcel({ storeId, file })
      setValidationResult(result)
    } catch (err) {
      if (isInterceptorHandled(err)) return
      console.error('[PlanTable] 엑셀 검증 실패:', err)
      setValidationResult({
        valid: false,
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        schedules: null,
        errors: [{ rowNumber: 0, message: err instanceof Error ? err.message : '엑셀 검증에 실패했습니다.' }],
      })
    }
  }

  // 2단계: 검증 성공 데이터 저장 (replaceMode)
  const handleSaveValidated = async () => {
    if (!storeId) {
      openAlert({ message: '점포를 먼저 선택해주세요.' })
      return
    }
    if (!validationResult?.valid || !validationResult.schedules) {
      openAlert({ message: '검증이 완료된 엑셀 파일만 저장할 수 있습니다.' })
      return
    }
    try {
      await upsertSchedule({ storeId, data: validationResult.schedules, replaceMode: true })
      openAlert({
        message: '엑셀 데이터가 저장되었습니다.',
        onConfirm: () => {
          setUploadOpen(false)
          setValidationResult(null)
        },
      })
    } catch (err) {
      if (isInterceptorHandled(err)) return
      console.error('[PlanTable] 엑셀 저장 실패:', err)
      openAlert({ message: getErrorMessage(err, '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.') })
    }
  }

  // 샘플 템플릿 다운로드
  const handleDownloadSample = async () => {
    try {
      const blob = await downloadTemplate()
      downloadBlob(blob, '근무계획표_업로드_샘플.xlsx')
    } catch (err) {
      if (isInterceptorHandled(err)) return
      console.error('[PlanTable] 샘플 다운로드 실패:', err)
      openAlert({ message: getErrorMessage(err, '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.') })
    }
  }

  // TODO: 공통 로딩 화면으로 교체 (엑셀 다운로드 pending)
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false)

  // 엑셀 다운로드 (현재 검색 조건 기준)
  const handleDownloadExcel = async () => {
    if (!storeId) {
      openAlert({ message: '점포를 먼저 선택해주세요.' })
      return
    }
    setIsDownloadingExcel(true)
    try {
      const blob = await downloadScheduleExcel({
        storeId,
        startDate: searchFrom,
        endDate: searchTo,
        employeeName: searchEmployeeName || undefined,
        dayOfWeek: searchDayType ?? undefined,
      })
      const defaultName = `근무계획표_${searchFrom}_${searchTo}.xlsx`
      downloadBlob(blob, defaultName)
    } catch (err) {
      if (isInterceptorHandled(err)) return
      console.error('[PlanTable] 엑셀 다운로드 실패:', err)
      openAlert({ message: getErrorMessage(err, '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.') })
    } finally {
      setIsDownloadingExcel(false)
    }
  }

  const searchParams = headOfficeId ? {
    officeId: headOfficeId,
    storeId,
    employeeName: searchEmployeeName || undefined,
    dayType: searchDayType ?? undefined,
    from: searchFrom,
    to: searchTo,
  } satisfies ScheduleSearchParams : null

  // 본사/점포 선택 없으면 요청 보내지 않음
  const { data: scheduleList = [], isLoading, isError } = useScheduleList(
    searchParams,
    !!headOfficeId,
  )

  const totalCount = scheduleList.reduce((acc, s) => acc + s.workerList.filter((w) => !w.isDeleted).length, 0)

  // 본사/점포 미선택 시 안내
  if (mounted && !headOfficeId) {
    return (
      <div className="container">
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <div style={{ color: "#888" }}>점포를 선택해주세요.</div>
        </div>
      </div>
    )
  }

  if (mounted && !storeId) {
    return (
      <div className="container">
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <div style={{ color: "#888" }}>점포를 선택해주세요.</div>
        </div>
      </div>
    )
  }

  // 계획 수립/수정 페이지 이동
  const handleGoToEdit = (editStoreId?: number | null, date?: string) => {
    const targetStoreId = editStoreId ?? selectedStoreId
    if (!targetStoreId) {
      openAlert({ message: '점포를 먼저 선택해주세요.' })
      return
    }
    const params = new URLSearchParams({ storeId: String(targetStoreId) })
    if (date) params.set('date', date)
    router.push(`/plan/edit?${params.toString()}`)
  }

  if (isError) {
    return (
      <div className="container">
        <div style={{ padding: "40px 0", textAlign: "center", color: "#e74c3c" }}>
          근무 계획 정보를 불러올 수 없습니다.
        </div>
      </div>
    )
  }

  // TODO: 공통 로딩 화면으로 교체 (목록 조회)
  if (isLoading) {
    return (
      <div className="container">
        <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
          불러오는 중...
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="sub-tit-wrap">
        <div className="sub-tit">점포별 근무 계획표</div>
        <div className="sub-btn-wrap flex items-center gap-2">
          {!!storeId && (
            <>
              <button className="btn-s outline-g" onClick={handleOpenUpload}>
                엑셀 업로드
              </button>
              <button className="btn-s outline-g" onClick={handleDownloadExcel} disabled={isDownloadingExcel}>
                {isDownloadingExcel ? '다운로드 중...' : '엑셀 다운로드'}
              </button>
            </>
          )}
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

      {isUploadOpen && (
        <UploadExcelPopup
          isUploading={isValidating}
          isSaving={isSavingExcel}
          isDownloadingSample={isDownloadingTemplate}
          result={validationResult}
          onClose={() => {
            setUploadOpen(false)
            setValidationResult(null)
          }}
          onUpload={handleValidateExcel}
          onSave={handleSaveValidated}
          onDownloadSample={handleDownloadSample}
          onAlert={(message) => openAlert({ message })}
        />
      )}
    </div>
  )
}
