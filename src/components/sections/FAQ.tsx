import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqItems } from '../../lib/data/faq';
import ScrollReveal from '../animations/ScrollReveal';

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <ScrollReveal delay={index * 0.05}>
            <div className="border-b border-border-subtle">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                >
                    <span className="font-display font-medium text-text-primary group-hover:text-accent transition-colors pr-4">
                        {question}
                    </span>
                    <motion.span
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-text-muted text-xl flex-shrink-0 w-6 h-6 flex items-center justify-center"
                    >
                        +
                    </motion.span>
                </button>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <p className="text-sm text-text-secondary leading-relaxed pb-5">
                                {answer}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ScrollReveal>
    );
}

export default function FAQ() {
    return (
        <section id="faq" className="py-section relative">
            <div className="section-container">
                <ScrollReveal className="text-center mb-16">
                    <p className="text-accent font-medium text-sm uppercase tracking-widest mb-4">FAQ</p>
                    <h2 className="text-section font-display font-bold text-text-primary mb-4">
                        Questions? Answers.
                    </h2>
                </ScrollReveal>

                <div className="max-w-2xl mx-auto">
                    {faqItems.map((item, i) => (
                        <FAQItem key={i} question={item.question} answer={item.answer} index={i} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <ScrollReveal className="text-center mt-16">
                    <p className="text-text-secondary mb-4 text-sm">Still have questions?</p>
                    <a href="mailto:support@agenthost.com" className="btn-secondary text-sm">
                        Get in touch
                    </a>
                </ScrollReveal>
            </div>
        </section>
    );
}
