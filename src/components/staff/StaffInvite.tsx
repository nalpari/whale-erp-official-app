'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InviteForm01 from './invite/InviteForm01'
import InviteForm02 from './invite/InviteForm02'
import InviteForm03 from './invite/InviteForm03'
import InviteForm04 from './invite/InviteForm04'
import { useStaffInviteStore } from '@/store/useStaffInviteStore'
import { useCreateEmployee } from '@/hooks/queries/use-employee-queries'
import { getErrorMessage } from '@/lib/api'

type StepOneData = ReturnType<typeof useStaffInviteStore.getState>['stepOne']
type StepTwoData = ReturnType<typeof useStaffInviteStore.getState>['stepTwo']
type StepFourData = ReturnType<typeof useStaffInviteStore.getState>['stepFour']

function isStepValid(step: number, stepOne: StepOneData, stepTwo: StepTwoData, stepFour: StepFourData): boolean {
  if (step === 1) {
    if (!stepOne.headOfficeOrganizationId) return false
    if (stepOne.workplaceType === 'FRANCHISE' && !stepOne.franchiseOrganizationId) return false
    if (!stepOne.employeeName.trim()) return false
    if (!stepOne.mobilePhone.trim()) return false
    if (stepOne.mobilePhone.replace(/[^0-9]/g, '').length < 10) return false
  }
  if (step === 2) {
    if (!stepTwo.hireDate && !stepTwo.contractStartDate) return false
    if (!stepTwo.contractStartDate) return false
    if (!stepTwo.noEndDate && !stepTwo.contractEndDate) return false
    if (!stepTwo.jobDescription.trim()) return false
  }
  if (step === 4) {
    const hasWorkDay = stepFour.workHours.some((wh) => wh.isWork)
    if (!hasWorkDay) return false
    const saturday = stepFour.workHours.find((wh) => wh.dayType === 'SATURDAY')
    if (saturday?.isWork && !saturday.everySaturdayWork && !saturday.firstSaturdayWorkDay) return false
    const sunday = stepFour.workHours.find((wh) => wh.dayType === 'SUNDAY')
    if (sunday?.isWork && !sunday.everySundayWork && !sunday.firstSundayWorkDay) return false
  }
  return true
}

export default function StaffInvite() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const { stepOne, stepTwo, stepFour, toPostRequest, reset } = useStaffInviteStore()
  const createMutation = useCreateEmployee()

  useEffect(() => {
    return () => { reset() }
  }, [reset])

  const canGoNext = isStepValid(step, stepOne, stepTwo, stepFour)
  const canInvite = isStepValid(1, stepOne, stepTwo, stepFour)
    && isStepValid(2, stepOne, stepTwo, stepFour)
    && isStepValid(4, stepOne, stepTwo, stepFour)

  const handleNext = () => {
    window.scrollTo({ top: 0 })
    setStep(step + 1)
  }

  const handlePrev = () => {
    window.scrollTo({ top: 0 })
    setStep(step - 1)
  }

  const handleInvite = async () => {
    const request = toPostRequest()
    if (!request) return
    if (!confirm(`${request.employeeName}님에게 초대 카카오톡을 발송할까요?`)) return

    try {
      await createMutation.mutateAsync(request)
      alert('직원 초대가 완료되었습니다.')
      reset()
      router.push('/staff')
    } catch (error) {
      alert(getErrorMessage(error, '직원 초대에 실패했습니다.'))
    }
  }

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          {step === 1 && <InviteForm01 />}
          {step === 2 && <InviteForm02 />}
          {step === 3 && <InviteForm03 />}
          {step === 4 && <InviteForm04 />}
        </div>
      </div>
      <div className="content-pagination">
        {step === 4 && (
          <div className="mb25">
            <button
              className="btn-form block blue"
              onClick={handleInvite}
              disabled={!canInvite}
            >
              초대하기
            </button>
          </div>
        )}
        <div className="pagination-wrap">
          <button
            className="page-btn prev"
            disabled={step === 1}
            onClick={handlePrev}
          >
            <i className="icon-arrow left"></i>
            <span>이전</span>
          </button>
          <div className="page-num">
            <span className="current">{step}</span>
            <span>/</span>
            <span>4</span>
          </div>
          <button
            className="page-btn next"
            disabled={step === 4 || !canGoNext}
            onClick={handleNext}
          >
            <span>다음</span>
            <i className="icon-arrow right"></i>
          </button>
        </div>
      </div>
    </>
  )
}
