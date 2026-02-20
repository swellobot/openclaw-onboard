import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCases } from '../../lib/data/useCases';
import ChatBubble from '../ui/ChatBubble';
import TypingIndicator from '../ui/TypingIndicator';
import PhoneMockup from '../ui/PhoneMockup';
import ScrollReveal from '../animations/ScrollReveal';

export default function UseCases() {
    const [activeId, setActiveId] = useState(useCases[0].id);
    const [visibleMessages, setVisibleMessages] = useState(0);
    const [showTyping, setShowTyping] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const activeCase = useCases.find((uc) => uc.id === activeId)!;

    const clearTimers = useCallback(() => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    }, []);

    const playMessages = useCallback(() => {
        clearTimers();
        setVisibleMessages(0);
        setShowTyping(false);

        const msgs = activeCase.messages;
        let delay = 300;

        msgs.forEach((msg, i) => {
            if (msg.role === 'agent') {
                // Show typing first
                const typingTimer = setTimeout(() => setShowTyping(true), delay);
                timerRef.current.push(typingTimer);
                delay += 600;

                const showTimer = setTimeout(() => {
                    setShowTyping(false);
                    setVisibleMessages(i + 1);
                }, delay);
                timerRef.current.push(showTimer);
                delay += 400;
            } else {
                const showTimer = setTimeout(() => {
                    setVisibleMessages(i + 1);
                }, delay);
                timerRef.current.push(showTimer);
                delay += 600;
            }
        });
    }, [activeCase, clearTimers]);

    useEffect(() => {
        playMessages();
        return clearTimers;
    }, [activeId, playMessages, clearTimers]);

    const commonCases = useCases.filter((uc) => !uc.surprising);
    const surprisingCases = useCases.filter((uc) => uc.surprising);

    return (
        <section id="features" className="py-section relative">
            {/* Background accent */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-accent/[0.04] via-transparent to-transparent" />
            </div>

            <div className="section-container relative z-10">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-accent font-medium text-sm uppercase tracking-widest mb-4">What Your Agent Can Do</p>
                    <h2 className="text-section font-display font-bold text-text-primary mb-4">
                        See it in action.
                    </h2>
                    <p className="text-subtitle text-text-secondary max-w-2xl mx-auto">
                        Real conversations, real tasks. Click any use case to watch your agent handle it.
                    </p>
                </ScrollReveal>

                {/* Use case categories */}
                <div className="mb-12">
                    {/* Common */}
                    <div className="mb-4">
                        <span className="text-xs text-text-muted uppercase tracking-widest mb-3 block text-center">The Essentials</span>
                        <div className="flex flex-wrap justify-center gap-2">
                            {commonCases.map((uc) => (
                                <button
                                    key={uc.id}
                                    onClick={() => setActiveId(uc.id)}
                                    className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${activeId === uc.id
                                            ? 'bg-accent text-bg-deep shadow-glow-sm'
                                            : 'bg-bg-elevated border border-border-subtle text-text-secondary hover:border-accent/30 hover:text-text-primary'
                                        }
                  `}
                                >
                                    <span className="mr-1.5">{uc.emoji}</span>
                                    {uc.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Surprising */}
                    <div>
                        <span className="text-xs text-text-muted uppercase tracking-widest mb-3 block text-center">
                            Wait, it can do <span className="text-accent">that</span>?
                        </span>
                        <div className="flex flex-wrap justify-center gap-2">
                            {surprisingCases.map((uc) => (
                                <button
                                    key={uc.id}
                                    onClick={() => setActiveId(uc.id)}
                                    className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${activeId === uc.id
                                            ? 'bg-accent text-bg-deep shadow-glow-sm'
                                            : 'bg-bg-elevated border border-border-subtle text-text-secondary hover:border-accent/30 hover:text-text-primary'
                                        }
                  `}
                                >
                                    <span className="mr-1.5">{uc.emoji}</span>
                                    {uc.label}
                                    {uc.surprising && (
                                        <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent">NEW</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat demo */}
                <div className="flex justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <PhoneMockup>
                                {/* Use case title */}
                                <div className="text-center mb-4 pb-3 border-b border-border-subtle">
                                    <span className="text-xs text-text-muted">{activeCase.emoji} {activeCase.title}</span>
                                </div>
                                {activeCase.messages.slice(0, visibleMessages).map((msg, i) => (
                                    <ChatBubble
                                        key={`${activeId}-${i}`}
                                        role={msg.role}
                                        content={msg.content}
                                        type={msg.type}
                                        index={0}
                                    />
                                ))}
                                {showTyping && <TypingIndicator />}
                            </PhoneMockup>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
