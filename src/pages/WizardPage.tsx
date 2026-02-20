import { useMemo, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../hooks/useTheme";

const TOTAL_STEPS = 6;

type WizardState = {
  personality: string | null;
  style: string | null;
  name: string;
  work: string;
  timezone: string;
  channels: string[];
};

const timezones = [
  "UTC",
  "US/Eastern",
  "US/Pacific",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Vilnius",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

const personalities = [
  { label: "Sharp & Direct", emoji: "⚡", desc: "Fast answers, no fluff" },
  { label: "Funny & Casual", emoji: "😄", desc: "Keeps it light, a bit of roasting" },
  { label: "Warm & Supportive", emoji: "🤝", desc: "Patient, encouraging, thorough" },
  { label: "Deep & Analytical", emoji: "🧠", desc: "Thinks carefully, gives structured answers" },
];

const responseStyles = [
  { label: "Short & punchy", emoji: "💬", desc: "Get to the point fast" },
  { label: "Detailed & thorough", emoji: "📖", desc: "Full context and reasoning" },
];

const channels = [
  { label: "Telegram", emoji: "💬" },
  { label: "WhatsApp", emoji: "📱" },
  { label: "Local terminal only", emoji: "🖥️" },
];

export default function WizardPage() {
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState(0);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [state, setState] = useState<WizardState>({
    personality: null,
    style: null,
    name: "",
    work: "",
    timezone: "UTC",
    channels: [],
  });

  const progress = useMemo(() => ((step + 1) / TOTAL_STEPS) * 100, [step]);

  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-night-900 via-night-800 to-night-700 text-white"
      : "bg-gradient-to-br from-white via-ice-900 to-ice-800 text-slate-900";

  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textMuted = theme === "dark" ? "text-white/70" : "text-slate-600";
  const textSoft = theme === "dark" ? "text-white/60" : "text-slate-500";
  const borderBase = theme === "dark" ? "border-white/10" : "border-slate-200";
  const panelBg = theme === "dark" ? "bg-white/5" : "bg-white/80";
  const panelBorder = theme === "dark" ? "border-white/10" : "border-slate-200";
  const inputBg = theme === "dark" ? "bg-white/5" : "bg-white";
  const inputText =
    theme === "dark"
      ? "text-white placeholder:text-white/40"
      : "text-slate-900 placeholder:text-slate-400";
  const headerMeta = theme === "dark" ? "text-white/50" : "text-slate-500";
  const buttonGhost =
    theme === "dark"
      ? "border-white/20 bg-white/10 text-white/80 hover:text-white"
      : "border-slate-200 bg-white text-slate-600 hover:text-slate-900";

  const cardBase =
    "rounded-2xl border px-4 py-4 transition-all duration-200 text-left hover:-translate-y-0.5";

  const nextDisabled =
    (step === 1 && !state.personality) ||
    (step === 2 && !state.style) ||
    (step === 4 && state.channels.length === 0);

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleCheckout = () => {
    setIsCheckoutLoading(true);
    console.log("Redirecting to Stripe...");
    // TODO: replace with Stripe.redirectToCheckout({ sessionId })
    window.setTimeout(() => setIsCheckoutLoading(false), 1200);
  };

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      <div className="mx-auto flex min-h-screen max-w-[640px] flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div>
            <p className={`text-xs uppercase tracking-[0.3em] ${headerMeta}`}>
              OpenClaw Onboard
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} buttonGhost={buttonGhost} />
        </header>

        <div className="mt-6">
          <div
            className={`h-2 w-full rounded-full ${
              theme === "dark" ? "bg-white/10" : "bg-slate-200"
            }`}
          >
            <div
              className="h-2 rounded-full bg-gradient-to-r from-accent-500 via-accent-600 to-lime-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={`mt-2 text-xs ${textSoft}`}>
            Step {step + 1} of {TOTAL_STEPS}
          </p>
        </div>

        <main
          key={step}
          className={`mt-8 flex-1 animate-slideIn rounded-3xl border ${panelBorder} ${panelBg} p-6 shadow-soft ${
            theme === "dark" ? "backdrop-blur" : ""
          }`}
        >
          {step === 0 && (
            <section className="space-y-6">
              <div>
                <h1 className={`font-display text-3xl font-semibold ${textPrimary}`}>
                  Meet your AI agent.
                </h1>
                <p className={`mt-2 ${textMuted}`}>
                  Answer a few questions and your agent will be ready in 2 minutes.
                </p>
              </div>
              <button
                className={`w-full rounded-2xl py-3 font-semibold transition ${
                  theme === "dark"
                    ? "bg-white text-night-900 hover:bg-ice-900"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
                onClick={handleNext}
              >
                Get Started
              </button>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-6">
              <div>
                <h2 className={`font-display text-2xl font-semibold ${textPrimary}`}>
                  What kind of agent do you want?
                </h2>
                <p className={`mt-2 ${textMuted}`}>Pick one personality.</p>
              </div>
              <div className="grid gap-3">
                {personalities.map((item) => {
                  const selected = state.personality === item.label;
                  return (
                    <button
                      key={item.label}
                      className={`${cardBase} ${
                        selected
                          ? "border-accent-500 bg-white/15"
                          : `${borderBase} ${panelBg}`
                      }`}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          personality: item.label,
                        }))
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <p className={`font-semibold ${textPrimary}`}>
                            {item.label}
                          </p>
                          <p className={`text-sm ${textSoft}`}>{item.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <div>
                <h2 className={`font-display text-2xl font-semibold ${textPrimary}`}>
                  How should your agent talk?
                </h2>
                <p className={`mt-2 ${textMuted}`}>Select one response style.</p>
              </div>
              <div className="grid gap-4">
                {responseStyles.map((item) => {
                  const selected = state.style === item.label;
                  return (
                    <button
                      key={item.label}
                      className={`${cardBase} ${
                        selected
                          ? "border-lime-500 bg-white/15"
                          : `${borderBase} ${panelBg}`
                      }`}
                      onClick={() =>
                        setState((prev) => ({ ...prev, style: item.label }))
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <p className={`font-semibold ${textPrimary}`}>
                            {item.label}
                          </p>
                          <p className={`text-sm ${textSoft}`}>{item.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-6">
              <div>
                <h2 className={`font-display text-2xl font-semibold ${textPrimary}`}>
                  Tell your agent about yourself
                </h2>
                <p className={`mt-2 ${textMuted}`}>Just the essentials.</p>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className={`text-sm ${textMuted}`}>Your name</span>
                  <input
                    className={`mt-2 w-full rounded-xl border ${borderBase} ${inputBg} px-4 py-3 text-sm ${inputText} focus:border-accent-500 focus:outline-none`}
                    placeholder="Ava Parker"
                    value={state.name}
                    onChange={(event) =>
                      setState((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </label>
                <label className="block">
                  <span className={`text-sm ${textMuted}`}>
                    What do you mainly work on?
                  </span>
                  <input
                    className={`mt-2 w-full rounded-xl border ${borderBase} ${inputBg} px-4 py-3 text-sm ${inputText} focus:border-accent-500 focus:outline-none`}
                    placeholder="Product design, data science, ops..."
                    value={state.work}
                    onChange={(event) =>
                      setState((prev) => ({ ...prev, work: event.target.value }))
                    }
                  />
                </label>
                <label className="block">
                  <span className={`text-sm ${textMuted}`}>Your timezone</span>
                  <select
                    className={`mt-2 w-full rounded-xl border ${borderBase} ${inputBg} px-4 py-3 text-sm ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    } focus:border-accent-500 focus:outline-none`}
                    value={state.timezone}
                    onChange={(event) =>
                      setState((prev) => ({
                        ...prev,
                        timezone: event.target.value,
                      }))
                    }
                  >
                    {timezones.map((zone) => (
                      <option key={zone} value={zone} className="text-night-900">
                        {zone}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-6">
              <div>
                <h2 className={`font-display text-2xl font-semibold ${textPrimary}`}>
                  How will you talk to your agent?
                </h2>
                <p className={`mt-2 ${textMuted}`}>Pick one or more channels.</p>
              </div>
              <div className="grid gap-3">
                {channels.map((item) => {
                  const selected = state.channels.includes(item.label);
                  return (
                    <button
                      key={item.label}
                      className={`${cardBase} ${
                        selected
                          ? "border-accent-500 bg-white/15"
                          : `${borderBase} ${panelBg}`
                      }`}
                      onClick={() =>
                        setState((prev) => {
                          const exists = prev.channels.includes(item.label);
                          return {
                            ...prev,
                            channels: exists
                              ? prev.channels.filter((c) => c !== item.label)
                              : [...prev.channels, item.label],
                          };
                        })
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <p className={`font-semibold ${textPrimary}`}>
                          {item.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="space-y-6">
              <div>
                <h2 className={`font-display text-2xl font-semibold ${textPrimary}`}>
                  Your agent is ready.
                </h2>
                <p className={`mt-2 ${textMuted}`}>
                  Review your setup and start checkout to launch your agent.
                </p>
              </div>
              <div className={`rounded-2xl border ${panelBorder} ${panelBg} p-5`}>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className={textSoft}>Name</span>
                    <span className={`font-semibold ${textPrimary}`}>
                      {state.name || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={textSoft}>Personality</span>
                    <span className={`font-semibold ${textPrimary}`}>
                      {state.personality || "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={textSoft}>Style</span>
                    <span className={`font-semibold ${textPrimary}`}>
                      {state.style || "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={textSoft}>Channel</span>
                    <span className={`font-semibold ${textPrimary} text-right`}>
                      {state.channels.length > 0
                        ? state.channels.join(", ")
                        : "Not selected"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className={`w-full rounded-2xl py-3 font-semibold transition ${
                  theme === "dark"
                    ? "bg-lime-500 text-night-900 hover:bg-lime-400"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                } ${isCheckoutLoading ? "cursor-wait opacity-80" : ""}`}
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? "Processing..." : "Get Your Agent — €29/mo"}
              </button>
              <p className={`text-xs ${textSoft}`}>
                Deploy with Vercel in one click — coming soon.
              </p>
            </section>
          )}
        </main>

        <footer className={`mt-6 flex items-center justify-between text-xs ${textSoft}`}>
          <span>OpenClaw Onboard</span>
          <div className="flex items-center gap-2">
            {step > 0 && step < TOTAL_STEPS && (
              <button
                className={`rounded-full border px-3 py-1 transition ${buttonGhost}`}
                onClick={handleBack}
              >
                Back
              </button>
            )}
            {step < TOTAL_STEPS - 1 && (
              <button
                className={`rounded-full px-4 py-1 font-semibold transition ${
                  nextDisabled
                    ? theme === "dark"
                      ? "cursor-not-allowed bg-white/10 text-white/40"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                    : theme === "dark"
                      ? "bg-white text-night-900 hover:bg-ice-900"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
                onClick={handleNext}
                disabled={nextDisabled}
              >
                Next
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
