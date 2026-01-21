import { DUMMY_CHAT_SESSION } from "@/constants/dummyData";
import { Interface__ChatState } from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  activeChat: Interface__ChatState;
  setActiveChat: (newState: any) => void;
}

const useActiveChatSession = create<State_Actions>((set) => {
  return {
    activeChat: {
      session: DUMMY_CHAT_SESSION.session,
      messages: DUMMY_CHAT_SESSION.messages,
      totalMessages: DUMMY_CHAT_SESSION.totalMessages,
      isNewSession: true,
      // streaming: { active: false, messageId: null },
      // loadingSession: true,
      // sendingPrompt: false,
      // error: false,
    },
    setActiveChat: (newState) => set({ activeChat: newState }),
  };
});

export default useActiveChatSession;
