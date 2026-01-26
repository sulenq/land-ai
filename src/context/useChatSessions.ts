import { Interface__ChatSession } from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  activeChatSessions: Interface__ChatSession[] | null;
  setActiveChatSessions: (
    chatSessions: State_Actions["activeChatSessions"],
  ) => void;
  renameChatSession: (sessionId: string, title: string) => void;
  prependToChatSessions: (session: Interface__ChatSession) => void;
  removeFromChatSessions: (sessionId: string) => void;
  clearChatSessions: () => void;
}

export const useChatSessions = create<State_Actions>((set) => ({
  activeChatSessions: null,

  setActiveChatSessions: (chatSessions) =>
    set({ activeChatSessions: chatSessions }),

  prependToChatSessions: (session) =>
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

  renameChatSession: (sessionId, title) =>
    set((state) => {
      if (!state.activeChatSessions) {
        return { activeChatSessions: null };
      }

      return {
        activeChatSessions: state.activeChatSessions.map((s) =>
          s.id === sessionId ? { ...s, title } : s,
        ),
      };
    }),

  removeFromChatSessions: (sessionId) =>
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

  clearChatSessions: () => set({ activeChatSessions: null }),
}));
