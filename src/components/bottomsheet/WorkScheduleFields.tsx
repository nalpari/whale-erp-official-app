'use client'

interface WorkScheduleFieldsProps {
  fromDate: string
  toDate: string
  workStart: string
  workEnd: string
  breakStart: string
  breakEnd: string
  defaultDates: { from: string; to: string }
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  openTimePicker: (title: string, initialTime: string, onSelect: (time: string | null) => void) => void
  onWorkStartChange: (value: string) => void
  onWorkEndChange: (value: string) => void
  onBreakStartChange: (value: string) => void
  onBreakEndChange: (value: string) => void
}

export default function WorkScheduleFields({
  fromDate,
  toDate,
  workStart,
  workEnd,
  breakStart,
  breakEnd,
  defaultDates,
  onFromDateChange,
  onToDateChange,
  openTimePicker,
  onWorkStartChange,
  onWorkEndChange,
  onBreakStartChange,
  onBreakEndChange,
}: WorkScheduleFieldsProps) {
  return (
    <>
      <div className="sheet-data-filed">
        <div className="filed-tit">
          기간 선택<span className="imp">*</span>
        </div>
        <div className="flex g8">
          <div className="date-picker-custom">
            <input
              type="date"
              className="date-picker-input"
              value={fromDate}
              min={defaultDates.from || undefined}
              max={toDate || defaultDates.to || undefined}
              onChange={(e) => onFromDateChange(e.target.value)}
            />
          </div>
          <span>~</span>
          <div className="date-picker-custom">
            <input
              type="date"
              className="date-picker-input"
              value={toDate}
              min={fromDate || defaultDates.from || undefined}
              max={defaultDates.to || undefined}
              onChange={(e) => onToDateChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="sheet-data-filed">
        <div className="filed-tit">
          근무시간<span className="imp">*</span>
        </div>
        <div className="flex g8">
          <div className="block">
            <button
              className="select-form al-l"
              onClick={() => openTimePicker('근무 시작시간', workStart || '09:00', (t) => onWorkStartChange(t ?? ''))}
            >
              {workStart || '시작시간'}
            </button>
          </div>
          <div className="block">
            <button
              className="select-form al-l"
              onClick={() => openTimePicker('근무 종료시간', workEnd || '18:00', (t) => onWorkEndChange(t ?? ''))}
            >
              {workEnd || '종료시간'}
            </button>
          </div>
        </div>
      </div>
      <div className="sheet-data-filed">
        <div className="filed-tit">휴게시간</div>
        <div className="flex g8">
          <div className="block">
            <button
              className="select-form al-l"
              onClick={() => openTimePicker('휴게 시작시간', breakStart || '12:00', (t) => onBreakStartChange(t ?? ''))}
            >
              {breakStart || '시작시간'}
            </button>
          </div>
          <div className="block">
            <button
              className="select-form al-l"
              onClick={() => openTimePicker('휴게 종료시간', breakEnd || '13:00', (t) => onBreakEndChange(t ?? ''))}
            >
              {breakEnd || '종료시간'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
