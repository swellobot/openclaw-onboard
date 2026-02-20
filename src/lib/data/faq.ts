export interface FAQItem {
    question: string;
    answer: string;
}

export const faqItems: FAQItem[] = [
    {
        question: 'How is this different from just using ChatGPT or Claude?',
        answer: 'ChatGPT and Claude are general-purpose tools that forget you after each session. AgentHost gives you a personal agent that remembers everything about you, runs 24/7, lives on your phone, and can proactively reach out. It\'s the difference between a search engine and a personal assistant who knows your life.',
    },
    {
        question: 'Is my data safe?',
        answer: 'Absolutely. Each agent runs in its own isolated sandbox on our secure infrastructure. Your conversations are encrypted at rest and in transit, never used to train any AI models, and never shared with third parties. You own your data and can export everything anytime.',
    },
    {
        question: 'What AI models can I use?',
        answer: 'Starter plans use Claude Sonnet 4.5 — fast and capable for daily tasks. Pro plans include intelligent auto-routing between Claude Opus 4.5 and Sonnet. Enterprise users can choose from Claude Opus 4.6, GPT-5.2, Gemini 2.5 Pro, or even run local models via Ollama for maximum privacy.',
    },
    {
        question: 'Can I switch messaging channels?',
        answer: 'Yes! Pro and Enterprise plans support unlimited channels simultaneously. Your agent\'s memory and personality carry across WhatsApp, Telegram, iMessage, Slack, Discord, and Signal. Switch anytime without losing context.',
    },
    {
        question: 'What happens to my data if I cancel?',
        answer: 'You get a 30-day grace period to export all your data — conversation history, agent memory, configuration files, everything. After that, all data is permanently deleted from our servers. We never hold your data hostage.',
    },
    {
        question: 'How does the onboarding work?',
        answer: 'After choosing a plan, you connect your preferred messaging app and chat with our Onboarding Agent for about 10-15 minutes. It learns about you through natural conversation — your preferences, communication style, and what you need help with. Behind the scenes, it configures your personal agent automatically. No forms, no settings pages.',
    },
    {
        question: 'Can my agent message people on my behalf?',
        answer: 'Only if you explicitly allow it during onboarding. You set the boundaries — from "always ask before contacting anyone" to "proactively schedule meetings with these specific people." You\'re always in control.',
    },
    {
        question: 'What if I want to self-host instead?',
        answer: 'AgentHost is built on OpenClaw, which is open-source. If you\'re technical and want full control, you can self-host the entire stack. We make it effortless for everyone else.',
    },
];

