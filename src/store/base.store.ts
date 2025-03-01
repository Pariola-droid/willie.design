import { create } from 'zustand';

type BaseStore = {
  isNavOpened: boolean;
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
  setIsNavOpened: (value: boolean) => void;
};

export const useBaseStore = create<BaseStore>((set) => ({
  isNavOpened: false,
  isAnimating: false,
  setIsNavOpened: (value: boolean) => set({ isNavOpened: value }),
  setIsAnimating: (value: boolean) => set({ isAnimating: value }),
}));
