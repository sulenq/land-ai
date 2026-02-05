import { create } from "zustand";

interface NavsTabs {
  current: string;
}

interface State_Actions {
  navsTabs: NavsTabs;
  setNavsTabs: (newState: Partial<NavsTabs>) => void;
}

export const DEFAULT_NAVS_TABS = {
  current: "your_chats",
};

export const useNavsTabs = create<State_Actions>((set) => ({
  navsTabs: DEFAULT_NAVS_TABS,
  setNavsTabs: (newState) =>
    set((state) => ({
      navsTabs: {
        ...state.navsTabs,
        ...newState,
      },
    })),
}));
