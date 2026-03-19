"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import Image from "next/image";
import { Sheet } from "react-modal-sheet";

export default function WorkerChangeSheet() {
  const workerChangeSheet = useBottomSheetControler(
    (state) => state.workerChangeSheet
  );
  const setWorkerChangeSheet = useBottomSheetControler(
    (state) => state.setWorkerChangeSheet
  );

  const handleClose = () => {
    setWorkerChangeSheet(false);
  };

  return (
    <Sheet
      isOpen={workerChangeSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>근무자 교체</h3>
            </div>
            <div className=" bottom-sheet-body">
              <div className="sheet-data-wrap">
                <div className="worker-info-wrap full">
                  <div className="worker-img">
                    <Image
                      src="/assets/images/layout/avatar02.svg"
                      alt="근무자 이미지"
                      width={46}
                      height={46}
                    />
                  </div>
                  <div className="worker-info">
                    <div className="worker-name">
                      <span>김직원 님</span>의
                      <span className="badge blue ml5">정직원 4h</span>
                    </div>
                    <div className="worker-name">교체 근무자를 선택하세요.</div>
                  </div>
                </div>
                <div className="worker-info-wrap part">
                  <div className="worker-img">
                    <Image
                      src="/assets/images/layout/avatar01.svg"
                      alt="근무자 이미지"
                      width={46}
                      height={46}
                    />
                  </div>
                  <div className="worker-info">
                    <div className="worker-name">
                      <span>김직원 님</span>의
                      <span className="badge green ml5">파트 4h</span>
                    </div>
                    <div className="worker-name">교체 근무자를 선택하세요.</div>
                  </div>
                </div>
                <div className="worker-info-wrap temporary">
                  <div className="worker-img">
                    <Image
                      src="/assets/images/layout/avatar01.svg"
                      alt="근무자 이미지"
                      width={46}
                      height={46}
                    />
                  </div>
                  <div className="worker-info">
                    <div className="worker-name">
                      <span>김직원 님</span>의
                      <span className="badge brown ml5">임시 4h</span>
                    </div>
                    <div className="worker-name">교체 근무자를 선택하세요.</div>
                  </div>
                </div>
                <div className="sheet-data-filed">
                    <div className="filed-tit">
                      교체 근무자<span className="imp"> *</span>
                    </div>
                    <div className="block">
                      <select name="" id="" className="select-form">
                        <option value="1">김직원</option>
                        <option value="2">이직원</option>
                        <option value="3">박직원</option>
                      </select>
                    </div>
                  </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form blue">교체</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
