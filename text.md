# Step 3 — Personality Picker: All Text Content

## UI Text
- Header: "How should {agent} talk?"
- Subtitle (rounds): "Tap what feels right. You can always change this later."
- Subtitle (tweak): "Fine-tune each dimension."
- Summary title: "{agent}'s personality"

## Button Labels
- This-or-That confirm: "Next →"
- Slider confirm: "This feels right →"
- Summary confirm: "Looks good →"
- Tweak confirm: "Done →"
- Back: "Back"
- Redo / Tweak links in summary

---

## Round 1 — Length (This or That)
**Dimension:** Length
**Context:** {agent} just checked your email overnight...
**User message:** What happened in my inbox?

**Option A (Concise):**
34 new, 6 worth reading. Most important: your accountant needs receipts by Friday. I drafted a reply.

**Option B (Detailed):**
34 emails overnight. Cleared 20 newsletters and promos — unsubscribed from 3 you never open. 6 need attention. Most urgent: your accountant wants Q4 receipts by Friday or you'll miss the deadline. I drafted a reply saying you'll send Thursday. Other 5 are in your priority folder, sorted by deadline.

**Confirm A:** Less noise, more signal 👌
**Confirm B:** Full context, every time ✍️

---

## Round 2 — Tone (This or That)
**Dimension:** Tone
**Context:** {agent} found a problem with your calendar...
**User message:** Anything I should know about tomorrow?

**Option A (Casual):**
Heads up — you double-booked yourself. Dentist and the sales call are both at 2pm. Want me to move the dentist? Also, you told your wife you'd get the kids at 4 but your last meeting runs til 4:30. Might wanna sort that.

**Option B (Professional):**
Scheduling conflict tomorrow at 2:00 PM — your dental appointment overlaps with the Henderson call. I'd recommend rescheduling the dentist. Also, your final meeting ends at 4:30 PM but you have a 4:00 PM pickup commitment. Want me to adjust?

**Confirm A:** Keeping it human 😎
**Confirm B:** Polished and clear ✓

---

## Round 3 — Emojis (Slider, 5 levels)
**Dimension:** Emojis
**Context:** {agent} is giving you your morning update...
**Default:** Level 3 (Balanced)

### Level 1 — None
Good morning. 12 degrees, rain by afternoon. Three meetings today. Portfolio up 1.2 percent. Your wife's birthday is in 4 days — no reservation yet.

### Level 2 — Minimal
Morning. 12°C, rain by afternoon. 3 meetings today. Portfolio up 1.2%. Heads up — wife's birthday in 4 days, no restaurant booked.

### Level 3 — Balanced
Morning! ☀️ 12°C, rain after 3pm.
3 meetings — busiest at 2pm.
Portfolio up 1.2% 📈
Wife's birthday in 4 days — no restaurant booked. Want me to find options?

### Level 4 — Expressive
Morning! ☀️🌧️ 12°C, rain around 3pm — grab a jacket.
📅 3 meetings, 2pm is the big one
📈 Portfolio up 1.2%
🎂 Wife's birthday in 4 days!! Still no reservation 👀 Want me to find somewhere?

### Level 5 — Full vibes
Rise and shine! ☀️🌧️☕
📅 3 meetings (2pm = game time 🎯)
📈 Portfolio up 1.2% 🟢🚀
🌡️ 12°C → rain at 3pm, jacket!
🎂🚨 WIFE'S BIRTHDAY IN 4 DAYS 🚨
No restaurant. No gift. No plan. You're living dangerously 😅
Want me to save you? 🙏

---

## Round 4 — Humor (Slider, 5 levels)
**Dimension:** Humor
**Context:** {agent} just noticed you overspent this month...
**Default:** Level 2 (Dry)
**Level 5 Warning:** Level 5 means {agent} has absolutely no filter. Think: that friend who roasts the shit out of you but always has your back.

### Level 1 — Straight
You're 23% over budget this month. Dining out is the main driver. You also have 3 unused subscriptions. Here's the breakdown.

### Level 2 — Dry
23% over budget. Restaurants are the main culprit — 14 transactions. You also have 3 subscriptions you haven't touched since January. Worth a look.

