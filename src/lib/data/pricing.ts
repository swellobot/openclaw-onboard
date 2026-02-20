export interface PricingTier {
    name: string;
    price: { monthly: number; annual: number };
    description: string;
    features: string[];
    cta: string;
    featured?: boolean;
    badge?: string;
}

export const pricingTiers: PricingTier[] = [
    {
        name: 'Starter',
        price: { monthly: 29, annual: 23 },
        description: 'Perfect for trying out your personal AI agent.',
        features: [
            '1 personal agent',
            '1 messaging channel',
            'Claude Sonnet 4.5',
            '500 messages/day',
            'Research, writing, reminders',
            'Daily memory',
            'Email support',
        ],
        cta: 'Get Started',
    },
    {
        name: 'Pro',
        price: { monthly: 59, annual: 47 },
        description: 'For power users who want the full experience.',
        features: [
            '1 personal agent',
            'Unlimited messaging channels',
            'Opus 4.5 + Sonnet auto-routing',
            'Unlimited messages',
            'All skills & integrations',
            'Long-term vector memory',
            'Voice messages + TTS',
            'Proactive check-ins',
            'Priority support',
        ],
        cta: 'Get Started',
        featured: true,
        badge: 'Most Popular',
    },
    {
        name: 'Enterprise',
        price: { monthly: 129, annual: 103 },
        description: 'Multiple agents, custom models, full control.',
        features: [
            'Up to 5 agents',
            'All Pro features',
            'Custom model selection',
            'Bring your own API keys',
            'Custom skills development',
            'Webhook integrations',
            'API access to your agent',
            'Advanced sandbox config',
            'Dedicated support',
        ],
        cta: 'Get Started',
        badge: 'Power',
    },
];
