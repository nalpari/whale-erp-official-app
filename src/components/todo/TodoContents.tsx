"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useStoreStore } from "@/store/useStoreStore";
import { useDeleteTodos } from "@/hooks/queries/use-todo-queries";
import TodoCalendar from "./TodoCalendar";
import type { CalendarDayData, OrgGroup, EmployeeGroup, TodoItem } from "./types";
import "./css/todo.scss";

const DAY_NAMES = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const SWIPE_THRESHOLD = 50;

const API_BASE = "/api/v1/employee-todos";

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

export default function TodoContents() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialDate = parseInitialDate(searchParams.get("date"));

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [todoData, setTodoData] = useState<CalendarDayData[]>([]);

  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId);
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice);
  const selectedStore = useStoreStore((state) => state.selectedStore);
  const headOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? null;
  const storeId = selectedStore?.id ?? null;

  const deleteTodosMutation = useDeleteTodos();

  const loadedMonthRef = useRef<string>("");
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const today = new Date();
  const isToday = isSameDay(selectedDate, today);

  // 선택된 날짜의 organizations
  const selectedDayData = todoData.find((d) => d.day === selectedDate.getDate());
  const organizations = selectedDayData?.organizations ?? [];

  // 월별 데이터 fetch (headOfficeId 필수)
  const fetchMonthlyData = useCallback(
    async (year: number, month: number): Promise<CalendarDayData[]> => {
      if (!headOfficeId) return [];

      try {
        const params: Record<string, number> = { year, month, headOfficeId };
        if (storeId) params.storeId = storeId;

        const res = await api.get(
          `${API_BASE}/mobile/calendar`,
          { params }
        );
        if (res.data.success || res.data.status === "SUCCESS") {
          return res.data.data as CalendarDayData[];
        }
      } catch {
        // API 실패 시 빈 배열
      }
      return [];
    },
    [headOfficeId, storeId]
  );

  // 초기 로드 및 월/점포 변경 시 데이터 로드
  const cacheKey = useMemo(
    () => `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${headOfficeId}-${storeId}`,
    [selectedDate, headOfficeId, storeId]
  );

  // 데이터 리페치 함수
  const refetchCurrentMonth = useCallback(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    fetchMonthlyData(year, month).then(setTodoData);
  }, [selectedDate, fetchMonthlyData]);

  useEffect(() => {
    if (cacheKey === loadedMonthRef.current) return;

    loadedMonthRef.current = cacheKey;
    refetchCurrentMonth();
  }, [cacheKey, refetchCurrentMonth]);

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

  // 할 일 삭제
  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      if (!window.confirm("해당 할 일을 삭제하시겠습니까?")) return;

      try {
        await deleteTodosMutation.mutateAsync([todoId]);
        refetchCurrentMonth();
      } catch {
        alert("삭제에 실패했습니다.");
      }
    },
    [deleteTodosMutation, refetchCurrentMonth]
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
    <div className="container">
      <div
        className="todo-contents"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="sub-tit-wrap">
          <div className="sub-tit">TO-DO 체크</div>
          <div className="sub-btn-wrap">
            <button
              type="button"
              className="btn-s black"
              onClick={() => router.push("/todo/new")}
            >
              등록
            </button>
          </div>
        </div>

        <div className="sub-content-body">
          <div className="sub-item-bx">
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
            {organizations.length > 0 ? (
              storeId
                ? // 점포 선택됨 → 직원명을 메인 타이틀로, 할 일 바로 나열
                  organizations.flatMap((org) => org.employees).map((emp) => (
                    <TodoEmployeeFlatSection
                      key={emp.employeeInfoId}
                      employee={emp}
                      onDelete={handleDeleteTodo}
                    />
                  ))
                : // 점포 미선택 → 조직 → 직원 그룹핑
                  organizations.map((org) => (
                    <TodoOrgSection
                      key={`${org.headOfficeId}-${org.franchiseId}-${org.storeId}`}
                      org={org}
                      onDelete={handleDeleteTodo}
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
    </div>
  );
}

/** 조직명 표시 */
function getOrgDisplayName(org: OrgGroup): string {
  return org.storeName ?? org.franchiseName ?? org.headOfficeName;
}

/** 조직별 TODO 섹션 */
function TodoOrgSection({
  org,
  onDelete,
}: {
  org: OrgGroup;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="todo-org-section">
      <h3 className="todo-org-tit">
        <svg className="todo-org-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 14V3a1 1 0 011-1h4a1 1 0 011 1v11M8 14V7a1 1 0 011-1h4a1 1 0 011 1v7M1 14h14M4.5 4.5h1M4.5 7h1M4.5 9.5h1M10.5 8.5h1M10.5 11h1" stroke="#888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {getOrgDisplayName(org)}
      </h3>
      {org.employees.map((emp) => (
        <TodoEmployeeSection
          key={emp.employeeInfoId}
          employee={emp}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

/** 점포 선택 시 - 직원명을 메인 타이틀로 표시 */
function TodoEmployeeFlatSection({
  employee,
  onDelete,
}: {
  employee: EmployeeGroup;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="todo-org-section">
      <h3 className="todo-org-tit">{employee.employeeName}</h3>
      <div className="todo-check-wrap">
        {employee.todos.map((todo) => (
          <TodoCheckItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

/** 점포 미선택 시 - 조직 하위 직원별 TODO 섹션 */
function TodoEmployeeSection({
  employee,
  onDelete,
}: {
  employee: EmployeeGroup;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="todo-list-item">
      <h4 className="todo-list-item-tit">{employee.employeeName}</h4>
      <div className="todo-check-wrap">
        {employee.todos.map((todo) => (
          <TodoCheckItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

/** 개별 TODO 아이템 */
function TodoCheckItem({
  todo,
  onDelete,
}: {
  todo: TodoItem;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="todo-check-item">
      <span className={`badge ${todo.isCompleted ? "d-green" : "d-red"}`}>
        {todo.isCompleted ? "완료" : "미완료"}
      </span>
      <span className="todo-content">{todo.content}</span>
      <button
        type="button"
        className="todo-delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label="삭제"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="#999" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
