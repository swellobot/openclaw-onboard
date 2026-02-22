import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { ConversationMessage, UserProfile } from '../../../lib/types/wizard';
import { sendChatMessage } from '../../../lib/data/wizard';
import type { OnboardingContext, ChatStatus } from '../../../lib/data/wizard';
import ChatBubble from '../../ui/ChatBubble';
import TypingIndicator from '../../ui/TypingIndicator';
import { cn } from '../../../lib/utils';

interface ConversationStepProps {
  sessionId: string;
  channel: string;
  messages: ConversationMessage[];
  conversationDone: boolean;
  agentContext: OnboardingContext;
  onAddMessage: (msg: ConversationMessage) => void;
  onDone: (done: boolean, profile: UserProfile | null) => void;
  onNext: () => void;
}

export default function ConversationStep({
  sessionId,
  messages,
  conversationDone,
  agentContext,
  onAddMessage,
  onDone,
  onNext,
}: ConversationStepProps) {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastStatus, setLastStatus] = useState<ChatStatus>('active');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // First user message sends context to n8n, subsequent ones don't
  const isFirstUserMessage = messages.length === 0;

  const hardcodedGreeting = `Hey! I'm ${agentContext.agentName}. Before we get started — what's your name and what do you do?`;

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: ConversationMessage = { role: 'user', content: text.trim() };
      onAddMessage(userMsg);
      setInput('');
      setLoading(true);
      setError(null);

      try {
        const res = await sendChatMessage(
          sessionId,
          text.trim(),
          isFirstUserMessage ? agentContext : undefined
        );

        const assistantMsg: ConversationMessage = {
          role: 'assistant',
          content: res.message,
        };
        onAddMessage(assistantMsg);
        setLastStatus(res.status);

        if (res.status === 'complete') {
          onDone(true, null);
          setTimeout(() => onNext(), 1500);
        }
      } catch {
        setError('Something went wrong. Try again or skip this step.');
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, isFirstUserMessage, sessionId, agentContext, onAddMessage, navigate]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleConfirm = () => {
    send('Confirm');
  };

  const handleCancel = () => {
    const cancelMsg: ConversationMessage = { role: 'user', content: 'Cancel' };
    onAddMessage(cancelMsg);
    const agentReply: ConversationMessage = {
      role: 'assistant',
      content: 'No worries! Is there something wrong, or is there something else you want to mention?',
    };
    onAddMessage(agentReply);
    setLastStatus('active');
  };

  const handleSkip = () => {
    // Notify webhook that the interview was skipped
    const payload: Record<string, unknown> = { sessionId, message: '', skipped: true };
    const stripeSessionId = localStorage.getItem('stripe_session_id');
    if (stripeSessionId) {
      payload.stripeSessionId = stripeSessionId;
    }
    if (isFirstUserMessage) {
      payload.context = agentContext;
    }
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.error('[chat] Skip notify failed:', err));

    onDone(true, null);
    onNext();
  };

  // Hide input when confirming (show buttons instead) or complete
  const showInput = lastStatus === 'active' && !conversationDone;
  const showConfirmButtons = lastStatus === 'confirming' && !loading;

  return (
    <div className="flex flex-col h-full">
      {/* Interview intro */}
      {messages.length === 0 && !conversationDone && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-center"
        >
          <p className="text-sm font-medium text-text-primary">
            Time for a quick interview
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {agentContext.agentName} wants to get to know you. Just talk naturally — the more you share, the better your agent will understand you.
          </p>
        </motion.div>
      )}

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 pb-4 min-h-[280px] max-h-[400px]">
        {/* Hardcoded first greeting — always visible, no n8n call */}
        <ChatBubble role="agent" content={hardcodedGreeting} index={0} />

        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role === 'assistant' ? 'agent' : 'user'}
            content={msg.content}
            index={0}
          />
        ))}

        {loading && <TypingIndicator />}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-sm rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400"
          >
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 underline hover:text-red-300"
            >
              Retry
            </button>
          </motion.div>
        )}
      </div>

      {/* Confirm / Cancel buttons */}
      {showConfirmButtons && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 pb-3"
        >
          <button
            onClick={handleConfirm}
            className={cn(
              'flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-bg-deep transition',
              'hover:bg-accent/90'
            )}
          >
            Confirm
          </button>
          <button
            onClick={handleCancel}
            className={cn(
              'flex-1 rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-medium text-text-secondary transition',
              'hover:border-border-visible hover:text-text-primary'
            )}
          >
            Cancel
          </button>
        </motion.div>
      )}

      {/* Input / Skip */}
      <div className="pt-2 border-t border-border-subtle">
        {showInput ? (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
                disabled={loading}
                className={cn(
                  'flex-1 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-2.5 text-sm text-text-primary',
                  'placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
                  'transition disabled:opacity-50'
                )}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={cn(
                  'rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-bg-deep transition',
                  'hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                Send
              </button>
            </form>
            <button
              onClick={handleSkip}
              className="mt-3 w-full text-center text-xs text-text-muted hover:text-text-secondary transition"
            >
              Skip this step
            </button>
          </>
        ) : conversationDone ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-2"
          >
            <button
              onClick={onNext}
              className={cn(
                'w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-bg-deep transition',
                'hover:bg-accent/90'
              )}
            >
              Continue
            </button>
          </motion.div>
        ) : lastStatus === 'complete' ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-text-muted py-2"
          >
            Redirecting...
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}
