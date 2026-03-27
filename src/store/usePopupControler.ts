import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AlertOptions = {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type PopupControlerState = {
  aiChatPopup: boolean;
  setAiChatPopup: (isOpen: boolean) => void;
  alertPopup: boolean;
  alertOptions: AlertOptions | null;
  openAlert: (options: AlertOptions) => void;
  closeAlert: () => void;
  /** @deprecated setAlertPopup 대신 openAlert/closeAlert 사용 */
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
      alertOptions: null,
      openAlert: (options: AlertOptions) =>
        set({ alertPopup: true, alertOptions: options }, false, "popup/openAlert"),
      closeAlert: () =>
        set({ alertPopup: false, alertOptions: null }, false, "popup/closeAlert"),
      setAlertPopup: (isOpen: boolean) =>
        set(
          isOpen ? { alertPopup: true } : { alertPopup: false, alertOptions: null },
          false,
          "popup/setAlert"
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
