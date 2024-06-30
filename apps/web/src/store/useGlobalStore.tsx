import { create } from 'zustand';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';

type GlobalStoreType = {
  experience: boolean;
  setExperience: (value: boolean) => void;
};

const useGlobalStoreBase = create<GlobalStoreType>((set) => ({
  experience: false,
  setExperience: (value) => set({ experience: value }),
}));

export const useGlobalStore = createSelectorHooks(useGlobalStoreBase);
