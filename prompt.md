# Step 3 Design Cleanup — Reduce Noise, Guide the Eye

## Problems to Fix

1. **Too many competing elements.** Title, subtitle, dots, context line, user bubble, response cards/slider, labels, preview message, button, back link — all fighting for attention on one screen. The user doesn't know where to look first.

2. **Messages are hard to read.** In the This or That version, cards are too narrow side by side and text gets cut off. In the slider version, the preview message is a dense block of text in a dark box with no breathing room.

3. **Context line adds noise.** "Echo just noticed you overspent this month..." and "You just told Echo you want to skip your savings..." are unnecessary narration. The user can understand what's happening from the messages alone.

4. **The user message bubble competes with the heading.** In Image 2, the orange user bubble and the heading are both bold and attention-grabbing — your eye bounces between them.

5. **Round indicator dots are too prominent.** 7 orange dots in a row add visual clutter to an already busy screen.

## Design Direction

**One focus per screen.** At any moment, the user's eye should be drawn to exactly one thing: the agent's response. Everything else supports that quietly.

### Hierarchy (top to bottom, importance order):

**1. Agent response — THE HERO (biggest, most visible)**
The agent's message should be the dominant visual element. Large, readable text, plenty of padding, good contrast. This is what the user is here to evaluate.

**2. Control (slider or pills) — INTERACTIVE**
Directly below the response. Chunky, obvious, inviting to touch. When they interact with this, the response above changes.

**3. Everything else — QUIET**
Title, dots, user message, button — all present but visually subdued. They support the experience but don't compete.

### Specific Changes:

**Remove the context line entirely.** No "Echo just noticed..." narration. The message speaks for itself.

**Shrink the header area.** The title "How should Echo talk?" can be smaller — the user already knows what step they're on. They read it once. After that, it's noise. Consider moving it to a single line with smaller text, or even hiding it after the first round (the user already gets it).

**Make the round indicator minimal.** Instead of 7 large filled dots, use a thin progress bar (like the one already at the very top) or very small subtle dots. The user doesn't need to count rounds — they just need to know they're progressing.

**Remove the user message bubble from most rounds.** For the This or That rounds where context matters (like "I'm gonna skip the gym"), show the user message BUT make it small and muted — gray text, no bubble background, one line. It's context, not content. For slider rounds (emoji, humor, proactiveness, opinionated), there's often no user message needed at all — the agent is just talking. Don't add one artificially.

**For This or That rounds: stack cards vertically, not side by side.** Two narrow columns are unreadable. Instead:
- Show the agent response in one large readable card in the center
- Below it, two pill/tab buttons to toggle between Option A and Option B  
- Tapping a pill swaps the text in the single card above
- This way the text is always full-width and readable
- This is the same pattern as the slider rounds (one response + a control) which gives visual consistency across ALL rounds

**For slider rounds: remove the 5 cramped labels above the slider.** Only show:
- The CURRENT level label, displayed prominently (e.g., "Witty" or "Expressive")
- The slider itself (chunky, satisfying)
- Optionally: the two endpoint words at far left and far right of the track in small muted text

**Make the "This feels right →" / "Next →" button less dominant.** It doesn't need to be a full-width loud orange button on every single round. Consider a more subtle "Next →" that becomes prominent only after the user has made a selection. Or auto-advance after a short delay once they've picked.

**Keep agent messages SHORT.** Maximum 3 lines visible on screen. If it's longer, it's too long. The point is to feel the tone, not read a paragraph.

### Revised Screen Structure (applies to ALL round types):

```
[Thin progress bar at top]                    [3/6]

How should Echo talk?          ← smaller, one line

[Optional: tiny muted user context if needed]

┌─────────────────────────────────┐
│                                 │
│   Agent message here.           │  ← THE HERO
│   Large, readable, padded.      │  Big card,
│   Max 3 lines.                  │  centered,
│                                 │  dominant
└─────────────────────────────────┘

[Current level label: "Witty"]    ← bold, visible

○────────●────────○               ← chunky slider
                                     OR
[ 😎 Casual ]  [ 👔 Professional ] ← toggle pills

            Next →                ← subtle until selected
```

The key insight: **every round type now has the same visual structure** — one big response card in the center, one control underneath. The only difference is whether the control is a slider, pill toggle, or numbered circles. This creates consistency, reduces cognitive load, and makes the agent's voice the undeniable focus of every screen.

### Visual Polish

- The agent message card should have a slight glass/frosted effect or subtle border to lift it off the background — not just a dark box on a dark background
- Generous padding inside the card (at least 20px on all sides)
- Text size for the agent message should be larger than body text — maybe 17-18px
- Smooth crossfade animation when the message content changes (not a hard swap)
- The selected pill/slider position should have a satisfying micro-animation (gentle bounce or scale)
- Consider adding the agent's avatar/emoji to the top-left corner of the message card to make it feel like a real chat bubble