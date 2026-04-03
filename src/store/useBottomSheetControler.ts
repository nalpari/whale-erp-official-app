import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { WorkerEditItem, WorkerSheetEmployee, ScheduleContractType } from '@/types/schedule'

// 근무자 교체/삭제 바텀시트에서 대상 근무자 정보와 날짜를 표시하기 위한 컨텍스트
interface WorkerSheetContext {
  worker: WorkerEditItem | null
  date: string
}

// 바텀시트 콜백 타입 별칭
type WorkerAddCallback = (worker: WorkerEditItem, fromDate: string, toDate: string) => void
type WorkerReplaceCallback = (newWorkerId: number, newWorkerName: string, newContractType: ScheduleContractType) => void
type WorkerSearchFilters = { workerId: number | null; tempWorkerName: string }
// 점포 영업시간 시트의 "--:--" 선택이 null을 전달하므로 nullable 유지
type TimeSelectCallback = (time: string | null) => void

type BottomSheetControlerState = {
  workerSheetContext: WorkerSheetContext
  setWorkerSheetContext: (ctx: WorkerSheetContext) => void
  onWorkerAdd: WorkerAddCallback | null
  workerAddDefaultDates: { from: string; to: string }
  openWorkerAddSheet: (onAdd: WorkerAddCallback, defaultDates?: { from: string; to: string }) => void
  onTempWorkerAdd: WorkerAddCallback | null
  openTempWorkerAddSheet: (onAdd: WorkerAddCallback, defaultDates?: { from: string; to: string }) => void
  onWorkerReplace: WorkerReplaceCallback | null
  openWorkerChangeSheet: (worker: WorkerEditItem, date: string, onReplace: WorkerReplaceCallback) => void
  onWorkerDelete: (() => void) | null
  openWorkerDeleteSheet: (worker: WorkerEditItem, date: string, onDelete: () => void) => void
  onWorkerSearch: ((filters: WorkerSearchFilters) => void) | null
  workerSearchInitial: WorkerSearchFilters
  openWorkerSearchSheet: (onSearch: (filters: WorkerSearchFilters) => void, initial?: WorkerSearchFilters) => void
  workerSheetEmployees: WorkerSheetEmployee[]
  setWorkerSheetEmployees: (employees: WorkerSheetEmployee[]) => void
  storeSelectSheet: boolean
  setStoreSelectSheet: (isOpen: boolean) => void
  goToOptionSheet: boolean
  setGoToOptionSheet: (isOpen: boolean) => void
  storeSearchSheet: boolean
  setStoreSearchSheet: (isOpen: boolean) => void
  photoSelectSheet: boolean
  setPhotoSelectSheet: (isOpen: boolean) => void
  timeSelectSheet: boolean
  setTimeSelectSheet: (isOpen: boolean) => void
  staffSearchSheet: boolean
  setStaffSearchSheet: (isOpen: boolean) => void
  contractOptionSheet: boolean
  setContractOptionSheet: (isOpen: boolean) => void
  partStaffPaySheet: boolean
  setPartStaffPaySheet: (isOpen: boolean) => void
  bonusPaySheet: boolean
  setBonusPaySheet: (isOpen: boolean) => void
  contractSearchSheet: boolean
  setContractSearchSheet: (isOpen: boolean) => void
  fullTimerSearchSheet: boolean
  setFullTimerSearchSheet: (isOpen: boolean) => void
  paymentConditionSheet: boolean
  setPaymentConditionSheet: (isOpen: boolean) => void
  partTimerSearchSheet: boolean
  setPartTimerSearchSheet: (isOpen: boolean) => void
  overTimeSearchSheet: boolean
  setOverTimeSearchSheet: (isOpen: boolean) => void
  commuteSearchSheet: boolean
  setCommuteSearchSheet: (isOpen: boolean) => void
  planSearchSheet: boolean
  setPlanSearchSheet: (isOpen: boolean) => void
  workerChangeSheet: boolean
  setWorkerChangeSheet: (isOpen: boolean) => void
  closeWorkerChangeSheet: () => void
  workerDeleteSheet: boolean
  setWorkerDeleteSheet: (isOpen: boolean) => void
  closeWorkerDeleteSheet: () => void
  workerAddSheet: boolean
  setWorkerAddSheet: (isOpen: boolean) => void
  closeWorkerAddSheet: () => void
  temporaryWorkerAddSheet: boolean
  setTemporaryWorkerAddSheet: (isOpen: boolean) => void
  closeTemporaryWorkerAddSheet: () => void
  workerSearchSheet: boolean
  setWorkerSearchSheet: (isOpen: boolean) => void
  closeWorkerSearchSheet: () => void
  deductionAddSheet: boolean
  setDeductionAddSheet: (isOpen: boolean) => void
  photoUploadSheet: boolean
  setPhotoUploadSheet: (isOpen: boolean) => void
  timePickerSheet: boolean
  setTimePickerSheet: (isOpen: boolean) => void
  timePickerTitle: string
  timePickerValue: string
  onTimeSelect: TimeSelectCallback | null
  openTimePicker: (title: string, currentValue: string, onSelect: TimeSelectCallback) => void
}

