"use client";

import { useEffect } from "react";
import { usePopupControler } from "@/store/usePopupControler";
import AIChat from "../popup/AIChat";
import Alert from "../popup/Alert";
import PhotoPopup from "../popup/PhotoPopup";
import AddressSearchPop from "../popup/AddressSearchPop";

export default function PopupControler() {
  // 개별 구독으로 안정성 확보
  const aiChatPopup = usePopupControler((state) => state.aiChatPopup);
  const alertPopup = usePopupControler((state) => state.alertPopup);
  const photoPopup = usePopupControler((state) => state.photoPopup);
  const addressSearchPopup = usePopupControler(
    (state) => state.addressSearchPopup
  );

  useEffect(() => {
    const isAnyPopupOpen =
      aiChatPopup || alertPopup || photoPopup || addressSearchPopup;

    if (isAnyPopupOpen) {
      if (!document.body.classList.contains("open")) {
        document.body.classList.add("open");
      }
    } else {
      if (document.body.classList.contains("open")) {
        document.body.classList.remove("open");
      }
    }

    return () => {
      document.body.classList.remove("open");
    };
  }, [aiChatPopup, alertPopup, photoPopup, addressSearchPopup]);

  return (
    <>
      {aiChatPopup && <AIChat />}
      {alertPopup && <Alert />}
      {photoPopup && <PhotoPopup />}
      {addressSearchPopup && <AddressSearchPop />}
    </>
  );
}
