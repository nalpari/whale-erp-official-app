"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useStaffInviteStore } from "@/store/useStaffInviteStore";
import {
  useUpdateContractSalaryInfo,
  useCreateContractSalaryInfo,
  useMinimumWage,
} from "@/hooks/queries/use-contract-queries";
import { getErrorMessage } from "@/lib/api";
import ContractOptionSheet from "@/components/bottomsheet/ContractOptionSheet";
import TaxExemptTable from "@/components/staff/employment/TaxExemptTable";
import type { ContractDetail, ContractBonus } from "@/types/contract";
import type { ContractClassificationType } from "@/types/employee";

// 계약분류 코드 상수
const CONTRACT_COMPREHENSIVE = "CNTCFWK_001" as const; // 포괄연봉제
const CONTRACT_NON_COMPREHENSIVE = "CNTCFWK_002" as const; // 비포괄연봉제
const CONTRACT_PART_TIME = "CNTCFWK_003" as const; // 파트타임

interface EmploymentContractProps {
  initialData?: ContractDetail;
}

export default function EmploymentContract({
  initialData,
}: EmploymentContractProps) {
  const router = useRouter();
  const setContractOptionSheet = useBottomSheetControler(
    (state) => state.setContractOptionSheet,
  );

  const salary = initialData?.salaryInfo;
  // 수정 경로: 기존 급여정보가 있으면 UPDATE, 없으면 CREATE
  const isContractPath = !!initialData?.id;
  const isEditMode = isContractPath && !!salary?.id;

  // 계약분류 결정: 수정 경로 -> initialData, 초대 경로 -> store
  const inviteContractClassification = useStaffInviteStore(
    (s) => s.stepTwo.contractClassification,
  );
  const contractClassification: ContractClassificationType = isContractPath
    ? (initialData?.employmentContractHeader?.contractClassification ??
      CONTRACT_COMPREHENSIVE)
    : inviteContractClassification;

  const isComprehensive = contractClassification === CONTRACT_COMPREHENSIVE;
  const isNonComprehensive =
    contractClassification === CONTRACT_NON_COMPREHENSIVE;
  const isPartTime = contractClassification === CONTRACT_PART_TIME;

  // 초대 경로: staffInvite 스토어에서 급여 데이터 읽기
  const inviteSalary = useStaffInviteStore((s) => s.stepThreeSalary);

  // 최저시급 조회
  const currentYear = new Date().getFullYear();
  const { data: minWageData } = useMinimumWage(currentYear);
  const minimumWage = minWageData?.minimumWage ?? 0;



  // ContractOptionSheet 값 (계약년도, 통상시급, 주단위 근무시간)
  const [year, setYear] = useState<number>(currentYear);
  const [timelyAmount, setTimelyAmount] = useState<number>(
    salary?.timelySalary ?? (isEditMode ? 0 : inviteSalary.timelyAmount),
  );
  const [weeklyHours, setWeeklyHours] = useState<number>(
    isEditMode ? 40 : inviteSalary.weeklyHours,
  );

  // 통상시급이 0이면 최저시급을 표시/계산에 사용
  const activeTimelyAmount = timelyAmount || minimumWage;

  // 근무시간 입력값
  const [monthlyTime, setMonthlyTime] = useState<number>(
    salary?.monthlyTime ?? (isEditMode ? 0 : inviteSalary.monthlyTime),
  );
  const [overtimeTime, setOvertimeTime] = useState<number>(
    salary?.monthlyOvertimeAllowanceTime ??
      (isEditMode ? 0 : inviteSalary.overtimeTime),
  );
  const [nightTime, setNightTime] = useState<number>(
    salary?.monthlyNightAllowanceTime ??
      (isEditMode ? 0 : inviteSalary.nightTime),
  );
  const [holidayTime, setHolidayTime] = useState<number>(
    salary?.monthlyHolidayAllowanceTime ??
      (isEditMode ? 0 : inviteSalary.holidayTime),
  );
  const [addHolidayTime, setAddHolidayTime] = useState<number>(
    salary?.monthlyAddHolidayAllowanceTime ??
      (isEditMode ? 0 : inviteSalary.addHolidayTime),
  );

  // 비과세 항목
  const [mealAllowance, setMealAllowance] = useState<number>(
    salary?.mealAllowance ?? (isEditMode ? 0 : inviteSalary.mealAllowance),
  );
  const [mealIncluded, setMealIncluded] = useState<boolean>(
    isEditMode ? (salary?.mealAllowance ?? 0) > 0 : inviteSalary.mealIncluded,
  );
  const [vehicleAllowance, setVehicleAllowance] = useState<number>(
    salary?.vehicleAllowance ??
      (isEditMode ? 0 : inviteSalary.vehicleAllowance),
  );
  const [vehicleIncluded, setVehicleIncluded] = useState<boolean>(
    isEditMode
      ? (salary?.vehicleAllowance ?? 0) > 0
      : inviteSalary.vehicleIncluded,
  );
  const [childcareAllowance, setChildcareAllowance] = useState<number>(
    salary?.childcareAllowance ??
      (isEditMode ? 0 : inviteSalary.childcareAllowance),
  );
  const [childcareIncluded, setChildcareIncluded] = useState<boolean>(
    isEditMode
      ? (salary?.childcareAllowance ?? 0) > 0
      : inviteSalary.childcareIncluded,
  );

  // 추가근무시급 (비포괄연봉제 / 파트타임) -- 초기값은 최저시급
  const [weekdayHourlyWage, setWeekdayHourlyWage] = useState<number>(
    salary?.weekDayAllowanceAmount ??
      (isEditMode ? 0 : inviteSalary.weekdayHourlyWage),
  );
  const [overtimeHourlyWage, setOvertimeHourlyWage] = useState<number>(
    salary?.overtimeDayAllowanceAmount ??
      (isEditMode ? 0 : inviteSalary.overtimeHourlyWage),
  );
  const [holidayHourlyWage, setHolidayHourlyWage] = useState<number>(
    salary?.holidayAllowanceTimeAmount ??
      (isEditMode ? 0 : inviteSalary.holidayHourlyWage),
  );

  // 시급 활성값: 0이면 최저시급 사용
  const activeWeekdayWage = weekdayHourlyWage || minimumWage;
  const activeOvertimeWage = overtimeHourlyWage || minimumWage;
  const activeHolidayWage = holidayHourlyWage || minimumWage;

  // 상여금 상태
  const [bonuses, setBonuses] = useState<ContractBonus[]>(
    salary?.bonuses ?? (isEditMode ? [] : inviteSalary.bonuses),
  );
  const { mutateAsync: updateSalary, isPending: isUpdating } =
    useUpdateContractSalaryInfo();
  const { mutateAsync: createSalary, isPending: isCreating } =
    useCreateContractSalaryInfo();
  const isSaving = isUpdating || isCreating;

  // 파생값 계산
  const baseAmount = activeTimelyAmount * monthlyTime;

  // 포괄연봉제: 모든 수당 포함
  const overtimeAmount = activeTimelyAmount * 1.5 * overtimeTime;
  const nightAmount = activeTimelyAmount * 0.5 * nightTime;
  const holidayAmount = activeTimelyAmount * 1.5 * holidayTime;
  const addHolidayAmount = activeTimelyAmount * 2.0 * addHolidayTime;

  const nonTaxTotal =
    (mealIncluded ? mealAllowance : 0) +
    (vehicleIncluded ? vehicleAllowance : 0) +
    (childcareIncluded ? childcareAllowance : 0);

  // 월급여 계산: 계약분류별 차이
  const calcMonthlyTotal = () => {
    if (isComprehensive) {
      return Math.round(
        baseAmount +
          overtimeAmount +
          nightAmount +
          holidayAmount +
          addHolidayAmount +
          nonTaxTotal,
      );
    }
    if (isNonComprehensive) {
      return Math.round(baseAmount + nonTaxTotal);
    }
    return 0;
  };

  const monthlyTotalAmount = calcMonthlyTotal();
  const annualAmount = monthlyTotalAmount * 12;

  const formatAmount = (val: number) => val.toLocaleString("ko-KR");

  // 비과세 항목 핸들러
  const handleTaxExemptChange = (field: string, value: number | boolean) => {
    switch (field) {
      case "mealAllowance":
        setMealAllowance(value as number);
        break;
      case "mealIncluded":
        setMealIncluded(value as boolean);
        break;
      case "vehicleAllowance":
        setVehicleAllowance(value as number);
        break;
      case "vehicleIncluded":
        setVehicleIncluded(value as boolean);
        break;
      case "childcareAllowance":
        setChildcareAllowance(value as number);
        break;
      case "childcareIncluded":
        setChildcareIncluded(value as boolean);
        break;
    }
  };

  // 공통 급여 데이터 빌드
  const buildSalaryData = () => ({
    annualAmount,
    monthlyTotalAmount,
    timelyAmount: activeTimelyAmount,
    monthlyTime,
    monthlyBaseAmount: activeTimelyAmount * monthlyTime,
    // 포괄연봉제만 연장/야간/휴일 시간 포함
    ...(isComprehensive && {
      monthlyOvertimeAllowanceTime: overtimeTime,
      monthlyOvertimeAllowanceAmount: Math.round(
        activeTimelyAmount * 1.5 * overtimeTime,
      ),
      monthlyNightAllowanceTime: nightTime,
      monthlyNightAllowanceAmount: Math.round(
        activeTimelyAmount * 0.5 * nightTime,
      ),
      monthlyHolidayAllowanceTime: holidayTime,
      monthlyHolidayAllowanceAmount: Math.round(
        activeTimelyAmount * 1.5 * holidayTime,
      ),
      monthlyAddHolidayAllowanceTime: addHolidayTime,
      monthlyAddHolidayAllowanceAmount: Math.round(
        activeTimelyAmount * 2.0 * addHolidayTime,
      ),
    }),
    // 비과세 (포괄/비포괄만)
    ...(!isPartTime && {
      mealAllowanceAmount: mealIncluded ? mealAllowance : 0,
      vehicleAllowanceAmount: vehicleIncluded ? vehicleAllowance : 0,
      childcareAllowanceAmount: childcareIncluded ? childcareAllowance : 0,
    }),
    // 추가근무시급 (비포괄/파트타임만)
    ...(!isComprehensive && {
      weekDayAllowanceAmount: activeWeekdayWage,
      overtimeDayAllowanceAmount: activeOvertimeWage,
      holidayAllowanceTimeAmount: activeHolidayWage,
    }),
    // 상여금
    bonuses: bonuses.map((b) => ({
      bonusCode: b.bonusCode,
      bonusType: b.bonusType,
      amount: b.amount,
      memo: b.memo,
    })),
  });

  // 저장 핸들러
  const handleSave = async () => {
    if (isContractPath) {
      // 계약 수정 경로: API 호출
      const contractId = initialData?.id;
      if (contractId == null) return;

      try {
        if (isEditMode) {
          // 기존 급여정보 UPDATE
          const salaryId = salary?.id;
          if (salaryId == null) return;
          await updateSalary({
            id: salaryId,
            data: { contractId, id: salaryId, ...buildSalaryData() },
          });
        } else {
          // 급여정보 신규 CREATE
          await createSalary({ contractId, ...buildSalaryData() });
        }
        alert("저장되었습니다.");
        router.back();
      } catch (error) {
        alert(getErrorMessage(error, "저장에 실패했습니다."));
      }
    } else {
      // 직원 초대 경로: 급여 데이터를 스토어에 저장 후 이전 화면으로 복귀
      useStaffInviteStore.getState().setStepThreeSalary({
        timelyAmount,
        weeklyHours,
        monthlyTime,
        overtimeTime,
        nightTime,
        holidayTime,
        addHolidayTime,
        mealAllowance,
        mealIncluded,
        vehicleAllowance,
        vehicleIncluded,
        childcareAllowance,
        childcareIncluded,
        weekdayHourlyWage,
        overtimeHourlyWage,
        holidayHourlyWage,
        bonuses,
      });
      router.back();
    }
  };

  const handleOptionChange = (values: {
    year: number;
    timelyAmount: number;
    weeklyHours: number;
  }) => {
    setYear(values.year);
    setTimelyAmount(values.timelyAmount);
    setWeeklyHours(values.weeklyHours);
  };

  const contractClassificationName =
    initialData?.employmentContractHeader?.contractClassificationName ?? "";
  const employeeName = initialData?.employeeInfoName ?? "-";

  // 총 월간 근무시간 (포괄연봉제만)
  const totalMonthlyTime =
    monthlyTime + overtimeTime + nightTime + holidayTime + addHolidayTime;
  const isOver52 = weeklyHours > 52;

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              {/* 헤더: 포괄/비포괄만 표시 (파트타임은 ContractOptionSheet 불필요) */}
              {!isPartTime && (
                <button
                  className="employment-header"
                  onClick={() => setContractOptionSheet(true)}
                >
                  <div className="employment-icon">
                    <Image
                      src="/assets/images/layout/avatar01.svg"
                      alt="employment-icon"
                      width={46}
                      height={46}
                    />
                  </div>
                  <div className="employment-info">
                    <div className="employment-name">
                      <span className="name">{employeeName}</span>
                      {contractClassificationName && (
                        <span className="badge d-org">
                          {contractClassificationName}
                        </span>
                      )}
                    </div>
                    <div className="employment-job">
                      계약년도/통상시급/한주근무시간 설정
                    </div>
                    <ul className="employment-contract">
                      <li className="employ-cont-item">{year}년</li>
                      <li className="employ-cont-item">
                        {formatAmount(activeTimelyAmount)}원
                      </li>
                      <li className="employ-cont-item">{weeklyHours}시간</li>
                    </ul>
                  </div>
                  <div className="employment-btn-wrap">
                    <div className="employment-btn" />
                  </div>
                </button>
              )}

              {/* ========== 포괄연봉제 (CNTCFWK_001) ========== */}
              {isComprehensive && (
                <ComprehensiveTable
                  weeklyHours={weeklyHours}
                  activeTimelyAmount={activeTimelyAmount}
                  monthlyTime={monthlyTime}
                  overtimeTime={overtimeTime}
                  nightTime={nightTime}
                  holidayTime={holidayTime}
                  addHolidayTime={addHolidayTime}
                  totalMonthlyTime={totalMonthlyTime}
                  isOver52={isOver52}
                  formatAmount={formatAmount}
                  onMonthlyTimeChange={setMonthlyTime}
                  onOvertimeTimeChange={setOvertimeTime}
                  onNightTimeChange={setNightTime}
                  onHolidayTimeChange={setHolidayTime}
                  onAddHolidayTimeChange={setAddHolidayTime}
                />
              )}

              {/* ========== 비포괄연봉제 (CNTCFWK_002) ========== */}
              {isNonComprehensive && (
                <NonComprehensiveTable
                  weeklyHours={weeklyHours}
                  activeTimelyAmount={activeTimelyAmount}
                  monthlyTime={monthlyTime}
                  formatAmount={formatAmount}
                  onMonthlyTimeChange={setMonthlyTime}
                  weekdayHourlyWage={weekdayHourlyWage}
                  overtimeHourlyWage={overtimeHourlyWage}
                  holidayHourlyWage={holidayHourlyWage}
                  minimumWage={minimumWage}
                  onWeekdayWageChange={setWeekdayHourlyWage}
                  onOvertimeWageChange={setOvertimeHourlyWage}
                  onHolidayWageChange={setHolidayHourlyWage}
                />
              )}

              {/* 비과세 항목: 포괄 + 비포괄 공통 */}
              {!isPartTime && (
                <TaxExemptTable
                  data={{
                    mealAllowance,
                    mealIncluded,
                    vehicleAllowance,
                    vehicleIncluded,
                    childcareAllowance,
                    childcareIncluded,
                  }}
                  onChange={handleTaxExemptChange}
                />
              )}

              {/* ========== 파트타임 (CNTCFWK_003) ========== */}
              {isPartTime && (
                <PartTimeTable
                  weekdayHourlyWage={weekdayHourlyWage}
                  overtimeHourlyWage={overtimeHourlyWage}
                  holidayHourlyWage={holidayHourlyWage}
                  minimumWage={minimumWage}
                  onWeekdayWageChange={setWeekdayHourlyWage}
                  onOvertimeWageChange={setOvertimeHourlyWage}
                  onHolidayWageChange={setHolidayHourlyWage}
                />
              )}

              {/* 연봉총액/월급여총액: 포괄 + 비포괄만 하단 표시 */}
              {!isPartTime && (
                <div className="sub-item-bx">
                  <div className="total-pay-wrap">
                    <div className="total-pay-bx year">
                      <div className="total-pay-tit">연봉 총액</div>
                      <div className="total-pay-val">
                        {formatAmount(annualAmount)}원
                      </div>
                    </div>
                    <div className="total-pay-bx">
                      <div className="total-pay-tit">월급여 총액</div>
                      <div className="total-pay-val">
                        {formatAmount(monthlyTotalAmount)}원
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 하단 버튼 */}
              <div className="flex g8">
                {!isPartTime && (
                  <button
                    className="btn-form sky block brd"
                    onClick={() => {
                      setTimelyAmount(0)
                      setWeeklyHours(40)
                      setMonthlyTime(0)
                      setOvertimeTime(0)
                      setNightTime(0)
                      setHolidayTime(0)
                      setAddHolidayTime(0)
                      setMealAllowance(0)
                      setMealIncluded(false)
                      setVehicleAllowance(0)
                      setVehicleIncluded(false)
                      setChildcareAllowance(0)
                      setChildcareIncluded(false)
                      setWeekdayHourlyWage(0)
                      setOvertimeHourlyWage(0)
                      setHolidayHourlyWage(0)
                    }}
                  >
                    다시계산
                  </button>
                )}
                {isPartTime && (
                  <button
                    className="btn-form sky block brd"
                    onClick={() => {
                      setWeekdayHourlyWage(0);
                      setOvertimeHourlyWage(0);
                      setHolidayHourlyWage(0);
                      setBonuses([]);
                    }}
                  >
                    초기화
                  </button>
                )}
                <button
                  className="btn-form blue block"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "저장 중..." : isPartTime ? "설정 완료" : "저장"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ContractOptionSheet: 포괄/비포괄만 */}
      {!isPartTime && (
        <ContractOptionSheet
          year={year}
          timelyAmount={activeTimelyAmount}
          weeklyHours={weeklyHours}
          onChange={handleOptionChange}
        />
      )}

    </>
  );
}

