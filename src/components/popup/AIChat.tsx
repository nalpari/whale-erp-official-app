import { usePopupControler } from "@/store/usePopupControler";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AIChat() {
  const [active, setActive] = useState(false);
  const [mickActive, setMickActive] = useState(false); //마이크 아이콘 노출
  
  const aiChatPopup = usePopupControler((state) => state.aiChatPopup);
  const setAiChatPopup = usePopupControler((state) => state.setAiChatPopup);

  useEffect(() => {
    // 팝업 열기 시간 필요
    const timer = setTimeout(() => {
      setActive(aiChatPopup);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [aiChatPopup]);

  // 팝업 닫기 시간 필요
  const handleClose = () => {
    setActive(false);
    setTimeout(() => {
      setAiChatPopup(false);
    }, 250);
  };

  const handleMickToggle = () => {
    setMickActive((prev) => !prev);
  };

  return (
    <div className={`modal-popup ai ${active ? "act" : ""}`}>
      <div className="modal-dialog ">
        <div className="modal-content">
          <div className="modal-header ">
            <button className="modal-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="ai-chat-frame">
              <div className="ai-chat-body">
                <div className="ai-chat-inner">
                  <div className="ai-chat">
                    <div className="ai-chat-time">오후 8:21 수요일</div>
                    <ul className="ai-chat-list">
                      <li className="ai-chat-data">
                        <span>
                          안녕하세요, ChatBot입니다. 무엇을 도와드릴까요?
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="user-chat">
                    <div className="user-chat-time">오후 8:21 수요일</div>
                    <ul className="user-chat-list">
                      <li className="user-chat-data">
                        <span>가까운 매장 찾아 주세요</span>
                      </li>
                      <li className="user-chat-data">
                        <span>가까운 매장 찾아 주세요</span>
                      </li>
                    </ul>
                  </div>
                  <div className="ai-chat">
                    <div className="ai-chat-time">오후 8:21 수요일</div>
                    <ul className="ai-chat-list">
                      <li className="ai-chat-data">
                        <span>네, 주변 매장 리스트 입니다.</span>
                      </li>
                      <li className="ai-chat-data">
                        <span>
                          1.별다방
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 50m
                        </span>
                        <span>
                          1.별다방
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 50m
                        </span>
                        <span>
                          1.별다방
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 50m
                        </span>
                        <span>
                          1.별다방
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 50m
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="user-chat">
                    <div className="user-chat-time">오후 8:21 수요일</div>
                    <ul className="user-chat-list">
                      <li className="user-chat-data">
                        <span>별다방에서 주문 할께요.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="ai-chat-footer">
                <div className="chat-input-wrap">
                  <input type="text" placeholder="Type a message..." />
                  <button
                    className="chat-mick-btn"
                    onClick={handleMickToggle}
                  ></button>
                </div>
                <button className="send-message-btn"></button>
              </div>
              <div className={`ai-mick-wrap ${mickActive ? "act" : ""}`}>
                <div className="ai-mick-icon">
                  <Image
                    src="/assets/images/popup/ai_mick.svg"
                    alt="ai-mick-icon"
                    fill
                  />
                </div>
                <div className="ai-mick-text ">음성모드</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
