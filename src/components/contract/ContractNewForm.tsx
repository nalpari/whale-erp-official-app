'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useCreateContractHeader,
  useCreateContractWorkHours,
  useCreateContractSalaryInfo,
} from '@/hooks/queries/use-contract-queries'
import { getErrorMessage } from '@/lib/api'
import type {
  ContractHeaderCreateRequest,
  ContractWorkHour,
  ContractSalaryInfoCreateRequest,
  ContractClassificationType,
  SalaryCycle,
  SalaryMonth,
  DayType,
} from '@/types/contract'

const STEPS = ['계약정보', '근무시간', '급여정보'] as const

const JOB_OPTIONS = ['메뉴조리', '홀서빙', '고객응대', '업무보조', '매장청소'] as const

const DEFAULT_WORK_HOURS: ContractWorkHour[] = [
  { dayType: 'WEEKDAY' as DayType, isWork: true, isBreak: true, everySaturdayWork: false, everySundayWork: false, workStartTime: '09:00', workEndTime: '18:00', breakStartTime: '12:00', breakEndTime: '13:00' },
  { dayType: 'SATURDAY' as DayType, isWork: false, isBreak: false, everySaturdayWork: false, everySundayWork: false },
  { dayType: 'SUNDAY' as DayType, isWork: false, isBreak: false, everySaturdayWork: false, everySundayWork: false },
]

