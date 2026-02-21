export type MessagingChannel =
  | 'whatsapp'
  | 'telegram'
  | 'imessage'
  | 'slack'
  | 'discord'
  | 'signal';

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

export interface WizardState {
  channel: MessagingChannel | null;
  preferences: string[];
  conversationMessages: ConversationMessage[];
  profile: UserProfile | null;
  conversationDone: boolean;
  agentName: string;
  sessionId: string;
}

export interface OnboardingData {
  version: 2;
  sessionId: string;
  channel: MessagingChannel;
  preferences: string[];
  profile: UserProfile | null;
  agent: {
    name: string;
  };
  conversationLog: ConversationMessage[];
  completedAt: string;
}

export interface WizardProgress {
  currentStep: number;
  state: WizardState;
  lastUpdated: string;
}
