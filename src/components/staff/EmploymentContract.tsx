"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useUpdateContractSalaryInfo } from "@/hooks/queries/use-contract-queries";
import { getErrorMessage } from "@/lib/api";
import ContractOptionSheet from "@/components/bottomsheet/ContractOptionSheet";
import type { ContractDetail } from "@/types/contract";

interface EmploymentContractProps {
  initialData?: ContractDetail;
}

export default function EmploymentContract({
  initialData,
}: EmploymentContractProps) {
  const router = useRouter();
  const setContractOptionSheet = useBottomSheetControler(
    (state) => state.setContractOptionSheet
  );

  const salary = initialData?.salaryInfo;

  // ContractOptionSheet 값 (계약년도, 통상시급, 주단위 근무시간)
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [timelyAmount, setTimelyAmount] = useState<number>(
    salary?.timelySalary ?? 0
  );
  const [weeklyHours, setWeeklyHours] = useState<number>(40);

  // 근무시간 입력값
  const [monthlyTime, setMonthlyTime] = useState<number>(
    salary?.monthlyTime ?? 0
  );
  const [overtimeTime, setOvertimeTime] = useState<number>(
    salary?.monthlyOvertimeAllowanceTime ?? 0
  );
  const [nightTime, setNightTime] = useState<number>(
    salary?.monthlyNightAllowanceTime ?? 0
  );
  const [holidayTime, setHolidayTime] = useState<number>(
    salary?.monthlyHolidayAllowanceTime ?? 0
  );
  const [addHolidayTime, setAddHolidayTime] = useState<number>(
    salary?.monthlyAddHolidayAllowanceTime ?? 0
  );

  // 비과세 항목
  const [mealAllowance, setMealAllowance] = useState<number>(
    salary?.mealAllowanceAmount ?? 0
  );
  const [mealIncluded, setMealIncluded] = useState<boolean>(
    (salary?.mealAllowanceAmount ?? 0) > 0
  );
  const [vehicleAllowance, setVehicleAllowance] = useState<number>(
    salary?.vehicleAllowanceAmount ?? 0
  );
  const [vehicleIncluded, setVehicleIncluded] = useState<boolean>(
    (salary?.vehicleAllowanceAmount ?? 0) > 0
  );
  const [childcareAllowance, setChildcareAllowance] = useState<number>(
    salary?.childcareAllowanceAmount ?? 0
  );
  const [childcareIncluded, setChildcareIncluded] = useState<boolean>(
    (salary?.childcareAllowanceAmount ?? 0) > 0
  );

  // 계산된 금액
  const [annualAmount, setAnnualAmount] = useState<number>(
    salary?.annualSalary ?? 0
  );
  const [monthlyTotalAmount, setMonthlyTotalAmount] = useState<number>(
    salary?.monthlyTotalSalary ?? 0
  );

  const updateSalaryInfo = useUpdateContractSalaryInfo();

  // 다시계산: timelyAmount와 입력된 시간으로 월급여/연봉 재계산
  const handleRecalculate = () => {
    const baseAmount = timelyAmount * monthlyTime;
    const overtimeAmount = timelyAmount * 1.5 * overtimeTime;
    const nightAmount = timelyAmount * 0.5 * nightTime;
    const holidayAmount = timelyAmount * 1.5 * holidayTime;
    const addHolidayAmount = timelyAmount * 2.0 * addHolidayTime;

    const nonTaxTotal =
      (mealIncluded ? mealAllowance : 0) +
      (vehicleIncluded ? vehicleAllowance : 0) +
      (childcareIncluded ? childcareAllowance : 0);

    const monthly =
      baseAmount +
      overtimeAmount +
      nightAmount +
      holidayAmount +
      addHolidayAmount +
      nonTaxTotal;

    const annual = monthly * 12;

    setMonthlyTotalAmount(Math.round(monthly));
    setAnnualAmount(Math.round(annual));
  };

  const handleSave = async () => {
    if (!initialData?.id) return;
    if (!salary?.id) {
      alert("급여정보 ID가 없습니다.");
      return;
    }

    try {
      await updateSalaryInfo.mutateAsync({
        id: salary.id,
        data: {
          contractId: initialData.id,
          id: salary.id,
          annualAmount,
          monthlyTotalAmount,
          timelyAmount,
          monthlyTime,
          monthlyBaseAmount: timelyAmount * monthlyTime,
          monthlyOvertimeAllowanceTime: overtimeTime,
          monthlyOvertimeAllowanceAmount:
            Math.round(timelyAmount * 1.5 * overtimeTime),
          monthlyNightAllowanceTime: nightTime,
          monthlyNightAllowanceAmount:
            Math.round(timelyAmount * 0.5 * nightTime),
          monthlyHolidayAllowanceTime: holidayTime,
          monthlyHolidayAllowanceAmount:
            Math.round(timelyAmount * 1.5 * holidayTime),
          monthlyAddHolidayAllowanceTime: addHolidayTime,
          monthlyAddHolidayAllowanceAmount:
            Math.round(timelyAmount * 2.0 * addHolidayTime),
          mealAllowanceAmount: mealIncluded ? mealAllowance : 0,
          vehicleAllowanceAmount: vehicleIncluded ? vehicleAllowance : 0,
          childcareAllowanceAmount: childcareIncluded
            ? childcareAllowance
            : 0,
        },
      });
      alert("저장되었습니다.");
      router.back();
    } catch (error) {
      alert(getErrorMessage(error, "저장에 실패했습니다."));
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

  const formatAmount = (val: number) => val.toLocaleString("ko-KR");

  const contractClassificationName =
    initialData?.employmentContractHeader?.contractClassificationName ?? "";
  const employeeName = initialData?.employeeInfoName ?? "-";

  // 총 월간 근무시간
  const totalMonthlyTime =
    monthlyTime + overtimeTime + nightTime + holidayTime + addHolidayTime;
  const isOver52 = weeklyHours > 52;

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
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
                      {formatAmount(timelyAmount)}원
                    </li>
                    <li className="employ-cont-item">{weeklyHours}시간</li>
                  </ul>
                </div>
                <div className="employment-btn-wrap">
                  <div className="employment-btn"></div>
                </div>
              </button>
              <div className="sub-item-bx">
                <table className="employ-table">
                  <colgroup>
                    <col />
                    <col width={"50px"} />
                    <col width={"90px"} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>
                        <div className="tip-th flex g4">
                          <span>구분</span>
                          <button className="tooltip-btn">
                            <span
                              className="tooltip-icon"
                              id="tooltip-btn-anchor"
                            ></span>
                            <Tooltip
                              className="tooltip-txt"
                              anchorSelect="#tooltip-btn-anchor"
                              opacity={1}
                            >
                              <div>tooltip text</div>
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
                      <td>{formatAmount(timelyAmount * weeklyHours)}</td>
                    </tr>
                    <tr>
                      <td className="tit">기본근무</td>
                      <td>
                        <div className="block">
                          <input
                            type="number"
                            className="employ-input"
                            min="0"
                            value={monthlyTime}
                            onChange={(e) =>
                              setMonthlyTime(Math.max(0, Number(e.target.value) || 0))
                            }
                          />
                        </div>
                      </td>
                      <td>{formatAmount(timelyAmount * monthlyTime)}</td>
                    </tr>
                    <tr>
                      <td className="tit">연장근무</td>
                      <td>
                        <div className="block">
                          <input
                            type="number"
                            className="employ-input"
                            min="0"
                            value={overtimeTime}
                            onChange={(e) =>
                              setOvertimeTime(Math.max(0, Number(e.target.value) || 0))
                            }
                          />
                        </div>
                      </td>
                      <td>
                        {formatAmount(
                          Math.round(timelyAmount * 1.5 * overtimeTime)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="tit">야간근무</td>
                      <td>
                        <div className="block">
                          <input
                            type="number"
                            className="employ-input"
                            min="0"
                            value={nightTime}
                            onChange={(e) =>
                              setNightTime(Math.max(0, Number(e.target.value) || 0))
                            }
                          />
                        </div>
                      </td>
                      <td>
                        {formatAmount(
                          Math.round(timelyAmount * 0.5 * nightTime)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="tit">휴일근무</td>
                      <td>
                        <div className="block">
                          <input
                            type="number"
                            className="employ-input"
                            min="0"
                            value={holidayTime}
                            onChange={(e) =>
                              setHolidayTime(Math.max(0, Number(e.target.value) || 0))
                            }
                          />
                        </div>
                      </td>
                      <td>
                        {formatAmount(
                          Math.round(timelyAmount * 1.5 * holidayTime)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="tit">추가 휴일근무</td>
                      <td>
                        <div className="block">
                          <input
                            type="number"
                            className="employ-input"
                            value={addHolidayTime}
                            onChange={(e) =>
                              setAddHolidayTime(Number(e.target.value))
                            }
                          />
                        </div>
                      </td>
                      <td>
                        {formatAmount(
                          Math.round(timelyAmount * 2.0 * addHolidayTime)
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
              <div className="sub-item-bx">
                <table className="employ-table">
                  <colgroup>
                    <col />
                    <col width={"71px"} />
                    <col width={"105px"} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>
                        <div className="tip-th flex g4">
                          <span>비과세 항목</span>
                          <button className="tooltip-btn">
                            <span
                              className="tooltip-icon"
                              id="tooltip-btn-anchor-2"
                            ></span>
                            <Tooltip
                              className="tooltip-txt"
                              anchorSelect="#tooltip-btn-anchor-2"
                              opacity={1}
                            >
                              <div>tooltip text</div>
                            </Tooltip>
                          </button>
                        </div>
                      </th>
                      <th>급여에 포함</th>
                      <th>금액(원)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="tit">식대</td>
                      <td className="al-c">
                        <div className="toggle-btn">
                          <input
                            type="checkbox"
                            className="toggle-input"
                            id="toggle-meal"
                            checked={mealIncluded}
                            onChange={(e) =>
                              setMealIncluded(e.target.checked)
                            }
                          />
                          <label
                            className="slider"
                            htmlFor="toggle-meal"
                          ></label>
                        </div>
                      </td>
                      <td>
                        <div className="block">
                          <input
                            type="number"
                            className="employ-input"
                            value={mealAllowance}
                            max={200000}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setMealAllowance(Math.min(v, 200000));
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="tit">자가운전보조금</td>
                      <td className="al-c">
                        <div className="toggle-btn">
                          <input
                            type="checkbox"
                            className="toggle-input"
                            id="toggle-vehicle"
                            checked={vehicleIncluded}
                            onChange={(e) =>
                              setVehicleIncluded(e.target.checked)
                            }
                          />
                          <label
                            className="slider"
                            htmlFor="toggle-vehicle"
                          ></label>
                        </div>
                      </td>
                      <td>
                        <div className="block">
                          <input
                            type="number"
                            className="employ-input"
                            value={vehicleAllowance}
                            max={200000}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setVehicleAllowance(Math.min(v, 200000));
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="tit">육아수당</td>
                      <td className="al-c">
                        <div className="toggle-btn">
                          <input
                            type="checkbox"
                            className="toggle-input"
                            id="toggle-childcare"
                            checked={childcareIncluded}
                            onChange={(e) =>
                              setChildcareIncluded(e.target.checked)
                            }
                          />
                          <label
                            className="slider"
                            htmlFor="toggle-childcare"
                          ></label>
                        </div>
                      </td>
                      <td>
                        <div className="block">
                          <input
                            type="number"
                            className="employ-input"
                            value={childcareAllowance}
                            max={100000}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setChildcareAllowance(Math.min(v, 100000));
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
              <div className="flex g8">
                <button
                  className="btn-form sky block brd"
                  onClick={handleRecalculate}
                >
                  다시계산
                </button>
                <button
                  className="btn-form blue block"
                  onClick={handleSave}
                  disabled={updateSalaryInfo.isPending}
                >
                  {updateSalaryInfo.isPending ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContractOptionSheet
        year={year}
        timelyAmount={timelyAmount}
        weeklyHours={weeklyHours}
        onChange={handleOptionChange}
      />
    </>
  );
}
