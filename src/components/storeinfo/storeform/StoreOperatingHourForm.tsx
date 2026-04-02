"use client";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import type { OperatingHourRequest } from "@/types/store";
import { WEEKDAY_ORDER, WEEKDAY_LABEL } from "@/lib/store-utils";

type TimeField = 'openTime' | 'closeTime' | 'breakStartTime' | 'breakEndTime'

const WEEKDAYS = WEEKDAY_ORDER.map((key) => ({ key, label: WEEKDAY_LABEL[key] }));

function isEndBeforeStart(start?: string | null, end?: string | null): boolean {
  if (!start || !end) return false;
  return end <= start;
}

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

export default function StoreOperatingHourForm() {
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
            <TimeError show={isEndBeforeStart(weekday.openTime, weekday.closeTime)} message="종료시간은 시작시간보다 이후여야 합니다." />
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
            <TimeError show={isEndBeforeStart(weekday.breakStartTime, weekday.breakEndTime)} message="종료시간은 시작시간보다 이후여야 합니다." />
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
            <TimeError show={isEndBeforeStart(saturday.openTime, saturday.closeTime)} message="종료시간은 시작시간보다 이후여야 합니다." />
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
            <TimeError show={isEndBeforeStart(saturday.breakStartTime, saturday.breakEndTime)} message="종료시간은 시작시간보다 이후여야 합니다." />
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
            <TimeError show={isEndBeforeStart(sunday.openTime, sunday.closeTime)} message="종료시간은 시작시간보다 이후여야 합니다." />
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
            <TimeError show={isEndBeforeStart(sunday.breakStartTime, sunday.breakEndTime)} message="종료시간은 시작시간보다 이후여야 합니다." />
          </div>
        </div>
      </div>
    </div>
  );
}