export const useBottomSheetControler = create<BottomSheetControlerState>()(
  devtools(
    (set) => ({
      workerSheetContext: { worker: null, date: '' },
      setWorkerSheetContext: (ctx: WorkerSheetContext) =>
        set({ workerSheetContext: ctx }, false, 'bottomSheet/setWorkerSheetContext'),
      onWorkerAdd: null,
      workerAddDefaultDates: { from: '', to: '' },
      openWorkerAddSheet: (onAdd, defaultDates) =>
        set({ workerAddSheet: true, onWorkerAdd: onAdd, workerAddDefaultDates: defaultDates ?? { from: '', to: '' } }, false, 'bottomSheet/openWorkerAdd'),
      onTempWorkerAdd: null,
      openTempWorkerAddSheet: (onAdd, defaultDates) =>
        set({ temporaryWorkerAddSheet: true, onTempWorkerAdd: onAdd, workerAddDefaultDates: defaultDates ?? { from: '', to: '' } }, false, 'bottomSheet/openTempWorkerAdd'),
      onWorkerReplace: null,
      openWorkerChangeSheet: (worker, date, onReplace) =>
        set({ workerChangeSheet: true, workerSheetContext: { worker, date }, onWorkerReplace: onReplace }, false, 'bottomSheet/openWorkerChange'),
      onWorkerDelete: null,
      openWorkerDeleteSheet: (worker, date, onDelete) =>
        set({ workerDeleteSheet: true, workerSheetContext: { worker, date }, onWorkerDelete: onDelete }, false, 'bottomSheet/openWorkerDelete'),
      onWorkerSearch: null,
      workerSearchInitial: { workerId: null, tempWorkerName: '' },
      openWorkerSearchSheet: (onSearch, initial) =>
        set({
          workerSearchSheet: true,
          onWorkerSearch: onSearch,
          workerSearchInitial: initial ?? { workerId: null, tempWorkerName: '' },
        }, false, 'bottomSheet/openWorkerSearch'),
      workerSheetEmployees: [],
      setWorkerSheetEmployees: (employees) =>
        set({ workerSheetEmployees: employees }, false, 'bottomSheet/setWorkerSheetEmployees'),
      storeSelectSheet: false,
      setStoreSelectSheet: (isOpen: boolean) =>
        set({ storeSelectSheet: isOpen }, false, 'bottomSheet/setStoreSelect'),
      goToOptionSheet: false,
      setGoToOptionSheet: (isOpen: boolean) =>
        set({ goToOptionSheet: isOpen }, false, 'bottomSheet/setGoToOption'),
      storeSearchSheet: false,
      setStoreSearchSheet: (isOpen: boolean) =>
        set({ storeSearchSheet: isOpen }, false, 'bottomSheet/setStoreSearch'),
      photoSelectSheet: false,
      setPhotoSelectSheet: (isOpen: boolean) =>
        set({ photoSelectSheet: isOpen }, false, 'bottomSheet/setPhotoSelect'),
      timeSelectSheet: false,
      setTimeSelectSheet: (isOpen: boolean) =>
        set({ timeSelectSheet: isOpen }, false, 'bottomSheet/setTimeSelect'),
      staffSearchSheet: false,
      setStaffSearchSheet: (isOpen: boolean) =>
        set({ staffSearchSheet: isOpen }, false, 'bottomSheet/setStaffSearch'),
      contractOptionSheet: false,
      setContractOptionSheet: (isOpen: boolean) =>
        set(
          { contractOptionSheet: isOpen },
          false,
          'bottomSheet/setContractOption',
        ),
      partStaffPaySheet: false,
      setPartStaffPaySheet: (isOpen: boolean) =>
        set(
          { partStaffPaySheet: isOpen },
          false,
          'bottomSheet/setPartStaffPay',
        ),
      bonusPaySheet: false,
      setBonusPaySheet: (isOpen: boolean) =>
        set({ bonusPaySheet: isOpen }, false, 'bottomSheet/setBonusPay'),
      contractSearchSheet: false,
      setContractSearchSheet: (isOpen: boolean) =>
        set(
          { contractSearchSheet: isOpen },
          false,
          'bottomSheet/setContractSearch',
        ),
      fullTimerSearchSheet: false,
      setFullTimerSearchSheet: (isOpen: boolean) =>
        set(
          { fullTimerSearchSheet: isOpen },
          false,
          'bottomSheet/setFullTimerSearch',
        ),
      paymentConditionSheet: false,
      setPaymentConditionSheet: (isOpen: boolean) =>
        set(
          { paymentConditionSheet: isOpen },
          false,
          'bottomSheet/setPaymentCondition',
        ),
      partTimerSearchSheet: false,
      setPartTimerSearchSheet: (isOpen: boolean) =>
        set(
          { partTimerSearchSheet: isOpen },
          false,
          'bottomSheet/setPartTimerSearch',
        ),
      overTimeSearchSheet: false,
      setOverTimeSearchSheet: (isOpen: boolean) =>
        set(
          { overTimeSearchSheet: isOpen },
          false,
          'bottomSheet/setOverTimeSearch',
        ),
      commuteSearchSheet: false,
      setCommuteSearchSheet: (isOpen: boolean) =>
        set(
          { commuteSearchSheet: isOpen },
          false,
          'bottomSheet/setCommuteSearch',
        ),
      planSearchSheet: false,
      setPlanSearchSheet: (isOpen: boolean) =>
        set({ planSearchSheet: isOpen }, false, 'bottomSheet/setPlanSearch'),
      workerChangeSheet: false,
      setWorkerChangeSheet: (isOpen: boolean) =>
        set(
          { workerChangeSheet: isOpen },
          false,
          'bottomSheet/setWorkerChange',
        ),
      closeWorkerChangeSheet: () =>
        set(
          { workerChangeSheet: false, onWorkerReplace: null, workerSheetContext: { worker: null, date: '' } },
          false,
          'bottomSheet/closeWorkerChange',
        ),
      workerDeleteSheet: false,
      setWorkerDeleteSheet: (isOpen: boolean) =>
        set(
          { workerDeleteSheet: isOpen },
          false,
          'bottomSheet/setWorkerDelete',
        ),
      closeWorkerDeleteSheet: () =>
        set(
          { workerDeleteSheet: false, onWorkerDelete: null, workerSheetContext: { worker: null, date: '' } },
          false,
          'bottomSheet/closeWorkerDelete',
        ),
      workerAddSheet: false,
      setWorkerAddSheet: (isOpen: boolean) =>
        set({ workerAddSheet: isOpen }, false, 'bottomSheet/setWorkerAdd'),
      closeWorkerAddSheet: () =>
        set(
          { workerAddSheet: false, onWorkerAdd: null, workerAddDefaultDates: { from: '', to: '' } },
          false,
          'bottomSheet/closeWorkerAdd',
        ),
      temporaryWorkerAddSheet: false,
      setTemporaryWorkerAddSheet: (isOpen: boolean) =>
        set(
          { temporaryWorkerAddSheet: isOpen },
          false,
          'bottomSheet/setTemporaryWorkerAdd',
        ),
      closeTemporaryWorkerAddSheet: () =>
        set(
          { temporaryWorkerAddSheet: false, onTempWorkerAdd: null, workerAddDefaultDates: { from: '', to: '' } },
          false,
          'bottomSheet/closeTemporaryWorkerAdd',
        ),
      workerSearchSheet: false,
      setWorkerSearchSheet: (isOpen: boolean) =>
        set(
          { workerSearchSheet: isOpen },
          false,
          'bottomSheet/setWorkerSearch',
        ),
      closeWorkerSearchSheet: () =>
        set(
          { workerSearchSheet: false, onWorkerSearch: null, workerSearchInitial: { workerId: null, tempWorkerName: '' } },
          false,
          'bottomSheet/closeWorkerSearch',
        ),
      deductionAddSheet: false,
      setDeductionAddSheet: (isOpen: boolean) =>
        set(
          { deductionAddSheet: isOpen },
          false,
          'bottomSheet/setDeductionAdd',
        ),
      photoUploadSheet: false,
      setPhotoUploadSheet: (isOpen: boolean) =>
        set(
          { photoUploadSheet: isOpen },
          false,
          'bottomSheet/setPhotoUpload',
        ),
      timePickerSheet: false,
      setTimePickerSheet: (isOpen: boolean) =>
        set(
          { timePickerSheet: isOpen },
          false,
          'bottomSheet/setTimePicker',
        ),
      timePickerTitle: '',
      timePickerValue: '',
      onTimeSelect: null,
      openTimePicker: (title: string, currentValue: string, onSelect: TimeSelectCallback) =>
        set(
          { timePickerSheet: true, timePickerTitle: title, timePickerValue: currentValue, onTimeSelect: onSelect },
          false,
          'bottomSheet/openTimePicker',
        ),
    }),
    { name: 'BottomSheetControlerStore' },
  ),
)
