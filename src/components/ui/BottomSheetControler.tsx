'use client'

import { useEffect } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import StoreSelectSheet from '../bottomsheet/StoreSelectSheet'
import GoToOptionSheet from '../bottomsheet/GoToOptionSheet'
import StoreSearchSheet from '../bottomsheet/StoreSearchSheet'
import PhotoSelectSheet from '../bottomsheet/PhotoSelectSheet'
import TimeSelectSheet from '../bottomsheet/TimeSelectSheet'
import StaffSearchSheet from '../bottomsheet/StaffSearchSheet'
import ContractOptionSheet from '../bottomsheet/ContractOptionSheet'
import PartStaffPaySheet from '../bottomsheet/PartStaffPaySheet'
import BonusPaySheet from '../bottomsheet/BonusPaySheet'
import ContractSearchSheet from '../bottomsheet/ContractSearchSheet'
import FullTimerSearchSheet from '../bottomsheet/FullTimerSearchSheet'
import PaymentConditionSheet from '../bottomsheet/PaymentConditionSheet'
import PartTimerSearchSheet from '../bottomsheet/PartTimerSearchSheet'
import OverTimeSearchSheet from '../bottomsheet/OverTimeSearchSheet'
import CommuteSearchSheet from '../bottomsheet/CommuteSearchSheet'
import PlanTableSearchSheet from '../bottomsheet/PlanTableSearchSheet'
import WorkerChangeSheet from '../bottomsheet/WorkerChangeSheet'
import WorkerDeleteSheet from '../bottomsheet/WorkerDeleteSheet'
import WorkerAddSheet from '../bottomsheet/WorkerAddSheet'
import TemporaryWorkerAddSheet from '../bottomsheet/TemporaryWorkerAddSheet'
import WorkerSearchSheet from '../bottomsheet/WorkerSearchSheet'
import DeductionAddSheet from '../bottomsheet/DeductionAddSheet'

export default function BottomSheetControler() {
  // 개별 구독으로 안정성 확보
  const storeSelectSheet = useBottomSheetControler(
    (state) => state.storeSelectSheet,
  )
  const goToOptionSheet = useBottomSheetControler(
    (state) => state.goToOptionSheet,
  )
  const storeSearchSheet = useBottomSheetControler(
    (state) => state.storeSearchSheet,
  )
  const photoSelectSheet = useBottomSheetControler(
    (state) => state.photoSelectSheet,
  )
  const timeSelectSheet = useBottomSheetControler(
    (state) => state.timeSelectSheet,
  )
  const staffSearchSheet = useBottomSheetControler(
    (state) => state.staffSearchSheet,
  )
  const contractOptionSheet = useBottomSheetControler(
    (state) => state.contractOptionSheet,
  )
  const partStaffPaySheet = useBottomSheetControler(
    (state) => state.partStaffPaySheet,
  )
  const bonusPaySheet = useBottomSheetControler((state) => state.bonusPaySheet)
  const contractSearchSheet = useBottomSheetControler(
    (state) => state.contractSearchSheet,
  )
  const fullTimerSearchSheet = useBottomSheetControler(
    (state) => state.fullTimerSearchSheet,
  )
  const paymentConditionSheet = useBottomSheetControler(
    (state) => state.paymentConditionSheet,
  )
  const partTimerSearchSheet = useBottomSheetControler(
    (state) => state.partTimerSearchSheet,
  )
  const overTimeSearchSheet = useBottomSheetControler(
    (state) => state.overTimeSearchSheet,
  )
  const commuteSearchSheet = useBottomSheetControler(
    (state) => state.commuteSearchSheet,
  )
  const planSearchSheet = useBottomSheetControler(
    (state) => state.planSearchSheet,
  )
  const workerChangeSheet = useBottomSheetControler(
    (state) => state.workerChangeSheet,
  )
  const workerDeleteSheet = useBottomSheetControler(
    (state) => state.workerDeleteSheet,
  )
  const workerAddSheet = useBottomSheetControler(
    (state) => state.workerAddSheet,
  )
  const temporaryWorkerAddSheet = useBottomSheetControler(
    (state) => state.temporaryWorkerAddSheet,
  )
  const workerSearchSheet = useBottomSheetControler(
    (state) => state.workerSearchSheet,
  )
  const deductionAddSheet = useBottomSheetControler(
    (state) => state.deductionAddSheet,
  )
  useEffect(() => {
    const isAnyBottomSheetOpen =
      storeSelectSheet ||
      goToOptionSheet ||
      storeSearchSheet ||
      photoSelectSheet ||
      timeSelectSheet ||
      staffSearchSheet ||
      contractOptionSheet ||
      partStaffPaySheet ||
      bonusPaySheet ||
      contractSearchSheet ||
      fullTimerSearchSheet ||
      paymentConditionSheet ||
      partTimerSearchSheet ||
      overTimeSearchSheet ||
      commuteSearchSheet ||
      planSearchSheet ||
      workerChangeSheet ||
      workerDeleteSheet ||
      workerAddSheet ||
      temporaryWorkerAddSheet ||
      workerSearchSheet ||
      deductionAddSheet

    if (isAnyBottomSheetOpen) {
      if (!document.body.classList.contains('open')) {
        document.body.classList.add('open')
      }
    } else {
      if (document.body.classList.contains('open')) {
        document.body.classList.remove('open')
      }
    }

    return () => {
      document.body.classList.remove('open')
    }
  }, [
    storeSelectSheet,
    goToOptionSheet,
    storeSearchSheet,
    photoSelectSheet,
    timeSelectSheet,
    staffSearchSheet,
    contractOptionSheet,
    partStaffPaySheet,
    bonusPaySheet,
    contractSearchSheet,
    fullTimerSearchSheet,
    paymentConditionSheet,
    partTimerSearchSheet,
    overTimeSearchSheet,
    commuteSearchSheet,
    planSearchSheet,
    workerChangeSheet,
    workerDeleteSheet,
    workerAddSheet,
    temporaryWorkerAddSheet,
    workerSearchSheet,
    deductionAddSheet,
  ])

  return (
    <>
      {storeSelectSheet && <StoreSelectSheet />}
      {goToOptionSheet && <GoToOptionSheet />}
      {storeSearchSheet && <StoreSearchSheet />}
      {photoSelectSheet && <PhotoSelectSheet />}
      {timeSelectSheet && <TimeSelectSheet />}
      {staffSearchSheet && <StaffSearchSheet />}
      {contractOptionSheet && <ContractOptionSheet />}
      {partStaffPaySheet && <PartStaffPaySheet />}
      {bonusPaySheet && <BonusPaySheet />}
      {contractSearchSheet && <ContractSearchSheet />}
      {fullTimerSearchSheet && <FullTimerSearchSheet />}
      {paymentConditionSheet && <PaymentConditionSheet />}
      {partTimerSearchSheet && <PartTimerSearchSheet />}
      {overTimeSearchSheet && <OverTimeSearchSheet />}
      {commuteSearchSheet && <CommuteSearchSheet />}
      {planSearchSheet && <PlanTableSearchSheet />}
      {workerChangeSheet && <WorkerChangeSheet />}
      {workerDeleteSheet && <WorkerDeleteSheet />}
      {workerAddSheet && <WorkerAddSheet />}
      {temporaryWorkerAddSheet && <TemporaryWorkerAddSheet />}
      {workerSearchSheet && <WorkerSearchSheet />}
      {deductionAddSheet && <DeductionAddSheet />}
    </>
  )
}
