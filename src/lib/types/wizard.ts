export type MessagingChannel = 'whatsapp' | 'telegram';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserProfile {
  name: string;
  work: string;
  useCases: string[];
  communicationStyle: string;
  interests: string[];
  notes: string;
}

export interface PersonalityChoice {
  round: number;
  choice: 'A' | 'B' | null;
  value: number | null;
}

export interface WizardState {
  agentName: string;
  selectedScenarios: string[];
  personalityChoices: PersonalityChoice[];
  conversationMessages: ConversationMessage[];
  profile: UserProfile | null;
  conversationDone: boolean;
  channel: MessagingChannel | null;
  sessionId: string;
}

export interface OnboardingData {
  version: 2;
  sessionId: string;
  agent: { name: string };
  selectedScenarios: string[];
  personality: {
    choices: PersonalityChoice[];
    summary: string;
  };
  profile: UserProfile | null;
  channel: MessagingChannel;
  conversationLog: ConversationMessage[];
  completedAt: string;
}

export interface WizardProgress {
  currentStep: number;
  state: WizardState;
  lastUpdated: string;
}
