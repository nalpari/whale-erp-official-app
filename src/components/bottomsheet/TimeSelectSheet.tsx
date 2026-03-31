'use client'
import { useState, useRef, useCallback } from 'react'
import { useBottomSheetControler } from '@/store/useBottomSheetControler'
import { Sheet } from 'react-modal-sheet'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { SwiperClass } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

export default function TimeSelectSheet() {
  const timePickerSheet = useBottomSheetControler((state) => state.timePickerSheet)
  const setTimePickerSheet = useBottomSheetControler((state) => state.setTimePickerSheet)
  const timePickerTitle = useBottomSheetControler((state) => state.timePickerTitle)
  const timePickerValue = useBottomSheetControler((state) => state.timePickerValue)
  const onTimeSelect = useBottomSheetControler((state) => state.onTimeSelect)

  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)

  const hourSwiperRef = useRef<SwiperClass | null>(null)
  const minuteSwiperRef = useRef<SwiperClass | null>(null)

  const handleOpenStart = useCallback(() => {
    if (timePickerValue) {
      const [h, m] = timePickerValue.split(':').map(Number)
      setHour(h)
      setMinute(m === 30 ? 1 : 0)
      // Swiper 초기 슬라이드 설정은 onSwiper에서 처리
    } else {
      setHour(9)
      setMinute(0)
    }
  }, [timePickerValue])

  const handleClose = () => {
    setTimePickerSheet(false)
  }

  const handleSave = () => {
    const hStr = String(hour).padStart(2, '0')
    const mStr = minute === 1 ? '30' : '00'
    onTimeSelect?.(`${hStr}:${mStr}`)
    handleClose()
  }

  return (
    <Sheet
      isOpen={timePickerSheet}
      onClose={handleClose}
      onOpenStart={handleOpenStart}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content disableDrag={true}>
          <div className="bottom-sheet time">
            <div className="bottom-sheet-header">
              <h3>{timePickerTitle || '시간설정'}</h3>
              <div className="bt-sh-btn-wrap">
                <button className="btn-s outline-g" onClick={handleSave}>
                  저장
                </button>
              </div>
            </div>
            <div className="bottom-sheet-body">
              <div className="time-select-wrap">
                <div className="time-swiper-wrap">
                  <div className="hour-swiper-wrap">
                    <Swiper
                      slidesPerView={3}
                      direction="vertical"
                      className="time-swiper"
                      centeredSlides={true}
                      spaceBetween={0}
                      loop={true}
                      initialSlide={hour}
                      onSwiper={(swiper) => {
                        hourSwiperRef.current = swiper
                      }}
                      onSlideChange={(swiper) => setHour(swiper.realIndex)}
                    >
                      {Array.from({ length: 24 }).map((_, index) => (
                        <SwiperSlide key={index}>
                          <div className="time-num">
                            {String(index).padStart(2, '0')}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="time-colon">:</div>
                  <div className="minute-swiper-wrap">
                    <Swiper
                      slidesPerView={3}
                      direction="vertical"
                      className="time-swiper"
                      centeredSlides={true}
                      spaceBetween={0}
                      initialSlide={minute}
                      onSwiper={(swiper) => {
                        minuteSwiperRef.current = swiper
                      }}
                      onSlideChange={(swiper) => setMinute(swiper.activeIndex)}
                    >
                      <SwiperSlide>
                        <div className="time-num">00</div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="time-num">30</div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  )
}
