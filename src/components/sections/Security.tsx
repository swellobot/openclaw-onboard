import { motion } from 'framer-motion';
import ScrollReveal from '../animations/ScrollReveal';

const securityFeatures = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-accent">
                <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Encrypted End-to-End',
        description: 'All data encrypted at rest and in transit using industry-standard AES-256 encryption.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-accent">
                <rect x="3" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="14" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="15" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="14" y="15" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        title: 'Isolated Infrastructure',
        description: 'Each agent runs in its own secure Docker container. Complete sandbox isolation.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-accent">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Your Data, Your Rules',
        description: 'Export everything anytime — conversations, memory, config files. GDPR compliant.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-accent">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: 'Never Shared',
        description: 'Your conversations are never used to train AI models. Never shared with third parties.',
    },
];

export default function Security() {
    return (
        <section id="security" className="py-section relative">
            <div className="section-container">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-accent font-medium text-sm uppercase tracking-widest mb-4">Security & Privacy</p>
                    <h2 className="text-section font-display font-bold text-text-primary mb-4">
                        Your data is sacred.
                    </h2>
                    <p className="text-subtitle text-text-secondary max-w-xl mx-auto">
                        We built this for ourselves first. Security isn't an afterthought — it's the foundation.
                    </p>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {securityFeatures.map((feature, i) => (
                        <ScrollReveal key={i} delay={i * 0.08}>
                            <motion.div
                                whileHover={{ y: -3 }}
                                className="glass-card p-6 h-full hover:border-accent/20 transition-colors"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="font-display font-semibold text-text-primary mb-2">{feature.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
