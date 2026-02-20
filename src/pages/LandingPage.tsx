import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../hooks/useTheme";

const problems = [
  "ChatGPT forgets you every session",
  "Setup takes hours and API knowledge",
  "Generic tools, generic results",
];

const steps = [
  "3 minutes. Answer a few questions about yourself.",
  "We build it. Your agent goes live on a private server.",
  "Open Telegram. Start talking. It knows who you are.",
];

const features = [
  "⚡ Always on — 24/7 in your Telegram",
  "🧠 Remembers everything — no more repeating yourself",
  "📅 Calendar & email — drafts, schedules, manages",
  "🔍 Deep research — web search and summaries on demand",
  "🎯 Built around you — your tone, your goals, your style",
  "🔧 Expandable — add skills: Spotify, fitness, finance, more",
];

const faqs = [
  {
    q: "Do I need technical knowledge?",
    a: "No. We handle everything.",
  },
  {
    q: "What messaging apps does it support?",
    a: "Telegram for now, WhatsApp coming soon.",
  },
  {
    q: "Can I customize it later?",
    a: "Yes. Tell your agent what to change and it updates itself.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your agent runs on your own private server. We never see your messages.",
  },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  const textMuted = theme === "dark" ? "text-white/70" : "text-slate-600";
  const textSoft = theme === "dark" ? "text-white/60" : "text-slate-500";
  const borderBase = theme === "dark" ? "border-white/10" : "border-slate-200";
  const panelBg = theme === "dark" ? "bg-white/5" : "bg-white";
  const buttonGhost =
    theme === "dark"
      ? "border-white/20 bg-white/10 text-white/80 hover:text-white"
      : "border-slate-200 bg-white text-slate-600 hover:text-slate-900";

  const sectionA = theme === "dark" ? "bg-night-900" : "bg-white";
  const sectionB = theme === "dark" ? "bg-night-800" : "bg-ice-900";
  const sectionC = theme === "dark" ? "bg-night-700" : "bg-white";

  return (
    <div
      className={`min-h-screen ${sectionA} ${
        theme === "dark" ? "text-white" : "text-slate-900"
      }`}
    >
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p
              className={`text-xs uppercase tracking-[0.3em] ${
                theme === "dark" ? "text-white/50" : "text-slate-500"
              }`}
            >
              OpenClaw Onboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#how"
              className={`hidden text-xs font-semibold uppercase tracking-wide ${textSoft} sm:block`}
            >
              See How It Works
            </a>
            <ThemeToggle theme={theme} onToggle={toggleTheme} buttonGhost={buttonGhost} />
          </div>
        </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className={`text-xs uppercase tracking-[0.3em] ${textSoft}`}>
              Hosted Personal AI Agent
            </p>
            <h1
              className={`font-display text-4xl font-semibold tracking-tight sm:text-5xl ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Your AI. Not A AI.
            </h1>
            <p className={`text-lg ${textMuted}`}>
              A personal agent built around you — your name, your goals, your tone. Lives in
              Telegram. Always on.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/setup"
                className="rounded-2xl bg-gradient-to-r from-accent-500 to-lime-500 px-6 py-3 text-center text-sm font-semibold text-night-900 transition hover:opacity-90"
              >
                Get Your Agent — €29/mo
              </Link>
              <a
                href="#how"
                className={`rounded-2xl border px-6 py-3 text-center text-sm font-semibold transition ${buttonGhost}`}
              >
                See How It Works
              </a>
            </div>
          </div>
          <div className={`rounded-3xl border ${borderBase} ${panelBg} p-6 shadow-soft`}>
            <div className="space-y-4">
              <div className={`rounded-2xl border ${borderBase} ${panelBg} p-4`}>
                <p className={`text-sm ${textSoft}`}>"Morning, Mara. You've got a client review at 2 PM."</p>
              </div>
              <div className={`rounded-2xl border ${borderBase} ${panelBg} p-4`}>
                <p className={`text-sm ${textSoft}`}>
                  "Drafted your email. Want it shorter or more direct?"
                </p>
              </div>
              <div className={`rounded-2xl border ${borderBase} ${panelBg} p-4`}>
                <p className={`text-sm ${textSoft}`}>
                  "Your research summary is ready. Top three takeaways attached."
                </p>
              </div>
            </div>
          </div>
        </section>

      <section className={`${sectionB} px-6 py-16 sm:py-20`}>
        <div className="mx-auto max-w-6xl">
          <h2
            className={`font-display text-2xl font-semibold sm:text-3xl ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            Why most AI tools disappoint
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {problems.map((item) => (
              <div
                key={item}
                className={`rounded-2xl border ${borderBase} ${panelBg} p-5 text-sm ${textMuted}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className={`${sectionC} px-6 py-16 sm:py-20`}>
        <div className="mx-auto max-w-6xl">
          <h2
            className={`font-display text-2xl font-semibold sm:text-3xl ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            How it works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((item, index) => (
              <div key={item} className={`rounded-2xl border ${borderBase} ${panelBg} p-5`}>
                <p className={`text-xs uppercase tracking-[0.3em] ${textSoft}`}>
                  Step {index + 1}
                </p>
                <p className={`mt-3 text-base ${textMuted}`}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionB} px-6 py-16 sm:py-20`}>
        <div className="mx-auto max-w-6xl">
          <h2
            className={`font-display text-2xl font-semibold sm:text-3xl ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            What your agent can do
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item) => (
              <div
                key={item}
                className={`rounded-2xl border ${borderBase} ${panelBg} p-5 text-sm ${textMuted}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionC} px-6 py-16 sm:py-20`}>
        <div className="mx-auto max-w-4xl">
          <div className={`rounded-3xl border ${borderBase} ${panelBg} p-8`}>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] ${textSoft}`}>Pricing</p>
                <h3
                  className={`mt-3 font-display text-3xl font-semibold ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  €29/month
                </h3>
                <ul className={`mt-4 space-y-2 text-sm ${textMuted}`}>
                  <li>Private server</li>
                  <li>Telegram agent</li>
                  <li>SOUL.md persona</li>
                  <li>10 skills pre-installed</li>
                  <li>Cancel anytime</li>
                </ul>
              </div>
              <Link
                to="/setup"
                className="rounded-2xl bg-gradient-to-r from-accent-500 to-lime-500 px-6 py-3 text-sm font-semibold text-night-900 transition hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`${sectionB} px-6 py-16 sm:py-20`}>
        <div className="mx-auto max-w-6xl">
          <h2
            className={`font-display text-2xl font-semibold sm:text-3xl ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            FAQ
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {faqs.map((item) => (
              <div
                key={item.q}
                className={`rounded-2xl border ${borderBase} ${panelBg} p-5`}
              >
                <p className={`text-sm font-semibold ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}
                >
                  {item.q}
                </p>
                <p className={`mt-2 text-sm ${textMuted}`}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={`${sectionA} border-t ${borderBase} px-6 py-10`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              OpenClaw Onboard
            </p>
            <p className={textSoft}>Personal AI agents in minutes.</p>
          </div>
          <div className={`flex gap-6 text-xs uppercase tracking-[0.2em] ${textSoft}`}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <p className={textSoft}>Built on OpenClaw</p>
        </div>
      </footer>
    </div>
  );
}
