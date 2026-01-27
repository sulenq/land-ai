import { create } from "zustand";
import { RefObject } from "react";

type MessageContainerStyle = {
  h?: string;
  pb?: string;
};

interface State_Actions {
  style: MessageContainerStyle;
  containerRef: RefObject<HTMLElement | null> | null;

  setStyle: (partial: MessageContainerStyle) => void;
  setRef: (ref: RefObject<HTMLElement | null> | null) => void;
}

const useMessageContainer = create<State_Actions>((set) => ({
  style: {
    h: "auto",
    pb: "64px",
  },
  containerRef: null,

  setStyle: (newStyle) =>
    set((state) => ({
      style: {
        ...state.style,
        ...newStyle,
      },
    })),

  setRef: (ref) =>
    set(() => ({
      containerRef: ref,
    })),
}));

export default useMessageContainer;
