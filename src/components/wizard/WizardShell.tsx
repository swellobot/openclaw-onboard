import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface WizardShellProps {
  step: number;
  direction: number;
  progress: number;
  totalSteps: number;
  canGoBack: boolean;
  showNav: boolean;
  hideChrome?: boolean;
  onBack: () => void;
  children: ReactNode;
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function WizardShell({
  step,
  direction,
  progress,
  totalSteps,
  canGoBack,
  showNav,
  hideChrome,
  onBack,
  children,
}: WizardShellProps) {
  return (
    <div className="min-h-screen bg-bg-deep">
      <div className="mx-auto flex min-h-screen max-w-[640px] flex-col px-6 py-8">
        {!hideChrome && (
          <>
            {/* Header */}
            <header className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                Agent Host
              </p>
              <p className="text-xs text-text-muted">
                {step + 1} / {totalSteps}
              </p>
            </header>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-amber-600"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  layout
                />
              </div>
            </div>
          </>
        )}

        {/* Step content */}
        <main className={cn(hideChrome ? 'mt-0' : 'mt-5', 'flex-1')}>
          {hideChrome ? (
            children
          ) : (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* Footer nav */}
        {showNav && (
          <footer className="mt-6 flex items-center justify-between">
            {canGoBack ? (
              <button
                onClick={onBack}
                className={cn(
                  'rounded-xl border border-border-subtle px-5 py-2.5 text-sm font-medium',
                  'text-text-secondary transition hover:border-border-visible hover:text-text-primary'
                )}
              >
                Back
              </button>
            ) : (
              <div />
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
