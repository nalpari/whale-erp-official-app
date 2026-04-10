"use client";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import type { OperatingHourRequest } from "@/types/store";
import { getOperatingHourValidation, WEEKDAY_ORDER, WEEKDAY_LABEL } from "@/lib/store-utils";

type TimeField = 'openTime' | 'closeTime' | 'breakStartTime' | 'breakEndTime'

const WEEKDAYS = WEEKDAY_ORDER.map((key) => ({ key, label: WEEKDAY_LABEL[key] }));

function TimeError({ show, message }: { show: boolean; message: string }) {
  if (!show) return null;
  return <div className="warning mt10">* {message}</div>;
}

function findHour(operating: OperatingHourRequest[], dayType: string): OperatingHourRequest {
  return operating.find((o) => o.dayType === dayType) ?? {
    dayType: dayType as OperatingHourRequest["dayType"],
    isOperating: false,
    openTime: null,
    closeTime: null,
    breakStartTime: null,
    breakEndTime: null,
  };
}

function TimeInput({
  label,
  value,
  onSelect,
}: {
  label: string;
  value: string | null | undefined;
  onSelect: (time: string | null) => void;
}) {
  const openTimePicker = useBottomSheetControler((state) => state.openTimePicker);

  return (
    <button
      type="button"
      className="input-frame time-select"
      onClick={() => openTimePicker(label, value ?? "", onSelect)}
    >
      {value || label}
    </button>
  );
}

