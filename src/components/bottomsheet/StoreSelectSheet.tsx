"use client";
import { useBottomSheetControler } from "@/store/useBottomSheetControler";
import { Sheet } from "react-modal-sheet";

export default function StoreSelectSheet() {
  const storeSelectSheet = useBottomSheetControler((state) => state.storeSelectSheet);
  const setStoreSelectSheet = useBottomSheetControler((state) => state.setStoreSelectSheet);

  const handleClose = () => {
    setStoreSelectSheet(false);
  };

  return (
    <Sheet
      isOpen={storeSelectSheet}
      onClose={handleClose}
      detent="content"
      disableScrollLocking={true}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="bottom-sheet">
            <div className="bottom-sheet-header">
              <h3>점포 선택</h3>
            </div>
            <div className=" bottom-sheet-body">
              <div className="store-list">
                <div className="store-item">
                  <button>운영 - (본사) 따름인</button>
                </div>
                <div className="store-item act">
                  <button>운영 - (직영점) 힘이나는커피생활 을지로3가점</button>
                </div>
                <div className="store-item">
                  <button>미운영- (가맹점) 힘이나는커피생활 여의도점</button>
                </div>
                <div className="store-item">
                  <button>미운영- (직영점) 힘이나는커피생활 무교점</button>
                </div>
                <div className="store-item">
                  <button>미운영- (가맹점) 힘이나는커피생활 여의도점</button>
                </div>
              </div>
            </div>
            <div className="bottom-sheet-footer">
              <button className="btn-form sky">초기화</button>
              <button className="btn-form blue">선택</button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={handleClose} />
    </Sheet>
  );
}
