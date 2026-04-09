"use client";
import { useState } from "react";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { useMinimumWage } from "@/hooks/queries/use-contract-queries";
import { Sheet } from "react-modal-sheet";

export default function ContractOptionSheet() {
  const contractOptionSheet = useBottomSheetControler((s) => s.contractOptionSheet);
  const setContractOptionSheet = useBottomSheetControler((s) => s.setContractOptionSheet);
  const storeYear = useBottomSheetControler((s) => s.contractOptionYear);
  const storeTimelyAmount = useBottomSheetControler((s) => s.contractOptionTimelyAmount);
  const storeWeeklyHours = useBottomSheetControler((s) => s.contractOptionWeeklyHours);
  const storeOnChange = useBottomSheetControler((s) => s.contractOptionOnChange);

  const defaultYear = new Date().getFullYear();

  const [year, setYear] = useState(defaultYear);
  const [timelyAmount, setTimelyAmount] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(40);

  const { data: minimumWageData, isLoading: isMinWageLoading } = useMinimumWage(year);
  const minimumWage = minimumWageData?.minimumWage ?? 0;
  const minimumWageLabel = isMinWageLoading
    ? '...'
    : minimumWage
      ? `${minimumWage.toLocaleString('ko-KR')}원`
      : '-';

  // 바텀시트 열릴 때 스토어 값으로 동기화
  const syncFromStore = () => {
    setYear(storeYear);
    setTimelyAmount(storeTimelyAmount);
    setWeeklyHours(storeWeeklyHours);
  };

  const handleClose = () => {
    setContractOptionSheet(false);
  };

  const handleReset = () => {
    setYear(defaultYear);
    setTimelyAmount(0);
    setWeeklyHours(40);
  };

  const handleConfirm = () => {
    storeOnChange?.({ year, timelyAmount, weeklyHours });
    setContractOptionSheet(false);
  };

  return (
    <Sheet
      isOpen={contractOptionSheet}
      onClose={handleClose}
      onOpenEnd={syncFromStore}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>계약설정</h3>
            </div>
            <div className=" bottom-sheet-body">
              <div className="sheet-data-wrap">
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    계약년도 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const y = defaultYear - 2 + i;
                        return (
                          <option key={y} value={y}>
                            {y}년
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    통상시급(원) <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input
                      type="number"
                      className="input-frame al-r"
                      min="0"
                      value={timelyAmount || ''}
                      placeholder="0"
                      onChange={(e) => setTimelyAmount(Math.max(0, Number(e.target.value)))}
                    />
                  </div>
                  <div className="filed-guide">
                    <span>
                      <i>{year}년</i> 최저시급은 <i>{minimumWageLabel}</i> 입니다.
                    </span>
                    <span>통상시급은 최저시급 이상으로 설정해야 합니다.</span>
                  </div>
                </div>
                <div className="sheet-data-filed">
                  <div className="filed-tit">
                    주 단위 근무시간 입력 <span className="imp">*</span>
                  </div>
                  <div className="block">
                    <input
                      type="number"
                      className="input-frame"
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    />
                  </div>
                  <div className="filed-guide">
                    <span>하루 8시간 근무 시, 주단위로는 40시간입니다.</span>
                    <span>
                      주당 15시간 이상 근무할 경우, 주휴수당(근무시간/5)을 함께
                      계산합니다.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky" onClick={handleReset}>
                초기화
              </button>
              <button className="btn-form blue" onClick={handleConfirm}>
                설정 완료
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
