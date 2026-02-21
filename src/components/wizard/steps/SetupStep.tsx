import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { configFiles } from '../../../lib/data/wizard';
import ChatBubble from '../../ui/ChatBubble';

interface SetupStepProps {
  agentName: string;
  userName: string;
  onComplete: () => void;
}

export default function SetupStep({
  agentName,
  userName,
  onComplete,
}: SetupStepProps) {
  const navigate = useNavigate();
  const [visibleFiles, setVisibleFiles] = useState(0);
  const [phase, setPhase] = useState<'terminal' | 'done'>('terminal');

  useEffect(() => {
    if (phase !== 'terminal') return;

    const timer = setInterval(() => {
      setVisibleFiles((prev) => {
        const next = prev + 1;
        if (next >= configFiles.length) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
            setPhase('done');
          }, 600);
        }
        return next;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [phase, onComplete]);

  const displayName = agentName || 'Your agent';

  return (
    <div>
      <AnimatePresence mode="wait">
        {phase === 'terminal' && (
          <motion.div
            key="terminal"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-2 font-display text-2xl font-semibold text-text-primary">
              Setting up {displayName}...
            </h2>
            <p className="mb-6 text-sm text-text-muted">
              Configuring your agent environment
            </p>

            {/* Terminal card */}
            <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-2.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-text-muted">terminal</span>
              </div>

              {/* Terminal body */}
              <div className="p-4 font-mono text-sm">
                {configFiles.slice(0, visibleFiles).map((file) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="mb-1 flex items-center gap-2"
                  >
                    <span className="text-success">+</span>
                    <span className="text-text-secondary">{file.name}</span>
                    <span className="ml-auto text-xs text-text-muted">
                      {file.status}
                    </span>
                  </motion.div>
                ))}

                {/* Blinking cursor */}
                {visibleFiles < configFiles.length && (
                  <div className="flex items-center gap-1 text-text-muted">
                    <span>$</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                      className="inline-block h-4 w-2 bg-accent"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center"
          >
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

            <h2 className="font-display text-3xl font-semibold text-text-primary">
              {displayName} is live!
            </h2>
            <p className="mt-2 text-text-secondary">
              Your agent is ready to chat.
            </p>

            {/* First message preview */}
            <div className="mt-8 w-full max-w-sm">
              <ChatBubble
                role="agent"
                content={`Hey${userName ? ` ${userName}` : ''}! I'm ${displayName}, your new AI agent. What can I help you with today?`}
                index={0}
              />
            </div>

            <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
              <button
                onClick={() => navigate('/')}
                className="btn-primary w-full justify-center"
              >
                Start Chatting
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full rounded-xl border border-border-subtle px-5 py-2.5 text-sm font-medium text-text-secondary transition hover:border-border-visible hover:text-text-primary"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
