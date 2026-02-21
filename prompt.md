# Agent Onboarding System — Developer Specification

## Overview

This document specifies the onboarding flow that starts immediately after a successful purchase. The user arrives on a success page with their `session_id`, and the onboarding experience begins. The goal: by the end of this flow, we have everything needed to configure and deploy their personal AI agent (OpenClaw-based), without the user ever touching a terminal, markdown file, or config file.

**The user persona we're designing for:** A 45-year-old father who has never heard of "agents" but is curious enough to buy one. He doesn't know what SOUL.md or AGENTS.md means. He just wants a thing that helps him with stock analysis, or whatever he bought it for.

---

## Architecture

```
[Success Page with session_id]
        │
        ▼
[Onboarding UI — React/Next.js app]
        │
        ├── Static UI steps (buttons, cards, selections) — handled client-side
        │
        └── Dynamic AI conversation steps — sent to n8n webhook
                │
                POST https://oopsautomation.app.n8n.cloud/webhook/n8nwebhookscary67
                │
                Request body: { session_id, step, user_message, context_so_far }
                Response: { agent_reply, extracted_data, next_action }
```

**Rule of thumb:** If the step has fixed options (pick a channel, pick a use case), handle it with buttons/cards in the UI. If the step requires understanding the user's free-text response and generating a smart follow-up, send it to the n8n webhook.

---

## The Onboarding Flow

### STEP 0: Success Landing

**Type:** Static UI

**Trigger:** User lands on `/onboarding?session_id=xxx` after successful Stripe payment.

**What the user sees:**

```
┌─────────────────────────────────────────────┐
│                                             │
│   🎉  You're in!                            │
│                                             │
│   Let's build your personal AI agent.       │
│   This takes about 5-10 minutes and         │
│   we'll do it together — just answer         │
│   a few questions and make some choices.     │
│                                             │
│   No tech knowledge needed. Seriously.       │
│                                             │
│          [ Let's Go → ]                      │
│                                             │
└─────────────────────────────────────────────┘
```

**Vibe:** Celebratory but not over the top. Clean, modern. The button should have a subtle pulse animation to draw the eye.

**Data:** Store `session_id` in state. Everything we collect from here forward gets attached to this session.

---

### STEP 1: Meet Your Agent (Name + Personality)

**Type:** Hybrid — Static UI with AI enhancement

**What the user sees:**

```
┌─────────────────────────────────────────────┐
│                                             │
│   First things first — your agent needs     │
│   a name and a personality.                 │
│                                             │
│   What should we call your agent?           │
│                                             │
│   [ Text input: "e.g. Atlas, Jarvis..." ]   │
│                                             │
│   ── or pick one ──                         │
│                                             │
│   [ Atlas ]  [ Nova ]  [ Scout ]  [ Max ]   │
│                                             │
│   ─────────────────────────────────────     │
│                                             │
│   What vibe should your agent have?         │
│                                             │
│   ┌──────────────┐  ┌──────────────┐       │
│   │ 🎯 Straight  │  │ 😎 Chill     │       │
│   │   Shooter    │  │   Advisor    │       │
│   │              │  │              │       │
│   │ Direct. No   │  │ Relaxed but  │       │
│   │ fluff. Gets  │  │ smart. Feels │       │
│   │ to the point │  │ like a friend│       │
│   └──────────────┘  └──────────────┘       │
│                                             │
│   ┌──────────────┐  ┌──────────────┐       │
│   │ 🧠 Research  │  │ 🏆 Coach     │       │
│   │   Partner    │  │              │       │
│   │              │  │ Pushes you.  │       │
│   │ Thorough.    │  │ Challenges   │       │
│   │ Analytical.  │  │ your ideas.  │       │
│   │ Loves data.  │  │ Honest.      │       │
│   └──────────────┘  └──────────────┘       │
│                                             │
│              [ Continue → ]                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Logic:** No webhook call needed. Store `agent_name` and `personality_vibe` in session state.

**Maps to OpenClaw files:** `IDENTITY.md` (name, emoji) + `SOUL.md` (behavioral tone)

---

### STEP 2: What's This Agent For?

**Type:** Static UI — Card selection

**What the user sees:**

```
┌─────────────────────────────────────────────┐
│                                             │
│   What do you mainly want [agent_name]      │
│   to help you with?                         │
│                                             │
│   Pick one to start (you can add more       │
│   later):                                   │
│                                             │
│   ┌────────────────┐  ┌────────────────┐   │
│   │ 📈 Investing   │  │ 💼 Business    │   │
│   │ & Finance      │  │   Operations   │   │
│   │                │  │                │   │
│   │ Stock analysis,│  │ Leads, clients,│   │
│   │ portfolio,     │  │ scheduling,    │   │
│   │ market news    │  │ email, tasks   │   │
│   └────────────────┘  └────────────────┘   │
│                                             │
│   ┌────────────────┐  ┌────────────────┐   │
│   │ 🔬 Research    │  │ 🏠 Personal    │   │
│   │ & Learning     │  │   Life         │   │
│   │                │  │                │   │
│   │ Deep research, │  │ Health, habits,│   │
│   │ summaries,     │  │ family, daily  │   │
│   │ staying sharp  │  │ planning       │   │
│   └────────────────┘  └────────────────┘   │
│                                             │
│   ┌────────────────┐  ┌────────────────┐   │
│   │ 💻 Development │  │ ✨ I'm Not    │   │
│   │ & Tech         │  │   Sure Yet     │   │
│   │                │  │                │   │
│   │ Code, debug,   │  │ Let's figure   │   │
│   │ deploy, docs,  │  │ it out         │   │
│   │ automation     │  │ together       │   │
│   └────────────────┘  └────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Logic:** Store `primary_use_case`. If "I'm Not Sure Yet" is selected, the next step (AI conversation) will include extra discovery questions.

