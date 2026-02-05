import { Interface__DASession } from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  DASessions: Interface__DASession[] | null;
  setDASessions: (chatSessions: State_Actions["DASessions"]) => void;
  prependToDASessions: (session: Interface__DASession) => void;
  renameDASession: (sessionId: string, title: string) => void;
  removeFromDASessions: (sessionId: string) => void;
  clearDASessions: () => void;
}

export const useDASessions = create<State_Actions>((set) => ({
  DASessions: null,

  setDASessions: (chatSessions) => set({ DASessions: chatSessions }),

  prependToDASessions: (session) =>
    set((state) => {
      if (!state.DASessions) {
        return { DASessions: [session] };
      }

      const filtered = state.DASessions.filter((s) => s.id !== session.id);

      return {
        DASessions: [session, ...filtered],
      };
    }),

  renameDASession: (sessionId, title) =>
    set((state) => {
      if (!state.DASessions) {
        return { DASessions: null };
      }

      return {
        DASessions: state.DASessions.map((s) =>
          s.id === sessionId ? { ...s, title } : s,
        ),
      };
    }),

  removeFromDASessions: (sessionId) =>
    set((state) => {
      if (!state.DASessions) {
        return { DASessions: null };
      }

      const filtered = state.DASessions.filter((s) => s.id !== sessionId);

      return {
        DASessions: filtered,
      };
    }),

  clearDASessions: () => set({ DASessions: null }),
}));
