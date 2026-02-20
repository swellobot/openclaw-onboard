import { motion } from 'framer-motion';

interface ChatBubbleProps {
    role: 'user' | 'agent';
    content: string;
    type?: 'text' | 'voice';
    index?: number;
}

export default function ChatBubble({ role, content, type = 'text', index = 0 }: ChatBubbleProps) {
    const isAgent = role === 'agent';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-3`}
        >
            <div
                className={`
          max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isAgent
                        ? 'bg-bg-elevated text-text-primary rounded-bl-md border border-border-subtle'
                        : 'bg-gradient-to-r from-accent to-amber-600 text-bg-deep rounded-br-md font-medium'
                    }
        `}
            >
                {type === 'voice' ? (
                    <VoiceWaveformInline />
                ) : (
                    <div className="whitespace-pre-line">{content}</div>
                )}
            </div>
        </motion.div>
    );
}

function VoiceWaveformInline() {
    const bars = [4, 8, 14, 10, 18, 12, 6, 16, 10, 8, 14, 6, 12, 18, 8, 10, 14, 6, 10, 4];

    return (
        <div className="flex items-center gap-1 py-1 px-2 min-w-[160px]">
            <span className="text-accent mr-2">🎙️</span>
            <div className="flex items-center gap-[2px] flex-1">
                {bars.map((h, i) => (
                    <motion.div
                        key={i}
                        className="w-[3px] bg-current rounded-full opacity-70"
                        initial={{ height: 3 }}
                        animate={{ height: h }}
                        transition={{
                            duration: 0.4,
                            delay: i * 0.05,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
            <span className="text-xs opacity-60 ml-2">0:42</span>
        </div>
    );
}
