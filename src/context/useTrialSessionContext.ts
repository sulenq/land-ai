import { DUMMY_TRIAL_SESSION } from "@/constants/dummyData";
import { Interface__TrialSession } from "@/constants/interfaces";
import { create } from "zustand";

interface State_Actions {
  trialSession: Interface__TrialSession | null;
  setTrialSession: (newState: Partial<Interface__TrialSession>) => void;
  // Step Actions
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}

export const useTrialSessionContext = create<State_Actions>((set) => ({
  // TODO: remove dummy
  trialSession: DUMMY_TRIAL_SESSION,

  setTrialSession: (newState) =>
    set((state) => ({
      trialSession: state.trialSession
        ? ({ ...state.trialSession, ...newState } as Interface__TrialSession)
        : null,
    })),

  /**
   * Increments the current step by 1
   */
  nextStep: () =>
    set((state) => {
      if (!state.trialSession || state.trialSession.step >= 4) return state;
      return {
        trialSession: {
          ...state.trialSession,
          step: state.trialSession.step + 1,
        },
      };
    }),

  /**
   * Decrements the current step by 1 (Minimum: 0)
   */
  prevStep: () =>
    set((state) => {
      if (!state.trialSession || state.trialSession.step === 1) return state;
      return {
        trialSession: {
          ...state.trialSession,
          step: state.trialSession.step - 1,
        },
      };
    }),

  /**
   * Sets the step to a specific value
   */
  setStep: (step) =>
    set((state) => {
      if (!state.trialSession) return state;
      return {
        trialSession: {
          ...state.trialSession,
          step: step < 0 ? 0 : step,
        },
      };
    }),
}));
