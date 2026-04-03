import { Interface__TrialDASessionDetail } from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  activeTrialDaSession: Interface__TrialDASessionDetail | null;
  setActiveTrialDaSession: (
    newState: Partial<Interface__TrialDASessionDetail>,
  ) => void;
  resetActiveTrialDaSession: () => void;

  updateUploadedFilesValidationStatus: (
    manualDetails: Interface__TrialDASessionDetail["manualDetails"],
  ) => void;
}

export const useActiveTrialDaSessionContext = create<State_Actions>((set) => ({
  activeTrialDaSession: null,

  setActiveTrialDaSession: (newState) =>
    set((state) => ({
      activeTrialDaSession: state.activeTrialDaSession
        ? { ...state.activeTrialDaSession, ...newState }
        : ({ ...newState } as Interface__TrialDASessionDetail),
    })),

  resetActiveTrialDaSession: () =>
    set(() => ({
      activeTrialDaSession: null,
    })),

  updateUploadedFilesValidationStatus: (manualDetails) =>
    set((state) => ({
      activeTrialDaSession: state.activeTrialDaSession
        ? { ...state.activeTrialDaSession, manualDetails }
        : null,
    })),
}));
