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

const dimensionQuestions: Record<string, string> = {
  Length: 'How detailed should {agent} be?',
  Tone: 'How should {agent} sound?',
  Emojis: 'How many emojis should {agent} use?',
  Humor: 'How funny should {agent} be?',
  Initiative: 'How proactive should {agent} be?',
  Opinions: 'How opinionated should {agent} be?',
  Style: 'How should {agent} handle pushback?',
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
  const [phase, setPhase] = useState<'intro' | 'rounds' | 'summary' | 'tweak'>(() => {
    if (currentRound >= TOTAL_ROUNDS) return 'summary';
    if (choices.length === 0) return 'intro';
    return 'rounds';
  });

  const allDone = currentRound >= TOTAL_ROUNDS;
  const round = allDone ? null : personalityRounds[currentRound];

  useEffect(() => {
    if (allDone && (phase === 'rounds' || phase === 'intro')) setPhase('summary');
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
    if (totConfirmed || !totInteracted) return;
    setTotConfirmed(true);
    onChoice({ round: round!.id, choice: totActive, value: null });
  }, [totConfirmed, totInteracted, totActive, round, onChoice]);

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
    if (!round || !sliderInteracted) return;
    onChoice({ round: round.id, choice: null, value: sliderValue });
    advanceRound();
  }, [round, sliderValue, sliderInteracted, onChoice, advanceRound]);

  const handleRedo = () => {
    setCurrentRound(0);
    setPhase('rounds');
  };

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

  /* ── Intro screen ── */
  if (phase === 'intro') {
    return (
      <div className="flex flex-col">
        {/* Mirror WizardShell chrome */}
        <header className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
            Agent Host
          </p>
          <p className="text-xs text-text-muted">3 / 6</p>
        </header>
        <div className="mt-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent to-amber-600"
              initial={false}
              animate={{ width: '50%' }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center pt-16 sm:pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center font-display text-xl sm:text-2xl font-semibold text-text-primary"
          >
            Let&apos;s shape {displayName}&apos;s personality
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-3 max-w-sm text-center text-sm text-text-secondary"
          >
            You&apos;ll see how {displayName} would respond in real situations.
            Just pick the style you prefer.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setPhase('rounds')}
            className="mt-8 rounded-xl bg-gradient-to-r from-accent to-amber-600 px-8 py-3.5 text-sm font-semibold text-bg-deep shadow-glow-sm"
          >
            Let&apos;s go &rarr;
          </motion.button>
        </div>
      </div>
    );
  }

  /* ── Summary / Tweak ── */
  if (phase === 'summary' || phase === 'tweak') {
    return (
      <div className="flex flex-col pb-28 sm:pb-32">
        <AnimatePresence mode="wait">
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

        {/* Fixed bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          <div className="mx-auto max-w-[640px] px-4 sm:px-6 pb-5 sm:pb-8 pt-5 sm:pt-6 pointer-events-auto bg-gradient-to-t from-bg-deep from-70% to-transparent">
            <div className="flex flex-col gap-3">
              <button
                onClick={phase === 'summary' ? onNext : () => setPhase('summary')}
                className="w-full rounded-xl bg-gradient-to-r from-accent to-amber-600 py-3.5 text-sm font-semibold text-bg-deep shadow-glow-sm"
              >
                {phase === 'summary' ? 'Looks good \u2192' : 'Done \u2192'}
              </button>
              <button
                onClick={onBack}
                className="w-full rounded-xl border border-border-subtle py-2.5 text-sm font-medium text-text-secondary transition hover:border-border-visible hover:text-text-primary"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Rounds (1–7) — no shell chrome, no Back ── */
  const roundAction =
    round?.type === 'this-or-that'
      ? (!totConfirmed ? { label: 'Next \u2192', onClick: handleTotConfirm, disabled: !totInteracted } : null)
      : round?.type === 'slider' && humorGate !== 'asking'
        ? { label: 'This feels right \u2192', onClick: handleSliderConfirm, disabled: !sliderInteracted }
        : null;

  return (
    <div className="flex flex-col pb-56 sm:pb-64">
      {/* Header + dot indicators */}
      <div className="mb-3 sm:mb-4">
        <h2 className="font-display text-xs sm:text-sm font-medium text-text-muted">
          How should {displayName} talk?
        </h2>
        <div className="mt-2 flex items-center gap-1.5">
          {personalityRounds.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 w-1.5 rounded-full transition-colors duration-300',
                i === currentRound
                  ? 'bg-accent'
                  : i < currentRound
                    ? 'bg-accent/40'
                    : 'bg-border-subtle'
              )}
            />
          ))}
        </div>
      </div>

      {/* Round content — only the card, no pills */}
      {round?.type === 'this-or-that' && (
        <ThisOrThatContent
          round={round}
          agentName={displayName}
          active={totActive}
        />
      )}
      {round?.type === 'slider' && (
        <SliderContent
          round={round}
          agentName={displayName}
          value={sliderValue}
          humorGate={humorGate}
          onConfirmHumor={handleConfirmHumor}
          onDeclineHumor={handleDeclineHumor}
        />
      )}

      {/* ── Fixed bottom bar: question + pills + action ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="mx-auto max-w-[640px] px-4 sm:px-6 pb-5 sm:pb-8 pt-4 pointer-events-auto bg-gradient-to-t from-bg-deep from-60% to-transparent">
          {/* Dimension question */}
          {round && !totConfirmMsg && (
            <p className="mb-3 text-center text-sm sm:text-base font-medium text-text-secondary">
              {interpolate(dimensionQuestions[round.dimension] || '', displayName)}
            </p>
          )}

          {/* This-or-that pills */}
          {round?.type === 'this-or-that' && !totConfirmMsg && (
            <div className="relative mb-3 flex gap-2.5 sm:gap-3">
              {(['A', 'B'] as const).map((letter) => {
                const r = round as ThisOrThatRound;
                const label = letter === 'A' ? r.labelA : r.labelB;
                const isActive = totActive === letter && totInteracted;
                return (
                  <button
                    key={letter}
                    onClick={() => handleTotToggle(letter)}
                    disabled={totConfirmed}
                    className={cn(
                      'relative flex-1 overflow-hidden rounded-xl py-3 sm:py-3.5 text-sm sm:text-base font-medium transition-all duration-200',
                      totConfirmed && !isActive && 'opacity-20',
                      isActive
                        ? 'bg-accent text-bg-deep shadow-glow-sm'
                        : 'border border-border-visible bg-bg-elevated text-text-secondary hover:border-accent/30 hover:text-text-primary'
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Slider pills */}
          {round?.type === 'slider' && humorGate !== 'asking' && (
            <div className="mb-3 flex flex-wrap justify-center gap-2 sm:gap-2.5">
              {(round as SliderRound).levels.map((lvl, i) => {
                const pos = i + 1;
                const isActive = pos === sliderValue;
                return (
                  <button
                    key={i}
                    onClick={() => handleSliderChange(pos)}
                    className={cn(
                      'rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-accent text-bg-deep shadow-glow-sm'
                        : 'border border-border-visible bg-bg-elevated text-text-secondary hover:border-accent/30 hover:text-text-primary'
                    )}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Action / confirmation */}
          {totConfirmMsg ? (
            <p className="text-center text-sm font-medium text-text-muted">
              {totConfirmMsg}
            </p>
          ) : roundAction ? (
            <button
              disabled={roundAction.disabled}
              onClick={roundAction.onClick}
              className={cn(
                'w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-300',
                roundAction.disabled
                  ? 'border border-border-subtle text-text-muted/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-accent to-amber-600 text-bg-deep shadow-glow-sm'
              )}
            >
              {roundAction.label}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ───────── Shared Hero Card ───────── */

function AgentMessageCard({
  agentName,
  message,
  isEmpty,
}: {
  agentName: string;
  message: string;
  isEmpty?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[rgba(26,26,31,0.65)] p-4 sm:p-5 md:p-6 backdrop-blur-md shadow-card">
      {/* Agent avatar + name */}
      <div className="mb-2.5 sm:mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber-600 text-[11px] font-bold text-bg-deep">
          {agentName.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-medium text-text-muted">{agentName}</span>
      </div>

      <div
        className={cn(
          'whitespace-pre-line leading-relaxed',
          isEmpty
            ? 'text-sm text-text-muted italic'
            : 'text-[15px] sm:text-[17px] text-text-primary'
        )}
      >
        {message}
      </div>
    </div>
  );
}

/* ───────── This or That Content (presentation only) ───────── */

function ThisOrThatContent({
  round,
  agentName,
  active,
}: {
  round: ThisOrThatRound;
  agentName: string;
  active: 'A' | 'B';
}) {
  const currentMessage = active === 'A' ? round.optionA : round.optionB;

  return (
    <div className="flex flex-col">
      {/* Context line */}
      <p className="mb-3 text-sm sm:text-base italic text-text-muted/70">
        {interpolate(round.context, agentName)}
      </p>

      {/* User message — looks like a sent message, not a button */}
      <div className="mb-3 sm:mb-4 flex justify-end">
        <div className="rounded-2xl rounded-br-sm bg-white/[0.06] px-4 py-2.5 max-w-[80%]">
          <p className="text-sm sm:text-[15px] text-text-secondary">
            {round.userMessage}
          </p>
        </div>
      </div>

      {/* Hero agent message card */}
      <AgentMessageCard
        agentName={agentName}
        message={currentMessage}
      />
    </div>
  );
}

/* ───────── Slider Content (presentation only) ───────── */

function SliderContent({
  round,
  agentName,
  value,
  humorGate,
  onConfirmHumor,
  onDeclineHumor,
}: {
  round: SliderRound;
  agentName: string;
  value: number;
  humorGate: 'none' | 'asking' | 'confirmed';
  onConfirmHumor: () => void;
  onDeclineHumor: () => void;
}) {
  const level = round.levels[value - 1];
  const isEmptyPreview = !level?.preview;

  return (
    <div className="flex flex-col">
      {/* Context line */}
      <p className="mb-3 text-sm sm:text-base italic text-text-muted/70">
        {interpolate(round.context, agentName)}
      </p>

      {/* Hero agent message card */}
      {humorGate !== 'asking' && (
        <AgentMessageCard
          agentName={agentName}
          message={
            isEmptyPreview
              ? interpolate('{agent} is waiting for you to reach out.', agentName)
              : level.preview
          }
          isEmpty={isEmptyPreview}
        />
      )}

      {/* Humor interstitial */}
      {humorGate === 'asking' && round.level5Warning && (
        <div className="rounded-2xl border border-border-subtle bg-bg-deep p-5 sm:p-6 text-center">
          <span className="mb-2 block text-3xl">😈</span>
          <p className="mb-4 text-sm sm:text-base text-text-secondary">
            {interpolate(round.level5Warning, agentName)}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onConfirmHumor}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-bg-deep"
            >
              Show me 😈
            </button>
            <button
              onClick={onDeclineHumor}
              className="rounded-xl border border-border-subtle px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Maybe not
            </button>
          </div>
        </div>
      )}
    </div>
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
      <div className="w-full rounded-2xl border border-border-subtle bg-bg-elevated p-4 sm:p-5">
        <p className="mb-3 sm:mb-4 text-center text-sm font-semibold text-text-muted">
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
                <div className="flex rounded-xl border border-border-subtle bg-bg-elevated p-0.5">
                  {(['A', 'B'] as const).map((letter) => {
                    const label = letter === 'A' ? round.labelA : round.labelB;
                    const isActive = current === letter;
                    return (
                      <button
                        key={letter}
                        onClick={() => onChoice({ round: round.id, choice: letter, value: null })}
                        className={cn(
                          'flex-1 rounded-[10px] py-2 text-xs sm:text-sm font-medium transition-all duration-200',
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
              <div className="flex flex-wrap gap-1.5">
                {round.levels.map((lvl, i) => {
                  const pos = i + 1;
                  const isActive = pos === currentVal;
                  return (
                    <button
                      key={i}
                      onClick={() => onChoice({ round: round.id, choice: null, value: pos })}
                      className={cn(
                        'rounded-lg px-2.5 py-1.5 text-[11px] sm:text-xs font-medium transition-all duration-200',
                        isActive
                          ? 'bg-accent text-bg-deep'
                          : 'border border-border-subtle bg-bg-surface text-text-muted hover:border-accent/30 hover:text-text-primary'
                      )}
                    >
                      {lvl.label}
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