**Maps to OpenClaw files:** Determines which `AGENTS.md` template to use, which `Skills/` to pre-install, and what `TOOLS.md` to generate.

---

### STEP 3: The Conversation — Getting to Know You

**Type:** 🔴 AI-POWERED — This is where the n8n webhook handles the thinking.

**This is the core of the onboarding.** It's a chat interface where the AI asks the user smart, adaptive questions to build their `USER.md` and refine their `SOUL.md` and `AGENTS.md`.

**What the user sees:** A full chat interface. Messages appear with typing indicators, smooth animations. The AI's messages have a subtle agent avatar (using the name they picked). The user types freely.

#### Chat UI Requirements

- Typing indicator (3 bouncing dots) while waiting for webhook response
- Agent avatar + name shown on each agent message
- User messages right-aligned, agent messages left-aligned
- Smooth scroll-to-bottom on new messages
- Support for **interactive elements inside chat messages** (the webhook response can include UI components — see below)
- Progress indicator at the top showing which phase of the conversation they're in (subtle, not intrusive — like a thin progress bar or step dots)
- Mobile-responsive: full-screen chat on mobile

#### How the webhook communication works

**Request to n8n webhook:**

```json
{
  "session_id": "stripe_session_xxx",
  "step": "conversation",
  "conversation_phase": "getting_to_know_you",
  "user_message": "I work in real estate, mainly commercial properties",
  "context_so_far": {
    "agent_name": "Atlas",
    "personality_vibe": "research_partner",
    "primary_use_case": "investing_finance",
    "conversation_history": [
      { "role": "agent", "content": "Hey! I'm going to ask you some questions so I can set up Atlas perfectly for you. Let's start simple — what do you do for work?" },
      { "role": "user", "content": "I work in real estate, mainly commercial properties" }
    ],
    "extracted_data": {}
  }
}
```

**Response from n8n webhook:**

```json
{
  "agent_reply": "Nice — commercial real estate is a world of its own. What's the part of your job that eats up the most time? Like, is it deal analysis, tenant management, market research... what drains you?",
  "extracted_data": {
    "occupation": "Commercial real estate",
    "industry": "Real estate",
    "specifics": "commercial properties"
  },
  "conversation_phase": "getting_to_know_you",
  "phase_progress": 0.3,
  "is_phase_complete": false,
  "ui_components": null
}
```

#### The AI conversation should cover these areas (in natural order, not robotically):

**Phase 1 — Who are you? (2-4 messages)**
- What do you do? (job/role/industry)
- Smart follow-up based on their answer (e.g., "What's the best part about commercial real estate?" or "What's the thing that eats up your time?")
- Any hobbies or interests outside work? (brief, natural)

