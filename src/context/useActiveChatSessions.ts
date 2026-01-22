import { Interface__ChatSession } from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  activeChatSessions: Interface__ChatSession[] | null;
  setActiveChatSessions: (
    chatSessions: State_Actions["activeChatSessions"],
  ) => void;
}

export const useActiveChatSessions = create<State_Actions>((set) => {
  return {
    activeChatSessions: null,
    setActiveChatSessions: (chatSessions) =>
      set({ activeChatSessions: chatSessions }),
  };
});

export default useActiveChatSessions;
