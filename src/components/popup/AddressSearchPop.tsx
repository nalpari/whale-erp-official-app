"use client";
import { usePopupControler } from "@/store/usePopupControler";
import { useEffect, useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeResult) => void;
        width: string;
        height: string;
      }) => { embed: (container: HTMLElement) => void };
    };
  }
}

interface DaumPostcodeResult {
  address: string;
  roadAddress: string;
  jibunAddress: string;
  zonecode: string;
  buildingName: string;
}

export default function AddressSearchPop() {
  const [active, setActive] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);
  const addressSearchPopup = usePopupControler(
    (state) => state.addressSearchPopup
  );
  const setAddressSearchPopup = usePopupControler(
    (state) => state.setAddressSearchPopup
  );
  const onAddressSelect = usePopupControler(
    (state) => state.onAddressSelect
  );
  const openAlert = usePopupControler((state) => state.openAlert);

  const handleClose = useCallback(() => {
    setActive(false);
    setTimeout(() => {
      setAddressSearchPopup(false);
    }, 250);
  }, [setAddressSearchPopup]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(addressSearchPopup);
    }, 100);
    return () => clearTimeout(timer);
  }, [addressSearchPopup]);

  // Daum Postcode 스크립트 로드 + embed
  useEffect(() => {
    if (!active || !embedRef.current) return;

    const loadAndEmbed = () => {
      if (!embedRef.current) return;
      new window.daum.Postcode({
        oncomplete: (data: DaumPostcodeResult) => {
          const fullAddress = data.roadAddress || data.address;
          try {
            onAddressSelect?.(fullAddress);
          } catch (err) {
            console.error("[AddressSearchPop] 주소 선택 콜백 실패:", err);
          } finally {
            handleClose();
          }
        },
        width: "100%",
        height: "100%",
      }).embed(embedRef.current);
    };

    if (window.daum?.Postcode) {
      loadAndEmbed();
    } else {
      const script = document.createElement("script");
      script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.onload = loadAndEmbed;
      script.onerror = () => {
        console.error('[AddressSearchPop] 주소 검색 스크립트 로드 실패');
        openAlert({ message: '주소 검색 서비스를 불러올 수 없습니다. 네트워크 연결을 확인해주세요.' });
        handleClose();
      };
      document.head.appendChild(script);
    }
  }, [active, onAddressSelect, handleClose, openAlert]);

  return (
    <div className={`modal-popup ${active ? "act" : ""}`}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3>주소검색</h3>
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div
              ref={embedRef}
              style={{ width: "100%", height: "calc(100vh - 120px)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
