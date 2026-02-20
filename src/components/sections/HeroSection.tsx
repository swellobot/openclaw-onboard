import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ChatBubble from '../ui/ChatBubble';
import TypingIndicator from '../ui/TypingIndicator';
import PhoneMockup from '../ui/PhoneMockup';
import ScrollReveal from '../animations/ScrollReveal';

const heroMessages = [
    { role: 'agent' as const, content: "Hey! I'm your onboarding agent. What should we call yours?", delay: 600 },
    { role: 'user' as const, content: 'Something like... Nova? ✨', delay: 1800 },
    { role: 'agent' as const, content: "Love it! Nova it is. Quick Q — what's been stressing you out this week?", delay: 3200 },
    { role: 'user' as const, content: '', type: 'voice' as const, delay: 5000 },
    { role: 'agent' as const, content: "Got it. Sounds like you need help with email triage and meeting prep. I'm already configuring Nova for you...", delay: 6500 },
];

const channels = [
    { name: 'WhatsApp', icon: '💬' },
    { name: 'Telegram', icon: '✈️' },
    { name: 'iMessage', icon: '💭' },
    { name: 'Slack', icon: '⚡' },
    { name: 'Discord', icon: '🎮' },
    { name: 'Signal', icon: '🔒' },
];

export default function HeroSection() {
    const [visibleMessages, setVisibleMessages] = useState(0);
    const [showTyping, setShowTyping] = useState(false);

    const animateMessages = useCallback(() => {
        let currentIndex = 0;

        const showNext = () => {
            if (currentIndex >= heroMessages.length) {
                // Reset after all messages shown
                setTimeout(() => {
                    setVisibleMessages(0);
                    setShowTyping(false);
                    setTimeout(animateMessages, 2000);
                }, 4000);
                return;
            }

            const msg = heroMessages[currentIndex];
            const nextMsg = heroMessages[currentIndex + 1];

            // Show typing before agent messages
            if (msg.role === 'agent') {
                setShowTyping(true);
                setTimeout(() => {
                    setShowTyping(false);
                    currentIndex++;
                    setVisibleMessages(currentIndex);

                    // Schedule next message
                    if (nextMsg) {
                        setTimeout(showNext, 1200);
                    } else {
                        showNext();
                    }
                }, 800);
            } else {
                currentIndex++;
                setVisibleMessages(currentIndex);
                if (nextMsg) {
                    setTimeout(showNext, 1200);
                } else {
                    showNext();
                }
            }
        };

        setTimeout(showNext, 1000);
    }, []);

    useEffect(() => {
        animateMessages();
    }, [animateMessages]);

    return (
        <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Radial gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent/[0.07] via-transparent to-transparent" />
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(250,250,250,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,250,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Floating orbs */}
                <motion.div
                    animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[20%] right-[15%] w-96 h-96 rounded-full bg-accent/[0.04] blur-3xl"
                />
                <motion.div
                    animate={{ y: [15, -15, 15], x: [10, -10, 10] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-[20%] left-[10%] w-72 h-72 rounded-full bg-red-500/[0.03] blur-3xl"
                />
            </div>

            <div className="section-container relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Copy */}
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-bg-elevated/50 text-xs text-text-secondary mb-8"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            Built on OpenClaw · Open Source
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-hero font-display font-bold text-text-primary mb-6"
                        >
                            Your personal AI agent.{' '}
                            <span className="text-gradient">On your phone.</span>{' '}
                            In 15 minutes.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            className="text-subtitle text-text-secondary mb-8 max-w-md"
                        >
                            No code. No config files. No API keys. Just have a conversation, and your personal AI agent is ready — on WhatsApp, Telegram, or any messaging app.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.45 }}
                            className="flex flex-wrap gap-4 mb-12"
                        >
                            <a href="#pricing" className="btn-primary text-base">
                                Get Your Agent
                                <span className="text-xl">→</span>
                            </a>
                            <a href="#how-it-works" className="btn-secondary">
                                See How It Works
                            </a>
                        </motion.div>

                        {/* Channel icons */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex items-center gap-1"
                        >
                            <span className="text-xs text-text-muted mr-3">Available on</span>
                            <div className="flex gap-3">
                                {channels.map((ch, i) => (
                                    <motion.div
                                        key={ch.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + i * 0.08 }}
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        className="w-9 h-9 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-sm cursor-pointer hover:border-accent/30 hover:shadow-glow-sm transition-all"
                                        title={ch.name}
                                    >
                                        {ch.icon}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Phone mockup with animated chat */}
                    <ScrollReveal delay={0.4} className="flex justify-center lg:justify-end">
                        <PhoneMockup>
                            {heroMessages.slice(0, visibleMessages).map((msg, i) => (
                                <ChatBubble
                                    key={i}
                                    role={msg.role}
                                    content={msg.content}
                                    type={msg.type}
                                    index={0}
                                />
                            ))}
                            {showTyping && <TypingIndicator />}
                        </PhoneMockup>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