export default function StoreOperatingHourForm({ submitted = false }: { submitted?: boolean }) {
  const operating = useStoreFormStore((s) => s.operating);
  const setOperating = useStoreFormStore((s) => s.setOperating);

  const updateHour = (dayType: string, field: TimeField, value: string | null) => {
    setOperating(
      operating.map((o) => {
        if (o.dayType !== dayType) return o;
        const updated = { ...o, [field]: value };
        // openTime + closeTime 둘 다 있어야 운영 (buildOperatingHoursRequest와 동일 기준)
        const hasOperatingTime = !!(updated.openTime && updated.closeTime);
        return { ...updated, isOperating: hasOperatingTime };
      })
    );
  };

  const toggleWeekDay = (day: string) => {
    const weekday = findHour(operating, "WEEKDAY");
    const current = weekday.selectWeekDayList ?? [];
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setOperating(
      operating.map((o) =>
        o.dayType === "WEEKDAY" ? { ...o, selectWeekDayList: next } : o
      )
    );
  };

  const weekday = findHour(operating, "WEEKDAY");
  const saturday = findHour(operating, "SATURDAY");
  const sunday = findHour(operating, "SUNDAY");
  const selectedWeekDays = weekday.selectWeekDayList ?? [];
  const weekdayValidation = getOperatingHourValidation(weekday);
  const saturdayValidation = getOperatingHourValidation(saturday);
  const sundayValidation = getOperatingHourValidation(sunday);

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-cont-tit-wrap">
          <div className="sub-cont-tit">영업시간</div>
        </div>

        {/* 평일 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">평일</div>
            <div>
              <div className="block mb8">
                <TimeInput
                  label="시작시간"
                  value={weekday.openTime}
                  onSelect={(t) => updateHour("WEEKDAY", "openTime", t)}
                />
              </div>
              <div className="block">
                <TimeInput
                  label="종료시간"
                  value={weekday.closeTime}
                  onSelect={(t) => updateHour("WEEKDAY", "closeTime", t)}
                />
              </div>
            </div>
            <TimeError show={submitted && weekdayValidation.hasOperatingTimePairError} message="영업 시작시간과 종료시간을 모두 입력해주세요." />
            <TimeError show={submitted && weekdayValidation.hasOperatingTimeRangeError} message="종료시간은 시작시간보다 이후여야 합니다." />
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">브레이크타임</div>
            <div>
              <div className="block mb8">
                <TimeInput
                  label="시작시간"
                  value={weekday.breakStartTime}
                  onSelect={(t) => updateHour("WEEKDAY", "breakStartTime", t)}
                />
              </div>
              <div className="block">
                <TimeInput
                  label="종료시간"
                  value={weekday.breakEndTime}
                  onSelect={(t) => updateHour("WEEKDAY", "breakEndTime", t)}
                />
              </div>
            </div>
            <TimeError show={submitted && weekdayValidation.hasBreakTimePairError} message="휴게 시작시간과 종료시간을 모두 입력해주세요." />
            <TimeError show={submitted && weekdayValidation.hasBreakTimeRangeError} message="종료시간은 시작시간보다 이후여야 합니다." />
            <TimeError show={submitted && weekdayValidation.hasBreakWithoutOperatingTimeError} message="휴게시간을 설정하려면 영업시간을 먼저 입력해주세요." />
            <TimeError show={submitted && weekdayValidation.hasBreakOutsideOperatingError} message="휴게시간은 영업시간 내에서만 설정할 수 있습니다." />
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">요일선택</div>
            <div className="flex g8">
              {WEEKDAYS.map((day) => (
                <button
                  key={day.key}
                  className={`day-btn ${selectedWeekDays.includes(day.key) ? "act" : ""}`}
                  onClick={() => toggleWeekDay(day.key)}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <TimeError show={submitted && weekdayValidation.hasWeekdaySelectionError} message="평일 영업시간을 저장하려면 요일을 선택해주세요." />
          </div>
        </div>

        {/* 토요일 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">토요일</div>
            <div>
              <div className="block mb8">
                <TimeInput
                  label="시작시간"
                  value={saturday.openTime}
                  onSelect={(t) => updateHour("SATURDAY", "openTime", t)}
                />
              </div>
              <div className="block">
                <TimeInput
                  label="종료시간"
                  value={saturday.closeTime}
                  onSelect={(t) => updateHour("SATURDAY", "closeTime", t)}
                />
              </div>
            </div>
            <TimeError show={submitted && saturdayValidation.hasOperatingTimePairError} message="영업 시작시간과 종료시간을 모두 입력해주세요." />
            <TimeError show={submitted && saturdayValidation.hasOperatingTimeRangeError} message="종료시간은 시작시간보다 이후여야 합니다." />
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">브레이크타임</div>
            <div>
              <div className="block mb8">
                <TimeInput
                  label="시작시간"
                  value={saturday.breakStartTime}
                  onSelect={(t) => updateHour("SATURDAY", "breakStartTime", t)}
                />
              </div>
              <div className="block">
                <TimeInput
                  label="종료시간"
                  value={saturday.breakEndTime}
                  onSelect={(t) => updateHour("SATURDAY", "breakEndTime", t)}
                />
              </div>
            </div>
            <TimeError show={submitted && saturdayValidation.hasBreakTimePairError} message="휴게 시작시간과 종료시간을 모두 입력해주세요." />
            <TimeError show={submitted && saturdayValidation.hasBreakTimeRangeError} message="종료시간은 시작시간보다 이후여야 합니다." />
            <TimeError show={submitted && saturdayValidation.hasBreakWithoutOperatingTimeError} message="휴게시간을 설정하려면 영업시간을 먼저 입력해주세요." />
            <TimeError show={submitted && saturdayValidation.hasBreakOutsideOperatingError} message="휴게시간은 영업시간 내에서만 설정할 수 있습니다." />
          </div>
        </div>

        {/* 일요일 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">일요일</div>
            <div>
              <div className="block mb8">
                <TimeInput
                  label="시작시간"
                  value={sunday.openTime}
                  onSelect={(t) => updateHour("SUNDAY", "openTime", t)}
                />
              </div>
              <div className="block">
                <TimeInput
                  label="종료시간"
                  value={sunday.closeTime}
                  onSelect={(t) => updateHour("SUNDAY", "closeTime", t)}
                />
              </div>
            </div>
            <TimeError show={submitted && sundayValidation.hasOperatingTimePairError} message="영업 시작시간과 종료시간을 모두 입력해주세요." />
            <TimeError show={submitted && sundayValidation.hasOperatingTimeRangeError} message="종료시간은 시작시간보다 이후여야 합니다." />
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">브레이크타임</div>
            <div>
              <div className="block mb8">
                <TimeInput
                  label="시작시간"
                  value={sunday.breakStartTime}
                  onSelect={(t) => updateHour("SUNDAY", "breakStartTime", t)}
                />
              </div>
              <div className="block">
                <TimeInput
                  label="종료시간"
                  value={sunday.breakEndTime}
                  onSelect={(t) => updateHour("SUNDAY", "breakEndTime", t)}
                />
              </div>
            </div>
            <TimeError show={submitted && sundayValidation.hasBreakTimePairError} message="휴게 시작시간과 종료시간을 모두 입력해주세요." />
            <TimeError show={submitted && sundayValidation.hasBreakTimeRangeError} message="종료시간은 시작시간보다 이후여야 합니다." />
            <TimeError show={submitted && sundayValidation.hasBreakWithoutOperatingTimeError} message="휴게시간을 설정하려면 영업시간을 먼저 입력해주세요." />
            <TimeError show={submitted && sundayValidation.hasBreakOutsideOperatingError} message="휴게시간은 영업시간 내에서만 설정할 수 있습니다." />
          </div>
        </div>
      </div>
    </div>
  );
}
