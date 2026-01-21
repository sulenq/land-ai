import { create } from "zustand";

interface State_Actions {
  style: any;
  setStyle: (newState: any) => void;
}

const usePromptInput = create<State_Actions>((set) => {
  return {
    style: {
      h: "116px",
    },
    setStyle: (newState) => set({ style: newState }),
  };
});

export default usePromptInput;
