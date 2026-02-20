import { useState } from 'react';
import { motion } from 'framer-motion';
import { pricingTiers, PricingTier } from '../../lib/data/pricing';
import ScrollReveal from '../animations/ScrollReveal';

function PricingCard({ tier, annual, index }: { tier: PricingTier; annual: boolean; index: number }) {
    const price = annual ? tier.price.annual : tier.price.monthly;

    return (
        <ScrollReveal delay={index * 0.1}>
            <motion.div
                whileHover={{ y: -4 }}
                className={`
          relative rounded-2xl p-6 lg:p-8 h-full flex flex-col
          ${tier.featured
                        ? 'bg-bg-elevated border-2 border-accent/40 shadow-glow'
                        : 'bg-bg-surface border border-border-subtle hover:border-border-visible'
                    }
          transition-all duration-300
        `}
            >
                {/* Badge */}
                {tier.badge && (
                    <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-semibold ${tier.featured
                            ? 'bg-accent text-bg-deep'
                            : 'bg-bg-hover border border-border-subtle text-text-secondary'
                        }`}>
                        {tier.badge}
                    </div>
                )}

                {/* Header */}
                <div className="mb-6">
                    <h3 className="font-display font-semibold text-xl text-text-primary mb-1">{tier.name}</h3>
                    <p className="text-sm text-text-secondary">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-display font-bold text-text-primary">${price}</span>
                        <span className="text-text-muted text-sm">/mo</span>
                    </div>
                    {annual && (
                        <span className="text-xs text-success mt-1 block">
                            Save ${(tier.price.monthly - tier.price.annual) * 12}/year
                        </span>
                    )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <button
                    className={`
            w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200
            ${tier.featured
                            ? 'btn-primary justify-center'
                            : 'bg-bg-hover border border-border-subtle text-text-primary hover:bg-bg-elevated hover:border-accent/30'
                        }
          `}
                >
                    {tier.cta} →
                </button>
            </motion.div>
        </ScrollReveal>
    );
}

export default function Pricing() {
    const [annual, setAnnual] = useState(false);

    return (
        <section id="pricing" className="py-section relative">
            <div className="section-container">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-accent font-medium text-sm uppercase tracking-widest mb-4">Pricing</p>
                    <h2 className="text-section font-display font-bold text-text-primary mb-4">
                        Simple, transparent pricing.
                    </h2>
                    <p className="text-subtitle text-text-secondary max-w-2xl mx-auto">
                        No hidden fees. No API keys to manage. Everything included.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={`text-sm ${!annual ? 'text-text-primary' : 'text-text-muted'}`}>Monthly</span>
                        <button
                            onClick={() => setAnnual(!annual)}
                            className="relative w-12 h-6 rounded-full bg-bg-hover border border-border-subtle transition-colors"
                        >
                            <motion.div
                                className="absolute top-0.5 w-5 h-5 rounded-full bg-accent"
                                animate={{ left: annual ? 26 : 2 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            />
                        </button>
                        <span className={`text-sm ${annual ? 'text-text-primary' : 'text-text-muted'}`}>
                            Annual
                            <span className="ml-1.5 text-xs text-success">Save 20%</span>
                        </span>
                    </div>
                </ScrollReveal>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
                    {pricingTiers.map((tier, i) => (
                        <PricingCard key={tier.name} tier={tier} annual={annual} index={i} />
                    ))}
                </div>

                {/* Bottom note */}
                <ScrollReveal className="text-center">
                    <div className="glass-card inline-flex items-center gap-6 px-8 py-4 mx-auto">
                        {['Hosting', 'Security', 'Onboarding', 'Memory', 'Updates'].map((item) => (
                            <span key={item} className="text-xs text-text-muted flex items-center gap-1.5">
                                <span className="text-accent">✓</span> {item}
                            </span>
                        ))}
                    </div>
                    <p className="text-sm text-text-muted mt-4">
                        No API keys. No servers. No config files. Everything included.
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
}
