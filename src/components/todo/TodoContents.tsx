"use client";

import { useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useStoreStore } from "@/store/useStoreStore";
import { usePopupControler } from "@/store/usePopupControler";
import { useDeleteTodos, useCalendarData } from "@/hooks/queries/use-todo-queries";
import { getCalendarData } from "@/lib/api/todo";
import TodoCalendar from "@/components/todo/TodoCalendar";
import type { CalendarDayData, OrgGroup, EmployeeGroup, TodoItem } from "@/types/todo";
import "./css/todo.scss";

const DAY_NAMES = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const SWIPE_THRESHOLD = 50;

function parseInitialDate(dateParam: string | null): Date {
  if (dateParam) {
    const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateParam);
    if (matched) {
      const [, year, month, day] = matched;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    const parsed = new Date(dateParam);
    if (!Number.isNaN(parsed.getTime())) return parsed;
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

  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId);
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice);
  const selectedStore = useStoreStore((state) => state.selectedStore);
  const headOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? null;
  const storeId = selectedStore?.id ?? null;

  const openAlert = usePopupControler((state) => state.openAlert);
  const { mutateAsync: deleteTodos } = useDeleteTodos();

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const today = new Date();
  const isToday = isSameDay(selectedDate, today);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  // React Query로 월별 데이터 조회
  const { data: todoData = [], isLoading, isError } = useCalendarData(year, month, headOfficeId, storeId);

  // 선택된 날짜의 organizations
  const selectedDayData = todoData.find((d) => d.day === selectedDate.getDate());
  const organizations = selectedDayData?.organizations ?? [];

  // 캘린더 스와이프 시 다른 월 데이터 가져오기 (browseMonth 용)
  const fetchMonthlyData = useCallback(
    async (y: number, m: number): Promise<CalendarDayData[]> => {
      if (!headOfficeId) return [];
      try {
        return await getCalendarData({
          year: y,
          month: m,
          headOfficeId,
          ...(storeId ? { storeId } : {}),
        });
      } catch (err) {
        console.error('[TodoContents] 월별 데이터 조회 실패:', { year: y, month: m }, err);
        openAlert({ message: "일정을 불러오지 못했습니다. 다시 시도해주세요." });
        return [];
      }
    },
    [headOfficeId, openAlert, storeId]
  );

  // 날짜 변경
  const changeDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // 하루 이동
  const moveDay = useCallback((offset: number) => {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + offset);
      return next;
    });
  }, []);

  // 오늘로 복귀
  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  // 할 일 삭제
  const handleDeleteTodo = useCallback(
    (todoId: number) => {
      openAlert({
        message: "해당 할 일을 삭제하시겠습니까?",
        confirmText: "삭제",
        cancelText: "취소",
        onConfirm: async () => {
          try {
            await deleteTodos([todoId]);
          } catch (err) {
            console.error("[TodoContents] 삭제 실패:", err);
            openAlert({ message: "삭제에 실패했습니다. 다시 시도해주세요." });
          }
        },
      });
    },
    [openAlert, deleteTodos]
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

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= SWIPE_THRESHOLD) {
        moveDay(dx > 0 ? -1 : 1);
      }

      touchStartRef.current = null;
    },
    [moveDay]
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
              onMonthDataNeeded={fetchMonthlyData}
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
            {isLoading ? (
              <div className="todo-empty">
                <p>불러오는 중...</p>
              </div>
            ) : isError ? (
              <div className="todo-empty">
                <p>데이터를 불러오지 못했습니다.</p>
              </div>
            ) : organizations.length > 0 ? (
              storeId
                ? organizations.flatMap((org, orgIdx) =>
                    org.employees.map((emp) => (
                      <TodoEmployeeFlatSection
                        key={`${orgIdx}-${emp.employeeInfoId}`}
                        employee={emp}
                        onDelete={handleDeleteTodo}
                      />
                    ))
                  )
                : organizations.map((org) => (
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
