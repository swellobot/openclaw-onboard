import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { onboardingSteps } from '../../lib/data/onboarding';
import ChatBubble from '../ui/ChatBubble';
import ScrollReveal from '../animations/ScrollReveal';

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 0.8', 'end 0.2'],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <section id="how-it-works" className="py-section relative" ref={containerRef}>
            <div className="section-container">
                {/* Section Header */}
                <ScrollReveal className="text-center mb-20">
                    <p className="text-accent font-medium text-sm uppercase tracking-widest mb-4">How It Works</p>
                    <h2 className="text-section font-display font-bold text-text-primary mb-4">
                        From zero to personal agent.<br />
                        <span className="text-gradient">In one conversation.</span>
                    </h2>
                    <p className="text-subtitle text-text-secondary max-w-2xl mx-auto">
                        No forms. No settings pages. No terminal. Just a 10-minute chat that builds your perfect AI agent.
                    </p>
                </ScrollReveal>

                {/* Timeline */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Center line (desktop) */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border-subtle -translate-x-1/2">
                        <motion.div
                            className="w-full bg-gradient-to-b from-accent to-red-500 origin-top"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    {/* Mobile line */}
                    <div className="lg:hidden absolute left-6 top-0 bottom-0 w-px bg-border-subtle">
                        <motion.div
                            className="w-full bg-gradient-to-b from-accent to-red-500 origin-top"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-12 lg:space-y-16">
                        {onboardingSteps.map((step, i) => {
                            const isEven = i % 2 === 0;
                            return (
                                <ScrollReveal
                                    key={step.step}
                                    direction={isEven ? 'left' : 'right'}
                                    delay={0.1}
                                >
                                    <div className={`lg:grid lg:grid-cols-2 lg:gap-12 items-center ${!isEven ? 'lg:direction-rtl' : ''}`}>
                                        {/* Content side */}
                                        <div className={`pl-14 lg:pl-0 ${!isEven ? 'lg:order-2 lg:pl-12' : 'lg:pr-12 lg:text-right'} mb-6 lg:mb-0`}>
                                            {/* Step number badge */}
                                            <div className={`flex items-center gap-3 mb-3 ${!isEven ? '' : 'lg:justify-end'}`}>
                                                <span className="text-3xl">{step.icon}</span>
                                                <span className="text-xs font-mono text-accent/70 uppercase tracking-widest">
                                                    Step {step.step}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-text-secondary text-sm leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Visual side */}
                                        <div className={`pl-14 lg:pl-0 ${!isEven ? 'lg:order-1' : ''}`}>
                                            {step.messages ? (
                                                <div className="glass-card p-4 max-w-sm mx-auto lg:mx-0">
                                                    {step.messages.map((msg, j) => (
                                                        <ChatBubble
                                                            key={j}
                                                            role={msg.role}
                                                            content={msg.content}
                                                            type={msg.type}
                                                            index={j}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="glass-card p-6 max-w-sm mx-auto lg:mx-0 flex items-center justify-center min-h-[100px]">
                                                    <div className="text-center">
                                                        <span className="text-4xl block mb-2">{step.icon}</span>
                                                        <span className="text-xs text-text-muted">{step.title}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Timeline dot (mobile) */}
                                        <div className="lg:hidden absolute left-4 w-5 h-5 rounded-full bg-bg-deep border-2 border-accent shadow-glow-sm" style={{ marginTop: '-2.5rem' }} />
                                    </div>

                                    {/* Timeline dot (desktop) */}
                                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-bg-deep border-2 border-accent shadow-glow-sm items-center justify-center" style={{ marginTop: '-3rem' }}>
                                        <div className="w-2 h-2 rounded-full bg-accent" />
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
