import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { buildScenarioCards } from '../../../lib/data/wizard';
import type { ScenarioCard, ScenarioChatMsg } from '../../../lib/data/wizard';

interface ScenarioShowcaseStepProps {
  agentName: string;
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
}

const MAX_SKILLS = 5;

const iconBgs: Record<string, string> = {
  'morning-briefing': 'from-amber-400 to-orange-500',
  'email-autopilot': 'from-blue-400 to-indigo-500',
  research: 'from-emerald-400 to-teal-500',
  remember: 'from-purple-400 to-fuchsia-500',
  accountability: 'from-rose-400 to-red-500',
  family: 'from-pink-400 to-rose-500',
};

export default function ScenarioShowcaseStep({
  agentName,
  selected,
  onToggle,
  onNext,
}: ScenarioShowcaseStepProps) {
  const cards = buildScenarioCards(agentName);
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayCard, setOverlayCard] = useState<ScenarioCard | null>(null);
  const [nudge, setNudge] = useState(false);
  const [capToast, setCapToast] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.children[0]?.clientWidth || 1;
    const gap = 16;
    const idx = Math.round(container.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(idx, cards.length - 1));
  }, [cards.length]);

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    setActiveIndex(index);
  };

  const tryToggle = (id: string) => {
    if (selected.includes(id)) {
      onToggle(id);
      return;
    }
    if (selected.length >= MAX_SKILLS) {
      setCapToast(true);
      setTimeout(() => setCapToast(false), 2500);
      return;
    }
    onToggle(id);
  };

  const handleAddFromOverlay = (id: string) => {
    if (selected.includes(id)) {
      onToggle(id);
      return;
    }
    if (selected.length >= MAX_SKILLS) {
      setCapToast(true);
      setTimeout(() => setCapToast(false), 2500);
      return;
    }
    onToggle(id);
    setTimeout(() => setOverlayCard(null), 300);
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      setNudge(true);
      setTimeout(() => setNudge(false), 2500);
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-1 font-display text-2xl font-semibold text-text-primary"
      >
        What should {agentName || 'your agent'} do for you?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-5 text-sm text-text-muted"
      >
        Swipe to explore. Tap to add.
      </motion.p>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 -mx-2 px-2"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {cards.map((card, ci) => {
          const isSelected = selected.includes(card.id);
          const bg = iconBgs[card.id] || 'from-accent to-amber-600';

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.07, duration: 0.35 }}
              onClick={() => setOverlayCard(card)}
              className={cn(
                'relative flex w-[70vw] max-w-[320px] shrink-0 snap-center cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all duration-200',
                isSelected
                  ? 'border-accent shadow-glow-sm'
                  : 'border-border-subtle hover:border-border-visible',
                'bg-bg-elevated'
              )}
            >
              {/* Icon area */}
              <div
                className={cn(
                  'flex items-center justify-center bg-gradient-to-br py-10',
                  bg
                )}
              >
                <span className="text-6xl drop-shadow-lg">{card.icon}</span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-1 text-lg font-bold text-text-primary">
                  {card.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-text-muted">
                  {card.description}
                </p>

                {/* Add button */}
                <div className="mt-auto">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    animate={isSelected ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      tryToggle(card.id);
                    }}
                    className={cn(
                      'w-full rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200',
                      isSelected
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border-subtle text-text-secondary hover:border-border-visible hover:text-text-primary'
                    )}
                  >
                    {isSelected ? 'Added ✓' : 'Add +'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="mt-1 flex items-center justify-center gap-2">
        {cards.map((card, i) => {
          const isCardSelected = selected.includes(card.id);
          return (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-200',
                i === activeIndex ? 'w-5' : 'w-2',
                i === activeIndex && isCardSelected
                  ? 'bg-accent'
                  : i === activeIndex
                    ? 'bg-text-muted'
                    : isCardSelected
                      ? 'bg-accent/60'
                      : 'bg-border-subtle'
              )}
            />
          );
        })}
      </div>

      {/* Continue + counter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-5 flex items-center gap-3"
      >
        <button
          onClick={handleContinue}
          className="btn-primary flex-1 justify-center"
        >
          Continue
        </button>
        <span className="shrink-0 text-sm font-medium text-text-muted">
          {selected.length} of {MAX_SKILLS} selected
        </span>
      </motion.div>

      {/* Nudge / cap toast */}
      <AnimatePresence>
        {nudge && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-center text-xs text-text-muted"
          >
            Pick at least one to get started
          </motion.p>
        )}
        {capToast && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-center text-xs text-text-muted"
          >
            Start with {MAX_SKILLS} for now — you can add more from your dashboard anytime.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {overlayCard && (
          <FullScreenOverlay
            card={overlayCard}
            agentName={agentName}
            isSelected={selected.includes(overlayCard.id)}
            atCap={selected.length >= MAX_SKILLS && !selected.includes(overlayCard.id)}
            onToggle={() => handleAddFromOverlay(overlayCard.id)}
            onClose={() => setOverlayCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────── Full-Screen Overlay ───────── */

interface OverlayProps {
  card: ScenarioCard;
  agentName: string;
  isSelected: boolean;
  atCap: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function FullScreenOverlay({ card, agentName, isSelected, atCap, onToggle, onClose }: OverlayProps) {
  const displayName = agentName || 'Agent';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col bg-bg-surface"
    >
      {/* Top bar with close */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="w-8" />
        <div className="flex items-center gap-2">
          <span className="text-xl">{card.icon}</span>
          <h3 className="text-lg font-bold text-text-primary">{card.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-elevated text-text-muted hover:text-text-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {/* Phone mockup */}
        <div className="mx-auto max-w-sm rounded-[1.8rem] border-2 border-border-visible bg-bg-deep p-1.5 shadow-elevated">
          {/* Notch */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2">
              <div className="h-5 w-24 rounded-b-xl bg-bg-deep" />
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.4rem] bg-bg-surface">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pt-6 pb-1 text-[10px] text-text-muted">
              <span>9:41</span>
              <div className="flex items-center gap-1 opacity-50">
                <span>●●●●</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Chat header */}
            <div className="flex items-center gap-2.5 border-b border-border-subtle px-4 py-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber-600 text-xs font-bold text-bg-deep">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-semibold text-text-primary">{displayName}</div>
                <div className="text-[10px] text-success">Online</div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex flex-col gap-2 p-3">
              {card.previewMessages.map((msg, mi) => (
                <PreviewMessage key={mi} msg={msg} />
              ))}
            </div>
          </div>
        </div>

        {/* Bullets */}
        <div className="mx-auto mt-5 max-w-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            What this means for you
          </p>
          <ul className="space-y-1.5">
            {card.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky bottom add button */}
      <div className="border-t border-border-subtle px-5 py-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onToggle}
          disabled={atCap}
          className={cn(
            'mx-auto block w-full max-w-sm rounded-full py-3 text-sm font-semibold transition-all duration-200',
            isSelected
              ? 'border border-accent bg-accent/15 text-accent'
              : atCap
                ? 'border border-border-subtle bg-bg-elevated text-text-muted cursor-not-allowed'
                : 'bg-accent text-bg-deep hover:brightness-110'
          )}
        >
          {isSelected ? 'Added ✓' : atCap ? 'Limit reached (5/5)' : 'Add +'}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ───────── Preview message bubble ───────── */

function PreviewMessage({ msg }: { msg: ScenarioChatMsg }) {
  return (
    <>
      {msg.meta && (
        <div className="my-1 text-center text-[9px] text-text-muted">
          — {msg.meta} —
        </div>
      )}
      <div className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
        <div
          className={cn(
            'max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed',
            msg.role === 'user'
              ? 'rounded-br-md bg-gradient-to-r from-accent to-amber-600 font-medium text-bg-deep'
              : 'rounded-bl-md border border-border-subtle bg-bg-elevated text-text-primary'
          )}
        >
          <div className="whitespace-pre-line">{msg.content}</div>
          {msg.time && (
            <div
              className={cn(
                'mt-1 text-[9px]',
                msg.role === 'user' ? 'text-bg-deep/60' : 'text-text-muted'
              )}
            >
              {msg.time}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
