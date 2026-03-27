"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { WhaleCalendar } from "whale-calendar";
import "whale-calendar/styles.css";
import type { CalendarDayData } from "./types";

interface TodoCalendarProps {
  selectedDate: Date;
  todoData: CalendarDayData[];
  onDayClick: (date: Date) => void;
  onMonthDataNeeded: (year: number, month: number) => Promise<CalendarDayData[]>;
}

export default function TodoCalendar({
  selectedDate,
  todoData,
  onDayClick,
  onMonthDataNeeded,
}: TodoCalendarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [browseTarget, setBrowseTarget] = useState<{ year: number; month: number } | null>(null);
  const [browseData, setBrowseData] = useState<CalendarDayData[] | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth() + 1;

  // selectedDate가 변경되면 browseTarget 해제 (하단 스와이프로 월이 바뀌면 달력도 따라감)
  // browseTarget이 현재 선택된 월과 같으면 자동 해제하여 불필요한 상태 유지 방지
  const effectiveBrowseTarget =
    browseTarget &&
    (browseTarget.year !== selectedYear || browseTarget.month !== selectedMonth)
      ? browseTarget
      : null;

  const viewYear = effectiveBrowseTarget?.year ?? selectedYear;
  const viewMonth = effectiveBrowseTarget?.month ?? selectedMonth;

  const isSameMonth = viewYear === selectedYear && viewMonth === selectedMonth;
  const displayData = isSameMonth ? todoData : browseData;
  const calendarData = buildCalendarData(displayData, viewYear, viewMonth);

  // 타이틀 DOM 교체
  useEffect(() => {
    if (!calendarRef.current) return;
    const titleEl = calendarRef.current.querySelector(
      ".whale-calendar__title"
    ) as HTMLElement | null;
    if (titleEl) {
      titleEl.textContent = `${viewYear}년 ${viewMonth}월`;
    }
  }, [viewYear, viewMonth]);

  // 캘린더 그리드 토글
  useEffect(() => {
    if (!calendarRef.current) return;
    const gridEl = calendarRef.current.querySelector(
      ".whale-calendar__grid"
    ) as HTMLElement | null;
    if (gridEl) {
      gridEl.style.display = isCalendarOpen ? "grid" : "none";
    }
  }, [isCalendarOpen]);

  // 캘린더 탐색 (스와이프용) - 하단 목록 유지
  const browseMonth = useCallback(
    async (year: number, month: number) => {
      setBrowseTarget({ year, month });
      const data = await onMonthDataNeeded(year, month);
      setBrowseData(data);
    },
    [onMonthDataNeeded]
  );

  // < > 버튼 → 해당 월 1일 선택 (하단 목록도 이동)
  const handleMonthChange = useCallback(
    (year: number, month: number) => {
      const firstDay = new Date(year, month - 1, 1);
      onDayClick(firstDay);
      setBrowseTarget(null);
      setBrowseData(null);
    },
    [onDayClick]
  );

  // 날짜 클릭
  const handleDayClick = useCallback(
    (date: Date) => {
      onDayClick(date);
      setBrowseTarget(null);
      setBrowseData(null);
    },
    [onDayClick]
  );

  // 스케줄 뱃지 클릭
  const handleScheduleClick = useCallback(
    (date: Date) => {
      handleDayClick(date);
    },
    [handleDayClick]
  );

  // 캘린더 영역 스와이프 → 월 탐색 (열려있을 때만, 하단 목록 유지)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isCalendarOpen) return;
    e.stopPropagation();
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, [isCalendarOpen]);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current || !isCalendarOpen) return;
      e.stopPropagation();
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= 50) {
        let nextMonth = viewMonth + (dx > 0 ? -1 : 1);
        let nextYear = viewYear;
        if (nextMonth < 1) { nextMonth = 12; nextYear--; }
        if (nextMonth > 12) { nextMonth = 1; nextYear++; }
        browseMonth(nextYear, nextMonth);
      }
    },
    [isCalendarOpen, viewYear, viewMonth, browseMonth]
  );

  return (
    <div
      className="todo-diary-wrap"
      ref={calendarRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <WhaleCalendar
        year={viewYear}
        month={viewMonth}
        data={calendarData}
        selectedDate={selectedDate}
        onDayClick={handleDayClick}
        onScheduleClick={handleScheduleClick}
        onMonthChange={handleMonthChange}
        locale="ko"
      />
      <button
        type="button"
        className="todo-calendar-toggle"
        onClick={() => setIsCalendarOpen((prev) => !prev)}
        aria-label={isCalendarOpen ? "캘린더 접기" : "캘린더 펼치기"}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="3" width="16" height="14" rx="2" stroke="#777" strokeWidth="1.5" />
          <path d="M2 7H18" stroke="#777" strokeWidth="1.5" />
          <path d="M6 1V4" stroke="#777" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 1V4" stroke="#777" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

/** CalendarDayData[] → whale-calendar CalendarData 변환 */
function buildCalendarData(
  data: CalendarDayData[] | null,
  year: number,
  month: number
): Record<string, { schedules: { id: string; label: string; color: string }[] }> {
  if (!data) return {};

  const result: Record<
    string,
    { schedules: { id: string; label: string; color: string }[] }
  > = {};

  for (const dayData of data) {
    const day = dayData.day;
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    result[dateKey] = {
      schedules: [{ id: `todo-${day}`, label: "", color: "transparent" }],
    };
  }

  return result;
}
