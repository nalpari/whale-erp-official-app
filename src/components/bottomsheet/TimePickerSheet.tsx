"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";
import { useRef, useEffect } from "react";
import "./css/time-picker-sheet.scss";

// 00:00 ~ 23:30 (30분 단위, 48개)
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of [0, 30]) {
    TIME_OPTIONS.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    );
  }
}

export default function TimePickerSheet() {
  const timePickerSheet = useBottomSheetControler((state) => state.timePickerSheet);
  const setTimePickerSheet = useBottomSheetControler((state) => state.setTimePickerSheet);
  const timePickerTitle = useBottomSheetControler((state) => state.timePickerTitle);
  const timePickerValue = useBottomSheetControler((state) => state.timePickerValue);
  const onTimeSelect = useBottomSheetControler((state) => state.onTimeSelect);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (timePickerSheet && selectedRef.current) {
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({ block: "center" });
      }, 200);
    }
  }, [timePickerSheet]);

  const handleClose = () => {
    setTimePickerSheet(false);
  };

  const handleSelect = (time: string | null) => {
    try {
      onTimeSelect?.(time);
    } catch (err) {
      console.error('[TimePickerSheet] onTimeSelect 콜백 실행 실패:', err);
    } finally {
      handleClose();
    }
  };

  return (
    <Sheet
      isOpen={timePickerSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet time">
            <div className="bottom-sheet-header">
              <h3>{timePickerTitle || "시간설정"}</h3>
            </div>
            <div className="time-picker-list">
              <button
                type="button"
                className="time-picker-item"
                onClick={() => handleSelect(null)}
              >
                --:--
              </button>
              {TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  ref={time === timePickerValue ? selectedRef : undefined}
                  className={`time-picker-item${time === timePickerValue ? " act" : ""}`}
                  onClick={() => handleSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
