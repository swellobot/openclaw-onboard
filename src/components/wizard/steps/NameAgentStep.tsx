import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { agentNameSuggestions } from '../../../lib/data/wizard';

interface NameAgentStepProps {
  agentName: string;
  onSetName: (name: string) => void;
  onNext: () => void;
}

export default function NameAgentStep({
  agentName,
  onSetName,
  onNext,
}: NameAgentStepProps) {
  const [name, setName] = useState(agentName);
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<'input' | 'booting' | 'online'>('input');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canContinue = name.trim().length > 0;

  const typewriterSuggest = useCallback(() => {
    if (isTyping) return;
    const suggestion =
      agentNameSuggestions[Math.floor(Math.random() * agentNameSuggestions.length)];
    setIsTyping(true);
    setName('');
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setName(suggestion.slice(0, i));
      if (i >= suggestion.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 60);
  }, [isTyping]);

  const handleConfirm = () => {
    if (!canContinue) return;
    onSetName(name.trim());
    setPhase('booting');
  };

  useEffect(() => {
    if (phase === 'booting') {
      const timer = setTimeout(() => setPhase('online'), 2500);
      return () => clearTimeout(timer);
    }
    if (phase === 'online') {
      const timer = setTimeout(onNext, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, onNext]);

  const displayName = name.trim() || 'Your agent';

  return (
    <div>
      <AnimatePresence mode="wait">
        {phase === 'input' && (
          <motion.div
            key="input"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 font-display text-2xl font-semibold text-text-primary"
            >
              Name your agent
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-6 text-sm text-text-muted"
            >
              Pick something you&apos;d call a helpful friend.
            </motion.p>

            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                  placeholder="Enter a name..."
                  className={cn(
                    'w-full rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3 text-lg font-semibold text-text-primary',
                    'placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
                    'transition'
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                {agentNameSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setName(s)}
                    className={cn(
                      'rounded-full border border-border-subtle px-3 py-1.5 text-sm transition',
                      name === s
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'text-text-secondary hover:border-border-visible hover:text-text-primary'
                    )}
                  >
                    {s}
                  </button>
                ))}
                <button
                  onClick={typewriterSuggest}
                  disabled={isTyping}
                  className={cn(
                    'rounded-full border border-dashed border-accent/40 px-3 py-1.5 text-sm text-accent transition',
                    'hover:border-accent hover:bg-accent/10',
                    isTyping && 'cursor-wait opacity-50'
                  )}
                >
                  Suggest
                </button>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={handleConfirm}
                disabled={!canContinue}
                className={cn(
                  'btn-primary mt-2 w-full justify-center',
                  !canContinue && 'cursor-not-allowed opacity-40'
                )}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        )}

        {(phase === 'booting' || phase === 'online') && (
          <motion.div
            key="boot"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center pt-12 text-center"
          >
            {/* Pulsing avatar */}
            <motion.div
              animate={
                phase === 'booting'
                  ? { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                phase === 'booting'
                  ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.3 }
              }
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber-600"
            >
              <span className="text-3xl font-bold text-bg-deep">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </motion.div>

            {/* Progress ring */}
            <div className="relative mb-6 h-2 w-48 overflow-hidden rounded-full bg-bg-elevated">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: phase === 'online' ? '100%' : '85%' }}
                transition={{ duration: phase === 'online' ? 0.3 : 2.2, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 rounded-full bg-accent"
              />
            </div>

            <motion.p
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-text-primary"
            >
              {phase === 'booting'
                ? `${displayName} is waking up...`
                : `${displayName} is online.`}
            </motion.p>

            {phase === 'online' && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-success/20"
              >
                <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
