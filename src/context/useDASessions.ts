import { Interface__DASession } from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  activeDASessions: Interface__DASession[] | null;
  setActiveDASessions: (
    chatSessions: State_Actions["activeDASessions"],
  ) => void;
  prependToDASessions: (session: Interface__DASession) => void;
  renameDASession: (sessionId: string, title: string) => void;
  toggleProtectedSession: (sessionId: string) => void;
  removeFromDASessions: (sessionId: string) => void;
  clearDASessions: () => void;
}

export const useDASessions = create<State_Actions>((set) => ({
  activeDASessions: null,

  setActiveDASessions: (chatSessions) =>
    set({ activeDASessions: chatSessions }),

  prependToDASessions: (session) =>
    set((state) => {
      if (!state.activeDASessions) {
        return { activeDASessions: [session] };
      }

      const filtered = state.activeDASessions.filter(
        (s) => s.id !== session.id,
      );

      return {
        activeDASessions: [session, ...filtered],
      };
    }),

  renameDASession: (sessionId, title) =>
    set((state) => {
      if (!state.activeDASessions) {
        return { activeDASessions: null };
      }

      return {
        activeDASessions: state.activeDASessions.map((s) =>
          s.id === sessionId ? { ...s, title } : s,
        ),
      };
    }),

  toggleProtectedSession: (sessionId) =>
    set((state) => {
      if (!state.activeDASessions) {
        return { activeDASessions: null };
      }

      return {
        activeDASessions: state.activeDASessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                isProtected: !s.isProtected,
              }
            : s,
        ),
      };
    }),

  removeFromDASessions: (sessionId) =>
    set((state) => {
      if (!state.activeDASessions) {
        return { activeDASessions: null };
      }

      const filtered = state.activeDASessions.filter((s) => s.id !== sessionId);

      return {
        activeDASessions: filtered.length > 0 ? filtered : null,
      };
    }),

  clearDASessions: () => set({ activeDASessions: null }),
}));