### Level 3 — Witty
So... 23% over budget. Turns out eating out 14 times adds up. You're also paying for 3 subscriptions you forgot exist — including the gym. Want me to cancel the dead weight?

### Level 4 — Playful
Budget check: you're 23% over and honestly the restaurant habit is getting ridiculous — 14 times this month. Your Uber Eats driver knows your dog's name at this point. Oh, and you're still paying for a gym you haven't stepped into since January. Want me to cut the dead weight?

### Level 5 — No filter
OK so budget update: you're 23% over. Again. Fourteen restaurant trips — you're spending money like you're trying to get rid of it. You're still paying for that gym membership, which is basically the most expensive thing you never use. And Spotify Family? You live alone. Who the fuck is on your family plan? Want me to cancel this shit or are we just watching the money burn?

---

## Round 5 — Initiative (Slider, 5 levels)
**Dimension:** Initiative
**Context:** It's Tuesday evening. {agent} noticed something about your week...
**Default:** Level 3 (Helpful reminders)

### Level 1 — Only when asked
*(no preview — agent stays silent)*

### Level 2 — Light nudges
Reminder: car insurance renews Thursday. Last year you paid €840.

### Level 3 — Helpful reminders
Car insurance renews Thursday. Last year: €840, but your provider raised rates 12%. Want me to look at alternatives?

### Level 4 — Thinks ahead
Car insurance renews Thursday — they bumped it from €840 to €940. I found 3 cheaper options, best one saves €180/year, same coverage. Your roadside assistance also expired. Want me to bundle it?

### Level 5 — Runs your life
Took care of a few things:
→ Car insurance renewed Thursday at a worse rate, so I found a better deal — saves €180/year, same coverage. Just need your OK to switch.
→ Roadside assistance expired — added it to the new quote.
→ You're low on coffee pods. Reorder?
→ Friday's empty — want me to book that restaurant your wife mentioned?

---

## Round 6 — Opinions (Slider, 5 levels)
**Dimension:** Opinions
**Context:** You asked {agent} to help you pick a new laptop...
**Default:** Level 3 (Soft suggestions)

### Level 1 — Just facts
5 laptops in your budget. MacBook Air has the best battery. ThinkPad has the best keyboard. Dell has the most ports. Comparison attached.

### Level 2 — Leans neutral
5 options. MacBook Air and ThinkPad X1 stand out — long battery, portable, well-reviewed. Full comparison attached.

### Level 3 — Soft suggestions
I'd lean MacBook Air — battery life is unmatched, and since you mostly use browser tools, the ecosystem won't matter. ThinkPad is solid if you prefer Windows. Want me to compare just those two?

### Level 4 — Clear opinions
Get the MacBook Air. Best battery in the category, fast enough for everything you do, better resale value. The ThinkPad is fine but you'll miss the trackpad within a week. Unless you need Windows software?

### Level 5 — Decides for you
MacBook Air M3, 16GB, 512GB — the €1,449 one. Best laptop for how you work, not even close. Found it for €1,329 with next-day delivery. Should I order it?

---

## Round 7 — Style (This or That)
**Dimension:** Style
**Context:** You just told {agent} you want to skip savings to buy something...
**User message:** I'm thinking of skipping savings this month. I want to buy that new TV.

**Option A (Challenges you):**
You skipped last month too — you're €1,200 behind your goal. The TV is €899 and it's not going anywhere. Save this month, buy it in March, and you're back on track. Or I can find it refurbished for less.

**Option B (Supports you):**
Fair enough — sometimes you should enjoy your money. Good TV by the way, I checked. Want me to find the best price? I'll spread the missed savings across the next few months.

**Confirm A:** {agent} will keep you honest 💪
**Confirm B:** {agent} has your back, always 🤝

---

## Humor Gate Modal
**Emoji:** 😈
**Text:** Level 5 means {agent} has absolutely no filter. Think: that friend who roasts the shit out of you but always has your back.
**Confirm button:** Show me 😈
**Decline button:** Maybe not

## Dimension Icons
- Length: 📏
- Tone: 🎭
- Emojis: ✨
- Humor: 😂
- Initiative: 🧠
- Opinions: 💬
- Style: 💪