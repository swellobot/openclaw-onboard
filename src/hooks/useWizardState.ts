import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type {
  WizardState,
  WizardProgress,
  OnboardingData,
  ConversationMessage,
  UserProfile,
  PersonalityChoice,
  MessagingChannel,
} from '../lib/types/wizard';
import { derivePersonalitySummary } from '../lib/data/wizard';

const ONBOARDING_KEY = 'agenthost_onboarding';
const TOTAL_STEPS = 6;

function progressKey(sessionId: string) {
  return `agenthost_wizard_progress_${sessionId}`;
}

function makeInitialState(sessionId: string): WizardState {
  return {
    agentName: '',
    selectedScenarios: [],
    personalityChoices: [],
    conversationMessages: [],
    profile: null,
    conversationDone: false,
    channel: null,
    sessionId,
  };
}

function loadProgress(sessionId: string): { step: number; state: WizardState } | null {
  try {
    const raw = localStorage.getItem(progressKey(sessionId));
    if (!raw) return null;
    const parsed: WizardProgress = JSON.parse(raw);
    return { step: parsed.currentStep, state: parsed.state };
  } catch {
    return null;
  }
}

function saveProgress(sessionId: string, step: number, state: WizardState) {
  const data: WizardProgress = {
    currentStep: step,
    state,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(progressKey(sessionId), JSON.stringify(data));
}

function buildOnboardingData(state: WizardState): OnboardingData {
  return {
    version: 2,
    sessionId: state.sessionId,
    agent: { name: state.agentName },
    selectedScenarios: state.selectedScenarios,
    personality: {
      choices: state.personalityChoices,
      summary: derivePersonalitySummary(state.personalityChoices),
    },
    profile: state.profile,
    channel: state.channel!,
    conversationLog: state.conversationMessages,
    completedAt: new Date().toISOString(),
  };
}

function saveOnboarding(state: WizardState) {
  const data = buildOnboardingData(state);
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
  localStorage.removeItem(progressKey(state.sessionId));
}


export function useWizardState() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const id = sessionId || crypto.randomUUID();

  const saved = loadProgress(id);
  const [step, setStep] = useState(saved?.step ?? 0);
  const [state, setState] = useState<WizardState>(saved?.state ?? makeInitialState(id));
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    saveProgress(id, step, state);
  }, [id, step, state]);

  const next = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step]);

  const back = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const goToStep = useCallback(
    (target: number) => {
      setDirection(target > step ? 1 : -1);
      setStep(target);
    },
    [step]
  );

  const setAgentName = useCallback((agentName: string) => {
    setState((prev) => ({ ...prev, agentName }));
  }, []);

  const toggleScenario = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      selectedScenarios: prev.selectedScenarios.includes(id)
        ? prev.selectedScenarios.filter((s) => s !== id)
        : [...prev.selectedScenarios, id],
    }));
  }, []);

  const addPersonalityChoice = useCallback((choice: PersonalityChoice) => {
    setState((prev) => ({
      ...prev,
      personalityChoices: [
        ...prev.personalityChoices.filter((c) => c.round !== choice.round),
        choice,
      ],
    }));
  }, []);

  const addConversationMessage = useCallback((message: ConversationMessage) => {
    setState((prev) => ({
      ...prev,
      conversationMessages: [...prev.conversationMessages, message],
    }));
  }, []);

  const setConversationDone = useCallback((done: boolean, profile: UserProfile | null) => {
    setState((prev) => ({ ...prev, conversationDone: done, profile }));
  }, []);

  const setChannel = useCallback((channel: MessagingChannel) => {
    setState((prev) => ({ ...prev, channel }));
  }, []);

  const complete = useCallback(() => {
    saveOnboarding(state);
  }, [state]);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return {
    step,
    state,
    direction,
    progress,
    totalSteps: TOTAL_STEPS,
    sessionId: id,
    next,
    back,
    goToStep,
    setAgentName,
    toggleScenario,
    addPersonalityChoice,
    addConversationMessage,
    setConversationDone,
    setChannel,
    complete,
  };
}
