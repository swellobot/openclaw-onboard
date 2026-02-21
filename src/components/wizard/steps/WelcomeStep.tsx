import { motion } from 'framer-motion';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const items = [
    'Pick your messaging channel',
    'Choose what you want help with',
    'Have a quick chat so we can personalise your agent',
    'Name your agent',
  ];

  return (
    <div className="flex flex-col items-center pt-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20"
      >
        <svg
          className="h-8 w-8 text-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-display text-3xl font-semibold text-text-primary"
      >
        Payment confirmed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-3 text-text-secondary"
      >
        Let&apos;s set up your agent in ~2 minutes.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-8 w-full max-w-sm"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-text-muted">
          What we&apos;ll do
        </p>
        <ul className="space-y-3 text-left">
          {items.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-3 text-sm text-text-secondary"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                {i + 1}
              </span>
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={onNext}
        className="btn-primary mt-10 w-full max-w-sm justify-center"
      >
        Let&apos;s Go
      </motion.button>
    </div>
  );
}
