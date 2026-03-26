"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TodoCalendar from "./TodoCalendar";
import type { CalendarDayData, OrgGroup, TodoItem } from "./types";
import "./css/todo.css";

const DAY_NAMES = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const SWIPE_THRESHOLD = 50;

// TODO: 실제 API 연동 시 교체
const API_BASE = "/api/v1/employee-todos";
const MEMBER_ID = "1";

function parseInitialDate(dateParam: string | null): Date {
  if (dateParam) {
    const parsed = new Date(dateParam);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getOrgDisplayName(org: OrgGroup): string {
  return org.storeName ?? org.franchiseName ?? org.headOfficeName;
}

export default function TodoContents() {
  const searchParams = useSearchParams();
  const initialDate = parseInitialDate(searchParams.get("date"));

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [todoData, setTodoData] = useState<CalendarDayData[]>([]);
  const [loadedMonth, setLoadedMonth] = useState<string>("");

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const today = new Date();
  const isToday = isSameDay(selectedDate, today);

  // 선택된 날짜의 organizations
  const selectedDayData = todoData.find((d) => d.day === selectedDate.getDate());
  const organizations = selectedDayData?.organizations ?? [];

  // 월별 데이터 fetch
  const fetchMonthlyData = useCallback(
    async (year: number, month: number): Promise<CalendarDayData[]> => {
      try {
        const res = await fetch(
          `${API_BASE}/mobile/calendar/by-employee?memberId=${MEMBER_ID}&year=${year}&month=${month}`,
          {
            headers: {
              Authorization: `Bearer token`,
              affiliationId: "1",
              currentPath: window.location.pathname,
            },
          }
        );
        const json = await res.json();
        if (json.status === "SUCCESS") {
          return json.data as CalendarDayData[];
        }
      } catch {
        // API 실패 시 빈 배열
      }
      return [];
    },
    []
  );

  // 초기 로드 및 월 변경 시 데이터 로드
  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const monthKey = `${year}-${month}`;

    if (monthKey === loadedMonth) return;

    setLoadedMonth(monthKey);
    fetchMonthlyData(year, month).then(setTodoData);
  }, [selectedDate, loadedMonth, fetchMonthlyData]);

  // 날짜 변경
  const changeDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
    },
    []
  );

  // 하루 이동
  const moveDay = useCallback(
    (offset: number) => {
      setSelectedDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() + offset);
        return next;
      });
    },
    []
  );

  // 오늘로 복귀
  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  // TODO 상태 토글 (낙관적 업데이트)
  const toggleTodo = useCallback(
    async (todoId: number, currentCompleted: boolean) => {
      const newCompleted = !currentCompleted;

      // 낙관적 업데이트
      setTodoData((prev) =>
        prev.map((dayData) => ({
          ...dayData,
          completedCount:
            dayData.completedCount +
            (dayData.organizations.some((org) =>
              org.todos.some((t) => t.id === todoId)
            )
              ? newCompleted
                ? 1
                : -1
              : 0),
          incompleteCount:
            dayData.incompleteCount +
            (dayData.organizations.some((org) =>
              org.todos.some((t) => t.id === todoId)
            )
              ? newCompleted
                ? -1
                : 1
              : 0),
          organizations: dayData.organizations.map((org) => ({
            ...org,
            todos: org.todos.map((todo) =>
              todo.id === todoId ? { ...todo, isCompleted: newCompleted } : todo
            ),
          })),
        }))
      );

      // PATCH API 호출
      try {
        const res = await fetch(`${API_BASE}/${todoId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer token`,
            affiliationId: "1",
            currentPath: window.location.pathname,
          },
          body: JSON.stringify({ isCompleted: newCompleted }),
        });

        if (!res.ok) throw new Error("API failed");
      } catch {
        // 실패 시 롤백
        setTodoData((prev) =>
          prev.map((dayData) => ({
            ...dayData,
            completedCount:
              dayData.completedCount +
              (dayData.organizations.some((org) =>
                org.todos.some((t) => t.id === todoId)
              )
                ? newCompleted
                  ? -1
                  : 1
                : 0),
            incompleteCount:
              dayData.incompleteCount +
              (dayData.organizations.some((org) =>
                org.todos.some((t) => t.id === todoId)
              )
                ? newCompleted
                  ? 1
                  : -1
                : 0),
            organizations: dayData.organizations.map((org) => ({
              ...org,
              todos: org.todos.map((todo) =>
                todo.id === todoId
                  ? { ...todo, isCompleted: currentCompleted }
                  : todo
              ),
            })),
          }))
        );
      }
    },
    []
  );

  // 스와이프 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;

      // 수평이 수직보다 클 때만 + 50px 이상
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= SWIPE_THRESHOLD) {
        moveDay(dx > 0 ? -1 : 1);
      }

      touchStartRef.current = null;
    },
    [moveDay]
  );

  // 캘린더 탐색용 월 데이터 로드
  const handleMonthDataNeeded = useCallback(
    async (year: number, month: number): Promise<CalendarDayData[]> => {
      return fetchMonthlyData(year, month);
    },
    [fetchMonthlyData]
  );

  return (
    <div
      className="container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="todo-contents">
        <div className="sub-tit-wrap">
          <h2 className="sub-tit">TO-DO 체크</h2>
        </div>

        <TodoCalendar
          selectedDate={selectedDate}
          todoData={todoData}
          onDayClick={changeDate}
          onMonthDataNeeded={handleMonthDataNeeded}
        />

        {/* 일자 바 */}
        <div className="todo-date">
          <div className="todo-date-left">
            <span>
              {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일{" "}
              {DAY_NAMES[selectedDate.getDay()]}
            </span>
            {!isToday && (
              <button
                type="button"
                className="btn-form xs outline"
                onClick={goToToday}
              >
                오늘
              </button>
            )}
          </div>
        </div>

        {/* TODO 목록 */}
        <div className="todo-list-wrap">
          {organizations.length > 0 ? (
            organizations.map((org) => (
              <TodoOrgSection
                key={`${org.headOfficeId}-${org.franchiseId}-${org.storeId}`}
                org={org}
                onToggle={toggleTodo}
              />
            ))
          ) : (
            <div className="todo-empty">
              <p>할 일이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** 조직별 TODO 섹션 */
function TodoOrgSection({
  org,
  onToggle,
}: {
  org: OrgGroup;
  onToggle: (id: number, isCompleted: boolean) => void;
}) {
  return (
    <div className="todo-list-item">
      <h3 className="todo-list-item-tit">{getOrgDisplayName(org)}</h3>
      <div className="todo-check-wrap">
        {org.todos.map((todo) => (
          <TodoCheckItem key={todo.id} todo={todo} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

/** 개별 TODO 체크 아이템 */
function TodoCheckItem({
  todo,
  onToggle,
}: {
  todo: TodoItem;
  onToggle: (id: number, isCompleted: boolean) => void;
}) {
  return (
    <div className="todo-check-item">
      <div className="check-form-box">
        <input
          type="checkbox"
          id={`todo-${todo.id}`}
          checked={todo.isCompleted}
          onChange={() => onToggle(todo.id, todo.isCompleted)}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={todo.isCompleted ? "completed" : ""}
        >
          {todo.content}
        </label>
      </div>
    </div>
  );
}
