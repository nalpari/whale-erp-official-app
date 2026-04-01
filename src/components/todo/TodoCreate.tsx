"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useStoreStore } from "@/store/useStoreStore";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useCreateTodo } from "@/hooks/queries/use-todo-queries";
import { useEmployeeOptions } from "@/hooks/queries/use-todo-queries";
import { getErrorMessage } from "@/lib/api";
import "./css/todo.scss";

export default function TodoCreate() {
  const router = useRouter();

  const authHeadOfficeId = useAuthStore((state) => state.headOfficeId);
  const selectedHeadOffice = useStoreStore((state) => state.selectedHeadOffice);
  const selectedStore = useStoreStore((state) => state.selectedStore);

  const headOfficeId = authHeadOfficeId ?? selectedHeadOffice?.id ?? undefined;
  const storeId = selectedStore?.id ?? undefined;

  const [employeeInfoId, setEmployeeInfoId] = useState<number | "">("");
  const [content, setContent] = useState("");
  const [hasPeriod, setHasPeriod] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const { mutateAsync: createTodo, isPending: isCreating } = useCreateTodo();

  const { data: employees = [] } = useEmployeeOptions(
    {
      purpose: "BROAD",
      headOfficeId,
      storeId,
    },
    !!headOfficeId
  );

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!employeeInfoId) newErrors.employee = "* 필수 입력 항목입니다.";
    if (!content.trim()) newErrors.content = "* 필수 입력 항목입니다.";
    if (!startDate) newErrors.startDate = "* 필수 입력 항목입니다.";
    if (hasPeriod && !endDate) newErrors.endDate = "* 필수 입력 항목입니다.";
    if (hasPeriod && endDate && endDate < startDate) {
      newErrors.endDate = "* 종료일은 시작일 이후여야 합니다.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [employeeInfoId, content, startDate, hasPeriod, endDate]);

  const handleSubmit = useCallback(async () => {
    if (isCreating) return;
    if (!validate()) return;
    setSubmitError("");

    try {
      await createTodo(
        hasPeriod
          ? {
              headOfficeId: headOfficeId ?? undefined,
              storeId: storeId ?? undefined,
              employeeInfoId: Number(employeeInfoId),
              content: content.trim(),
              hasPeriod: true,
              startDate,
              endDate,
            }
          : {
              headOfficeId: headOfficeId ?? undefined,
              storeId: storeId ?? undefined,
              employeeInfoId: Number(employeeInfoId),
              content: content.trim(),
              hasPeriod: false,
              startDate,
            },
      );
      router.push(`/todo?date=${startDate}`);
    } catch (err) {
      setSubmitError(getErrorMessage(err, "등록에 실패했습니다."));
    }
  }, [
    validate,
    employeeInfoId,
    content,
    hasPeriod,
    startDate,
    endDate,
    headOfficeId,
    storeId,
    isCreating,
    createTodo,
    router,
  ]);

  // 헤더 저장 버튼 연동
  const setOnSave = useHeaderStore((s) => s.setOnSave);
  useEffect(() => {
    setOnSave(() => handleSubmit());
    return () => setOnSave(null);
  }, [handleSubmit, setOnSave]);

  return (
    <div className="container sub">
      <div className="sub-content-body">
        <div className="sub-item-bx todo-create-form">
          {/* 직원 선택 */}
          <div className="data-filed">
            <div className="filed-tit">
              직원 <span className="imp">*</span>
            </div>
            <div className="block">
              <select
                className="select-form"
                value={employeeInfoId}
                onChange={(e) => {
                  setEmployeeInfoId(e.target.value ? Number(e.target.value) : "");
                  setErrors((prev) => ({ ...prev, employee: "" }));
                }}
              >
                <option value="">직원을 선택해주세요</option>
                {employees.map((emp) => (
                  <option key={emp.employeeInfoId} value={emp.employeeInfoId}>
                    {emp.employeeName} ({emp.employeeNumber})
                  </option>
                ))}
              </select>
            </div>
            {errors.employee && (
              <div className="warning mt5">{errors.employee}</div>
            )}
          </div>

          {/* 할 일 내용 */}
          <div className="data-filed">
            <div className="filed-tit">
              할 일 내용 <span className="imp">*</span>
            </div>
            <div className="block">
              <textarea
                className="textarea-form"
                placeholder="할 일 내용을 입력해주세요"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setErrors((prev) => ({ ...prev, content: "" }));
                }}
                rows={3}
              />
            </div>
            {errors.content && (
              <div className="warning mt5">{errors.content}</div>
            )}
          </div>

          {/* 기간 */}
          <div className="data-filed">
            <div className="filed-tit" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>기간 <span className="imp">*</span></span>
              <div className="toggle-wrap">
                <div className="toggle-btn">
                  <input
                    type="checkbox"
                    id="has-period"
                    checked={hasPeriod}
                    onChange={(e) => {
                      setHasPeriod(e.target.checked);
                      if (!e.target.checked) {
                        setEndDate("");
                        setErrors((prev) => ({ ...prev, endDate: "" }));
                      }
                    }}
                  />
                  <label className="slider" htmlFor="has-period" style={{ textIndent: "-9999px" }}>
                    기간 설정
                  </label>
                </div>
              </div>
            </div>
            <div className={hasPeriod ? "flex g8" : "block"}>
              <div className={hasPeriod ? "flex-1" : "block"}>
                <input
                  type="date"
                  className="input-frame"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setErrors((prev) => ({ ...prev, startDate: "" }));
                  }}
                />
              </div>
              {hasPeriod && (
                <>
                  <span style={{ display: "flex", alignItems: "center" }}>~</span>
                  <div className="flex-1">
                    <input
                      type="date"
                      className="input-frame"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setErrors((prev) => ({ ...prev, endDate: "" }));
                      }}
                    />
                  </div>
                </>
              )}
            </div>
            {errors.startDate && (
              <div className="warning mt5">{errors.startDate}</div>
            )}
            {errors.endDate && (
              <div className="warning mt5">{errors.endDate}</div>
            )}
          </div>

          {submitError && (
            <div className="warning mt5">{submitError}</div>
          )}
        </div>
      </div>
    </div>
  );
}