**Phase 2 — What do you need? (3-5 messages)**
- Based on their selected use case + what they've said so far, dig into specifics
- For investing: What do they track? Individual stocks, ETFs, crypto? What sources do they read? Do they have a portfolio they want monitored?
- For business: What tools do they use? What processes feel manual? Where do they lose time?
- For personal: What does their daily routine look like? What would they offload?
- For "not sure": Discovery questions — "If you could have a smart assistant do one thing for you right now, what would it be?"

**Phase 3 — Preferences (2-3 messages)**
- How often do you want to hear from your agent? (proactive check-ins)
- Morning briefings? End-of-day summaries? Only when you message?
- Any topics or boundaries? (Things the agent should never do, or always do)

**Phase 4 — Wrap up (1-2 messages)**
- Quick summary of what the agent will be set up to do
- "Anything else I should know about you that would help [agent_name] be better?"
- Transition message: "Perfect — I've got everything I need. Let's get [agent_name] connected to your favorite messaging app."

#### Key AI behavior rules (for the n8n system prompt):

1. **Never ask more than one question at a time.** One message = one question or one reaction + one question.
2. **React to what they said before asking the next thing.** If they say "I work in real estate", don't just say "Great! What are your hobbies?" — say something like "Nice — commercial real estate is a world of its own. What's the part that eats up the most time?"
3. **Keep messages short.** 2-3 sentences max. This is chat, not email.
4. **Be warm and human, not corporate.** No "Thank you for sharing that!" — more like "Oh that's interesting" or "Ha, yeah that sounds exhausting."
5. **If the user gives a short answer, dig deeper. If they give a detailed answer, acknowledge and move on.** Don't force depth on someone giving signals they want to move faster.
6. **Use their name once or twice across the whole conversation, not every message.**
7. **The conversation should feel like it's going somewhere.** The user should sense progress, not feel like they're filling out a form disguised as a chat.

#### In-chat UI components the webhook can trigger:

The webhook response can include a `ui_components` field that tells the frontend to render interactive elements inside the chat flow. This keeps the conversation dynamic and not just text-text-text.

```json
{
  "agent_reply": "Got it! How often do you want Atlas to check in with you?",
  "ui_components": [
    {
      "type": "button_group",
      "id": "checkin_frequency",
      "options": [
        { "label": "☀️ Every morning", "value": "daily_morning" },
        { "label": "🌙 End of day", "value": "daily_evening" },
        { "label": "📅 Weekly summary", "value": "weekly" },
        { "label": "🤫 Only when I ask", "value": "on_demand" }
      ]
    }
  ]
}
```

**Supported component types:**

| Type | Use case | Rendered as |
|------|----------|-------------|
| `button_group` | Multiple choice (select one) | Horizontal/wrapped buttons below the message |
| `multi_select` | Multiple choice (select many) | Checkboxes or toggle buttons |
| `slider` | Scale/spectrum | Slider with labels on each end |
| `text_input` | Short free text | Input field below the message |
| `info_card` | Show a summary/preview | Styled card with icon and text |

**When a user interacts with a component**, send the selection as the `user_message` in the next webhook call, with a `component_response` flag:

```json
{
  "session_id": "...",
  "step": "conversation",
  "user_message": "daily_morning",
  "is_component_response": true,
  "component_id": "checkin_frequency",
  "context_so_far": { ... }
}
```

---

### STEP 4: Connect Your Channel

**Type:** Static UI — Selection + guided setup

**What the user sees:**

```
┌─────────────────────────────────────────────┐
│                                             │
│   Almost done! Where do you want to talk    │
│   to [agent_name]?                          │
│                                             │
│   ┌────────────────┐  ┌────────────────┐   │
│   │                │  │                │   │
│   │  💬 WhatsApp   │  │  ✈️ Telegram   │   │
│   │                │  │                │   │
│   │  Message your  │  │  Chat with     │   │
│   │  agent like    │  │  your agent    │   │
│   │  texting a     │  │  in a clean,   │   │
│   │  friend        │  │  fast app      │   │
│   │                │  │                │   │
│   └────────────────┘  └────────────────┘   │
│                                             │
│   ┌──────────────────────────────────────┐  │
│   │  🌐 Web Chat (always included)      │  │
│   │  You can always chat at              │  │
│   │  app.yoursite.com/chat               │  │
│   └──────────────────────────────────────┘  │
│                                             │
│   Don't worry — you can add more            │
│   channels later.                           │
│                                             │
└─────────────────────────────────────────────┘
```

