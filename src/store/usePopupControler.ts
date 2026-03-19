import { create } from "zustand";
import { devtools } from "zustand/middleware";

type PopupControlerState = {
  aiChatPopup: boolean;
  setAiChatPopup: (isOpen: boolean) => void;
  alertPopup: boolean;
  setAlertPopup: (isOpen: boolean) => void;
  photoPopup: boolean;
  setPhotoPopup: (isOpen: boolean) => void;
  addressSearchPopup: boolean;
  setAddressSearchPopup: (isOpen: boolean) => void;
};

export const usePopupControler = create<PopupControlerState>()(
  devtools(
    (set) => ({
      aiChatPopup: false,
      setAiChatPopup: (isOpen: boolean) =>
        set({ aiChatPopup: isOpen }, false, "popup/setAiChat"),
      alertPopup: false,
      setAlertPopup: (isOpen: boolean) =>
        set({ alertPopup: isOpen }, false, "popup/setAlert"),
      photoPopup: false,
      setPhotoPopup: (isOpen: boolean) =>
        set({ photoPopup: isOpen }, false, "popup/setPhoto"),
      addressSearchPopup: false,
      setAddressSearchPopup: (isOpen: boolean) =>
        set({ addressSearchPopup: isOpen }, false, "popup/setAddressSearch"),
    }),
    { name: "PopupControlerStore" }
  )
);