export default function ContractNewForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [contractId, setContractId] = useState<number | null>(null)

  // Mutations
  const createHeader = useCreateContractHeader()
  const createWorkHours = useCreateContractWorkHours()
  const createSalaryInfo = useCreateContractSalaryInfo()

  // Step 1: 계약정보
  const [employeeInfoId, setEmployeeInfoId] = useState<number | undefined>()
  const [memberId, setMemberId] = useState<number | undefined>()
  const [contractClassification, setContractClassification] = useState<ContractClassificationType>('CNTCFWK_001')
  const [salaryCycle, setSalaryCycle] = useState<SalaryCycle>('SLRCC_001')
  const [salaryMonth, setSalaryMonth] = useState<SalaryMonth>('SLRMO_002')
  const [salaryDay, setSalaryDay] = useState(10)
  const [contractStartDate, setContractStartDate] = useState('')
  const [contractEndDate, setContractEndDate] = useState('')
  const [contractDate, setContractDate] = useState('')
  const [jobDescriptions, setJobDescriptions] = useState<string[]>([])
  const [insuranceNP, setInsuranceNP] = useState(false)
  const [insuranceHI, setInsuranceHI] = useState(false)
  const [insuranceEI, setInsuranceEI] = useState(false)
  const [insuranceWC, setInsuranceWC] = useState(false)
  const [workContractFile, setWorkContractFile] = useState<File | undefined>()
  const [wageContractFile, setWageContractFile] = useState<File | undefined>()

  // Step 2: 근무시간
  const [workHours, setWorkHours] = useState<ContractWorkHour[]>(DEFAULT_WORK_HOURS)

  // Step 3: 급여정보
  const [annualAmount, setAnnualAmount] = useState(0)
  const [monthlyTotalAmount, setMonthlyTotalAmount] = useState(0)
  const [timelyAmount, setTimelyAmount] = useState(0)
  const [monthlyTime, setMonthlyTime] = useState(209)
  const [monthlyBaseAmount, setMonthlyBaseAmount] = useState(0)

  const isPending = createHeader.isPending || createWorkHours.isPending || createSalaryInfo.isPending

  const toggleJob = (job: string) => {
    setJobDescriptions((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job],
    )
  }

  // Step 1 저장
  const handleStep1 = async () => {
    if (!employeeInfoId || !memberId) {
      alert('직원을 선택해주세요.')
      return
    }
    if (!contractStartDate || !contractDate) {
      alert('계약기간과 계약일을 입력해주세요.')
      return
    }
    try {
      const request: ContractHeaderCreateRequest = {
        employeeInfoId,
        memberId,
        headOfficeOrganizationId: 0, // TODO: authStore.headOfficeId 또는 선택값
        contractType: 'ECNT_001',
        contractClassification,
        nationalPensionEnrolled: insuranceNP,
        healthInsuranceEnrolled: insuranceHI,
        employmentInsuranceEnrolled: insuranceEI,
        workersCompensationEnrolled: insuranceWC,
        salaryCycle,
        salaryMonth,
        salaryDay,
        contractStartDate,
        contractEndDate: contractEndDate || contractStartDate,
        contractDate,
        jobDescription: jobDescriptions.join(','),
      }
      const newContractId = await createHeader.mutateAsync({
        data: request,
        workContractFile,
        wageContractFile,
      })
      setContractId(newContractId)
      setStep(1)
    } catch (error) {
      alert(getErrorMessage(error, '계약정보 저장에 실패했습니다.'))
    }
  }

  // Step 2 저장
  const handleStep2 = async () => {
    if (!contractId) return
    try {
      await createWorkHours.mutateAsync({
        contractId,
        workHours,
      })
      setStep(2)
    } catch (error) {
      alert(getErrorMessage(error, '근무시간 저장에 실패했습니다.'))
    }
  }

  // Step 3 저장
  const handleStep3 = async () => {
    if (!contractId) return
    try {
      const request: ContractSalaryInfoCreateRequest = {
        contractId,
        annualAmount,
        monthlyTotalAmount,
        timelyAmount,
        monthlyTime,
        monthlyBaseAmount,
      }
      await createSalaryInfo.mutateAsync(request)
      alert('계약이 등록되었습니다.')
      router.push('/contract')
    } catch (error) {
      alert(getErrorMessage(error, '급여정보 저장에 실패했습니다.'))
    }
  }

  const updateWorkHour = (index: number, updates: Partial<ContractWorkHour>) => {
    setWorkHours((prev) => prev.map((wh, i) => (i === index ? { ...wh, ...updates } : wh)))
  }

  return (
    <>
      <div className="container sub">
        {/* Step indicator */}
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">
                  {STEPS.map((label, i) => (
                    <span key={label} style={{ color: step === i ? '#1a73e8' : '#999', marginRight: 12 }}>
                      {i + 1}. {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step 1: 계약정보 */}
              {step === 0 && (
                <>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">직원 선택 <span className="imp">*</span></div>
                      <div className="block">
                        <select
                          className="select-form"
                          value={employeeInfoId ?? ''}
                          onChange={(e) => {
                            setEmployeeInfoId(Number(e.target.value) || undefined)
                            setMemberId(Number(e.target.value) || undefined)
                          }}
                        >
                          <option value="">직원을 선택해주세요</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">계약기간 <span className="imp">*</span></div>
                      <div className="flex g6">
                        <div className="date-picker-custom">
                          <input type="date" className="date-picker-input" value={contractStartDate} onChange={(e) => setContractStartDate(e.target.value)} />
                        </div>
                        <span>~</span>
                        <div className="date-picker-custom">
                          <input type="date" className="date-picker-input" value={contractEndDate} onChange={(e) => setContractEndDate(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">업무내용</div>
                      <div className="flex g8" style={{ flexWrap: 'wrap' }}>
                        {JOB_OPTIONS.map((job) => (
                          <button key={job} className={`radio-btn block${jobDescriptions.includes(job) ? ' act' : ''}`} onClick={() => toggleJob(job)}>
                            {job}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">계약분류 <span className="imp">*</span></div>
                      <div className="block">
                        <select className="select-form" value={contractClassification} onChange={(e) => setContractClassification(e.target.value as ContractClassificationType)}>
                          <option value="CNTCFWK_001">포괄연봉제</option>
                          <option value="CNTCFWK_002">비포괄연봉제</option>
                          <option value="CNTCFWK_003">파트타임</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">4대보험</div>
                      <div className="flex g8" style={{ flexWrap: 'wrap' }}>
                        <button className={`radio-btn block${insuranceHI ? ' act' : ''}`} onClick={() => { setInsuranceHI(!insuranceHI); setInsuranceNP(!insuranceNP) }}>건강보험/국민연금</button>
                        <button className={`radio-btn block${insuranceEI ? ' act' : ''}`} onClick={() => { setInsuranceEI(!insuranceEI); setInsuranceWC(!insuranceWC) }}>고용보험/산재보험</button>
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">급여지급일 <span className="imp">*</span></div>
                      <div className="flex g8">
                        <select className="select-form" value={salaryCycle} onChange={(e) => setSalaryCycle(e.target.value as SalaryCycle)}>
                          <option value="SLRCC_001">월급</option>
                          <option value="SLRCC_002">시급</option>
                        </select>
                        <select className="select-form" value={salaryMonth} onChange={(e) => setSalaryMonth(e.target.value as SalaryMonth)}>
                          <option value="SLRMO_001">당월</option>
                          <option value="SLRMO_002">익월</option>
                        </select>
                        <select className="select-form" value={salaryDay} onChange={(e) => setSalaryDay(Number(e.target.value))}>
                          {[10, 15, 20, 25].map((d) => (
                            <option key={d} value={d}>{d}일</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">계약일 <span className="imp">*</span></div>
                      <div className="block">
                        <input type="date" className="input-frame" value={contractDate} onChange={(e) => setContractDate(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">근로계약서</div>
                      <div className="file-btn">
                        <input type="file" id="work-contract-new" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setWorkContractFile(e.target.files?.[0])} />
                        <label className="btn-form block grey" htmlFor="work-contract-new">
                          <i className="file-icon"></i><span>파일찾기</span>
                        </label>
                      </div>
                      {workContractFile && <div className="s-txt mt10">{workContractFile.name}</div>}
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">임금계약서</div>
                      <div className="file-btn">
                        <input type="file" id="wage-contract-new" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setWageContractFile(e.target.files?.[0])} />
                        <label className="btn-form block grey" htmlFor="wage-contract-new">
                          <i className="file-icon"></i><span>파일찾기</span>
                        </label>
                      </div>
                      {wageContractFile && <div className="s-txt mt10">{wageContractFile.name}</div>}
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: 근무시간 */}
              {step === 1 && (
                <>
                  {workHours.map((wh, index) => {
                    const dayLabel = wh.dayType === 'WEEKDAY' ? '평일' : wh.dayType === 'SATURDAY' ? '토요일' : '일요일'
                    return (
                      <div className="sub-item-bx" key={wh.dayType}>
                        <div className="data-filed">
                          <div className="filed-tit">{dayLabel}</div>
                          <div className="flex g8 mb8">
                            <button className={`radio-btn block${wh.isWork ? ' act' : ''}`} onClick={() => updateWorkHour(index, { isWork: true })}>근무</button>
                            <button className={`radio-btn block${!wh.isWork ? ' act' : ''}`} onClick={() => updateWorkHour(index, { isWork: false })}>미근무</button>
                          </div>
                          {wh.isWork && (
                            <>
                              <div className="flex g6 mb8">
                                <input type="time" className="input-frame" value={wh.workStartTime ?? ''} onChange={(e) => updateWorkHour(index, { workStartTime: e.target.value })} />
                                <span>~</span>
                                <input type="time" className="input-frame" value={wh.workEndTime ?? ''} onChange={(e) => updateWorkHour(index, { workEndTime: e.target.value })} />
                              </div>
                              <div className="flex g8 mb8">
                                <button className={`radio-btn block${wh.isBreak ? ' act' : ''}`} onClick={() => updateWorkHour(index, { isBreak: !wh.isBreak })}>휴게시간</button>
                              </div>
                              {wh.isBreak && (
                                <div className="flex g6 mb8">
                                  <input type="time" className="input-frame" value={wh.breakStartTime ?? ''} onChange={(e) => updateWorkHour(index, { breakStartTime: e.target.value })} />
                                  <span>~</span>
                                  <input type="time" className="input-frame" value={wh.breakEndTime ?? ''} onChange={(e) => updateWorkHour(index, { breakEndTime: e.target.value })} />
                                </div>
                              )}
                              {wh.dayType === 'SATURDAY' && (
                                <div className="flex g8 mb8">
                                  <button className={`radio-btn block${wh.everySaturdayWork ? ' act' : ''}`} onClick={() => updateWorkHour(index, { everySaturdayWork: true })}>매주</button>
                                  <button className={`radio-btn block${!wh.everySaturdayWork ? ' act' : ''}`} onClick={() => updateWorkHour(index, { everySaturdayWork: false })}>격주</button>
                                  {!wh.everySaturdayWork && (
                                    <input type="date" className="input-frame" value={wh.firstSaturdayWorkDay ?? ''} onChange={(e) => updateWorkHour(index, { firstSaturdayWorkDay: e.target.value })} />
                                  )}
                                </div>
                              )}
                              {wh.dayType === 'SUNDAY' && (
                                <div className="flex g8 mb8">
                                  <button className={`radio-btn block${wh.everySundayWork ? ' act' : ''}`} onClick={() => updateWorkHour(index, { everySundayWork: true })}>매주</button>
                                  <button className={`radio-btn block${!wh.everySundayWork ? ' act' : ''}`} onClick={() => updateWorkHour(index, { everySundayWork: false })}>격주</button>
                                  {!wh.everySundayWork && (
                                    <input type="date" className="input-frame" value={wh.firstSundayWorkDay ?? ''} onChange={(e) => updateWorkHour(index, { firstSundayWorkDay: e.target.value })} />
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </>
              )}

              {/* Step 3: 급여정보 */}
              {step === 2 && (
                <>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">통상시급 <span className="imp">*</span></div>
                      <div className="block">
                        <input type="number" className="input-frame" value={timelyAmount || ''} onChange={(e) => setTimelyAmount(Number(e.target.value))} placeholder="통상시급 입력" />
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">월 통상근로시간</div>
                      <div className="block">
                        <input type="number" className="input-frame" value={monthlyTime || ''} onChange={(e) => setMonthlyTime(Number(e.target.value))} />
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">월 기본급</div>
                      <div className="block">
                        <input type="number" className="input-frame" value={monthlyBaseAmount || ''} onChange={(e) => setMonthlyBaseAmount(Number(e.target.value))} />
                      </div>
                      <div className="s-txt mt10">
                        자동 계산: {(timelyAmount * monthlyTime).toLocaleString('ko-KR')}원
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">월급여 총액</div>
                      <div className="block">
                        <input type="number" className="input-frame" value={monthlyTotalAmount || ''} onChange={(e) => setMonthlyTotalAmount(Number(e.target.value))} />
                      </div>
                    </div>
                  </div>
                  <div className="sub-item-bx">
                    <div className="data-filed">
                      <div className="filed-tit">연봉 총액</div>
                      <div className="block">
                        <input type="number" className="input-frame" value={annualAmount || ''} onChange={(e) => setAnnualAmount(Number(e.target.value))} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        {step === 0 && (
          <button className="btn-form block blue" onClick={handleStep1} disabled={isPending}>
            {isPending ? '저장 중...' : '다음: 근무시간'}
          </button>
        )}
        {step === 1 && (
          <div className="flex g8">
            <button className="btn-form block sky" onClick={() => setStep(0)}>이전</button>
            <button className="btn-form block blue" onClick={handleStep2} disabled={isPending}>
              {isPending ? '저장 중...' : '다음: 급여정보'}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="flex g8">
            <button className="btn-form block sky" onClick={() => setStep(1)}>이전</button>
            <button className="btn-form block blue" onClick={handleStep3} disabled={isPending}>
              {isPending ? '저장 중...' : '등록 완료'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
