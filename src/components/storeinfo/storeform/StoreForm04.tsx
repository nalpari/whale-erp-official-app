"use client";
import { useStoreFormStore } from "@/store/useStoreFormStore";
import type { OperatingHourRequest } from "@/types/store";

const WEEKDAYS = [
  { key: "MONDAY", label: "월" },
  { key: "TUESDAY", label: "화" },
  { key: "WEDNESDAY", label: "수" },
  { key: "THURSDAY", label: "목" },
  { key: "FRIDAY", label: "금" },
];

function findHour(operating: OperatingHourRequest[], dayType: string): OperatingHourRequest {
  return operating.find((o) => o.dayType === dayType) ?? {
    dayType: dayType as OperatingHourRequest["dayType"],
    isOperating: true,
    openTime: null,
    closeTime: null,
    breakStartTime: null,
    breakEndTime: null,
  };
}

export default function StoreForm04() {
  const { operating, setOperating } = useStoreFormStore();

  const updateHour = (dayType: string, field: string, value: string | null) => {
    setOperating(
      operating.map((o) =>
        o.dayType === dayType ? { ...o, [field]: value } : o
      )
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
                <input
                  type="time"
                  className="input-frame"
                  value={weekday.openTime ?? ""}
                  onChange={(e) => updateHour("WEEKDAY", "openTime", e.target.value || null)}
                />
              </div>
              <div className="block">
                <input
                  type="time"
                  className="input-frame"
                  value={weekday.closeTime ?? ""}
                  onChange={(e) => updateHour("WEEKDAY", "closeTime", e.target.value || null)}
                />
              </div>
            </div>
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">브레이크타임</div>
            <div>
              <div className="block mb8">
                <input
                  type="time"
                  className="input-frame"
                  value={weekday.breakStartTime ?? ""}
                  onChange={(e) => updateHour("WEEKDAY", "breakStartTime", e.target.value || null)}
                />
              </div>
              <div className="block">
                <input
                  type="time"
                  className="input-frame"
                  value={weekday.breakEndTime ?? ""}
                  onChange={(e) => updateHour("WEEKDAY", "breakEndTime", e.target.value || null)}
                />
              </div>
            </div>
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
                <input
                  type="time"
                  className="input-frame"
                  value={saturday.openTime ?? ""}
                  onChange={(e) => updateHour("SATURDAY", "openTime", e.target.value || null)}
                />
              </div>
              <div className="block">
                <input
                  type="time"
                  className="input-frame"
                  value={saturday.closeTime ?? ""}
                  onChange={(e) => updateHour("SATURDAY", "closeTime", e.target.value || null)}
                />
              </div>
            </div>
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">브레이크타임</div>
            <div>
              <div className="block mb8">
                <input
                  type="time"
                  className="input-frame"
                  value={saturday.breakStartTime ?? ""}
                  onChange={(e) => updateHour("SATURDAY", "breakStartTime", e.target.value || null)}
                />
              </div>
              <div className="block">
                <input
                  type="time"
                  className="input-frame"
                  value={saturday.breakEndTime ?? ""}
                  onChange={(e) => updateHour("SATURDAY", "breakEndTime", e.target.value || null)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 일요일 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">일요일</div>
            <div>
              <div className="block mb8">
                <input
                  type="time"
                  className="input-frame"
                  value={sunday.openTime ?? ""}
                  onChange={(e) => updateHour("SUNDAY", "openTime", e.target.value || null)}
                />
              </div>
              <div className="block">
                <input
                  type="time"
                  className="input-frame"
                  value={sunday.closeTime ?? ""}
                  onChange={(e) => updateHour("SUNDAY", "closeTime", e.target.value || null)}
                />
              </div>
            </div>
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">브레이크타임</div>
            <div>
              <div className="block mb8">
                <input
                  type="time"
                  className="input-frame"
                  value={sunday.breakStartTime ?? ""}
                  onChange={(e) => updateHour("SUNDAY", "breakStartTime", e.target.value || null)}
                />
              </div>
              <div className="block">
                <input
                  type="time"
                  className="input-frame"
                  value={sunday.breakEndTime ?? ""}
                  onChange={(e) => updateHour("SUNDAY", "breakEndTime", e.target.value || null)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
