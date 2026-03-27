import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AlertOptions = {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

type PopupControlerState = {
  aiChatPopup: boolean;
  setAiChatPopup: (isOpen: boolean) => void;
  alertPopup: boolean;
  alertMessage: string;
  alertConfirmText: string;
  alertCancelText: string;
  alertOnConfirm: (() => void) | null;
  setAlertPopup: (isOpen: boolean) => void;
  openAlert: (options: AlertOptions) => void;
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
      alertMessage: "",
      alertConfirmText: "확인",
      alertCancelText: "",
      alertOnConfirm: null,
      setAlertPopup: (isOpen: boolean) =>
        set({ alertPopup: isOpen }, false, "popup/setAlert"),
      openAlert: ({ message, confirmText, cancelText, onConfirm }: AlertOptions) =>
        set(
          {
            alertPopup: true,
            alertMessage: message,
            alertConfirmText: confirmText ?? "확인",
            alertCancelText: cancelText ?? "",
            alertOnConfirm: onConfirm ?? null,
          },
          false,
          "popup/openAlert"
        ),
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
