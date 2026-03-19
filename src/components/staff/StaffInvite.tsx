"use client";
import { useState } from "react";
import InviteForm01 from "./invite/InviteForm01";
import InviteForm02 from "./invite/InviteForm02";
import InviteForm03 from "./invite/InviteForm03";
import InviteForm04 from "./invite/InviteForm04";

export default function StaffInvite() {
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
          {step === 1 && <InviteForm01 />}
          {step === 2 && <InviteForm02 />}
          {step === 3 && <InviteForm03 />}
          {step === 4 && <InviteForm04 />}
        </div>
      </div>
      <div className="content-pagination">
        {step === 4 && (
          <div className="mb25">
            <button className="btn-form block blue">초대하기</button>
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