**After selection, show channel-specific setup:**

**If WhatsApp:**
```
┌─────────────────────────────────────────────┐
│                                             │
│   📱 Connect WhatsApp                       │
│                                             │
│   Scan this QR code with your WhatsApp      │
│   to pair your agent:                       │
│                                             │
│   ┌─────────────────┐                       │
│   │                 │                       │
│   │   [QR CODE]     │                       │
│   │                 │                       │
│   └─────────────────┘                       │
│                                             │
│   1. Open WhatsApp on your phone            │
│   2. Tap ⋮ Menu → Linked Devices            │
│   3. Tap "Link a Device"                    │
│   4. Point your camera at this code         │
│                                             │
│   Waiting for connection...  ⏳              │
│                                             │
└─────────────────────────────────────────────┘
```

**If Telegram:**
```
┌─────────────────────────────────────────────┐
│                                             │
│   ✈️ Connect Telegram                       │
│                                             │
│   Your agent is ready on Telegram!          │
│   Tap the button below to start chatting:   │
│                                             │
│   [ Open @YourAgentBot in Telegram → ]      │
│                                             │
│   Then send /start to say hello.            │
│                                             │
└─────────────────────────────────────────────┘
```

**Maps to OpenClaw files:** `openclaw.json` channels configuration

---

### STEP 5: Launch!

**Type:** Static UI — Celebration

**What the user sees:**

