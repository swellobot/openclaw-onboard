import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../../ui/ChatBubble';
import { cn } from '../../../lib/utils';
import type { PersonalityChoice } from '../../../lib/types/wizard';

interface LaunchStepProps {
  agentName: string;
  userName: string;
  channel: 'whatsapp' | 'telegram' | null;
  sessionId: string;
  selectedScenarios: string[];
  personalityChoices: PersonalityChoice[];
  onComplete: () => void;
}

export default function LaunchStep({
  agentName,
  userName,
  channel,
  sessionId,
  selectedScenarios,
  personalityChoices,
  onComplete,
}: LaunchStepProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = agentName || 'Your agent';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: email.trim(), type: 'email' }),
      });

      if (!res.ok) throw new Error('Failed to send');

      // Notify VPS webhook with full wizard data
      const vpsPayload: Record<string, unknown> = {
        sessionId,
        email: email.trim(),
        agentName,
        channel,
        selectedScenarios,
        personality: personalityChoices,
      };
      const stripeSessionId = localStorage.getItem('stripe_session_id');
      if (stripeSessionId) {
        vpsPayload.stripeSessionId = stripeSessionId;
      }
      fetch('/api/notify-vps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vpsPayload),
      }).catch((err) => console.error('[launch] VPS notify failed:', err));

      console.log('[launch] Email submitted:', email.trim());
      onComplete();
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Chat header bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex w-full items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3"
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

      {/* Chat messages */}
      <div className="w-full space-y-1 mb-6">
        <ChatBubble
          role="agent"
          content={`Last step! We'll send your private connection details to your email — this is how you'll connect with ${displayName}. Keep it secret, don't share it with anyone.`}
          index={0}
        />

        {submitted && (
          <>
            <ChatBubble role="user" content={email} index={0} />
            <ChatBubble
              role="agent"
              content={`You're all set! We're preparing ${displayName} for you right now. Check your email in about 10 minutes — you'll get everything you need to connect with your agent. Remember, keep that email private!`}
              index={0}
            />
          </>
        )}
      </div>

      {/* Email input or success */}
      {!submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full space-y-3"
        >
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              required
              className={cn(
                'flex-1 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-2.5 text-sm text-text-primary',
                'placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
                'transition disabled:opacity-50'
              )}
            />
            <button
              type="submit"
              disabled={!email.trim() || loading}
              className={cn(
                'rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-bg-deep transition',
                'hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </form>
          <p className="text-center text-xs text-text-muted">
            This email is private and will only be used by your agent.
          </p>
          {error && (
            <p className="text-center text-xs text-red-400">{error}</p>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full flex-col gap-3"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full justify-center"
          >
            Go to Dashboard
          </button>
        </motion.div>
      )}
    </div>
  );
}
