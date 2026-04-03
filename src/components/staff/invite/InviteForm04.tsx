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

const formatTime = (time?: string | null) => {
  if (!time) return '시간 선택'
  return time.slice(0, 5)
}

/** HH:mm → HH:mm:ss */
const toTimeString = (time: string | null): string | null => {
  if (!time) return null
  return time.length === 5 ? `${time}:00` : time
}

export default function InviteForm04() {
  const openTimePicker = useBottomSheetControler(
    (state) => state.openTimePicker,
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

  const openTimeFor = (
    dayType: string,
    field: 'workStartTime' | 'workEndTime' | 'breakStartTime' | 'breakEndTime',
    title: string,
  ) => {
    const wh = findWorkHour(workHours, dayType)
    const current = wh[field] ? formatTime(wh[field]) : ''
    openTimePicker(title, current, (time) => {
      updateWorkHour(dayType, { [field]: toTimeString(time) })
    })
  }

  return (
    <div className="sub-cont-wrap">
      <div className="sub-cont-item-wrap">
        <div className="sub-cont-tit-wrap">
          <div className="sub-cont-tit">
            계약 근무시간 <span className="imp">*</span>
          </div>
        </div>

        {/* 평일 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="store-img-list-tit">평일</div>
            <div>
              <div className="block mb8">
                <button
                  className="select-form al-l"
                  onClick={() => openTimeFor('WEEKDAY', 'workStartTime', '평일 시작시간')}
                >
                  {formatTime(weekdayData.workStartTime)}
                </button>
              </div>
              <div className="block">
                <button
                  className="select-form al-l"
                  onClick={() => openTimeFor('WEEKDAY', 'workEndTime', '평일 종료시간')}
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
                  onClick={() => openTimeFor('WEEKDAY', 'breakStartTime', '평일 휴게 시작')}
                >
                  {formatTime(weekdayData.breakStartTime)}
                </button>
              </div>
              <div className="block">
                <button
                  className="select-form al-l"
                  onClick={() => openTimeFor('WEEKDAY', 'breakEndTime', '평일 휴게 종료')}
                >
                  {formatTime(weekdayData.breakEndTime)}
                </button>
              </div>
            </div>
          </div>
          {/* 근무요일 토글 */}
          <div className="data-filed">
            <div className="filed-tit sub">근무요일</div>
            <div className="flex g8">
              {WEEKDAYS.map((day) => {
                const dayWh = workHours.find((wh) => wh.dayType === day.dayType)
                const isActive = dayWh ? dayWh.isWork : true
                return (
                  <button
                    key={day.dayType}
                    className={`day-btn${isActive ? ' act' : ''}`}
                    onClick={() => {
                      const exists = workHours.some((wh) => wh.dayType === day.dayType)
                      if (exists) {
                        const newWorkHours = workHours.map((wh) =>
                          wh.dayType === day.dayType ? { ...wh, isWork: !wh.isWork } : wh,
                        )
                        setStepFour({ workHours: newWorkHours })
                      } else {
                        setStepFour({
                          workHours: [...workHours, { dayType: day.dayType, isWork: true, isBreak: false }],
                        })
                      }
                    }}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 토요일 */}
        <div className="sub-item-bx">
          <div className="data-filed">
            <div className="tit-head">
              <div className="store-img-list-tit">토요일</div>
              <div className="auto-right">
                <button
                  className={`radio-btn block blue${saturdayData.isWork ? ' act' : ''}`}
                  onClick={() => updateWorkHour('SATURDAY', { isWork: !saturdayData.isWork })}
                >
                  {saturdayData.isWork ? '근무' : '휴무'}
                </button>
              </div>
            </div>
            {saturdayData.isWork && (
              <div>
                <div className="block mb8">
                  <button
                    className="select-form al-l"
                    onClick={() => openTimeFor('SATURDAY', 'workStartTime', '토요일 시작시간')}
                  >
                    {formatTime(saturdayData.workStartTime)}
                  </button>
                </div>
                <div className="block">
                  <button
                    className="select-form al-l"
                    onClick={() => openTimeFor('SATURDAY', 'workEndTime', '토요일 종료시간')}
                  >
                    {formatTime(saturdayData.workEndTime)}
                  </button>
                </div>
              </div>
            )}
          </div>
          {saturdayData.isWork && (
            <div className="data-filed">
              <div className="filed-tit sub">휴게시간</div>
              <div>
                <div className="block mb8">
                  <button
                    className="select-form al-l"
                    onClick={() => openTimeFor('SATURDAY', 'breakStartTime', '토요일 휴게 시작')}
                  >
                    {formatTime(saturdayData.breakStartTime)}
                  </button>
                </div>
                <div className="block">
                  <button
                    className="select-form al-l"
                    onClick={() => openTimeFor('SATURDAY', 'breakEndTime', '토요일 휴게 종료')}
                  >
                    {formatTime(saturdayData.breakEndTime)}
                  </button>
                </div>
              </div>
            </div>
          )}
          {saturdayData.isWork && (
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
          )}
          {saturdayData.isWork && !saturdayData.everySaturdayWork && (
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
            <div className="tit-head">
              <div className="store-img-list-tit">일요일</div>
              <div className="auto-right">
                <button
                  className={`radio-btn block blue${sundayData.isWork ? ' act' : ''}`}
                  onClick={() => updateWorkHour('SUNDAY', { isWork: !sundayData.isWork })}
                >
                  {sundayData.isWork ? '근무' : '휴무'}
                </button>
              </div>
            </div>
            {sundayData.isWork && (
              <div>
                <div className="block mb8">
                  <button
                    className="select-form al-l"
                    onClick={() => openTimeFor('SUNDAY', 'workStartTime', '일요일 시작시간')}
                  >
                    {formatTime(sundayData.workStartTime)}
                  </button>
                </div>
                <div className="block">
                  <button
                    className="select-form al-l"
                    onClick={() => openTimeFor('SUNDAY', 'workEndTime', '일요일 종료시간')}
                  >
                    {formatTime(sundayData.workEndTime)}
                  </button>
                </div>
              </div>
            )}
          </div>
          {sundayData.isWork && (
            <div className="data-filed">
              <div className="filed-tit sub">브레이크타임</div>
              <div>
                <div className="block mb8">
                  <button
                    className="select-form al-l"
                    onClick={() => openTimeFor('SUNDAY', 'breakStartTime', '일요일 휴게 시작')}
                  >
                    {formatTime(sundayData.breakStartTime)}
                  </button>
                </div>
                <div className="block">
                  <button
                    className="select-form al-l"
                    onClick={() => openTimeFor('SUNDAY', 'breakEndTime', '일요일 휴게 종료')}
                  >
                    {formatTime(sundayData.breakEndTime)}
                  </button>
                </div>
              </div>
            </div>
          )}
          {sundayData.isWork && (
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
          )}
          {sundayData.isWork && !sundayData.everySundayWork && (
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
