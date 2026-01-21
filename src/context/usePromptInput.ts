import { create } from "zustand";

interface State_Actions {
  style: any;
  set: (newState: any) => void;
}

const usePromptInput = create<State_Actions>((set) => {
  return {
    style: {
      h: "auto",
    },
    set: (newState) => set({ style: newState }),
  };
});

export default usePromptInput;
