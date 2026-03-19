import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface MenuState {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
}

export const useMenuStore = create<MenuState>()(
  devtools(
    (set) => ({
      isMenuOpen: false,
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen }), false, "menu/toggle"),
      openMenu: () => set({ isMenuOpen: true }, false, "menu/open"),
      closeMenu: () => set({ isMenuOpen: false }, false, "menu/close"),
    }),
    { name: "MenuStore" }
  )
);
