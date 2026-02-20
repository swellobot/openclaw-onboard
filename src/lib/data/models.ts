export interface AIModel {
    id: string;
    name: string;
    provider: string;
    description: string;
    capabilities: {
        reasoning: number;
        speed: number;
        creativity: number;
        breadth: number;
        multimodal: number;
    };
    estimatedCost: string;
    tier: 'starter' | 'pro' | 'enterprise';
}

export const models: AIModel[] = [
    {
        id: 'sonnet-45',
        name: 'Claude Sonnet 4.5',
        provider: 'Anthropic',
        description: 'Fast, smart, and affordable. Great for everyday tasks.',
        capabilities: { reasoning: 75, speed: 90, creativity: 70, breadth: 70, multimodal: 60 },
        estimatedCost: '~$8/mo',
        tier: 'starter',
    },
    {
        id: 'opus-45',
        name: 'Claude Opus 4.5',
        provider: 'Anthropic',
        description: 'Best-in-class reasoning. Handles complex, nuanced tasks.',
        capabilities: { reasoning: 95, speed: 65, creativity: 90, breadth: 85, multimodal: 75 },
        estimatedCost: '~$18/mo',
        tier: 'pro',
    },
    {
        id: 'gpt-52',
        name: 'GPT-5.2',
        provider: 'OpenAI',
        description: 'Excellent breadth of knowledge and versatility.',
        capabilities: { reasoning: 85, speed: 80, creativity: 80, breadth: 95, multimodal: 85 },
        estimatedCost: '~$15/mo',
        tier: 'enterprise',
    },
    {
        id: 'gemini-25',
        name: 'Gemini 2.5 Pro',
        provider: 'Google',
        description: 'Best multimodal understanding. Images, video, and more.',
        capabilities: { reasoning: 80, speed: 85, creativity: 75, breadth: 80, multimodal: 95 },
        estimatedCost: '~$12/mo',
        tier: 'enterprise',
    },
    {
        id: 'local',
        name: 'Local (Ollama)',
        provider: 'Self-hosted',
        description: 'Maximum privacy. Your data never leaves your machine.',
        capabilities: { reasoning: 55, speed: 70, creativity: 50, breadth: 45, multimodal: 30 },
        estimatedCost: 'Free',
        tier: 'enterprise',
    },
];
