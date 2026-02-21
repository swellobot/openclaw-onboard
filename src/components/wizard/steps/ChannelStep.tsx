import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { channelOptions } from '../../../lib/data/wizard';
import type { MessagingChannel } from '../../../lib/types/wizard';

interface ChannelStepProps {
  agentName: string;
  selected: MessagingChannel | null;
  onSelect: (channel: MessagingChannel) => void;
  onNext: () => void;
}

export default function ChannelStep({
  agentName,
  selected,
  onSelect,
  onNext,
}: ChannelStepProps) {
  const handleSelect = (channel: MessagingChannel) => {
    onSelect(channel);
    setTimeout(onNext, 400);
  };

  const displayName = agentName || 'your agent';

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-1 font-display text-2xl font-semibold text-text-primary"
      >
        Where do you want to talk to {displayName}?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 text-sm text-text-muted"
      >
        Pick your main channel. You can always add more later.
      </motion.p>

      <div className="grid grid-cols-2 gap-4">
        {channelOptions.map((ch, i) => {
          const isSelected = selected === ch.id;
          return (
            <motion.button
              key={ch.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(ch.id)}
              className={cn(
                'glass-card flex flex-col items-center gap-3 px-6 py-8 text-center transition-all duration-200',
                isSelected
                  ? 'border-accent bg-accent/10 shadow-glow-sm'
                  : 'hover:border-border-visible hover:bg-bg-hover'
              )}
            >
              <span className="text-4xl">{ch.icon}</span>
              <span className="text-lg font-semibold text-text-primary">
                {ch.label}
              </span>
              <span className="text-xs text-text-muted leading-relaxed">{ch.description}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-5 text-center text-xs text-text-muted"
      >
        Web chat is always available too.
      </motion.p>
    </div>
  );
}
