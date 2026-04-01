import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AlertOptions = {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
};

type PopupControlerState = {
  aiChatPopup: boolean;
  setAiChatPopup: (isOpen: boolean) => void;
  alertPopup: boolean;
  alertOptions: AlertOptions | null;
  openAlert: (options: AlertOptions) => void;
  closeAlert: () => void;
  photoPopup: boolean;
  setPhotoPopup: (isOpen: boolean) => void;
  photoPopupImages: string[];
  photoPopupIndex: number;
  openPhotoPopup: (images: string[], index: number) => void;
  addressSearchPopup: boolean;
  setAddressSearchPopup: (isOpen: boolean) => void;
  onAddressSelect: ((address: string) => void) | null;
  openAddressSearch: (onSelect: (address: string) => void) => void;
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
      photoPopup: false,
      setPhotoPopup: (isOpen: boolean) =>
        set({ photoPopup: isOpen }, false, "popup/setPhoto"),
      photoPopupImages: [],
      photoPopupIndex: 0,
      openPhotoPopup: (images: string[], index: number) =>
        set(
          { photoPopup: true, photoPopupImages: images, photoPopupIndex: index },
          false,
          "popup/openPhotoPopup"
        ),
      addressSearchPopup: false,
      setAddressSearchPopup: (isOpen: boolean) =>
        set({ addressSearchPopup: isOpen }, false, "popup/setAddressSearch"),
      onAddressSelect: null,
      openAddressSearch: (onSelect: (address: string) => void) =>
        set(
          { addressSearchPopup: true, onAddressSelect: onSelect },
          false,
          "popup/openAddressSearch"
        ),
    }),
    { name: "PopupControlerStore" }
  )
);
