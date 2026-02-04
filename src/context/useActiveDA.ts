import {
  Interface__DAServiceDetail,
  Interface__DASession,
} from "@/constants/interfaces";
import { create } from "zustand";

type ActiveDAState = {
  daService: Interface__DAServiceDetail | null;
  daDocs: any;
  daSession: Interface__DASession | null;
};

interface State_Actions {
  activeDA: ActiveDAState;
  setActiveDA: (partial: Partial<ActiveDAState>) => void;
}

export const DEFAULT_ACTIVE_DA: ActiveDAState = {
  daService: null,
  daDocs: null,
  daSession: null,
};

export const useActiveDA = create<State_Actions>((set) => ({
  activeDA: DEFAULT_ACTIVE_DA,
  setActiveDA: (partial) =>
    set((state) => ({
      activeDA: {
        ...state.activeDA,
        ...partial,
      },
    })),
  clearActiveDA: () => set({ activeDA: DEFAULT_ACTIVE_DA }),
}));
