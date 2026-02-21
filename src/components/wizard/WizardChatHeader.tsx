import { motion } from 'framer-motion';

interface WizardChatHeaderProps {
  question: string;
}

export default function WizardChatHeader({ question }: WizardChatHeaderProps) {
  return (
    <div className="mb-8 flex items-start gap-3">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber-600"
      >
        <span className="text-lg font-bold text-bg-deep">O</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="glass-card px-4 py-3"
      >
        <p className="text-sm leading-relaxed text-text-primary">{question}</p>
      </motion.div>
    </div>
  );
}