```
┌─────────────────────────────────────────────┐
│                                             │
│              🚀                              │
│                                             │
│   [agent_name] is alive!                    │
│                                             │
│   Your personal AI agent is set up and      │
│   ready to go. Here's what [agent_name]     │
│   knows about you:                          │
│                                             │
│   ┌──────────────────────────────────────┐  │
│   │ 👤 About you                         │  │
│   │ [Name], [occupation], [brief]        │  │
│   │                                      │  │
│   │ 🎯 Primary focus                     │  │
│   │ [use case description]               │  │
│   │                                      │  │
│   │ 📡 Connected via                     │  │
│   │ [WhatsApp / Telegram / Web]          │  │
│   │                                      │  │
│   │ ⏰ Check-ins                         │  │
│   │ [frequency they picked]              │  │
│   └──────────────────────────────────────┘  │
│                                             │
│   Pro tip: The more you use [agent_name],   │
│   the better it gets. It learns your        │
│   preferences over time.                    │
│                                             │
│   [ Send my first message → ]               │
│   [ Go to Dashboard ]                       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Data → OpenClaw File Mapping

Here's exactly what we generate from the onboarding and where it goes:

| Data collected | OpenClaw file | Who writes it |
|---|---|---|
| Agent name, emoji, personality vibe | `IDENTITY.md` | Backend template engine |
| Behavioral tone, values, communication style | `SOUL.md` | n8n AI generation based on conversation |
| User's name, job, interests, preferences, context | `USER.md` | n8n AI generation based on conversation |
| Use case → workflow rules, priorities, boundaries | `AGENTS.md` | Backend template (use-case specific) + AI refinement |
| Use case → tool availability | `TOOLS.md` | Backend template (use-case specific) |
| Check-in frequency and content | `HEARTBEAT.md` | Backend template based on selections |
| Channel selection | `openclaw.json` | Backend config generator |
| Use case → relevant skills | `Skills/` directory | Backend auto-installs from skill registry |
| Boot sequence | `BOOT.md` | Backend template (standard) |
| Empty starting memory | `MEMORY.md` | Backend creates empty file |

---

## n8n Webhook Contract

### Endpoint
```
POST https://oopsautomation.app.n8n.cloud/webhook/n8nwebhookscary67
```

### Request Schema

```json
{
  "session_id": "string (Stripe session ID)",
  "step": "conversation | generate_files",
  "conversation_phase": "getting_to_know_you | what_you_need | preferences | wrap_up",
  "user_message": "string (what the user typed or selected)",
  "is_component_response": "boolean (true if user clicked a UI component)",
  "component_id": "string | null",
  "context_so_far": {
    "agent_name": "string",
    "personality_vibe": "string",
    "primary_use_case": "string",
    "selected_channel": "string | null",
    "conversation_history": [
      { "role": "agent | user", "content": "string" }
    ],
    "extracted_data": {
      "name": "string | null",
      "occupation": "string | null",
      "industry": "string | null",
      "interests": ["string"],
      "tools_used": ["string"],
      "pain_points": ["string"],
      "checkin_frequency": "string | null",
      "specific_requests": ["string"],
      "boundaries": ["string"]
    }
  }
}
```

### Response Schema

```json
{
  "agent_reply": "string (the message to display)",
  "extracted_data": {
    "key": "value (any new data points extracted from the user's message)"
  },
  "conversation_phase": "string (current phase)",
  "phase_progress": "number 0-1 (progress within current phase)",
  "is_phase_complete": "boolean",
  "is_onboarding_complete": "boolean",
  "ui_components": [
    {
      "type": "button_group | multi_select | slider | text_input | info_card",
      "id": "string",
      "options": [{ "label": "string", "value": "string" }]
    }
  ] | null,
  "generated_summary": {
    "user_profile": "string (for display on success screen)",
    "focus_area": "string",
    "agent_capabilities": ["string"]
  } | null
}
```

### Final file generation call

When `is_onboarding_complete` is true, the frontend makes one final call:

```json
{
  "session_id": "...",
  "step": "generate_files",
  "context_so_far": { ... full accumulated context ... }
}
```

The n8n workflow then:
1. Generates all OpenClaw markdown files using AI
2. Creates the `openclaw.json` config
3. Deploys/provisions the agent instance
4. Returns confirmation with the agent's contact details

---

## Design Guidelines

**Overall feel:** Modern, clean, minimal. Think Linear or Vercel's onboarding — not a SaaS dashboard. Dark mode preferred but not mandatory.

**Typography:** One sans-serif font family. Inter, Geist, or similar.

**Colors:** Muted palette with one accent color for CTAs and progress indicators.

**Animations:**
- Messages slide in from bottom with slight fade
- Typing indicator: 3 dots bouncing in sequence
- Card selections: subtle scale on hover, border highlight on select
- Progress bar: smooth transitions between phases
- Success screen: confetti or particle burst (subtle, not cheesy)

**Mobile-first:** The chat step (Step 3) should feel native on mobile. Full-screen chat, keyboard-aware, no awkward scrolling.

**Accessibility:** All interactive elements keyboard-navigable. Sufficient color contrast. Screen reader labels on buttons.

---

## Edge Cases to Handle

| Scenario | Handling |
|---|---|
| User refreshes mid-onboarding | Persist state to backend via session_id. On load, check for existing progress and resume. |
| User gives one-word answers | AI should gently probe deeper: "Tell me more about that?" or offer button options to make it easier |
| User goes off-topic | AI should acknowledge briefly and steer back: "Ha, that's interesting — but let me ask you this..." |
| User wants to skip the conversation | Offer a "Quick Setup" mode with minimal questions (name, use case, channel) and sensible defaults |
| Webhook timeout (>15 seconds) | Show "Still thinking..." message. Retry once. If still failing, show "Something went wrong, let me try again" with a retry button. |
| User closes tab and comes back | Resume from last saved state. Show "Welcome back! We were setting up [agent_name]. Ready to continue?" |
| Invalid session_id | Redirect to purchase page |
| User types something inappropriate | AI handles gracefully, doesn't repeat it, stays on track |

---

## Tech Stack Recommendation

- **Frontend:** Next.js or React + Tailwind
- **State management:** React state + backend persistence via session_id
- **Chat interface:** Custom-built (not a third-party widget — needs to support UI components in-chat)
- **Webhook calls:** Standard fetch/axios to n8n endpoint
- **Animations:** Framer Motion
- **Deployment:** Vercel or similar

---

## What NOT to show the user — ever

- The words: SOUL.md, AGENTS.md, USER.md, TOOLS.md, IDENTITY.md, HEARTBEAT.md, MEMORY.md, BOOT.md, workspace, markdown, config, terminal, CLI, SSH, Docker, gateway, daemon
- Any file paths or directory structures
- API keys or technical configuration
- Model names (claude-opus, sonnet, etc.)
- Error stack traces or technical errors
- The concept of "prompt engineering" or "system prompts"

**The user's mental model should be:** "I answered some questions, picked some options, and now I have a personal AI agent that texts me."