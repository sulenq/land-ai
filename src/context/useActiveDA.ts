import { Interface__ActiveDAState } from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  activeDA: Interface__ActiveDAState;

  initSession: () => void;
  setActiveDA: (partial: Partial<State_Actions["activeDA"]>) => void;

  setSession: (
    partial: Partial<State_Actions["activeDA"]["session"]> | null,
  ) => void;
  updateHasLoadedHistory: (value: boolean) => void;
  updateIsNewDA: (value: boolean) => void;
  clearActiveDa: () => void;
}

export const DEFAULT_ACTIVE_DA: Interface__ActiveDAState = {
  session: null,
  isNewDA: false,
  hasLoadedHistory: false,
};

export const useActiveDA = create<State_Actions>((set) => ({
  activeDA: DEFAULT_ACTIVE_DA,

  initSession: () =>
    set((state) => ({
      activeDA: {
        ...state.activeDA,
        isNewDA: true,
        hasLoadedHistory: true,
      },
    })),

  setActiveDA: (partial) =>
    set((state) => ({
      activeDA: {
        ...state.activeDA,
        ...partial,
      },
    })),

  setSession: (partial) =>
    set((state) => ({
      activeDA: {
        ...state.activeDA,
        session:
          partial === null
            ? null
            : {
                ...(state.activeDA.session ?? {}),
                ...partial,
              },
      },
    })),

  updateHasLoadedHistory: (value) =>
    set((state) => ({
      activeDA: {
        ...state.activeDA,
        hasLoadedHistory: value,
      },
    })),

  updateIsNewDA: (value) =>
    set((state) => ({
      activeDA: {
        ...state.activeDA,
        isNewChat: value,
      },
    })),

  clearActiveDa: () =>
    set(() => ({
      activeDA: DEFAULT_ACTIVE_DA,
    })),
}));
