'use client'

interface TimelineBarProps {
  workStartTime: string | null
  workEndTime: string | null
  breakStartTime: string | null
  breakEndTime: string | null
  hasWork: boolean
  hasBreak: boolean
}

// 00시~23시 (24시간)
const HOURS = Array.from({ length: 24 }, (_, i) => i)

function timeToMinutes(time: string | null): number | null {
  if (!time) return null
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function isInRange(minutes: number, start: number | null, end: number | null): boolean {
  if (start === null || end === null) return false
  if (start <= end) {
    return minutes >= start && minutes < end
  }
  return minutes >= start || minutes < end
}

/**
 * 30분 단위 셀의 CSS 클래스 결정:
 * - hasWork가 true이고 근무 범위 안이면서 휴게 범위가 아닌 경우 → "half" (채워진 색)
 * - 그 외 모든 경우 (범위 밖, 휴게 중, hasWork=false) → "half rest" (빈 셀)
 */
function getHalfClass(
  halfStart: number,
  workStart: number | null,
  workEnd: number | null,
  breakStart: number | null,
  breakEnd: number | null,
  hasWork: boolean,
  hasBreak: boolean,
): string {
  const inWork = hasWork && isInRange(halfStart, workStart, workEnd)
  const inBreak = hasBreak && isInRange(halfStart, breakStart, breakEnd)

  if (inWork && !inBreak) return 'half'
  return 'half rest'
}

export default function TimelineBar({
  workStartTime,
  workEndTime,
  breakStartTime,
  breakEndTime,
  hasWork,
  hasBreak,
}: TimelineBarProps) {
  const workStart = timeToMinutes(workStartTime)
  const workEnd = timeToMinutes(workEndTime)
  const breakStart = timeToMinutes(breakStartTime)
  const breakEnd = timeToMinutes(breakEndTime)

  return (
    <div className="plan-table">
      <div className="time-wrap">
        <div className="time-hour-wrap">
          {HOURS.map((hour) => {
            const first = getHalfClass(
              hour * 60,
              workStart, workEnd, breakStart, breakEnd,
              hasWork, hasBreak,
            )
            const second = getHalfClass(
              hour * 60 + 30,
              workStart, workEnd, breakStart, breakEnd,
              hasWork, hasBreak,
            )

            return (
              <div key={hour} className="time-hour">
                <span className={first} />
                <span className={second} />
              </div>
            )
          })}
        </div>
        <div className="time-num">
          {HOURS.map((hour) => (
            <span key={hour} className="hour">
              {String(hour).padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
