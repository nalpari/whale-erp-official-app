"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import Image from "next/image";
import { Sheet } from "react-modal-sheet";

export default function WorkerDeleteSheet() {
  const workerDeleteSheet = useBottomSheetControler(
    (state) => state.workerDeleteSheet
  );
  const setWorkerDeleteSheet = useBottomSheetControler(
    (state) => state.setWorkerDeleteSheet
  );

  const handleClose = () => {
    setWorkerDeleteSheet(false);
  };

  return (
    <Sheet
      isOpen={workerDeleteSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>근무자 삭제</h3>
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
                      <b className="badge blue ml5">정직원 4h</b>
                    </div>
                    <div className="worker-name">근무일정을 삭제 하시겠습니까?</div>
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
                      <b className="badge green ml5">파트 4h</b>
                    </div>
                    <div className="worker-name">근무일정을 삭제 하시겠습니까?</div>
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
                      <b className="badge brown ml5">임시 4h</b>
                    </div>
                    <div className="worker-name">근무일정을 삭제 하시겠습니까?</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky">취소</button>
              <button className="btn-form blue">삭제</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
