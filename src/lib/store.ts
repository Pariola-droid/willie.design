import { create } from 'zustand';

type Store = {
  isNavOpened: boolean;
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
  setIsNavOpened: (value: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  isNavOpened: false,
  isAnimating: false,
  setIsNavOpened: (value: boolean) => set({ isNavOpened: value }),
  setIsAnimating: (value: boolean) => set({ isAnimating: value }),
}));
