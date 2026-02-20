# Prompt: Design & Build the AgentHost Website

## Context

You are the lead developer and designer for **AgentHost** (working name — suggest a better one if you find one) — a hosted personal AI agent platform built on top of OpenClaw. The product lets non-technical users get a fully configured personal AI agent on their phone in under 15 minutes. No terminal. No config files. No API keys. Just pay, answer some questions through a fun conversational onboarding, and start chatting with your personal agent on WhatsApp, Telegram, iMessage, or any other messaging platform.

You have full internet access. Before designing anything, research current design trends in 2025-2026 for SaaS landing pages, AI product websites, and premium consumer tech products. Look at sites like:
- Linear.app (clean, dark, minimal)
- Raycast.com (developer-meets-consumer)
- Arc.net (unconventional, personality-driven)
- Superhuman.com (premium feel, waitlist energy)
- Notion.so (clean, illustration-driven)
- Vercel.com (dark, modern, technical credibility)
- Perplexity.ai (clean AI product)
- Framer templates tagged "AI" and "SaaS" for inspiration on layout patterns

Find unconventional interaction patterns, scroll animations, and visual approaches that break away from the standard "hero → features → pricing → footer" SaaS template. This should feel premium and different — not like another Tailwind template.

---

## The Product

### What It Is
A hosted OpenClaw-as-a-Service platform. Users get their own personal AI agent that:
- Lives on their phone via WhatsApp, Telegram, iMessage, Slack, Discord, Signal, or WebChat
- Has persistent memory across conversations (remembers everything about them)
- Can proactively reach out with reminders, ideas, check-ins
- Can do tasks: research, draft emails, manage calendar, summarize content, think through problems
- Learns and improves over time as it accumulates context about the user
- Runs 24/7 on our infrastructure — the user never touches a server

### How Onboarding Works (Critical — This Is the Core UX Story)
1. **User lands on website → picks a plan → pays**
2. **Selects their preferred messaging channel** (WhatsApp, Telegram, iMessage, etc.)
3. **Connects the channel** (QR code scan for WhatsApp, bot link for Telegram, etc.)
4. **Gets paired with our Onboarding Agent** — a temporary, specialized agent whose only job is to get to know the user through natural conversation
5. **The Onboarding Agent conducts a 10-15 minute conversational interview:**
   - Starts casual: "What did you do today?" "What's stressing you out?" — extracting real context while feeling like a chat
   - Personality calibration through A/B preference testing: "Which of these two responses would you rather get from your agent?" — way more accurate than asking "do you want formal or casual?"
   - Encourages voice messages: "Just talk to me for a minute about yourself" — people share 10x more context through voice than typing
   - Discovers use cases naturally: "If your agent could handle one annoying thing in your life, what would it be?"
   - Sets boundaries: "Should your agent ever message people on your behalf without asking?"
   - Names the agent: "What do you want to call me? Or want me to suggest something?"
6. **Behind the scenes, the Onboarding Agent generates all OpenClaw workspace files:**
   - `USER.md` — who the human is (extracted from conversation)
   - `SOUL.md` — agent personality, tone, values (derived from preference tests)
   - `IDENTITY.md` — agent name, emoji, theme
   - `AGENTS.md` — operating contract, boundaries, guardrails
   - `TOOLS.md` — enabled capabilities based on use cases
   - `MEMORY.md` — seeded with everything learned during onboarding
   - `HEARTBEAT.md` — proactivity settings
   - `openclaw.json` — full gateway configuration
7. **A dedicated OpenClaw instance is provisioned** (Docker container on our infrastructure)
8. **The user's messaging channel is seamlessly reconnected to their NEW personal agent**
9. **The personal agent sends its first message with full context:**
   > "Hey [name], I'm [agent name]. I already know you're a [job] who [relevant detail]. What do you need?"
10. **The Onboarding Agent goes dormant. The user now has a permanent personal agent.**

The website needs to make this flow feel magical, effortless, and inevitable. The user should think: "Wait, that's ALL I have to do?"

---

## Pricing & Plans

Design the pricing around these tiers (finalize exact numbers, but this is the structure):

