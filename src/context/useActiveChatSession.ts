import { DUMMY_CHAT_SESSION } from "@/constants/dummyData";
import {
  Interface__ChatMessage,
  Interface__ChatState,
} from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  activeChat: Interface__ChatState;
  appendUserMessage: (userMessage: Interface__ChatMessage) => void;
  startAssistantStreaming: () => string; // return assistantMessage id
  appendStreamingChunk: (payload: { messageId: string; chunk: string }) => void;
  finishStreaming: (messageId: string) => void;
  initNewChat: (newActiveChat: Interface__ChatState) => void;
}

const useActiveChatSession = create<State_Actions>((set) => ({
  activeChat: {
    session: DUMMY_CHAT_SESSION.session,
    messages: DUMMY_CHAT_SESSION.messages,
    totalMessages: DUMMY_CHAT_SESSION.totalMessages,
    isNewSession: true,
  },

  initNewChat: (newActiveChat) =>
    set(() => ({
      activeChat: newActiveChat,
    })),

  appendUserMessage: (userMessage) =>
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        messages: [...state.activeChat.messages, userMessage],
        totalMessages: state.activeChat.totalMessages + 1,
        isNewSession: false,
      },
    })),

  startAssistantStreaming: () => {
    const id = crypto.randomUUID();
    set((state) => ({
      activeChat: {
        ...state.activeChat,
        session: state.activeChat.session
          ? { ...state.activeChat.session, isStreaming: true }
          : null,
        messages: [
          ...state.activeChat.messages,
          { id, role: "assistant", content: "", isStreaming: true },
        ],
        totalMessages: state.activeChat.totalMessages + 1,
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

export default useActiveChatSession;
