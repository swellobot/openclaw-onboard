export interface ChatMessage {
    role: 'user' | 'agent';
    content: string;
    type?: 'text' | 'voice';
    delay?: number; // ms delay before showing this message
}

export interface UseCase {
    id: string;
    emoji: string;
    title: string;
    label: string;
    surprising?: boolean;
    messages: ChatMessage[];
}

export const useCases: UseCase[] = [
    // ── Common Use Cases ──────────────────────────────────────
    {
        id: 'email',
        emoji: '📨',
        title: 'Email Triage',
        label: 'Email',
        messages: [
            { role: 'user', content: 'I have 47 unread emails and I can\'t deal with them right now. Help?', delay: 0 },
            { role: 'agent', content: 'Just scanned all 47. Here\'s the breakdown:\n\n🔴 3 urgent — need your reply today\n🟡 8 need a reply this week\n⚪ 36 can wait or are FYI-only\n\nWant me to draft replies for the 3 urgent ones?', delay: 800 },
            { role: 'user', content: 'Yes please, draft them', delay: 600 },
            { role: 'agent', content: 'Done! I\'ve drafted all 3. The first one is to Sarah about the Q2 budget — I kept it concise and referenced your last conversation. Ready for your review.', delay: 1000 },
        ],
    },
    {
        id: 'calendar',
        emoji: '📅',
        title: 'Calendar Management',
        label: 'Calendar',
        messages: [
            { role: 'user', content: 'What does my day look like tomorrow?', delay: 0 },
            { role: 'agent', content: '📅 Tomorrow, Thursday:\n\n9:00 — Team standup (15 min)\n10:00 — Client call with Acme Corp (1 hr)\n11:30 — ☕ Buffer (30 min)\n12:00 — Lunch\n14:00 — Design review\n15:30 — 1:1 with Jake\n\n⚠️ The Acme call and design review are back-to-back with no break. Want me to suggest moving one?', delay: 800 },
            { role: 'user', content: 'Move the design review 30 minutes later', delay: 600 },
            { role: 'agent', content: 'Done! Moved to 14:30. Everyone\'s been notified. You now have a 30-minute buffer after the client call. 👌', delay: 800 },
        ],
    },
    {
        id: 'research',
        emoji: '🔍',
        title: 'Quick Research',
        label: 'Research',
        messages: [
            { role: 'user', content: 'Compare Notion vs Obsidian for a 5-person startup', delay: 0 },
            { role: 'agent', content: 'Here\'s a quick comparison:\n\n| | Notion | Obsidian |\n|---|---|---|\n| Best for | Collaboration | Personal knowledge |\n| Pricing | $8/user/mo | Free (sync $4/mo) |\n| Offline | Limited | Full |\n| Learning curve | Low | Medium |\n| Real-time collab | ✅ Yes | ❌ No |\n\n**My take**: For a 5-person team, Notion is the better fit — real-time collaboration and built-in project management will save you time. Want me to dig deeper into any aspect?', delay: 1200 },
        ],
    },
    {
        id: 'reminders',
        emoji: '⏰',
        title: 'Reminders & Follow-ups',
        label: 'Reminders',
        messages: [
            { role: 'user', content: 'Remind me to follow up with Sarah about the proposal on Thursday', delay: 0 },
            { role: 'agent', content: 'Got it! I\'ll remind you Thursday morning. I also noticed you mentioned wanting to include the revised pricing — should I remind you to update that too?', delay: 800 },
            { role: 'user', content: 'Yes, good catch', delay: 500 },
            { role: 'agent', content: '✅ Two reminders set for Thursday:\n1. Follow up with Sarah re: proposal\n2. Update pricing section before sending\n\nI\'ll nudge you at 9 AM.', delay: 800 },
        ],
    },
    {
        id: 'meetings',
        emoji: '🎙️',
        title: 'Meeting Summarizer',
        label: 'Meetings',
        messages: [
            { role: 'user', content: '', type: 'voice', delay: 0 },
            { role: 'agent', content: 'Got your 28-minute meeting summary ready:\n\n**Key Decisions:**\n• Launch date moved to March 15\n• Budget approved at $45K\n• Jake handles frontend, Lisa backend\n\n**Action Items:**\n• You: Send revised timeline by Friday\n• Jake: Share mockups by Wednesday\n• Lisa: Set up staging server\n\nWant me to send these action items to the team?', delay: 1200 },
        ],
    },
    {
        id: 'writing',
        emoji: '✏️',
        title: 'Writing Assistant',
        label: 'Writing',
        messages: [
            { role: 'user', content: 'Draft a polite decline for this freelance project. They offered $2K for a website but it\'s too low.', delay: 0 },
            { role: 'agent', content: 'Here\'s a warm decline:\n\n"Hi [Name],\n\nThank you so much for reaching out — the project sounds genuinely interesting. Unfortunately, given the scope of work involved, I wouldn\'t be able to deliver the quality you deserve at this budget level.\n\nIf your budget opens up in the future, I\'d love to revisit this. In the meantime, I\'d be happy to recommend a few talented developers who might be a great fit.\n\nWishing you the best with the project!\nBest, [You]"\n\nShall I adjust the tone or add anything?', delay: 1000 },
        ],
    },

    // ── Surprising Use Cases ──────────────────────────────────
    {
        id: 'relationships',
        emoji: '💬',
        title: 'Relationship Intelligence',
        label: 'Relationships',
        surprising: true,
        messages: [
            { role: 'user', content: 'When did I last talk to Mom?', delay: 0 },
            { role: 'agent', content: '12 days ago — February 8th. You called her about the garden renovation and she mentioned the new roses aren\'t doing well.\n\nYou also told me you wanted to check in more often. Want me to remind you to call her this evening? 💛', delay: 800 },
            { role: 'user', content: 'Yes, 7pm please', delay: 500 },
            { role: 'agent', content: '✅ Reminder set for 7 PM: Call Mom\n\nI\'ll also remind you about the roses — she\'ll appreciate you remembering.', delay: 700 },
        ],
    },
    {
        id: 'decisions',
        emoji: '🧠',
        title: 'Decision Partner',
        label: 'Decisions',
        surprising: true,
        messages: [
            { role: 'user', content: 'I got a job offer. $30K more but it\'s fully in-office. I don\'t know what to do.', delay: 0 },
            { role: 'agent', content: 'Big decision. Let me think through this with you based on what I know:\n\n**For taking it:**\n• $30K is significant — that\'s ~18% raise\n• You mentioned wanting more structured work\n• In-office might help with the isolation you\'ve been feeling\n\n**Against:**\n• You pick up your daughter at 3:30 — commute might conflict\n• You just got a good rhythm with your current team\n• Last time you worked in-office (2023), you said it drained you\n\nWhat matters most to you right now — the money, the flexibility, or the team?', delay: 1500 },
        ],
    },
    {
        id: 'wellness',
        emoji: '☀️',
        title: 'Wellness Nudges',
        label: 'Wellness',
        surprising: true,
        messages: [
            { role: 'agent', content: 'Hey — you\'ve been in meetings for 3 hours straight and it\'s a beautiful day outside. Want me to block 20 minutes for a walk? ☀️', delay: 0 },
            { role: 'user', content: 'Ugh yes please, I didn\'t even notice', delay: 600 },
            { role: 'agent', content: 'Done! Blocked 2:00-2:20 as "Break." I also silenced your notifications for that window.\n\nQuick stats this week:\n🚶 Average breaks/day: 1.2 (down from 2.5 last week)\n📱 Screen time: 11.3 hours yesterday\n\nMaybe we should set a daily walk reminder? Your best weeks were when you took breaks at 11am and 3pm.', delay: 1000 },
        ],
    },
    {
        id: 'negotiator',
        emoji: '💰',
        title: 'Deal Negotiator',
        label: 'Negotiate',
        surprising: true,
        messages: [
            { role: 'user', content: 'My internet bill just went up to $89/month. This is ridiculous.', delay: 0 },
            { role: 'agent', content: 'Classic move by ISPs. Here\'s your battle plan:\n\n📞 **Call script:**\n"I\'ve been a loyal customer for [X] years and I see my bill increased to $89. I\'ve been looking at competing offers and I\'d like to discuss keeping my rate competitive."\n\n**Competing prices in your area:**\n• AT&T Fiber: $55/mo (same speed)\n• T-Mobile Home: $50/mo\n• Your original rate: $65/mo\n\n**Pro tips:**\n1. Ask for the "retention department"\n2. If they offer $75, counter with $60\n3. Mention the AT&T $55 offer specifically\n\nMost people get 20-30% off. Want me to set a reminder to call them tomorrow during business hours?', delay: 1200 },
        ],
    },
    {
        id: 'knowledge',
        emoji: '🗃️',
        title: 'Personal Knowledge Base',
        label: 'Memory',
        surprising: true,
        messages: [
            { role: 'user', content: 'What was that restaurant Jake recommended last month?', delay: 0 },
            { role: 'agent', content: 'Jake mentioned **Osteria Francescana** on February 3rd during your lunch chat. He said:\n\n• The tasting menu is "absolutely worth it"\n• Book at least 2 weeks in advance\n• Ask for the corner table\n• His favorite was the "Five Ages of Parmigiano Reggiano"\n\nWant me to check availability and make a reservation?', delay: 1000 },
            { role: 'user', content: 'Yes! For Saturday, 7pm, table for 2', delay: 500 },
            { role: 'agent', content: 'I\'ll draft a reservation request for Saturday, Feb 22 at 7 PM, 2 people. I\'ll ask for the corner table like Jake suggested. 🍽️', delay: 800 },
        ],
    },
    {
        id: 'admin',
        emoji: '📋',
        title: 'Life Admin Automation',
        label: 'Life Admin',
        surprising: true,
        messages: [
            { role: 'user', content: 'My passport expires in 3 months. I keep forgetting to renew it.', delay: 0 },
            { role: 'agent', content: 'I\'ve got you. Here\'s your renewal checklist:\n\n📋 **What you need:**\n✅ Current passport\n⬜ Passport photo (2x2, white background)\n⬜ Form DS-82 (completed)\n⬜ $130 fee (check or money order)\n\n📍 Nearest office: Federal Building, 3rd Floor\n📅 Next available appointment: March 12\n\n⏱️ Processing time: 6-8 weeks (standard) or 2-3 weeks (expedited +$60)\n\nSince it expires in May, standard processing should work. Want me to:\n1. Set a reminder to take the photo this weekend?\n2. Draft the form with your info on file?\n3. Book the March 12 appointment?', delay: 1400 },
        ],
    },
];
