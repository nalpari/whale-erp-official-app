"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useUpdateContractWorkHours } from "@/hooks/queries/use-contract-queries";
import type { ContractDetail, ContractWorkHour } from "@/types/contract";

interface WorkDayState {
  isWork: boolean;
  workStartTime: string;
  workEndTime: string;
  isBreak: boolean;
  breakStartTime: string;
  breakEndTime: string;
}

interface SaturdayState extends WorkDayState {
  everySaturdayWork: boolean;
  firstSaturdayWorkDay: string;
}

interface SundayState extends WorkDayState {
  everySundayWork: boolean;
  firstSundayWorkDay: string;
}

function findByDayType(workHours: ContractWorkHour[], dayType: string): ContractWorkHour | undefined {
  return workHours?.find((w) => w.dayType === dayType);
}

interface Props {
  initialData?: ContractDetail;
}

export default function ContractEditTime({ initialData }: Props) {
  const router = useRouter();
  const setTimeSelectSheet = useBottomSheetControler(
    (state) => state.setTimeSelectSheet
  );
  const updateWorkHours = useUpdateContractWorkHours();

  const wh = initialData?.workHours ?? [];
  const weekdayRaw = findByDayType(wh, "WEEKDAY");
  const saturdayRaw = findByDayType(wh, "SATURDAY");
  const sundayRaw = findByDayType(wh, "SUNDAY");

  const [weekday, setWeekday] = useState<WorkDayState>({
    isWork: weekdayRaw?.isWork ?? true,
    workStartTime: weekdayRaw?.workStartTime ?? "",
    workEndTime: weekdayRaw?.workEndTime ?? "",
    isBreak: weekdayRaw?.isBreak ?? false,
    breakStartTime: weekdayRaw?.breakStartTime ?? "",
    breakEndTime: weekdayRaw?.breakEndTime ?? "",
  });

  const [saturday, setSaturday] = useState<SaturdayState>({
    isWork: saturdayRaw?.isWork ?? false,
    workStartTime: saturdayRaw?.workStartTime ?? "",
    workEndTime: saturdayRaw?.workEndTime ?? "",
    isBreak: saturdayRaw?.isBreak ?? false,
    breakStartTime: saturdayRaw?.breakStartTime ?? "",
    breakEndTime: saturdayRaw?.breakEndTime ?? "",
    everySaturdayWork: saturdayRaw?.everySaturdayWork ?? true,
    firstSaturdayWorkDay: saturdayRaw?.firstSaturdayWorkDay ?? "",
  });

  const [sunday, setSunday] = useState<SundayState>({
    isWork: sundayRaw?.isWork ?? false,
    workStartTime: sundayRaw?.workStartTime ?? "",
    workEndTime: sundayRaw?.workEndTime ?? "",
    isBreak: sundayRaw?.isBreak ?? false,
    breakStartTime: sundayRaw?.breakStartTime ?? "",
    breakEndTime: sundayRaw?.breakEndTime ?? "",
    everySundayWork: sundayRaw?.everySundayWork ?? true,
    firstSundayWorkDay: sundayRaw?.firstSundayWorkDay ?? "",
  });

  const handleSave = async () => {
    if (!initialData?.id) return;

    const workHours: ContractWorkHour[] = [
      {
        dayType: "WEEKDAY",
        isWork: weekday.isWork,
        isBreak: weekday.isBreak,
        everySaturdayWork: false,
        everySundayWork: false,
        workStartTime: weekday.workStartTime || undefined,
        workEndTime: weekday.workEndTime || undefined,
        breakStartTime: weekday.breakStartTime || undefined,
        breakEndTime: weekday.breakEndTime || undefined,
      },
      {
        dayType: "SATURDAY",
        isWork: saturday.isWork,
        isBreak: saturday.isBreak,
        everySaturdayWork: saturday.everySaturdayWork,
        firstSaturdayWorkDay: saturday.firstSaturdayWorkDay || undefined,
        everySundayWork: false,
        workStartTime: saturday.workStartTime || undefined,
        workEndTime: saturday.workEndTime || undefined,
        breakStartTime: saturday.breakStartTime || undefined,
        breakEndTime: saturday.breakEndTime || undefined,
      },
      {
        dayType: "SUNDAY",
        isWork: sunday.isWork,
        isBreak: sunday.isBreak,
        everySaturdayWork: false,
        everySundayWork: sunday.everySundayWork,
        firstSundayWorkDay: sunday.firstSundayWorkDay || undefined,
        workStartTime: sunday.workStartTime || undefined,
        workEndTime: sunday.workEndTime || undefined,
        breakStartTime: sunday.breakStartTime || undefined,
        breakEndTime: sunday.breakEndTime || undefined,
      },
    ];

    try {
      await updateWorkHours.mutateAsync({
        contractId: initialData.id,
        data: {
          contractId: initialData.id,
          workHours,
        },
      });
      alert("근무시간이 저장되었습니다.");
      router.back();
    } catch {
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">
                  계약 근무시간 <span className="imp">*</span>
                </div>
              </div>

              {/* 평일 */}
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="store-img-list-tit">평일</div>
                  <div className="flex g8 mb8">
                    <button
                      className={`radio-btn block blue${weekday.isWork ? " act" : ""}`}
                      onClick={() => setWeekday((p) => ({ ...p, isWork: true }))}
                    >
                      근무
                    </button>
                    <button
                      className={`radio-btn block blue${!weekday.isWork ? " act" : ""}`}
                      onClick={() => setWeekday((p) => ({ ...p, isWork: false }))}
                    >
                      미근무
                    </button>
                  </div>
                  <div>
                    <div className="block mb8">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {weekday.workStartTime || "시작시간"}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {weekday.workEndTime || "종료시간"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="data-filed">
                  <div className="filed-tit sub">휴게시간</div>
                  <div className="flex g8 mb8">
                    <button
                      className={`radio-btn block blue${weekday.isBreak ? " act" : ""}`}
                      onClick={() => setWeekday((p) => ({ ...p, isBreak: true }))}
                    >
                      있음
                    </button>
                    <button
                      className={`radio-btn block blue${!weekday.isBreak ? " act" : ""}`}
                      onClick={() => setWeekday((p) => ({ ...p, isBreak: false }))}
                    >
                      없음
                    </button>
                  </div>
                  <div>
                    <div className="block mb8">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {weekday.breakStartTime || "시작시간"}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {weekday.breakEndTime || "종료시간"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 토요일 */}
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="store-img-list-tit">토요일</div>
                  <div className="flex g8 mb8">
                    <button
                      className={`radio-btn block blue${saturday.isWork ? " act" : ""}`}
                      onClick={() => setSaturday((p) => ({ ...p, isWork: true }))}
                    >
                      근무
                    </button>
                    <button
                      className={`radio-btn block blue${!saturday.isWork ? " act" : ""}`}
                      onClick={() => setSaturday((p) => ({ ...p, isWork: false }))}
                    >
                      미근무
                    </button>
                  </div>
                  <div>
                    <div className="block mb8">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {saturday.workStartTime || "시작시간"}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {saturday.workEndTime || "종료시간"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="data-filed">
                  <div className="filed-tit sub">휴게시간</div>
                  <div className="flex g8 mb8">
                    <button
                      className={`radio-btn block blue${saturday.isBreak ? " act" : ""}`}
                      onClick={() => setSaturday((p) => ({ ...p, isBreak: true }))}
                    >
                      있음
                    </button>
                    <button
                      className={`radio-btn block blue${!saturday.isBreak ? " act" : ""}`}
                      onClick={() => setSaturday((p) => ({ ...p, isBreak: false }))}
                    >
                      없음
                    </button>
                  </div>
                  <div>
                    <div className="block mb8">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {saturday.breakStartTime || "시작시간"}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {saturday.breakEndTime || "종료시간"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="data-filed">
                  <div className="filed-tit sub">격주근무 여부</div>
                  <div className="flex g8">
                    <button
                      className={`radio-btn block blue${saturday.everySaturdayWork ? " act" : ""}`}
                      onClick={() => setSaturday((p) => ({ ...p, everySaturdayWork: true }))}
                    >
                      매주 근무
                    </button>
                    <button
                      className={`radio-btn block blue${!saturday.everySaturdayWork ? " act" : ""}`}
                      onClick={() => setSaturday((p) => ({ ...p, everySaturdayWork: false }))}
                    >
                      격주 근무
                    </button>
                  </div>
                </div>
                <div className="data-filed">
                  <div className="filed-tit sub">격주근무 시작일</div>
                  <div className="block">
                    <div className="date-picker-custom">
                      <input
                        type="text"
                        className="date-picker-input"
                        value={saturday.firstSaturdayWorkDay}
                        onChange={(e) =>
                          setSaturday((p) => ({ ...p, firstSaturdayWorkDay: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 일요일 */}
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="store-img-list-tit">일요일</div>
                  <div className="flex g8 mb8">
                    <button
                      className={`radio-btn block blue${sunday.isWork ? " act" : ""}`}
                      onClick={() => setSunday((p) => ({ ...p, isWork: true }))}
                    >
                      근무
                    </button>
                    <button
                      className={`radio-btn block blue${!sunday.isWork ? " act" : ""}`}
                      onClick={() => setSunday((p) => ({ ...p, isWork: false }))}
                    >
                      미근무
                    </button>
                  </div>
                  <div>
                    <div className="block mb8">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {sunday.workStartTime || "시작시간"}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {sunday.workEndTime || "종료시간"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="data-filed">
                  <div className="filed-tit sub">브레이크타임</div>
                  <div className="flex g8 mb8">
                    <button
                      className={`radio-btn block blue${sunday.isBreak ? " act" : ""}`}
                      onClick={() => setSunday((p) => ({ ...p, isBreak: true }))}
                    >
                      있음
                    </button>
                    <button
                      className={`radio-btn block blue${!sunday.isBreak ? " act" : ""}`}
                      onClick={() => setSunday((p) => ({ ...p, isBreak: false }))}
                    >
                      없음
                    </button>
                  </div>
                  <div>
                    <div className="block mb8">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {sunday.breakStartTime || "시작시간"}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => setTimeSelectSheet(true)}
                      >
                        {sunday.breakEndTime || "종료시간"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="data-filed">
                  <div className="filed-tit sub">격주근무 여부</div>
                  <div className="flex g8">
                    <button
                      className={`radio-btn block blue${sunday.everySundayWork ? " act" : ""}`}
                      onClick={() => setSunday((p) => ({ ...p, everySundayWork: true }))}
                    >
                      매주 근무
                    </button>
                    <button
                      className={`radio-btn block blue${!sunday.everySundayWork ? " act" : ""}`}
                      onClick={() => setSunday((p) => ({ ...p, everySundayWork: false }))}
                    >
                      격주 근무
                    </button>
                  </div>
                </div>
                <div className="data-filed">
                  <div className="filed-tit sub">격주근무 시작일</div>
                  <div className="block">
                    <div className="date-picker-custom">
                      <input
                        type="text"
                        className="date-picker-input"
                        value={sunday.firstSundayWorkDay}
                        onChange={(e) =>
                          setSunday((p) => ({ ...p, firstSundayWorkDay: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <button
          className="btn-form block blue"
          onClick={handleSave}
          disabled={updateWorkHours.isPending}
        >
          저장
        </button>
      </div>
    </>
  );
}
