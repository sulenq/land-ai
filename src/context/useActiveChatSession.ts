import { create } from "zustand";
import {
  Interface__ChatState,
  Interface__ChatMessage,
  Interface__ChatSession,
} from "@/constants/interfaces";

interface ChatActions {
  activeChat: Interface__ChatState;

  initSession: () => void;
  setActiveChat: (activeChat: Interface__ChatState) => void;

  setSession: (session: Interface__ChatSession | null) => void;
  setMessages: (messages: Interface__ChatMessage[]) => void;
  updateHasLoadedHistory: (value: boolean) => void;
  resetChat: () => void;

  appendMessage: (message: Interface__ChatMessage) => void;

  startAssistantStreaming: () => string;
  appendStreamingChunk: (payload: { messageId: string; chunk: string }) => void;
  finishStreaming: (messageId: string) => void;
}

export const DEFAULT_CHAT_STATE: Interface__ChatState = {
  session: null,
  messages: [],
  totalMessages: 0,
  isStreaming: false,
  hasLoadedHistory: false,
};

export const useActiveChatSession = create<ChatActions>((set) => ({
  activeChat: DEFAULT_CHAT_STATE,

  initSession: () =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        isStreaming: true,
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

  setMessages: (messages: Interface__ChatMessage[]) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        messages: messages,
      },
    })),

  resetChat: () =>
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

  appendMessage: (message) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        messages: [...state.activeChat.messages, message],
        totalMessages: state.activeChat.totalMessages + 1,
      },
    })),

  startAssistantStreaming: () => {
    const id = crypto.randomUUID();

    set((state) => ({
      activeChat: {
        ...state.activeChat,
        session: state.activeChat.session
          ? { ...state.activeChat.session }
          : null,
        messages: [
          ...state.activeChat.messages,
          {
            id,
            role: "assistant",
            content: "",
            isStreaming: true,
          },
        ],
        totalMessages: state.activeChat.totalMessages + 1,
        isStreaming: true,
      },
    }));

    return id;
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

  finishStreaming: (messageId) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        session: state.activeChat.session
          ? { ...state.activeChat.session, isStreaming: false }
          : null,
        messages: state.activeChat.messages.map((m) =>
          m.id === messageId ? { ...m, isStreaming: false } : m,
        ),
      },
    })),
}));
