import { create } from "zustand";
import {
  Interface__ChatState,
  Interface__ChatMessage,
  Interface__ContextChatSession,
} from "@/constants/interfaces";

interface State_Actions {
  activeChat: Interface__ChatState;

  initSession: () => void;
  setActiveChat: (activeChat: Interface__ChatState) => void;

  setSession: (session: Interface__ContextChatSession | null) => void;
  setMessages: (messages: Interface__ChatMessage[]) => void;
  updateHasLoadedHistory: (value: boolean) => void;
  updateIsNewChat: (value: boolean) => void;
  clearActiveChat: () => void;

  appendMessage: (message: Interface__ChatMessage) => void;
  removeMessage: (messageId: string) => void;

  startAssistantStreaming: (messageId: string) => string;
  appendStreamingChunk: (payload: { messageId: string; chunk: string }) => void;
  finishStreaming: () => void;
}

export const DEFAULT_CHAT_STATE: Interface__ChatState = {
  session: null,
  messages: [],
  totalMessages: 0,
  isStreaming: false,
  isNewChat: false,
  hasLoadedHistory: false,
};

export const useActiveChat = create<State_Actions>((set) => ({
  activeChat: DEFAULT_CHAT_STATE,

  initSession: () =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        isStreaming: true,
        isNewChat: true,
        hasLoadedHistory: true,
      },
    })),

  setActiveChat: (activeChat) => set({ activeChat }),

  setSession: (session) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        session,
      },
    })),

  setMessages: (messages) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        messages,
      },
    })),

  clearActiveChat: () =>
    set(() => ({
      activeChat: DEFAULT_CHAT_STATE,
    })),

  updateHasLoadedHistory: (value) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        hasLoadedHistory: value,
      },
    })),

  updateIsNewChat: (value) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        isNewChat: value,
      },
    })),

  appendMessage: (message) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        messages: [...state.activeChat.messages, message],
        totalMessages: state.activeChat.totalMessages + 1,
      },
    })),

  removeMessage: (messageId) =>
    set((state) => {
      const messages = state.activeChat.messages.filter(
        (m) => m.id !== messageId,
      );

      return {
        activeChat: {
          ...state.activeChat,
          messages,
          totalMessages: messages.length,
        },
      };
    }),

  startAssistantStreaming: (messageId) => {
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        session: state.activeChat.session
          ? { ...state.activeChat.session }
          : null,
        messages: [
          ...state.activeChat.messages,
          {
            id: messageId,
            role: "assistant",
            content: "",
            isStreaming: true,
          },
        ],
        totalMessages: state.activeChat.totalMessages + 1,
        isStreaming: true,
      },
    }));

    return messageId;
  },

  appendStreamingChunk: ({ messageId, chunk }) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        messages: state.activeChat.messages.map((m) =>
          m.id === messageId ? { ...m, content: m.content + chunk } : m,
        ),
      },
    })),

  finishStreaming: () =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        session: state.activeChat.session
          ? { ...state.activeChat.session, isStreaming: false }
          : null,
        messages: state.activeChat.messages.map((m, idx) =>
          idx === state.activeChat.messages.length - 1
            ? { ...m, isStreaming: false }
            : m,
        ),
        isStreaming: false,
      },
    })),
}));
