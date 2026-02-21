import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { channelOptions } from '../../../lib/data/wizard';
import type { MessagingChannel } from '../../../lib/types/wizard';
import WizardChatHeader from '../WizardChatHeader';

interface ChannelStepProps {
  selected: MessagingChannel | null;
  onSelect: (channel: MessagingChannel) => void;
  onNext: () => void;
}

export default function ChannelStep({
  selected,
  onSelect,
  onNext,
}: ChannelStepProps) {
  const handleSelect = (channel: MessagingChannel) => {
    onSelect(channel);
    setTimeout(onNext, 350);
  };

  return (
    <div>
      <WizardChatHeader question="Where do you want to chat with your agent?" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {channelOptions.map((ch, i) => {
          const isSelected = selected === ch.id;
          return (
            <motion.button
              key={ch.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(ch.id)}
              className={cn(
                'glass-card flex flex-col items-center gap-2 px-4 py-5 text-center transition-all duration-200',
                isSelected
                  ? 'border-accent bg-accent/10 shadow-glow-sm'
                  : 'hover:border-border-visible hover:bg-bg-hover'
              )}
            >
              <span className="text-2xl">{ch.icon}</span>
              <span className="text-sm font-semibold text-text-primary">
                {ch.label}
              </span>
              <span className="text-xs text-text-muted">{ch.description}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
