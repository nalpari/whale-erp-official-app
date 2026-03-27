"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { WhaleCalendar } from "whale-calendar";
import "whale-calendar/styles.css";
import type { CalendarDayData } from "./types";

interface TodoCalendarProps {
  selectedDate: Date;
  /** 현재 선택된 날짜의 월 데이터 (TODO 목록용) */
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
  // browseTarget: 사용자가 < > 버튼으로 탐색 중인 월. null이면 selectedDate의 월을 따름.
  const [browseTarget, setBrowseTarget] = useState<{ year: number; month: number } | null>(null);
  const [browseData, setBrowseData] = useState<CalendarDayData[] | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // 선택된 날짜의 년/월
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth() + 1;

  // 현재 보고 있는 년/월: 탐색 중이면 browseTarget, 아니면 selectedDate 기준
  const viewYear = browseTarget?.year ?? selectedYear;
  const viewMonth = browseTarget?.month ?? selectedMonth;

  // 현재 보고 있는 월이 선택된 월과 같은지
  const isSameMonth = viewYear === selectedYear && viewMonth === selectedMonth;

  // 캘린더에 표시할 데이터 결정
  const displayData = isSameMonth ? todoData : browseData;

  // CalendarDayData[] → whale-calendar CalendarData 변환
  const calendarData = buildCalendarData(displayData, viewYear, viewMonth);

  // 타이틀 DOM 교체: "M월 스케줄" → "yyyy년 MM월"
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

  // 월 변경 핸들러 (< > 버튼) → 해당 월 1일 선택
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
      // 선택된 날짜가 바뀌면 탐색 상태 해제 (selectedDate 기준으로 복귀)
      setBrowseTarget(null);
      setBrowseData(null);
    },
    [onDayClick]
  );

  // 스케줄 뱃지 클릭 (stopPropagation 대응)
  const handleScheduleClick = useCallback(
    (date: Date) => {
      handleDayClick(date);
    },
    [handleDayClick]
  );

  // 캘린더 영역 스와이프 → 월 이동 (열려있을 때만, 상위 전파 차단)
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
        handleMonthChange(nextYear, nextMonth);
      }
    },
    [isCalendarOpen, viewYear, viewMonth, handleMonthChange]
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
