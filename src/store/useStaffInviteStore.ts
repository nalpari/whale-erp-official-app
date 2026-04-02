import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {
  WorkplaceType,
  ContractClassificationType,
  SalaryCycle,
  SalaryMonth,
  EmploymentContractWorkHourDto,
  PostEmployeeInfoRequest,
} from '@/types/employee'

// Step 1: 기본 정보
interface StepOneData {
  workplaceType: WorkplaceType
  headOfficeOrganizationId: number | null
  franchiseOrganizationId: number | null
  storeId: number | null
  employeeName: string
  mobilePhone: string
}

// Step 2: 계약 조건
interface StepTwoData {
  contractClassification: ContractClassificationType
  nationalPensionEnrolled: boolean
  healthInsuranceEnrolled: boolean
  employmentInsuranceEnrolled: boolean
  workersCompensationEnrolled: boolean
  salaryCycle: SalaryCycle
  salaryMonth: SalaryMonth
  salaryDay: number
  contractStartDate: string
  contractEndDate: string
  noEndDate: boolean
  jobDescription: string
  hireDate: string
}

// Step 4: 근무 시간
interface StepFourData {
  workHours: EmploymentContractWorkHourDto[]
}

interface StaffInviteState {
  stepOne: StepOneData
  stepTwo: StepTwoData
  stepFour: StepFourData

  setStepOne: (data: Partial<StepOneData>) => void
  setStepTwo: (data: Partial<StepTwoData>) => void
  setStepFour: (data: Partial<StepFourData>) => void
  reset: () => void
  toPostRequest: () => PostEmployeeInfoRequest | null
}

const DEFAULT_STEP_ONE: StepOneData = {
  workplaceType: 'HEAD_OFFICE',
  headOfficeOrganizationId: null,
  franchiseOrganizationId: null,
  storeId: null,
  employeeName: '',
  mobilePhone: '',
}

const DEFAULT_STEP_TWO: StepTwoData = {
  contractClassification: 'CNTCFWK_001',
  nationalPensionEnrolled: true,
  healthInsuranceEnrolled: true,
  employmentInsuranceEnrolled: true,
  workersCompensationEnrolled: true,
  salaryCycle: 'SLRCC_002',
  salaryMonth: 'SLRCF_002',
  salaryDay: 5,
  contractStartDate: '',
  contractEndDate: '',
  noEndDate: false,
  jobDescription: '',
  hireDate: '',
}

const DEFAULT_WORK_HOURS: EmploymentContractWorkHourDto[] = [
  { dayType: 'WEEKDAY', isWork: true, isBreak: true, workStartTime: '09:00:00', workEndTime: '18:00:00', breakStartTime: '12:00:00', breakEndTime: '13:00:00' },
  { dayType: 'SATURDAY', isWork: false, isBreak: false, everySaturdayWork: true },
  { dayType: 'SUNDAY', isWork: false, isBreak: false, everySundayWork: true },
]

const DEFAULT_STEP_FOUR: StepFourData = {
  workHours: DEFAULT_WORK_HOURS,
}

const NO_END_DATE_VALUE = '9999-12-31'

export const useStaffInviteStore = create<StaffInviteState>()(
  devtools(
    (set, get) => ({
      stepOne: { ...DEFAULT_STEP_ONE },
      stepTwo: { ...DEFAULT_STEP_TWO },
      stepFour: { ...DEFAULT_STEP_FOUR },

      setStepOne: (data) =>
        set(
          (state) => ({ stepOne: { ...state.stepOne, ...data } }),
          false,
          'setStepOne',
        ),

      setStepTwo: (data) =>
        set(
          (state) => ({ stepTwo: { ...state.stepTwo, ...data } }),
          false,
          'setStepTwo',
        ),

      setStepFour: (data) =>
        set(
          (state) => ({ stepFour: { ...state.stepFour, ...data } }),
          false,
          'setStepFour',
        ),

      reset: () =>
        set(
          {
            stepOne: { ...DEFAULT_STEP_ONE },
            stepTwo: { ...DEFAULT_STEP_TWO },
            stepFour: { ...DEFAULT_STEP_FOUR },
          },
          false,
          'reset',
        ),

      toPostRequest: (): PostEmployeeInfoRequest | null => {
        const { stepOne, stepTwo, stepFour } = get()

        // Step 1 필수: 본사, 직원명, 휴대폰
        if (!stepOne.headOfficeOrganizationId || !stepOne.employeeName || !stepOne.mobilePhone) {
          return null
        }
        // Step 2 필수: 입사일, 계약시작일, 업무내용
        if (!stepTwo.hireDate || !stepTwo.contractStartDate || !stepTwo.jobDescription) {
          return null
        }
        // Step 2: 계약기간 미정이 아닌 경우 종료일 필수
        if (!stepTwo.noEndDate && !stepTwo.contractEndDate) {
          return null
        }
        // Step 4: 평일/토/일 중 1개 이상 근무 설정 필수
        const hasWorkDay = stepFour.workHours.some((wh) => wh.isWork)
        if (!hasWorkDay) {
          return null
        }

        const contractEndDate = stepTwo.noEndDate
          ? NO_END_DATE_VALUE
          : stepTwo.contractEndDate

        return {
          workplaceType: stepOne.workplaceType,
          headOfficeOrganizationId: stepOne.headOfficeOrganizationId,
          franchiseOrganizationId: stepOne.franchiseOrganizationId,
          storeId: stepOne.storeId,
          employeeName: stepOne.employeeName,
          mobilePhone: stepOne.mobilePhone || null,
          hireDate: stepTwo.hireDate,
          contractClassification: stepTwo.contractClassification,
          nationalPensionEnrolled: stepTwo.nationalPensionEnrolled,
          healthInsuranceEnrolled: stepTwo.healthInsuranceEnrolled,
          employmentInsuranceEnrolled: stepTwo.employmentInsuranceEnrolled,
          workersCompensationEnrolled: stepTwo.workersCompensationEnrolled,
          salaryCycle: stepTwo.salaryCycle,
          salaryMonth: stepTwo.salaryMonth,
          salaryDay: stepTwo.salaryDay,
          contractStartDate: stepTwo.contractStartDate,
          contractEndDate,
          jobDescription: stepTwo.jobDescription || null,
          workHours: stepFour.workHours,
        }
      },
    }),
    { name: 'staff-invite-store' },
  ),
)
