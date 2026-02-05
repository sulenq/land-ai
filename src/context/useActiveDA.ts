import {
  Interface__ActiveDAState,
  Interface__DASession,
} from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  activeDA: Interface__ActiveDAState;

  initSession: () => void;
  setActiveDA: (partial: Partial<State_Actions["activeDA"]>) => void;

  setSession: (session: Interface__DASession | null) => void;
  updateHasLoadedHistory: (value: boolean) => void;
  updateIsNewChat: (value: boolean) => void;
  clearActiveChat: () => void;
}

export const DEFAULT_CHAT_STATE: Interface__ActiveDAState = {
  session: null,
  isNewDA: false,
  hasLoadedHistory: false,
};

export const useActiveDA = create<State_Actions>((set) => ({
  activeDA: DEFAULT_CHAT_STATE,

  initSession: () =>
    set((state) => ({
      activeDA: {
        ...state.activeDA,
        isNewChat: true,
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

  setSession: (session) =>
    set((state) => ({
      activeDA: {
        ...state.activeDA,
        session,
      },
    })),

  updateHasLoadedHistory: (value) =>
    set((state) => ({
      activeDA: {
        ...state.activeDA,
        hasLoadedHistory: value,
      },
    })),

  updateIsNewChat: (value) =>
    set((state) => ({
      activeDA: {
        ...state.activeDA,
        isNewChat: value,
      },
    })),

  clearActiveChat: () =>
    set(() => ({
      activeDA: DEFAULT_CHAT_STATE,
    })),
}));
