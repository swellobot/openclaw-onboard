import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ConversationMessage, UserProfile } from '../../../lib/types/wizard';
import { sendOnboardingMessage } from '../../../lib/data/wizard';
import ChatBubble from '../../ui/ChatBubble';
import TypingIndicator from '../../ui/TypingIndicator';
import { cn } from '../../../lib/utils';

interface ConversationStepProps {
  sessionId: string;
  channel: string;
  messages: ConversationMessage[];
  conversationDone: boolean;
  onAddMessage: (msg: ConversationMessage) => void;
  onDone: (done: boolean, profile: UserProfile | null) => void;
  onNext: () => void;
}

const REPLY_LETTERS = ['A', 'B', 'C', 'D'];
const REPLY_COLORS = [
  'border-accent/40 hover:border-accent hover:bg-accent/10',
  'border-purple-500/40 hover:border-purple-500 hover:bg-purple-500/10',
  'border-emerald-500/40 hover:border-emerald-500 hover:bg-emerald-500/10',
  'border-sky-500/40 hover:border-sky-500 hover:bg-sky-500/10',
];
const REPLY_BADGE_COLORS = [
  'bg-accent/20 text-accent',
  'bg-purple-500/20 text-purple-400',
  'bg-emerald-500/20 text-emerald-400',
  'bg-sky-500/20 text-sky-400',
];

export default function ConversationStep({
  sessionId,
  channel,
  messages,
  conversationDone,
  onAddMessage,
  onDone,
  onNext,
}: ConversationStepProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, quickReplies, scrollToBottom]);

  // Auto-greet on mount if no messages yet
  useEffect(() => {
    if (initRef.current || messages.length > 0 || conversationDone) return;
    initRef.current = true;

    const greet = async () => {
      setLoading(true);
      setError(null);
      try {
        const greeting: ConversationMessage = {
          role: 'user',
          content: 'Hi, I just signed up!',
        };
        const res = await sendOnboardingMessage(sessionId, [greeting], channel);
        const assistantMsg: ConversationMessage = {
          role: 'assistant',
          content: res.reply,
        };
        onAddMessage(assistantMsg);
        setQuickReplies(res.quickReplies || []);
        if (res.done) {
          onDone(true, res.profile);
        }
      } catch {
        setError('Could not connect to the assistant. You can skip this step.');
      } finally {
        setLoading(false);
      }
    };
    greet();
  }, [sessionId, channel, messages.length, conversationDone, onAddMessage, onDone]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading || conversationDone) return;

      const userMsg: ConversationMessage = { role: 'user', content: text.trim() };
      onAddMessage(userMsg);
      setInput('');
      setQuickReplies([]);
      setSelected(null);
      setLoading(true);
      setError(null);

      try {
        const allMessages = [...messages, userMsg];
        const res = await sendOnboardingMessage(sessionId, allMessages, channel);
        const assistantMsg: ConversationMessage = {
          role: 'assistant',
          content: res.reply,
        };
        onAddMessage(assistantMsg);
        setQuickReplies(res.quickReplies || []);
        if (res.done) {
          onDone(true, res.profile);
        }
      } catch {
        setError('Something went wrong. Try again or skip this step.');
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, conversationDone, messages, sessionId, channel, onAddMessage, onDone]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleCardClick = (index: number, text: string) => {
    setSelected(index);
    // Small delay so the user sees the selection highlight before it sends
    setTimeout(() => send(text), 200);
  };

  const handleSkip = () => {
    onDone(true, null);
    onNext();
  };

  // Decide if quick replies should render as cards (longer text) or chips (short text)
  const useCards = quickReplies.length > 0 && quickReplies.some((qr) => qr.length > 30);

  return (
    <div className="flex flex-col h-full">
      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 pb-4 min-h-[280px] max-h-[400px]">
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
              onClick={() => {
                setError(null);
                if (messages.length === 0) {
                  initRef.current = false;
                }
              }}
              className="ml-2 underline hover:text-red-300"
            >
              Retry
            </button>
          </motion.div>
        )}
      </div>

      {/* Quick replies — cards for longer options, chips for short ones */}
      {quickReplies.length > 0 && !conversationDone && !loading && (
        <div className="pb-3">
          {useCards ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-2"
            >
              {quickReplies.map((qr, i) => {
                const isSelected = selected === i;
                return (
                  <motion.button
                    key={qr}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => handleCardClick(i, qr)}
                    disabled={selected !== null}
                    className={cn(
                      'relative w-full rounded-xl border bg-bg-elevated px-4 py-3.5 text-left transition-all duration-200',
                      'flex items-start gap-3',
                      isSelected
                        ? 'border-accent bg-accent/10 ring-1 ring-accent/30 scale-[0.98]'
                        : REPLY_COLORS[i % REPLY_COLORS.length],
                      selected !== null && !isSelected && 'opacity-40'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                        isSelected ? 'bg-accent/20 text-accent' : REPLY_BADGE_COLORS[i % REPLY_BADGE_COLORS.length]
                      )}
                    >
                      {REPLY_LETTERS[i] || i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-text-primary">
                      {qr}
                    </span>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2"
            >
              {quickReplies.map((qr, i) => (
                <motion.button
                  key={qr}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => send(qr)}
                  className={cn(
                    'rounded-full border border-border-subtle px-4 py-2 text-sm font-medium transition-all duration-200',
                    'text-text-secondary hover:border-accent hover:text-accent hover:bg-accent/10',
                    'active:scale-95'
                  )}
                >
                  {qr}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Input / Continue / Skip */}
      <div className="pt-2 border-t border-border-subtle">
        {conversationDone ? (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            className="btn-primary w-full justify-center"
          >
            Continue
          </motion.button>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={quickReplies.length > 0 ? 'Or type your own answer...' : 'Type your answer...'}
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
        )}
      </div>
    </div>
  );
}
