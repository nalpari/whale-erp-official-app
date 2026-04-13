"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { usePopupControler } from "@/store/usePopupControler";
import { useUpdateContractWorkHours } from "@/hooks/queries/use-contract-queries";
import { getErrorMessage } from "@/lib/api";
import "../bottomsheet/css/date-input-fix.scss";
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
  const openAlert = usePopupControler((s) => s.openAlert);
  const openTimePicker = useBottomSheetControler(
    (state) => state.openTimePicker
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
    everySaturdayWork: saturdayRaw?.everySaturdayWork ?? false,
    firstSaturdayWorkDay: saturdayRaw?.firstSaturdayWorkDay ?? "",
  });

  const [sunday, setSunday] = useState<SundayState>({
    isWork: sundayRaw?.isWork ?? false,
    workStartTime: sundayRaw?.workStartTime ?? "",
    workEndTime: sundayRaw?.workEndTime ?? "",
    isBreak: sundayRaw?.isBreak ?? false,
    breakStartTime: sundayRaw?.breakStartTime ?? "",
    breakEndTime: sundayRaw?.breakEndTime ?? "",
    everySundayWork: sundayRaw?.everySundayWork ?? false,
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

    // isWork=false인 항목은 시간값 초기화
    const cleanedWorkHours = workHours.map((wh) =>
      wh.isWork ? wh : { ...wh, workStartTime: undefined, workEndTime: undefined, breakStartTime: undefined, breakEndTime: undefined, isBreak: false, firstSaturdayWorkDay: undefined, firstSundayWorkDay: undefined, everySaturdayWork: false, everySundayWork: false },
    );
    try {
      await updateWorkHours.mutateAsync({
        contractId: initialData.id,
        data: {
          contractId: initialData.id,
          workHours: cleanedWorkHours,
        },
      });
      openAlert({
        message: "근무시간이 저장되었습니다.",
        confirmText: "확인",
        onConfirm: () => router.back(),
      });
    } catch (error) {
      openAlert({ message: getErrorMessage(error, "저장에 실패했습니다."), confirmText: "확인" });
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
                  {weekday.isWork && (
                    <>
                      <div>
                        <div className="block mb8">
                          <button
                            className="select-form al-l"
                            onClick={() => openTimePicker('평일 근무 시작', weekday.workStartTime, (v) => setWeekday((p) => ({ ...p, workStartTime: v ?? "" })))}
                          >
                            {weekday.workStartTime || "시작시간"}
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => openTimePicker('평일 근무 종료', weekday.workEndTime, (v) => setWeekday((p) => ({ ...p, workEndTime: v ?? "" })))}
                          >
                            {weekday.workEndTime || "종료시간"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {weekday.isWork && (
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
                        onClick={() => openTimePicker('평일 휴게 시작', weekday.breakStartTime, (v) => setWeekday((p) => ({ ...p, breakStartTime: v ?? "" })))}
                      >
                        {weekday.breakStartTime || "시작시간"}
                      </button>
                    </div>
                    <div className="block">
                      <button
                        className="select-form al-l"
                        onClick={() => openTimePicker('평일 휴게 종료', weekday.breakEndTime, (v) => setWeekday((p) => ({ ...p, breakEndTime: v ?? "" })))}
                      >
                        {weekday.breakEndTime || "종료시간"}
                      </button>
                    </div>
                  </div>
                </div>
                )}
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
                  {saturday.isWork && (
                    <>
                      <div>
                        <div className="block mb8">
                          <button
                            className="select-form al-l"
                            onClick={() => openTimePicker('토요일 근무 시작', saturday.workStartTime, (v) => setSaturday((p) => ({ ...p, workStartTime: v ?? "" })))}
                          >
                            {saturday.workStartTime || "시작시간"}
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => openTimePicker('토요일 근무 종료', saturday.workEndTime, (v) => setSaturday((p) => ({ ...p, workEndTime: v ?? "" })))}
                          >
                            {saturday.workEndTime || "종료시간"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {saturday.isWork && (
                  <>
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
                            onClick={() => openTimePicker('토요일 휴게 시작', saturday.breakStartTime, (v) => setSaturday((p) => ({ ...p, breakStartTime: v ?? "" })))}
                          >
                            {saturday.breakStartTime || "시작시간"}
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => openTimePicker('토요일 휴게 종료', saturday.breakEndTime, (v) => setSaturday((p) => ({ ...p, breakEndTime: v ?? "" })))}
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
                            type="date"
                            className="date-picker-input"
                            value={saturday.firstSaturdayWorkDay}
                            onChange={(e) =>
                              setSaturday((p) => ({ ...p, firstSaturdayWorkDay: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
                  {sunday.isWork && (
                    <>
                      <div>
                        <div className="block mb8">
                          <button
                            className="select-form al-l"
                            onClick={() => openTimePicker('일요일 근무 시작', sunday.workStartTime, (v) => setSunday((p) => ({ ...p, workStartTime: v ?? "" })))}
                          >
                            {sunday.workStartTime || "시작시간"}
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => openTimePicker('일요일 근무 종료', sunday.workEndTime, (v) => setSunday((p) => ({ ...p, workEndTime: v ?? "" })))}
                          >
                            {sunday.workEndTime || "종료시간"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {sunday.isWork && (
                  <>
                    <div className="data-filed">
                      <div className="filed-tit sub">휴게시간</div>
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
                            onClick={() => openTimePicker('일요일 휴게 시작', sunday.breakStartTime, (v) => setSunday((p) => ({ ...p, breakStartTime: v ?? "" })))}
                          >
                            {sunday.breakStartTime || "시작시간"}
                          </button>
                        </div>
                        <div className="block">
                          <button
                            className="select-form al-l"
                            onClick={() => openTimePicker('일요일 휴게 종료', sunday.breakEndTime, (v) => setSunday((p) => ({ ...p, breakEndTime: v ?? "" })))}
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
                            type="date"
                            className="date-picker-input"
                            value={sunday.firstSundayWorkDay}
                            onChange={(e) =>
                              setSunday((p) => ({ ...p, firstSundayWorkDay: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
