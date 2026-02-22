# Step 3 — Personality Picker UI Changes

## Add: Intro screen before Round 1
Before the first personality round, show a transition screen:
- Header: "AGENT HOST" with "3/6" and progress bar (this is the ONLY time 3/6 is visible during Step 3)
- Title: "Let's shape {agent}'s personality"
- Subtitle: "You'll see how {agent} would respond in real situations. Just pick the style you prefer."
- Single button: "Let's go →"

## Remove from all round screens (1–7):
- The "3/6" counter and top progress bar (already shown on intro screen)
- The subtitle "Tap what feels right. You can always change this later."
- The "Back" button

## Change on all round screens (1–7):
- Replace "1/7" text counter with dot indicators: ● ○ ○ ○ ○ ○ ○ (filled dot = current round)
- "Next →" button should be disabled/dimmed until the user selects an option
- Keep: header "How should {agent} talk?", context line (italic), chat bubbles, choice buttons, "Next →"

## When exiting Step 3:
- Restore the progress bar showing "4/6" on the next onboarding step