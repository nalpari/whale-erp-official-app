'use client'
import { useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { useStaffInviteStore } from '@/store/useStaffInviteStore'
import { useCommonCodeHierarchy } from '@/hooks/queries/use-common-code-queries'
import type { ContractClassificationType, SalaryCycle, SalaryMonth } from '@/types/employee'

const SALARY_CYCLE_OPTIONS: { label: string; value: SalaryCycle }[] = [
  { label: '월급', value: 'SLRCC_001' },
  { label: '시급', value: 'SLRCC_002' },
]

const SALARY_MONTH_OPTIONS: { label: string; value: SalaryMonth }[] = [
  { label: '당월', value: 'SLRCF_001' },
  { label: '익월', value: 'SLRCF_002' },
]

const JOB_DESCRIPTION_OPTIONS = [
  '메뉴조리',
  '홀서빙',
  '고객응대',
  '업무보조',
  '매장청소',
]

export default function InviteForm02() {
  const stepTwo = useStaffInviteStore((s) => s.stepTwo)
  const setStepTwo = useStaffInviteStore((s) => s.setStepTwo)
  const { data: contractClassifications = [] } = useCommonCodeHierarchy('CNTCFWK')
  const [isCustomInput, setIsCustomInput] = useState(false)
  const [customText, setCustomText] = useState('')

  const selectedJobs = stepTwo.jobDescription
    ? stepTwo.jobDescription.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const toggleJobDescription = (job: string) => {
    const newJobs = selectedJobs.includes(job)
      ? selectedJobs.filter((j) => j !== job)
      : [...selectedJobs, job]
    setStepTwo({ jobDescription: newJobs.join(', ') })
  }

  const toggleCustomInput = () => {
    if (isCustomInput) {
      // 직접입력 → 버튼 선택 모드: 직접입력 텍스트 초기화 + jobDescription 클리어
      setIsCustomInput(false)
      setCustomText('')
      setStepTwo({ jobDescription: '' })
    } else {
      // 버튼 선택 → 직접입력 모드: 기존 버튼 선택값 초기화
      setIsCustomInput(true)
      setStepTwo({ jobDescription: '' })
    }
  }

  const handleCustomTextChange = (text: string) => {
    setCustomText(text)
    setStepTwo({ jobDescription: text })
  }

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-cont-tit-wrap">
          <div className="sub-cont-tit">근로/계약조건</div>
        </div>

        {/* 계약기간 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              계약기간 <span className="imp">*</span>
            </div>
            <div className="flex g8 mb8">
              <button
                className={`radio-btn block blue${!stepTwo.noEndDate ? ' act' : ''}`}
                onClick={() => setStepTwo({ noEndDate: false })}
              >
                계약기간 있음
              </button>
              <button
                className={`radio-btn block blue${stepTwo.noEndDate ? ' act' : ''}`}
                onClick={() => setStepTwo({ noEndDate: true, contractEndDate: '' })}
              >
                계약기간 미정
              </button>
            </div>
            <div className="flex g6">
              <div className="date-picker-custom">
                <input
                  type="date"
                  className="date-picker-input"
                  value={stepTwo.contractStartDate}
                  onChange={(e) => setStepTwo({ contractStartDate: e.target.value, hireDate: e.target.value })}
                />
              </div>
              <span>~</span>
              <div className="date-picker-custom">
                <input
                  type="date"
                  className="date-picker-input"
                  value={stepTwo.contractEndDate}
                  onChange={(e) => setStepTwo({ contractEndDate: e.target.value })}
                  disabled={stepTwo.noEndDate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 업무내용 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              업무내용 <span className="imp">*</span>
            </div>
            <div className="radio-btn-grid">
              {JOB_DESCRIPTION_OPTIONS.map((job) => (
                <button
                  key={job}
                  className={`radio-btn block blue${!isCustomInput && selectedJobs.includes(job) ? ' act' : ''}`}
                  onClick={() => { if (!isCustomInput) toggleJobDescription(job) }}
                >
                  {job}
                </button>
              ))}
              <button
                className={`radio-btn block blue${isCustomInput ? ' act' : ''}`}
                onClick={toggleCustomInput}
              >
                직접입력
              </button>
            </div>
            {isCustomInput && (
              <div className="block">
                <textarea
                  className="textarea-form"
                  placeholder="업무 내용을 직접 입력해주세요."
                  value={customText}
                  onChange={(e) => handleCustomTextChange(e.target.value)}
                ></textarea>
              </div>
            )}
          </div>
        </div>

        {/* 계약분류 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="tit-head">
              <div className="filed-tit">
                계약분류<span className="imp">*</span>
              </div>
              <div className="auto-right">
                <button className="tooltip-btn">
                  <span className="tooltip-icon" id="tooltip-btn-anchor"></span>
                  <Tooltip
                    className="tooltip-txt"
                    anchorSelect="#tooltip-btn-anchor"
                    opacity={1}
                  >
                    <div>
                      포괄연봉제: 연봉에 초과근무 수당 포함
                      <br />
                      비포괄연봉제: 실제 근무시간에 따라 수당 계산
                      <br />
                      파트타임: 시급제 계약
                    </div>
                  </Tooltip>
                </button>
              </div>
            </div>
            <div className="block">
              <select
                className="select-form"
                value={stepTwo.contractClassification}
                onChange={(e) => {
                  const val = e.target.value as ContractClassificationType
                  setStepTwo({
                    contractClassification: val,
                    salaryCycle: val === 'CNTCFWK_003' ? 'SLRCC_002' : 'SLRCC_001',
                  })
                }}
              >
                {contractClassifications.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4대보험 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              4대보험 가입여부<span className="imp"> *</span>
            </div>
            <div className="flex g8">
              <button
                className={`radio-btn block blue${stepTwo.healthInsuranceEnrolled && stepTwo.nationalPensionEnrolled ? ' act' : ''}`}
                onClick={() =>
                  setStepTwo({
                    healthInsuranceEnrolled: !stepTwo.healthInsuranceEnrolled,
                    nationalPensionEnrolled: !stepTwo.nationalPensionEnrolled,
                  })
                }
              >
                건강보험, 국민연금
              </button>
              <button
                className={`radio-btn block blue${stepTwo.employmentInsuranceEnrolled && stepTwo.workersCompensationEnrolled ? ' act' : ''}`}
                onClick={() =>
                  setStepTwo({
                    employmentInsuranceEnrolled: !stepTwo.employmentInsuranceEnrolled,
                    workersCompensationEnrolled: !stepTwo.workersCompensationEnrolled,
                  })
                }
              >
                고용보험, 산재보험
              </button>
            </div>
            <div className="s-txt mt10">
              ※ 적용할 항목 체크 시 급여에 반영됩니다.
            </div>
          </div>
        </div>

        {/* 급여 지급일 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="tit-head">
              <div className="filed-tit">
                급여 지급일 <span className="imp"> *</span>
              </div>
            </div>
            <div className="block mb8">
              <select
                className="select-form"
                value={stepTwo.salaryCycle}
                onChange={(e) =>
                  setStepTwo({ salaryCycle: e.target.value as SalaryCycle })
                }
                disabled
              >
                {SALARY_CYCLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="block mb8">
              <select
                className="select-form"
                value={stepTwo.salaryMonth}
                onChange={(e) =>
                  setStepTwo({ salaryMonth: e.target.value as SalaryMonth })
                }
              >
                {SALARY_MONTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="block">
              <select
                className="select-form"
                value={stepTwo.salaryDay}
                onChange={(e) =>
                  setStepTwo({ salaryDay: Number(e.target.value) })
                }
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}일
                  </option>
                ))}
              </select>
            </div>
            <div className="s-txt mt10">
              ※ 31일로 설정 시, 급여일은 매월 말일 적용됩니다.
            </div>
          </div>
        </div>

        {/* 입사일 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="filed-tit">
              입사일 <span className="imp">*</span>
            </div>
            <div className="block">
              <div className="date-picker-custom">
                <input
                  type="date"
                  className="date-picker-input"
                  value={stepTwo.hireDate}
                  onChange={(e) => setStepTwo({ hireDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
