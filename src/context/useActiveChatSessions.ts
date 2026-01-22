import { Interface__ChatSession } from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  activeChatSessions: Interface__ChatSession[] | null;
  setActiveChatSessions: (
    chatSessions: State_Actions["activeChatSessions"],
  ) => void;
  prependActiveChatSession: (session: Interface__ChatSession) => void;
  removeActiveChatSession: (sessionId: string) => void;
  clearActiveChatSessions: () => void;
}

export const useActiveChatSessions = create<State_Actions>((set) => ({
  activeChatSessions: null,

  setActiveChatSessions: (chatSessions) =>
    set({ activeChatSessions: chatSessions }),

  prependActiveChatSession: (session) =>
    set((state) => {
      if (!state.activeChatSessions) {
        return { activeChatSessions: [session] };
      }

      const filtered = state.activeChatSessions.filter(
        (s) => s.id !== session.id,
      );

      return {
        activeChatSessions: [session, ...filtered],
      };
    }),

  removeActiveChatSession: (sessionId) =>
    set((state) => {
      if (!state.activeChatSessions) {
        return { activeChatSessions: null };
      }

      const filtered = state.activeChatSessions.filter(
        (s) => s.id !== sessionId,
      );

      return {
        activeChatSessions: filtered.length > 0 ? filtered : null,
      };
    }),

  clearActiveChatSessions: () => set({ activeChatSessions: null }),
}));
