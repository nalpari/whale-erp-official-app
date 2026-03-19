"use client";
import { useState } from "react";
import StoreForm01 from "./storeform/StoreForm01";
import StoreForm02 from "./storeform/StoreForm02";
import StoreForm03 from "./storeform/StoreForm03";
import StoreForm04 from "./storeform/StoreForm04";

export default function StoreCreate() {
  const [step, setStep] = useState(1);
  const handleNext = () => {
    window.scrollTo({
      top: 0,
    });
    setStep(step + 1);
  };
  const handlePrev = () => {
    window.scrollTo({
      top: 0,
    });
    setStep(step - 1);
  };
  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          {step === 1 && <StoreForm01 />}
          {step === 2 && <StoreForm02 />}
          {step === 3 && <StoreForm03 />}
          {step === 4 && <StoreForm04 />}
        </div>
      </div>
      <div className="content-pagination">
        {step === 4 && (
          <div className="mb25">
            <button className="btn-form block blue">저장</button>
          </div>
        )}
        <div className="pagination-wrap">
          <button
            className="page-btn prev"
            disabled={step === 1}
            onClick={handlePrev}
          >
            <i className="icon-arrow left"></i>
            <span>이전</span>
          </button>
          <div className="page-num">
            <span className="current">{step}</span>
            <span>/</span>
            <span>4</span>
          </div>
          <button
            className="page-btn next"
            disabled={step === 4}
            onClick={handleNext}
          >
            <span>다음</span>
            <i className="icon-arrow right"></i>
          </button>
        </div>
      </div>
    </>
  );
}
