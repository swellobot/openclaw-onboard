import { ChatMessage } from './useCases';

export interface OnboardingStep {
    step: number;
    title: string;
    description: string;
    icon: string;
    messages?: ChatMessage[];
}

export const onboardingSteps: OnboardingStep[] = [
    {
        step: 1,
        title: 'Pick a plan',
        description: 'Choose the tier that fits your needs. All plans include the full onboarding experience.',
        icon: '💳',
    },
    {
        step: 2,
        title: 'Choose your channel',
        description: 'WhatsApp, Telegram, iMessage, Slack, Discord, or Signal — pick where your agent lives.',
        icon: '📱',
    },
    {
        step: 3,
        title: 'Connect in 30 seconds',
        description: 'Scan a QR code or tap a link. Your messaging app is connected instantly.',
        icon: '🔗',
    },
    {
        step: 4,
        title: 'Meet your Onboarding Agent',
        description: 'A specialized agent starts a casual conversation to get to know you — no forms, no settings.',
        icon: '👋',
        messages: [
            { role: 'agent', content: "Hey! I'm here to help set up your personal agent. This will take about 10 minutes — and it's actually fun. Ready?", delay: 0 },
            { role: 'user', content: "Sure, let's do it!", delay: 600 },
        ],
    },
    {
        step: 5,
        title: 'Just chat naturally',
        description: 'Talk about yourself, your work, your preferences. Send voice messages for richer context.',
        icon: '💬',
        messages: [
            { role: 'agent', content: "What did you do today? Anything stressing you out?", delay: 0 },
            { role: 'user', content: "Honestly, drowning in emails and forgot my mom's birthday is next week", delay: 800 },
            { role: 'agent', content: "Noted — email management and personal reminders. I'm already building your agent around this. Tell me more...", delay: 600 },
        ],
    },
    {
        step: 6,
        title: 'Personality calibration',
        description: 'Pick between response styles — way more accurate than asking "formal or casual?"',
        icon: '🎯',
        messages: [
            { role: 'agent', content: "Which response would you prefer from your agent?\n\nA: \"Your meeting with Jake is at 3 PM. Agenda attached.\"\n\nB: \"Heads up — you've got Jake at 3! Here's the agenda. Want me to prep anything?\"", delay: 0 },
            { role: 'user', content: "Definitely B — more personality", delay: 800 },
        ],
    },
    {
        step: 7,
        title: 'Name your agent',
        description: 'Give it a name, or let it suggest one. This is your personal AI — make it yours.',
        icon: '✨',
        messages: [
            { role: 'agent', content: "Last thing — what do you want to call me? Or want me to suggest something?", delay: 0 },
            { role: 'user', content: "How about Nova?", delay: 600 },
            { role: 'agent', content: "Love it. ✨ Nova it is.", delay: 500 },
        ],
    },
    {
        step: 8,
        title: 'Agent configuration (automatic)',
        description: 'Behind the scenes, the Onboarding Agent generates your complete agent configuration — personality, memory, skills, boundaries.',
        icon: '⚙️',
    },
    {
        step: 9,
        title: 'Seamless handoff',
        description: 'Your messaging channel reconnects to your NEW personal agent. No interruption.',
        icon: '🔄',
    },
    {
        step: 10,
        title: 'Your agent is live',
        description: 'Nova sends its first message — with full context about who you are.',
        icon: '🚀',
        messages: [
            { role: 'agent', content: "Hey! I'm Nova. I already know you're a product designer who's drowning in emails and needs to buy your mom a birthday gift. What do you need first? 😊", delay: 0 },
        ],
    },
];
