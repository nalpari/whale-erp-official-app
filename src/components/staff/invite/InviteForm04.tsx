'use client'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { useStaffInviteStore } from '@/store/useStaffInviteStore'
import type { EmploymentContractWorkHourDto } from '@/types/employee'

const WEEKDAYS = [
  { label: '월', dayType: 'MONDAY' },
  { label: '화', dayType: 'TUESDAY' },
  { label: '수', dayType: 'WEDNESDAY' },
  { label: '목', dayType: 'THURSDAY' },
  { label: '금', dayType: 'FRIDAY' },
] as const

/** workHours 배열에서 특정 dayType의 데이터를 찾거나 기본값 반환 */
const findWorkHour = (
  workHours: EmploymentContractWorkHourDto[],
  dayType: string,
): EmploymentContractWorkHourDto => {
  return (
    workHours.find((wh) => wh.dayType === dayType) ?? {
      dayType: dayType as EmploymentContractWorkHourDto['dayType'],
      isWork: false,
      isBreak: false,
    }
  )
}

/** HH:mm:ss → HH:mm 표시 */
const formatTime = (time?: string | null) => {
  if (!time) return '시간 선택'
  return time.slice(0, 5)
}

export default function InviteForm04() {
  const setTimeSelectSheet = useBottomSheetControler(
    (state) => state.setTimeSelectSheet,
  )
  const { stepFour, setStepFour } = useStaffInviteStore()
  const { workHours } = stepFour

  const weekdayData = findWorkHour(workHours, 'WEEKDAY')
  const saturdayData = findWorkHour(workHours, 'SATURDAY')
  const sundayData = findWorkHour(workHours, 'SUNDAY')

  const updateWorkHour = (
    dayType: string,
    updates: Partial<EmploymentContractWorkHourDto>,
  ) => {
    const newWorkHours = workHours.map((wh) =>
      wh.dayType === dayType ? { ...wh, ...updates } : wh,
    )
    setStepFour({ workHours: newWorkHours })
  }

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-cont-tit-wrap">
          <div className="sub-cont-tit">
            계약 근무시간 <span className="imp">*</span>
          </div>
        </div>

        {/* 평일 - 정의서 #1-1,1-2,1-4 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">평일</div>
            <div>
              <div className="block mb8">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(weekdayData.workStartTime)}
                </button>
              </div>
              <div className="block">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(weekdayData.workEndTime)}
                </button>
              </div>
            </div>
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">휴게시간</div>
            <div>
              <div className="block mb8">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(weekdayData.breakStartTime)}
                </button>
              </div>
              <div className="block">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(weekdayData.breakEndTime)}
                </button>
              </div>
            </div>
          </div>
          {/* 정의서 #13: 요일별 근무 여부 체크 */}
          <div className="data-filed">
            <div className="filed-tit sub">근무요일</div>
            <div className="flex g8">
              {WEEKDAYS.map((day) => (
                <button key={day.dayType} className="day-btn act">
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 토요일 - 정의서 #14,14-1 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">토요일</div>
            <div>
              <div className="block mb8">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(saturdayData.workStartTime)}
                </button>
              </div>
              <div className="block">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(saturdayData.workEndTime)}
                </button>
              </div>
            </div>
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">휴게시간</div>
            <div>
              <div className="block mb8">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(saturdayData.breakStartTime)}
                </button>
              </div>
              <div className="block">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(saturdayData.breakEndTime)}
                </button>
              </div>
            </div>
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">격주근무 여부</div>
            <div className="flex g8">
              <button
                className={`radio-btn block blue${saturdayData.everySaturdayWork ? ' act' : ''}`}
                onClick={() => updateWorkHour('SATURDAY', { everySaturdayWork: true })}
              >
                매주 근무
              </button>
              <button
                className={`radio-btn block blue${!saturdayData.everySaturdayWork ? ' act' : ''}`}
                onClick={() => updateWorkHour('SATURDAY', { everySaturdayWork: false })}
              >
                격주 근무
              </button>
            </div>
          </div>
          {!saturdayData.everySaturdayWork && (
            <div className="data-filed">
              <div className="filed-tit sub">격주근무 시작일</div>
              <div className="block">
                <div className="date-picker-custom">
                  <input
                    type="date"
                    className="date-picker-input"
                    value={saturdayData.firstSaturdayWorkDay || ''}
                    onChange={(e) =>
                      updateWorkHour('SATURDAY', {
                        firstSaturdayWorkDay: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 일요일 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">일요일</div>
            <div>
              <div className="block mb8">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(sundayData.workStartTime)}
                </button>
              </div>
              <div className="block">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(sundayData.workEndTime)}
                </button>
              </div>
            </div>
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">브레이크타임</div>
            <div>
              <div className="block mb8">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(sundayData.breakStartTime)}
                </button>
              </div>
              <div className="block">
                <button
                  className="select-form al-l"
                  onClick={() => setTimeSelectSheet(true)}
                >
                  {formatTime(sundayData.breakEndTime)}
                </button>
              </div>
            </div>
          </div>
          <div className="data-filed">
            <div className="filed-tit sub">격주근무 여부</div>
            <div className="flex g8">
              <button
                className={`radio-btn block blue${sundayData.everySundayWork ? ' act' : ''}`}
                onClick={() => updateWorkHour('SUNDAY', { everySundayWork: true })}
              >
                매주 근무
              </button>
              <button
                className={`radio-btn block blue${!sundayData.everySundayWork ? ' act' : ''}`}
                onClick={() => updateWorkHour('SUNDAY', { everySundayWork: false })}
              >
                격주 근무
              </button>
            </div>
          </div>
          {!sundayData.everySundayWork && (
            <div className="data-filed">
              <div className="filed-tit sub">격주근무 시작일</div>
              <div className="block">
                <div className="date-picker-custom">
                  <input
                    type="date"
                    className="date-picker-input"
                    value={sundayData.firstSundayWorkDay || ''}
                    onChange={(e) =>
                      updateWorkHour('SUNDAY', {
                        firstSundayWorkDay: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
