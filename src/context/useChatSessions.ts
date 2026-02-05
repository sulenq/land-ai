import { Interface__ChatSession } from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  chatSessions: Interface__ChatSession[] | null;
  setChatSessions: (chatSessions: State_Actions["chatSessions"]) => void;
  prependToChatSessions: (session: Interface__ChatSession) => void;
  renameChatSession: (sessionId: string, title: string) => void;
  toggleProtectedSession: (sessionId: string) => void;
  removeFromChatSessions: (sessionId: string) => void;
  clearChatSessions: () => void;
}

export const useChatSessions = create<State_Actions>((set) => ({
  chatSessions: null,

  setChatSessions: (chatSessions) => set({ chatSessions: chatSessions }),

  prependToChatSessions: (session) =>
    set((state) => {
      if (!state.chatSessions) {
        return { chatSessions: [session] };
      }

      const filtered = state.chatSessions.filter((s) => s.id !== session.id);

      return {
        chatSessions: [session, ...filtered],
      };
    }),

  renameChatSession: (sessionId, title) =>
    set((state) => {
      if (!state.chatSessions) {
        return { chatSessions: null };
      }

      return {
        chatSessions: state.chatSessions.map((s) =>
          s.id === sessionId ? { ...s, title } : s,
        ),
      };
    }),

  toggleProtectedSession: (sessionId) =>
    set((state) => {
      if (!state.chatSessions) {
        return { chatSessions: null };
      }

      return {
        chatSessions: state.chatSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                isProtected: !s.isProtected,
              }
            : s,
        ),
      };
    }),

  removeFromChatSessions: (sessionId) =>
    set((state) => {
      if (!state.chatSessions) {
        return { chatSessions: null };
      }

      const filtered = state.chatSessions.filter((s) => s.id !== sessionId);

      return {
        chatSessions: filtered.length > 0 ? filtered : null,
      };
    }),

  clearChatSessions: () => set({ chatSessions: null }),
}));
