import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { preferenceOptions } from '../../../lib/data/wizard';
import WizardChatHeader from '../WizardChatHeader';

interface PreferencesStepProps {
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
}

export default function PreferencesStep({
  selected,
  onToggle,
  onNext,
}: PreferencesStepProps) {
  return (
    <div>
      <WizardChatHeader question="What would you like your agent to help you with?" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {preferenceOptions.map((opt, i) => {
          const isSelected = selected.includes(opt.id);
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggle(opt.id)}
              className={cn(
                'glass-card relative flex flex-col items-center gap-2 px-4 py-5 text-center transition-all duration-200',
                isSelected
                  ? 'border-accent bg-accent/10 shadow-glow-sm'
                  : 'hover:border-border-visible hover:bg-bg-hover'
              )}
            >
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-2 top-2"
                >
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.span>
              )}
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-sm font-semibold text-text-primary">
                {opt.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex flex-col items-center gap-2"
      >
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className={cn(
            'btn-primary w-full max-w-sm justify-center',
            selected.length === 0 && 'cursor-not-allowed opacity-40'
          )}
        >
          Continue{selected.length > 0 ? ` (${selected.length} selected)` : ''}
        </button>
        <button
          onClick={onNext}
          className="text-xs text-text-muted hover:text-text-secondary transition"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
