import { create } from 'zustand';

type Store = {
  isNavOpened: boolean;
  isAnimating: boolean;
  hasLoaded: boolean;
  isHomeRevealed: boolean;
  setIsAnimating: (value: boolean) => void;
  setIsNavOpened: (value: boolean) => void;
  setHasLoaded: (value: boolean) => void;
  setIsHomeRevealed: (value: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  isNavOpened: false,
  isAnimating: false,
  hasLoaded: false,
  isHomeRevealed: false,
  setIsNavOpened: (value: boolean) => set({ isNavOpened: value }),
  setIsAnimating: (value: boolean) => set({ isAnimating: value }),
  setHasLoaded: (value: boolean) => set({ hasLoaded: value }),
  setIsHomeRevealed: (value: boolean) => set({ isHomeRevealed: value }),
}));
