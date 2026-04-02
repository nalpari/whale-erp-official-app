'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InviteForm01 from './invite/InviteForm01'
import InviteForm02 from './invite/InviteForm02'
import InviteForm03 from './invite/InviteForm03'
import InviteForm04 from './invite/InviteForm04'
import { useStaffInviteStore } from '@/store/useStaffInviteStore'
import { useCreateEmployee } from '@/hooks/queries/use-employee-queries'
import { getErrorMessage } from '@/lib/api'

export default function StaffInvite() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const { toPostRequest, reset } = useStaffInviteStore()
  const createMutation = useCreateEmployee()

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
    if (!request) {
      alert('필수 항목을 입력해주세요.')
      return
    }
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
            <button className="btn-form block blue" onClick={handleInvite}>
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
            disabled={step === 4}
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
