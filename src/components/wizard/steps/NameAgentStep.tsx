import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { agentNameSuggestions } from '../../../lib/data/wizard';
import WizardChatHeader from '../WizardChatHeader';

interface NameAgentStepProps {
  agentName: string;
  userName: string;
  onSetName: (name: string) => void;
  onNext: () => void;
}

export default function NameAgentStep({
  agentName,
  userName,
  onSetName,
  onNext,
}: NameAgentStepProps) {
  const [name, setName] = useState(agentName);
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canContinue = name.trim().length > 0;

  const typewriterSuggest = useCallback(() => {
    if (isTyping) return;
    const suggestion =
      agentNameSuggestions[
        Math.floor(Math.random() * agentNameSuggestions.length)
      ];
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

  const handleNext = () => {
    onSetName(name.trim());
    onNext();
  };

  return (
    <div>
      <WizardChatHeader question="Last thing — what should we call your agent?" />

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
            placeholder="Enter a name..."
            className={cn(
              'w-full rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3 text-lg font-semibold text-text-primary',
              'placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
              'transition'
            )}
          />
        </motion.div>

        {/* Suggestion chips */}
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

        {/* Live preview */}
        {name.trim() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4"
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-text-muted">
              Preview
            </p>
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-accent">{name.trim()}</span>
              {' '}is ready to help you
              {userName ? `, ${userName}` : ''}.
            </p>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleNext}
          disabled={!canContinue}
          className={cn(
            'btn-primary mt-2 w-full justify-center',
            !canContinue && 'cursor-not-allowed opacity-40'
          )}
        >
          Finish Setup
        </motion.button>
      </div>
    </div>
  );
}
