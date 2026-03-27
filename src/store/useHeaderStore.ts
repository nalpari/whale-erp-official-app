import { create } from "zustand";
import { devtools } from "zustand/middleware";

type HeaderState = {
  title: string;
  setTitle: (title: string) => void;
  onDelete: (() => void) | null;
  setOnDelete: (handler: (() => void) | null) => void;
  showDeleteButton: boolean;
  setShowDeleteButton: (show: boolean) => void;
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
    }),
    { name: "HeaderStore" }
  )
);
