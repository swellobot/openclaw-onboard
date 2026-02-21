import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../../ui/ChatBubble';
import TypingIndicator from '../../ui/TypingIndicator';

interface LaunchStepProps {
  agentName: string;
  userName: string;
  channel: 'whatsapp' | 'telegram' | null;
  onComplete: () => void;
}

export default function LaunchStep({
  agentName,
  userName,
  channel,
  onComplete,
}: LaunchStepProps) {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [completed, setCompleted] = useState(false);

  const displayName = agentName || 'Your agent';
  const greeting = userName ? `Hey ${userName}!` : 'Hey!';
  const channelLabel = channel === 'whatsapp' ? 'WhatsApp' : 'Telegram';

  useEffect(() => {
    // Show typing indicator, then the message
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showMessage && !completed) {
      onComplete();
      setCompleted(true);
    }
  }, [showMessage, completed, onComplete]);

  return (
    <div className="flex flex-col items-center">
      {/* Chat header bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex w-full items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber-600">
          <span className="text-lg font-bold text-bg-deep">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">{displayName}</p>
          <p className="text-xs text-success">Online</p>
        </div>
      </motion.div>

      {/* Chat area */}
      <div className="w-full space-y-1 mb-8">
        {!showMessage && <TypingIndicator />}
        {showMessage && (
          <ChatBubble
            role="agent"
            content={`${greeting} I'm ${displayName}, and I'm set up and ready to go. Tomorrow morning I'll send you your first briefing. But right now — anything you want to ask me?`}
            index={0}
          />
        )}
      </div>

      {/* Action buttons */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex w-full flex-col gap-3"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full justify-center"
          >
            Open in {channelLabel}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full rounded-xl border border-border-subtle px-5 py-2.5 text-sm font-medium text-text-secondary transition hover:border-border-visible hover:text-text-primary"
          >
            Go to Dashboard
          </button>
        </motion.div>
      )}
    </div>
  );
}