// ========== 포괄연봉제 테이블 ==========
interface ComprehensiveTableProps {
  weeklyHours: number;
  activeTimelyAmount: number;
  monthlyTime: number;
  overtimeTime: number;
  nightTime: number;
  holidayTime: number;
  addHolidayTime: number;
  totalMonthlyTime: number;
  isOver52: boolean;
  formatAmount: (val: number) => string;
  onMonthlyTimeChange: (val: number) => void;
  onOvertimeTimeChange: (val: number) => void;
  onNightTimeChange: (val: number) => void;
  onHolidayTimeChange: (val: number) => void;
  onAddHolidayTimeChange: (val: number) => void;
}

function ComprehensiveTable({
  weeklyHours,
  activeTimelyAmount,
  monthlyTime,
  overtimeTime,
  nightTime,
  holidayTime,
  addHolidayTime,
  totalMonthlyTime,
  isOver52,
  formatAmount,
  onMonthlyTimeChange,
  onOvertimeTimeChange,
  onNightTimeChange,
  onHolidayTimeChange,
  onAddHolidayTimeChange,
}: ComprehensiveTableProps) {
  const handleNum =
    (setter: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(Math.max(0, Number(e.target.value) || 0));

  return (
    <div className="sub-item-bx">
      <table className="employ-table">
        <colgroup>
          <col />
          <col width="50px" />
          <col width="90px" />
        </colgroup>
        <thead>
          <tr>
            <th>
              <div className="tip-th flex g4">
                <span>구분</span>
                <button className="tooltip-btn">
                  <span className="tooltip-icon" id="tooltip-comp" />
                  <Tooltip
                    className="tooltip-txt"
                    anchorSelect="#tooltip-comp"
                    opacity={1}
                  >
                    <div>
                      포괄연봉제는 기본급과 고정 연장/야간/휴일 수당을 포함하여
                      연봉을 산정합니다.
                    </div>
                  </Tooltip>
                </button>
              </div>
            </th>
            <th>시간</th>
            <th>금액(원)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="tit">한주 근무시간</td>
            <td>{weeklyHours}</td>
            <td>{formatAmount(activeTimelyAmount * weeklyHours)}</td>
          </tr>
          <tr>
            <td className="tit">기본급</td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  min="0"
                  value={monthlyTime || ""}
                  placeholder="0"
                  onChange={handleNum(onMonthlyTimeChange)}
                />
              </div>
            </td>
            <td>{formatAmount(activeTimelyAmount * monthlyTime)}</td>
          </tr>
          <tr>
            <td className="tit">연장수당</td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  min="0"
                  value={overtimeTime || ""}
                  placeholder="0"
                  onChange={handleNum(onOvertimeTimeChange)}
                />
              </div>
            </td>
            <td>
              {formatAmount(
                Math.round(activeTimelyAmount * 1.5 * overtimeTime),
              )}
            </td>
          </tr>
          <tr>
            <td className="tit">야간수당</td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  min="0"
                  value={nightTime || ""}
                  placeholder="0"
                  onChange={handleNum(onNightTimeChange)}
                />
              </div>
            </td>
            <td>
              {formatAmount(Math.round(activeTimelyAmount * 0.5 * nightTime))}
            </td>
          </tr>
          <tr>
            <td className="tit">휴일근무수당</td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  min="0"
                  value={holidayTime || ""}
                  placeholder="0"
                  onChange={handleNum(onHolidayTimeChange)}
                />
              </div>
            </td>
            <td>
              {formatAmount(Math.round(activeTimelyAmount * 1.5 * holidayTime))}
            </td>
          </tr>
          <tr>
            <td className="tit">추가휴일근무수당</td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  min="0"
                  value={addHolidayTime || ""}
                  placeholder="0"
                  onChange={handleNum(onAddHolidayTimeChange)}
                />
              </div>
            </td>
            <td>
              {formatAmount(
                Math.round(activeTimelyAmount * 2.0 * addHolidayTime),
              )}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>월간 총 근무 시간</td>
            <td className="al-r">{totalMonthlyTime}</td>
            <td className={isOver52 ? "over-txt" : ""}>
              {isOver52 ? "주52시간 초과" : ""}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ========== 비포괄연봉제 테이블 ==========
interface NonComprehensiveTableProps {
  weeklyHours: number;
  activeTimelyAmount: number;
  monthlyTime: number;
  formatAmount: (val: number) => string;
  onMonthlyTimeChange: (val: number) => void;
  weekdayHourlyWage: number;
  overtimeHourlyWage: number;
  holidayHourlyWage: number;
  minimumWage: number;
  onWeekdayWageChange: (val: number) => void;
  onOvertimeWageChange: (val: number) => void;
  onHolidayWageChange: (val: number) => void;
}

function NonComprehensiveTable({
  weeklyHours,
  activeTimelyAmount,
  monthlyTime,
  formatAmount,
  onMonthlyTimeChange,
  weekdayHourlyWage,
  overtimeHourlyWage,
  holidayHourlyWage,
  minimumWage,
  onWeekdayWageChange,
  onOvertimeWageChange,
  onHolidayWageChange,
}: NonComprehensiveTableProps) {
  const handleNum =
    (setter: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(Math.max(0, Number(e.target.value) || 0));

  return (
    <>
      {/* 기본급 테이블 (시간+금액) */}
      <div className="sub-item-bx">
        <table className="employ-table">
          <colgroup>
            <col />
            <col width="50px" />
            <col width="90px" />
          </colgroup>
          <thead>
            <tr>
              <th>
                <div className="tip-th flex g4">
                  <span>구분</span>
                  <button className="tooltip-btn">
                    <span className="tooltip-icon" id="tooltip-noncomp" />
                    <Tooltip
                      className="tooltip-txt"
                      anchorSelect="#tooltip-noncomp"
                      opacity={1}
                    >
                      <div>
                        비포괄연봉제는 기본급만 포함하며, 추가근무는 실제 근무
                        시 별도 정산합니다.
                      </div>
                    </Tooltip>
                  </button>
                </div>
              </th>
              <th>시간</th>
              <th>금액(원)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tit">한주 근무시간</td>
              <td>{weeklyHours}</td>
              <td>{formatAmount(activeTimelyAmount * weeklyHours)}</td>
            </tr>
            <tr>
              <td className="tit">기본급</td>
              <td>
                <div className="block">
                  <input
                    type="number"
                    className="employ-input"
                    min="0"
                    value={monthlyTime || ""}
                    placeholder="0"
                    onChange={handleNum(onMonthlyTimeChange)}
                  />
                </div>
              </td>
              <td>{formatAmount(activeTimelyAmount * monthlyTime)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 추가근무시급 테이블 (금액만) */}
      <div className="sub-item-bx">
        <table className="employ-table">
          <colgroup>
            <col />
            <col width="105px" />
          </colgroup>
          <thead>
            <tr>
              <th>
                <div className="tip-th flex g4">
                  <span>추가근무시급</span>
                </div>
              </th>
              <th>금액(원)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tit">평일시급</td>
              <td>
                <div className="block">
                  <input
                    type="number"
                    className="employ-input"
                    min="0"
                    value={weekdayHourlyWage || ""}
                    placeholder={String(minimumWage || 0)}
                    onChange={handleNum(onWeekdayWageChange)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="tit">연장근무시급</td>
              <td>
                <div className="block">
                  <input
                    type="number"
                    className="employ-input"
                    min="0"
                    value={overtimeHourlyWage || ""}
                    placeholder={String(minimumWage || 0)}
                    onChange={handleNum(onOvertimeWageChange)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="tit">휴일근무시급</td>
              <td>
                <div className="block">
                  <input
                    type="number"
                    className="employ-input"
                    min="0"
                    value={holidayHourlyWage || ""}
                    placeholder={String(minimumWage || 0)}
                    onChange={handleNum(onHolidayWageChange)}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

// ========== 파트타임 시급 테이블 ==========
interface PartTimeTableProps {
  weekdayHourlyWage: number;
  overtimeHourlyWage: number;
  holidayHourlyWage: number;
  minimumWage: number;
  onWeekdayWageChange: (val: number) => void;
  onOvertimeWageChange: (val: number) => void;
  onHolidayWageChange: (val: number) => void;
}

function PartTimeTable({
  weekdayHourlyWage,
  overtimeHourlyWage,
  holidayHourlyWage,
  minimumWage,
  onWeekdayWageChange,
  onOvertimeWageChange,
  onHolidayWageChange,
}: PartTimeTableProps) {
  const handleNum =
    (setter: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(Math.max(0, Number(e.target.value) || 0));

  return (
    <div className="sub-item-bx">
      <table className="employ-table">
        <colgroup>
          <col />
          <col width="105px" />
        </colgroup>
        <thead>
          <tr>
            <th>
              <div className="tip-th flex g4">
                <span>시급</span>
              </div>
            </th>
            <th>금액(원)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="tit">
              평일시급 <span className="imp">*</span>
            </td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  min="0"
                  value={weekdayHourlyWage || ""}
                  placeholder={String(minimumWage || 0)}
                  onChange={handleNum(onWeekdayWageChange)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="tit">
              연장근무시급 <span className="imp">*</span>
            </td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  min="0"
                  value={overtimeHourlyWage || ""}
                  placeholder={String(minimumWage || 0)}
                  onChange={handleNum(onOvertimeWageChange)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="tit">
              휴일근무시급 <span className="imp">*</span>
            </td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  min="0"
                  value={holidayHourlyWage || ""}
                  placeholder={String(minimumWage || 0)}
                  onChange={handleNum(onHolidayWageChange)}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
