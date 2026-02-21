import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { personalityRounds } from '../../../lib/data/wizard';
import type { ThisOrThatRound, SliderRound } from '../../../lib/data/wizard';
import type { PersonalityChoice } from '../../../lib/types/wizard';

interface PersonalityPickerStepProps {
  agentName: string;
  choices: PersonalityChoice[];
  onChoice: (choice: PersonalityChoice) => void;
  onNext: () => void;
  onBack: () => void;
}

const TOTAL_ROUNDS = personalityRounds.length;

const dimensionIcons: Record<string, string> = {
  Length: '📏',
  Tone: '🎭',
  Emojis: '✨',
  Humor: '😂',
  Initiative: '🧠',
  Opinions: '💬',
  Style: '💪',
};

function interpolate(text: string, agentName: string) {
  return text.replace(/\{agent\}/g, agentName || 'your agent');
}

export default function PersonalityPickerStep({
  agentName,
  choices,
  onChoice,
  onNext,
  onBack,
}: PersonalityPickerStepProps) {
  const displayName = agentName || 'your agent';

  /* ── Phase & round state ── */
  const [currentRound, setCurrentRound] = useState(() => {
    const answered = choices.map((c) => c.round);
    const first = personalityRounds.find((r) => !answered.includes(r.id));
    return first ? personalityRounds.indexOf(first) : TOTAL_ROUNDS;
  });
  const [phase, setPhase] = useState<'rounds' | 'summary' | 'tweak'>(
    () => (currentRound >= TOTAL_ROUNDS ? 'summary' : 'rounds')
  );

  const allDone = currentRound >= TOTAL_ROUNDS;
  const round = allDone ? null : personalityRounds[currentRound];

  useEffect(() => {
    if (allDone && phase === 'rounds') setPhase('summary');
  }, [allDone, phase]);

  const advanceRound = useCallback(() => {
    setCurrentRound((r) => {
      const next = r + 1;
      if (next >= TOTAL_ROUNDS) setPhase('summary');
      return next;
    });
  }, []);

  /* ── Round-scoped state (resets per round) ── */
  const [totActive, setTotActive] = useState<'A' | 'B'>('A');
  const [totConfirmed, setTotConfirmed] = useState(false);
  const [totInteracted, setTotInteracted] = useState(false);

  const savedSliderValue = round?.type === 'slider'
    ? (choices.find((c) => c.round === round.id)?.value ?? round.defaultValue)
    : 3;
  const [sliderValue, setSliderValue] = useState(savedSliderValue);
  const [sliderInteracted, setSliderInteracted] = useState(false);
  const [humorGate, setHumorGate] = useState<'none' | 'asking' | 'confirmed'>('none');

  // Reset round-scoped state when round changes
  useEffect(() => {
    setTotActive('A');
    setTotConfirmed(false);
    setTotInteracted(false);
    const r = personalityRounds[currentRound];
    if (r?.type === 'slider') {
      const saved = choices.find((c) => c.round === r.id)?.value;
      setSliderValue(saved ?? r.defaultValue);
    }
    setSliderInteracted(false);
    setHumorGate('none');
  }, [currentRound]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── This-or-That handlers ── */
  const handleTotToggle = (letter: 'A' | 'B') => {
    if (totConfirmed) return;
    setTotActive(letter);
    setTotInteracted(true);
  };

  const handleTotConfirm = useCallback(() => {
    if (totConfirmed) return;
    setTotConfirmed(true);
    onChoice({ round: round!.id, choice: totActive, value: null });
  }, [totConfirmed, totActive, round, onChoice]);

  // Auto-advance after this-or-that confirmation
  useEffect(() => {
    if (!totConfirmed) return;
    const timer = setTimeout(advanceRound, 900);
    return () => clearTimeout(timer);
  }, [totConfirmed, advanceRound]);

  /* ── Slider handlers ── */
  const handleSliderChange = (newVal: number) => {
    if (round?.type !== 'slider') return;
    if ((round as SliderRound).level5Warning && newVal === 5 && humorGate !== 'confirmed') {
      setHumorGate('asking');
      return;
    }
    setSliderValue(newVal);
    setSliderInteracted(true);
  };

  const handleConfirmHumor = () => {
    setHumorGate('confirmed');
    setSliderValue(5);
    setSliderInteracted(true);
  };

  const handleDeclineHumor = () => {
    setHumorGate('none');
    setSliderValue(4);
    setSliderInteracted(true);
  };

  const handleSliderConfirm = useCallback(() => {
    if (!round) return;
    onChoice({ round: round.id, choice: null, value: sliderValue });
    advanceRound();
  }, [round, sliderValue, onChoice, advanceRound]);

  const handleRedo = () => {
    setCurrentRound(0);
    setPhase('rounds');
  };

  /* ── Compute footer action ── */
  const getAction = (): { label: string; onClick: () => void; prominent: boolean } | null => {
    if (phase === 'summary') return { label: 'Looks good →', onClick: onNext, prominent: true };
    if (phase === 'tweak') return { label: 'Done →', onClick: () => setPhase('summary'), prominent: true };
    if (!round) return null;

    if (round.type === 'this-or-that') {
      if (totConfirmed) return null; // auto-advancing, hide button
      return { label: 'Next →', onClick: handleTotConfirm, prominent: totInteracted };
    }

    if (round.type === 'slider') {
      if (humorGate === 'asking') return null;
      return { label: 'This feels right →', onClick: handleSliderConfirm, prominent: sliderInteracted };
    }

    return null;
  };

  const action = getAction();

  // Confirmation message for this-or-that
  const totConfirmMsg =
    totConfirmed && round?.type === 'this-or-that'
      ? interpolate(
          totActive === 'A'
            ? (round as ThisOrThatRound).confirmA
            : (round as ThisOrThatRound).confirmB,
          displayName
        )
      : null;

  return (
    <div className="flex flex-col pb-24">
      {/* Compact header + round counter */}
      <div className="mb-3 flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-sm font-medium text-text-muted"
        >
          How should {displayName} talk?
        </motion.h2>
        {phase === 'rounds' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs tabular-nums text-text-muted"
          >
            {currentRound + 1}/{TOTAL_ROUNDS}
          </motion.span>
        )}
      </div>

      {/* Thin progress bar */}
      {phase === 'rounds' && (
        <div className="mb-6 h-[2px] w-full overflow-hidden rounded-full bg-border-subtle">
          <motion.div
            className="h-full rounded-full bg-accent/80"
            initial={false}
            animate={{ width: `${((currentRound + 1) / TOTAL_ROUNDS) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        {phase === 'rounds' && round?.type === 'this-or-that' && (
          <ThisOrThatContent
            key={`tot-${round.id}`}
            round={round}
            agentName={displayName}
            active={totActive}
            confirmed={totConfirmed}
            onToggle={handleTotToggle}
          />
        )}

        {phase === 'rounds' && round?.type === 'slider' && (
          <SliderContent
            key={`sl-${round.id}`}
            round={round}
            agentName={displayName}
            value={sliderValue}
            humorGate={humorGate}
            onSliderChange={handleSliderChange}
            onConfirmHumor={handleConfirmHumor}
            onDeclineHumor={handleDeclineHumor}
          />
        )}

        {phase === 'summary' && (
          <SummaryContent
            key="summary"
            agentName={displayName}
            choices={choices}
            onRedo={handleRedo}
            onTweak={() => setPhase('tweak')}
          />
        )}

        {phase === 'tweak' && (
          <TweakContent
            key="tweak"
            choices={choices}
            onChoice={onChoice}
          />
        )}
      </AnimatePresence>

      {/* ── Fixed bottom bar: Back + Next ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="mx-auto max-w-[640px] px-6 pb-8 pt-6 pointer-events-auto bg-gradient-to-t from-bg-deep from-70% to-transparent">
          <div className="flex items-center justify-between gap-3">
            {/* Back */}
            <button
              onClick={onBack}
              className="rounded-xl border border-border-subtle px-5 py-2.5 text-sm font-medium text-text-secondary transition hover:border-border-visible hover:text-text-primary"
            >
              Back
            </button>

            {/* Action / confirmation */}
            <AnimatePresence mode="wait">
              {totConfirmMsg ? (
                <motion.span
                  key="tot-confirm"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium text-text-muted"
                >
                  {totConfirmMsg}
                </motion.span>
              ) : action ? (
                <motion.button
                  key={`action-${phase}-${currentRound}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={action.onClick}
                  className={cn(
                    'rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300',
                    action.prominent
                      ? 'bg-gradient-to-r from-accent to-amber-600 text-bg-deep shadow-glow-sm'
                      : 'border border-border-subtle text-text-muted hover:border-accent/40 hover:text-text-primary'
                  )}
                >
                  {action.label}
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Shared Hero Card ───────── */

function AgentMessageCard({
  agentName,
  message,
  messageKey,
  isEmpty,
}: {
  agentName: string;
  message: string;
  messageKey: string | number;
  isEmpty?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[rgba(26,26,31,0.65)] p-5 backdrop-blur-md shadow-card">
      {/* Agent avatar + name */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber-600 text-[11px] font-bold text-bg-deep">
          {agentName.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-medium text-text-muted">{agentName}</span>
      </div>

      {/* Message with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={messageKey}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className={cn(
            'whitespace-pre-line leading-relaxed',
            isEmpty
              ? 'text-sm text-text-muted italic'
              : 'text-[17px] text-text-primary'
          )}
        >
          {message}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ───────── This or That Content (presentation only) ───────── */

function ThisOrThatContent({
  round,
  agentName,
  active,
  confirmed,
  onToggle,
}: {
  round: ThisOrThatRound;
  agentName: string;
  active: 'A' | 'B';
  confirmed: boolean;
  onToggle: (letter: 'A' | 'B') => void;
}) {
  const currentMessage = active === 'A' ? round.optionA : round.optionB;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
      {/* User context — visible but quiet */}
      <p className="mb-3 text-sm text-text-secondary">
        "{round.userMessage}"
      </p>

      {/* Hero agent message card */}
      <AgentMessageCard
        agentName={agentName}
        message={currentMessage}
        messageKey={active}
      />

      {/* Toggle pills */}
      <div className="relative mt-5 flex gap-2">
        {(['A', 'B'] as const).map((letter) => {
          const label = letter === 'A' ? round.labelA : round.labelB;
          const isActive = active === letter;
          return (
            <motion.button
              key={letter}
              onClick={() => onToggle(letter)}
              disabled={confirmed}
              whileTap={confirmed ? {} : { scale: 0.96 }}
              className={cn(
                'relative flex-1 overflow-hidden rounded-full py-2.5 text-sm font-medium transition-colors duration-200',
                confirmed && !isActive && 'opacity-30',
                isActive
                  ? 'text-bg-deep'
                  : 'border border-border-subtle text-text-muted hover:border-border-visible hover:text-text-primary'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={`pill-bg-${round.id}`}
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ───────── Slider Content (presentation only) ───────── */

function SliderContent({
  round,
  agentName,
  value,
  humorGate,
  onSliderChange,
  onConfirmHumor,
  onDeclineHumor,
}: {
  round: SliderRound;
  agentName: string;
  value: number;
  humorGate: 'none' | 'asking' | 'confirmed';
  onSliderChange: (val: number) => void;
  onConfirmHumor: () => void;
  onDeclineHumor: () => void;
}) {
  const level = round.levels[value - 1];
  const isEmptyPreview = !level?.preview;
  const leftLabel = round.levels[0]?.label;
  const rightLabel = round.levels[round.levels.length - 1]?.label;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
    >
      {/* Hero agent message card */}
      {humorGate !== 'asking' && (
        <AgentMessageCard
          agentName={agentName}
          message={
            isEmptyPreview
              ? interpolate('{agent} is waiting for you to reach out.', agentName)
              : level.preview
          }
          messageKey={value}
          isEmpty={isEmptyPreview}
        />
      )}

      {/* Humor interstitial */}
      <AnimatePresence>
        {humorGate === 'asking' && round.level5Warning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-border-subtle bg-bg-deep p-5 text-center"
          >
            <span className="mb-2 block text-3xl">😈</span>
            <p className="mb-4 text-sm text-text-secondary">
              {interpolate(round.level5Warning, agentName)}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onConfirmHumor}
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-bg-deep"
              >
                Show me 😈
              </button>
              <button
                onClick={onDeclineHumor}
                className="rounded-full border border-border-subtle px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
              >
                Maybe not
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current level label */}
      {humorGate !== 'asking' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-5 text-center"
          >
            <span className="text-sm font-semibold text-accent">{level?.label}</span>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Chunky slider */}
      {humorGate !== 'asking' && (
        <div className="mt-4">
          <div className="mb-2 flex justify-between px-1">
            <span className="text-[10px] text-text-muted/60">{leftLabel}</span>
            <span className="text-[10px] text-text-muted/60">{rightLabel}</span>
          </div>

          <div className="relative mx-auto h-11 px-1">
            <div className="absolute top-1/2 left-1 right-1 h-[6px] -translate-y-1/2 rounded-full bg-border-subtle" />
            <motion.div
              className="absolute top-1/2 left-1 h-[6px] -translate-y-1/2 rounded-full bg-accent"
              initial={false}
              animate={{ width: `${((value - 1) / 4) * 100}%` }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
            <div className="relative flex h-full items-center justify-between">
              {round.levels.map((_, i) => {
                const isActive = i + 1 === value;
                const isFilled = i + 1 <= value;
                return (
                  <motion.button
                    key={i}
                    onClick={() => onSliderChange(i + 1)}
                    animate={{
                      width: isActive ? 28 : 14,
                      height: isActive ? 28 : 14,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={cn(
                      'relative z-10 rounded-full',
                      isActive
                        ? 'bg-accent shadow-glow-sm'
                        : isFilled
                          ? 'bg-accent'
                          : 'bg-border-visible'
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ───────── Summary Content ───────── */

function SummaryContent({
  agentName,
  choices,
  onRedo,
  onTweak,
}: {
  agentName: string;
  choices: PersonalityChoice[];
  onRedo: () => void;
  onTweak: () => void;
}) {
  const getLabel = (round: (typeof personalityRounds)[number]) => {
    const pick = choices.find((c) => c.round === round.id);
    if (!pick) return '—';
    if (round.type === 'this-or-that') {
      return pick.choice === 'A' ? round.labelA : round.labelB;
    }
    const idx = (pick.value ?? round.defaultValue) - 1;
    return round.levels[idx]?.label ?? '—';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center"
    >
      <div className="w-full rounded-2xl border border-border-subtle bg-bg-elevated p-5">
        <p className="mb-4 text-center text-sm font-semibold text-text-muted">
          {agentName}&apos;s personality
        </p>
        <div className="space-y-2">
          {personalityRounds.map((round) => (
            <div key={round.id} className="flex items-center gap-2.5">
              <span className="w-5 text-center text-sm">{dimensionIcons[round.dimension] || '•'}</span>
              <span className="w-20 shrink-0 text-xs text-text-muted">{round.dimension}</span>
              <span className="rounded-full border border-border-subtle bg-bg-surface px-3 py-1 text-xs font-medium text-text-primary">
                {getLabel(round)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 justify-center">
        <button
          onClick={onRedo}
          className="text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          Redo
        </button>
        <span className="text-border-subtle">·</span>
        <button
          onClick={onTweak}
          className="text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          Tweak
        </button>
      </div>
    </motion.div>
  );
}

/* ───────── Tweak Content ───────── */

function TweakContent({
  choices,
  onChoice,
}: {
  choices: PersonalityChoice[];
  onChoice: (choice: PersonalityChoice) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col"
    >
      <div className="space-y-5">
        {personalityRounds.map((round) => {
          const pick = choices.find((c) => c.round === round.id);

          if (round.type === 'this-or-that') {
            const current = pick?.choice ?? 'A';
            return (
              <div key={round.id}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm">{dimensionIcons[round.dimension] || '•'}</span>
                  <span className="text-xs font-medium text-text-muted">{round.dimension}</span>
                </div>
                <div className="flex rounded-full border border-border-subtle bg-bg-elevated p-0.5">
                  {(['A', 'B'] as const).map((letter) => {
                    const label = letter === 'A' ? round.labelA : round.labelB;
                    const isActive = current === letter;
                    return (
                      <button
                        key={letter}
                        onClick={() => onChoice({ round: round.id, choice: letter, value: null })}
                        className={cn(
                          'flex-1 rounded-full py-1.5 text-xs font-medium transition-all duration-200',
                          isActive
                            ? 'bg-accent text-bg-deep'
                            : 'text-text-muted hover:text-text-primary'
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          const currentVal = pick?.value ?? round.defaultValue;
          return (
            <div key={round.id}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{dimensionIcons[round.dimension] || '•'}</span>
                  <span className="text-xs font-medium text-text-muted">{round.dimension}</span>
                </div>
                <span className="text-xs font-medium text-accent">
                  {round.levels[currentVal - 1]?.label}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {round.levels.map((_, i) => {
                  const pos = i + 1;
                  const isActive = pos === currentVal;
                  const isFilled = pos <= currentVal;
                  return (
                    <button
                      key={i}
                      onClick={() => onChoice({ round: round.id, choice: null, value: pos })}
                      className="flex-1 flex justify-center py-1"
                    >
                      <div
                        className={cn(
                          'rounded-full transition-all duration-200',
                          isActive
                            ? 'h-4 w-4 bg-accent'
                            : isFilled
                              ? 'h-2.5 w-2.5 bg-accent/60'
                              : 'h-2.5 w-2.5 bg-border-subtle'
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
