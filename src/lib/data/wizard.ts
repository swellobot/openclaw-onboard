import type { MessagingChannel, ConversationMessage } from '../types/wizard';

export interface ChannelOption {
  id: MessagingChannel;
  label: string;
  icon: string;
  description: string;
}

export const channelOptions: ChannelOption[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: '💬',
    description: 'Most popular worldwide',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: '✈️',
    description: 'Fast & feature-rich',
  },
  {
    id: 'imessage',
    label: 'iMessage',
    icon: '🍎',
    description: 'Native on Apple devices',
  },
  {
    id: 'slack',
    label: 'Slack',
    icon: '💼',
    description: 'Great for work teams',
  },
  {
    id: 'discord',
    label: 'Discord',
    icon: '🎮',
    description: 'Communities & servers',
  },
  {
    id: 'signal',
    label: 'Signal',
    icon: '🔒',
    description: 'Privacy-first messaging',
  },
];

export interface PreferenceOption {
  id: string;
  icon: string;
  label: string;
}

export const preferenceOptions: PreferenceOption[] = [
  { id: 'scheduling', icon: '📅', label: 'Scheduling & Calendar' },
  { id: 'emails', icon: '✉️', label: 'Email Drafting' },
  { id: 'research', icon: '🔍', label: 'Research & Summaries' },
  { id: 'writing', icon: '✍️', label: 'Creative Writing' },
  { id: 'coding', icon: '💻', label: 'Code & Tech Help' },
  { id: 'business', icon: '📊', label: 'Business & Finance' },
  { id: 'social', icon: '📱', label: 'Social Media' },
  { id: 'learning', icon: '📚', label: 'Learning & Education' },
  { id: 'travel', icon: '✈️', label: 'Travel Planning' },
  { id: 'health', icon: '🏃', label: 'Health & Wellness' },
  { id: 'shopping', icon: '🛒', label: 'Shopping & Deals' },
  { id: 'fun', icon: '🎮', label: 'Fun & Entertainment' },
];

export const agentNameSuggestions = [
  'Nova',
  'Atlas',
  'Echo',
  'Sage',
  'Pixel',
  'Onyx',
  'Aria',
  'Bolt',
];

export const configFiles = [
  { name: 'agent.config.yaml', status: 'created' },
  { name: 'personality.json', status: 'created' },
  { name: 'channel-bridge.ts', status: 'created' },
  { name: 'memory-store.db', status: 'initialized' },
  { name: 'response-engine.wasm', status: 'compiled' },
  { name: 'encryption-keys.pem', status: 'generated' },
];

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

export interface WebhookResponse {
  reply: string;
  done: boolean;
  profile: {
    name: string;
    work: string;
    useCases: string[];
    communicationStyle: string;
    interests: string[];
    notes: string;
  } | null;
  quickReplies: string[];
}

export async function sendOnboardingMessage(
  sessionId: string,
  messages: ConversationMessage[],
  channel: string
): Promise<WebhookResponse> {
  if (!WEBHOOK_URL) {
    throw new Error('VITE_N8N_WEBHOOK_URL is not configured');
  }

  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, messages, channel }),
  });

  if (!res.ok) {
    throw new Error(`Webhook error: ${res.status}`);
  }

  return res.json();
}