### Starter — $29/month
- 1 personal agent
- 1 messaging channel
- Claude Sonnet 4.5 (fast, smart, affordable)
- Basic skills (research, writing, reminders, summarization)
- 500 messages/day
- Daily memory
- Email support

### Pro — $59/month (recommended)
- 1 personal agent
- Unlimited messaging channels (WhatsApp + Telegram + iMessage simultaneously)
- Claude Opus 4.5 for complex tasks, Sonnet for routine (intelligent auto-routing)
- All skills (calendar, email drafting, browser, file access, cron jobs)
- Unlimited messages
- Long-term memory with vector search
- Voice message support (speech-to-text + text-to-speech)
- Proactive heartbeat check-ins
- Priority support

### Enterprise / Power — $129/month
- Multiple agents (up to 5 — e.g., work agent, personal agent, fitness agent)
- All Pro features
- Custom model selection (bring your own API keys or choose from catalog):
  - Claude Opus 4.6 (most capable)
  - GPT-5.2
  - Gemini 2.5 Pro
  - Local model support via Ollama
  - OpenRouter auto-routing for cost optimization
- Custom skills development
- Webhook integrations
- API access to your agent
- Advanced sandbox/security configuration
- Dedicated support

### Model Configuration (Available on Enterprise, Visible to All)
The website should have a section or interactive element showing that users can configure their agent's "brain":
- **Model selection** — pick primary model + fallbacks
- **Cost estimation** — show estimated monthly API cost based on usage patterns
- **Capability comparison** — what each model is good at (Claude for reasoning, GPT for breadth, Gemini for multimodal, local models for privacy)
- This should feel like configuring a car — picking the engine, not writing code

---

## Website Structure & Pages

### 1. Landing / Hero
- NOT a standard hero. Think: an interactive demo, a conversation preview, or an animation showing the onboarding flow in real time
- Instantly communicate the value: "Your personal AI agent. On your phone. In 15 minutes."
- Show the messaging platforms it works on (WhatsApp, Telegram, iMessage icons)
- One prominent CTA: "Get Your Agent" or "Start Now"

### 2. How It Works
- Visual storytelling of the onboarding flow (the 10-step process above)
- This should be the most impressive section — animated, interactive, or scroll-driven
- Show actual chat bubbles, voice message waveforms, the A/B preference testing
- End with the "handoff moment" — when the personal agent takes over

### 3. What Your Agent Can Do
- Not a feature list. Show USE CASES with real examples:
  - "Hey, summarize this article" → shows summary
  - "What's on my calendar tomorrow?" → shows response
  - "Draft a reply to this email" → shows draft
  - "Remind me to follow up with Sarah on Thursday" → shows confirmation
  - Voice message example → transcription → response
- Maybe an interactive chat demo where visitors can try a limited version

### 4. The Agent's Brain (Model Configuration)
- Interactive configurator showing model options
- Slider or toggle: Speed ↔ Intelligence ↔ Cost
- Show what each model excels at
- Visual comparison table (but make it beautiful, not a boring grid)

### 5. Pricing
- Three-tier pricing with the structure above
- Annual discount option
- "All plans include" section: hosting, security, memory, onboarding, updates
- Emphasize: "No API keys. No servers. No config files. Everything included."

### 6. Security & Privacy
- Local-first philosophy (your data on our secure infrastructure, not shared with anyone)
- Sandbox isolation
- Encryption
- You own your data — export anytime
- GDPR compliant
- Brief but trust-building

### 7. FAQ
- Clean, expandable FAQ addressing: "Is this safe?", "What models can I use?", "Can I switch channels?", "What happens to my data?", "Can I export?", "What if I want to self-host instead?"

### 8. Blog / Updates (future — just plan the layout)

---

## Design Requirements

