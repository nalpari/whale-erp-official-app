import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type BottomSheetControlerState = {
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
  workerDeleteSheet: boolean
  setWorkerDeleteSheet: (isOpen: boolean) => void
  workerAddSheet: boolean
  setWorkerAddSheet: (isOpen: boolean) => void
  temporaryWorkerAddSheet: boolean
  setTemporaryWorkerAddSheet: (isOpen: boolean) => void
  workerSearchSheet: boolean
  setWorkerSearchSheet: (isOpen: boolean) => void
  deductionAddSheet: boolean
  setDeductionAddSheet: (isOpen: boolean) => void
}

export const useBottomSheetControler = create<BottomSheetControlerState>()(
  devtools(
    (set) => ({
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
      workerDeleteSheet: false,
      setWorkerDeleteSheet: (isOpen: boolean) =>
        set(
          { workerDeleteSheet: isOpen },
          false,
          'bottomSheet/setWorkerDelete',
        ),
      workerAddSheet: false,
      setWorkerAddSheet: (isOpen: boolean) =>
        set({ workerAddSheet: isOpen }, false, 'bottomSheet/setWorkerAdd'),
      temporaryWorkerAddSheet: false,
      setTemporaryWorkerAddSheet: (isOpen: boolean) =>
        set(
          { temporaryWorkerAddSheet: isOpen },
          false,
          'bottomSheet/setTemporaryWorkerAdd',
        ),
      workerSearchSheet: false,
      setWorkerSearchSheet: (isOpen: boolean) =>
        set(
          { workerSearchSheet: isOpen },
          false,
          'bottomSheet/setWorkerSearch',
        ),
      deductionAddSheet: false,
      setDeductionAddSheet: (isOpen: boolean) =>
        set(
          { deductionAddSheet: isOpen },
          false,
          'bottomSheet/setDeductionAdd',
        ),
    }),
    { name: 'BottomSheetControlerStore' },
  ),
)
