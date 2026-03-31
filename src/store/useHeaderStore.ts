import { create } from "zustand";
import { devtools } from "zustand/middleware";

type HeaderState = {
  title: string;
  setTitle: (title: string) => void;
  onDelete: (() => void) | null;
  setOnDelete: (handler: (() => void) | null) => void;
  showDeleteButton: boolean;
  setShowDeleteButton: (show: boolean) => void;
  rightLabel: string;
  setRightLabel: (label: string) => void;
  onBack: (() => void) | null;
  setOnBack: (handler: (() => void) | null) => void;
  onSave: (() => void) | null;
  setOnSave: (handler: (() => void) | null) => void;
};

export const useHeaderStore = create<HeaderState>()(
  devtools(
    (set) => ({
      title: "",
      setTitle: (title) => set({ title }, false, "header/setTitle"),
      onDelete: null,
      setOnDelete: (handler) =>
        set({ onDelete: handler }, false, "header/setOnDelete"),
      showDeleteButton: false,
      setShowDeleteButton: (show) =>
        set({ showDeleteButton: show }, false, "header/setShowDeleteButton"),
      rightLabel: "",
      setRightLabel: (label) =>
        set({ rightLabel: label }, false, "header/setRightLabel"),
      onBack: null,
      setOnBack: (handler) =>
        set({ onBack: handler }, false, "header/setOnBack"),
      onSave: null,
      setOnSave: (handler) =>
        set({ onSave: handler }, false, "header/setOnSave"),
    }),
    { name: "HeaderStore" }
  )
);