### Visual Direction
- **Premium, not playful.** This is a $29-129/month product. It should feel like Superhuman, not Duolingo.
- **Dark mode primary** with a sophisticated color palette. Think deep navy/charcoal with one accent color (electric blue, warm amber, or vibrant coral — pick what works best).
- **Typography matters.** Use a modern, slightly unconventional font pairing. Not Inter + system fonts. Look at what Linear, Raycast, and Arc use. Consider: Satoshi, General Sans, Cabinet Grotto, Clash Display for headings.
- **Motion and interaction.** Subtle scroll animations, hover effects, smooth transitions. Not gratuitous — purposeful. Every animation should communicate something.
- **Mobile-first but desktop-stunning.** Most users will discover this on mobile (since the product lives on their phone). But the desktop experience should be impressive for those who find it via search/social.
- **No stock photos.** Use illustrations, 3D elements, gradients, mesh gradients, or abstract visuals. If showing UI, show actual chat interfaces with realistic conversations.
- **Whitespace is a feature.** Let the content breathe. Premium products don't cram.

### Technical Implementation
- **Next.js** (App Router) with TypeScript
- **Tailwind CSS** for utility styling + custom CSS for animations and special effects
- **Framer Motion** for animations
- **Responsive** — looks perfect on iPhone SE through 4K monitors
- **Fast** — 95+ Lighthouse performance score
- **SEO-ready** — proper meta tags, Open Graph, structured data
- **Analytics-ready** — plan for Plausible or PostHog integration

### Interactive Elements to Consider
- **Live chat preview** — animated chat bubbles showing a real conversation with the agent
- **Onboarding flow preview** — scroll-driven animation showing the interview process
- **Model configurator** — interactive element where you pick model/speed/cost
- **Pricing calculator** — estimate your monthly cost based on usage
- **Channel selector** — click your messaging app and see it light up with a preview

---

## What to Deliver

### Phase 1: Design Plan (this is what you're doing now)
1. **Moodboard / visual direction** — colors, typography, reference sites, overall feel
2. **Sitemap** — all pages and their hierarchy
3. **Wireframes** — for each major section (desktop + mobile)
4. **Component inventory** — reusable UI components needed
5. **Animation plan** — what moves, when, and why
6. **Technical architecture** — file structure, key libraries, data flow

### Phase 2: Implementation
1. Full working website based on the approved design plan
2. All pages and sections functional
3. Responsive across all breakpoints
4. Animations and interactions implemented
5. Optimized for performance
6. Ready for content integration and CMS connection

---

## Important Notes

- **The onboarding story is the hero of this website.** Most AI products say "sign up and figure it out." Our story is: "Pay, have a fun conversation, and your agent is ready." That's the magic. Design around it.
- **Show, don't tell.** Instead of saying "easy setup," SHOW the onboarding chat. Instead of saying "powerful AI," SHOW real agent responses.
- **The target audience is NOT developers.** It's professionals, entrepreneurs, busy people, ADHD warriors, anyone who wants a personal assistant but can't afford a human one. The language should be simple, the visuals should be inviting, the process should feel inevitable.
- **Don't make it look like an AI product from 2023.** No purple gradients everywhere, no robot illustrations, no "powered by AI" badges. This should look like a premium consumer product that happens to use AI.
- **Study the competition:** Look at what Lindy.ai, Relevance AI, and others are doing — then do something distinctly different and better-looking.
- **The name "AgentHost" is a working title.** If during your research you find a better name that's available, suggest it. The name should feel premium, personal, and not overly techy. Ideas to consider: personal, intimate, always-there vibes.

---

## Reference: OpenClaw Workspace Files (for accuracy in describing the product)

The user never sees these directly, but understanding them helps you describe the product accurately:

```
SOUL.md       → Agent personality, tone, values, behavioral constraints
AGENTS.md     → Operating contract: priorities, boundaries, workflow rules
USER.md       → Human context: name, timezone, job, preferences, life details
IDENTITY.md   → Agent name, emoji, visual theme
TOOLS.md      → Environment-specific tool notes and capabilities
HEARTBEAT.md  → Periodic check-in behavior and cadence
MEMORY.md     → Long-lived curated memory (persistent facts)
memory/       → Daily conversation logs (auto-managed)
openclaw.json → Master configuration (model, channels, sandbox, sessions)
```

The onboarding conversation generates ALL of these automatically. That's the product magic.

---

Now research, plan, and build something stunning. Start with the design plan (Phase 1), get my approval, then implement.