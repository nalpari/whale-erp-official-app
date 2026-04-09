"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useStoreStore } from "@/store/useStoreStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useAttendanceDetail } from "@/hooks/queries/use-commute-queries";
import {
  getAttendanceDayStatus,
  groupAttendanceRecords,
  calcWorkMinutes,
  formatMinutes,
  formatTime,
  toInputDate,
  getAvatarSrc,
} from "@/lib/commute-utils";
import type { AttendanceRecord, CommuteDayDisplayStatus, ContractWorkHour } from "@/types/commute";
import type { AttendanceRecordGroup } from "@/lib/commute-utils";

const WEEKDAY_TYPES = new Set(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]);

function formatH(minutes: number): string {
  if (minutes <= 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function groupContractWorkHours(items: ContractWorkHour[]): ContractWorkHour[] {
  const weekdays = items.filter((i) => WEEKDAY_TYPES.has(i.dayType));
  const others = items.filter((i) => !WEEKDAY_TYPES.has(i.dayType) && i.dayType !== "WEEKDAY");
  const weekdayEntry = items.find((i) => i.dayType === "WEEKDAY");

  const result: ContractWorkHour[] = [];

  if (weekdayEntry) {
    result.push(weekdayEntry);
  } else if (weekdays.length > 0) {
    result.push({ ...weekdays[0], dayType: "WEEKDAY" });
  }

  const saturday = others.find((i) => i.dayType === "SATURDAY");
  const sunday = others.find((i) => i.dayType === "SUNDAY");
  if (saturday) result.push(saturday);
  if (sunday) result.push(sunday);

  return result;
}

const WORKPLACE_TYPE_LABEL: Record<string, string> = {
  HEAD_OFFICE: "본사직원",
  FRANCHISE: "가맹점직원",
  STORE: "점포직원",
};

const DAY_TYPE_LABEL: Record<string, string> = {
  WEEKDAY: "평일",
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
  SUNDAY: "일요일",
};

function ContractWorkHourRow({ item }: { item: ContractWorkHour }) {
  const hasTime = item.workStartTime && item.workEndTime;
  const totalMin = hasTime
    ? calcWorkMinutes(item.workStartTime, item.workEndTime)
    : 0;
  const breakMin =
    item.isBreak && item.breakStartTime && item.breakEndTime
      ? calcWorkMinutes(item.breakStartTime, item.breakEndTime)
      : 0;
  const workMin = totalMin - breakMin;

  return (
    <div className="sub-item-bx">
      <div className="commute-time-wrap">
        <div className="commute-time-tit">
          {DAY_TYPE_LABEL[item.dayType] ?? item.dayType}
        </div>
        {hasTime ? (
          <div className="commute-time-data">
            <div className="commute-time-data-time">
              <span>{formatTime(item.workStartTime)}~{formatTime(item.workEndTime)}</span>
              <span>{formatH(totalMin)}</span>
            </div>
            <div className="commute-time-data-work">
              <div className="commute-time-data-work-item">
                <span className="badge d-green">근무</span>
                <span className="time">{formatH(workMin > 0 ? workMin : totalMin)}</span>
              </div>
              <div className="commute-time-data-work-item">
                <span className="badge brown">휴게</span>
                <span className="time">{breakMin > 0 ? formatH(breakMin) : "0h"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="commute-time-data">
            <span className="badge grey">미등록</span>
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_BADGE: Record<CommuteDayDisplayStatus, { label: string; className: string }> = {
  근무: { label: "근무", className: "badge d-green" },
  지연: { label: "지연", className: "badge l-org" },
  미출근: { label: "미출근", className: "badge grey" },
  결근: { label: "결근", className: "badge d-red" },
  휴일: { label: "휴일", className: "badge grey" },
};

function RecordRow({ record }: { record: AttendanceRecord }) {
  const workMin = calcWorkMinutes(record.workStartTime, record.workEndTime);
  const timeRange = record.workStartTime
    ? `${formatTime(record.workStartTime)}~${formatTime(record.workEndTime) || "진행 중"}`
    : "-";

  const hasFullRecord = record.workStartTime && record.workEndTime;
  const hasContract = record.contractStartTime && record.contractEndTime;
  const totalMin = Math.floor(workMin);

  let badgeClass: string;
  let badgeLabel: string;

  if (hasFullRecord) {
    badgeClass = STATUS_BADGE["근무"].className;
    badgeLabel = STATUS_BADGE["근무"].label;
  } else if (hasContract && !record.workStartTime) {
    const [year, month, day] = record.date.split("-").map(Number);
    const recordDate = new Date(year, month - 1, day);
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (recordDate < todayMidnight) {
      badgeClass = STATUS_BADGE["결근"].className;
      badgeLabel = STATUS_BADGE["결근"].label;
    } else {
      badgeClass = STATUS_BADGE["지연"].className;
      badgeLabel = STATUS_BADGE["지연"].label;
    }
  } else {
    const status = getAttendanceDayStatus(record);
    const badge = STATUS_BADGE[status];
    badgeClass = badge.className;
    badgeLabel = badge.label;
  }

  return (
    <div className="commute-list-data-item">
      <div className="commute-list-data-time">{timeRange}</div>
      <div className="commute-list-data-work">
        <span className={badgeClass}>{badgeLabel}</span>
        {hasFullRecord && (
          <span className="time">{Math.floor(totalMin / 60)}시간 {totalMin % 60}분</span>
        )}
      </div>
    </div>
  );
}

function AttendanceGroupRow({ group }: { group: AttendanceRecordGroup }) {
  const badge = STATUS_BADGE[group.status];
  const dateLabel = `${group.date.slice(5).replace("-", ".")} ${group.day.slice(0, 1)}`;
  const hasWorkTime = group.records.some((r) => r.workStartTime !== null);

  if (group.status === "휴일" && !hasWorkTime) {
    return (
      <div className="commute-list-item rest">
        <div className="commute-list-tit">
          <span className={badge.className}>{badge.label}</span>
          <span>{dateLabel}</span>
        </div>
      </div>
    );
  }

  // 계약 없고 출근기록도 없을 때만 날짜만 표시 (화면정의서 Note #10: 출근기록 있으면 계약 없어도 근무 표시)
  if (!group.hasContract && !group.records.some((r) => r.workStartTime !== null)) {
    return (
      <div className="commute-list-item">
        <div className="commute-list-tit">{dateLabel}</div>
      </div>
    );
  }

  if (group.status === "결근" || group.status === "미출근") {
    return (
      <div className="commute-list-item">
        <div className="commute-list-tit">{dateLabel}</div>
        <div className="commute-list-data">
          <div className="commute-list-data-item">
            <div className="commute-list-data-work">
              <span className={badge.className}>{badge.label}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`commute-list-item${group.isHoliday ? " rest" : ""}`}>
      <div className="commute-list-tit">
        {group.isHoliday && (
          <span className={STATUS_BADGE["휴일"].className}>
            {STATUS_BADGE["휴일"].label}
          </span>
        )}
        <span>{dateLabel}</span>
        {group.records.length > 1 && (
          <span className="time">총 {formatMinutes(group.totalMinutes)}</span>
        )}
      </div>
      <div className="commute-list-data">
        {group.records.map((record, index) => (
          <RecordRow
            key={record.recordId ?? `${record.date}-empty-${index}`}
            record={record}
          />
        ))}
      </div>
    </div>
  );
}

export default function CommuteDetail({ employeeId }: { employeeId: number }) {
  const setTitle = useHeaderStore((s) => s.setTitle);

  useEffect(() => {
    setTitle("출퇴근 현황");
    return () => setTitle("");
  }, [setTitle]);

  const officeId = useStoreStore((s) => s.selectedHeadOffice?.id);
  const storeId = useStoreStore((s) => s.selectedStore?.id);
  const storeFranchiseId = useStoreStore((s) => s.selectedStore?.franchiseId);
  const authFranchiseId = useAuthStore((s) => s.franchiseId);
  const franchiseId = storeFranchiseId ?? authFranchiseId;

  const [from, setFrom] = useState(() => {
    const today = new Date();
    const d = new Date(today);
    d.setDate(today.getDate() - 6);
    return toInputDate(d);
  });
  const [to, setTo] = useState(() => toInputDate(new Date()));
  const [queryFrom, setQueryFrom] = useState(from);
  const [queryTo, setQueryTo] = useState(to);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useAttendanceDetail(
    {
      officeId: officeId ?? 0,
      franchiseId: franchiseId ?? undefined,
      storeId,
      employeeId,
      from: queryFrom,
      to: queryTo,
    },
    !!officeId && !!employeeId
  );

  useEffect(() => {
    if (isError) console.error('[CommuteDetail] 근무현황 조회 실패:', error)
  }, [isError, error])

  const handleSearch = () => {
    setQueryFrom(from);
    setQueryTo(to);
  };

  return (
    <div className="container sub">
      <div className="sub-content-body">
        {/* 프로필 */}
        <div className="commute-profile">
          <div className="profile-img">
            <Image
              src={getAvatarSrc(data?.iconType ?? 0)}
              alt="profile-img"
              width={64}
              height={64}
              priority
            />
          </div>
          <div className="profile-info">
            <div className="profile-name">{data?.employeeName ?? "-"}님</div>
            {(data?.rank || data?.position) && (
              <div className="profile-job">
                {data.rank && <span>{data.rank}</span>}
                {data.position && <span>{data.position}</span>}
              </div>
            )}
          </div>
          <div className="profile-data">
            {data?.employeeNumber && (
              <span className="badge grey">{data.employeeNumber}</span>
            )}
            {data?.workplaceType && (
              <span className="badge grey">
                {WORKPLACE_TYPE_LABEL[data.workplaceType] ?? data.workplaceType}
              </span>
            )}
            {data?.contractClassification && (
              <span className="badge grey">{data.contractClassification}</span>
            )}
            {data?.workStatus && (
              <span className="badge d-green line">{data.workStatus}</span>
            )}
          </div>
        </div>

        {/* 소속 정보 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-item-bx">
              <table className="info-table">
                <colgroup>
                  <col style={{ width: "70px" }} />
                  <col />
                </colgroup>
                <tbody>
                  {data?.officeName && (
                    <tr>
                      <th>본사</th>
                      <td>{data.officeName}</td>
                    </tr>
                  )}
                  {data?.franchiseName && (
                    <tr>
                      <th>가맹점</th>
                      <td>{data.franchiseName}</td>
                    </tr>
                  )}
                  {data?.storeName && (
                    <tr>
                      <th>점포</th>
                      <td>{data.storeName}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 근무시간 */}
        {(data?.contractWorkHours?.length ?? 0) > 0 && (
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-cont-tit-wrap">
                <div className="sub-cont-tit">근무시간</div>
              </div>
              {groupContractWorkHours(data?.contractWorkHours ?? []).map((item) => (
                <ContractWorkHourRow key={item.dayType} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* 근무현황 */}
        <div className="sub-cont-wrap">
          <div className="sub-cont-item-wrap">
            <div className="sub-cont-tit-wrap">
              <div className="sub-cont-tit">
                근무현황<span className="imp"> *</span>
              </div>
            </div>

            {/* 날짜 범위 검색 */}
            <div className="commute-date-search">
              <div className="flex g8 mb8">
                <div className="date-picker-custom">
                  <input
                    type="date"
                    className="date-picker-input"
                    value={from}
                    max={to}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
                <span>~</span>
                <div className="date-picker-custom">
                  <input
                    type="date"
                    className="date-picker-input"
                    value={to}
                    min={from}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="block">
                <button
                  className="btn-form block grey"
                  onClick={handleSearch}
                >
                  검색
                </button>
              </div>
            </div>

            {/* 근무 기록 목록 */}
            {/* TODO: 공통 로딩 화면으로 교체 (상세 조회) */}
            {isLoading ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#999" }}>
                불러오는 중...
              </div>
            ) : isError ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#e74c3c" }}>
                데이터를 불러오지 못했습니다.
              </div>
            ) : (
              <div className="commute-list-wrap">
                {groupAttendanceRecords(data?.record ?? []).map((group) => (
                  <AttendanceGroupRow
                    key={group.date}
                    group={group}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
