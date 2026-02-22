import type { MessagingChannel, PersonalityChoice } from '../types/wizard';

// --- Channel options (WhatsApp + Telegram only) ---

export interface ChannelOption {
  id: MessagingChannel;
  label: string;
  icon: string;
  description: string;
}

export const channelOptions: ChannelOption[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: '💬',
    description: 'Message your agent like texting a friend',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: '✈️',
    description: 'Fast, clean, and feature-rich',
  },
];

// --- Agent name suggestions ---

export const agentNameSuggestions = [
  'Nova',
  'Atlas',
  'Echo',
  'Sage',
  'Pixel',
  'Onyx',
  'Aria',
  'Bolt',
];

// --- Scenario showcase cards ---

export interface ScenarioChatMsg {
  role: 'user' | 'agent';
  content: string;
  time?: string;
  meta?: string; // e.g. "4 days later"
}

export interface ScenarioCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  previewMessages: ScenarioChatMsg[];
  bullets: string[];
}

export function buildScenarioCards(_agentName: string): ScenarioCard[] {
  return [
    {
      id: 'morning-briefing',
      icon: '☀️',
      title: 'Morning Briefing',
      description: 'Your weather, calendar, news, and to-do list — delivered as one message before you get out of bed.',
      bullets: [
        'Texts you every morning at the time you choose',
        'Pulls from your calendar, news topics you pick, and weather',
        'You can reply to take action — reschedule, add reminders, ask questions',
      ],
      previewMessages: [
        { role: 'agent', time: '7:00 AM', content: 'Good morning! Here\'s your Wednesday:\n\n☀️ 14°C, light rain after 3pm — grab a jacket\n📅 3 meetings today. The 2pm with David is the important one — he\'s going to ask about the Q1 numbers\n📈 Your portfolio is up 0.8%. Tesla earnings come out after close.\n📰 ECB holds rates steady — full summary if you want it\n💡 You wanted to call the insurance company today' },
        { role: 'user', time: '7:02 AM', content: 'Push the 2pm to Thursday, I\'m not ready' },
        { role: 'agent', time: '7:02 AM', content: 'Moved to Thursday 2pm. I\'ll remind you Wednesday evening to prep the Q1 numbers. Anything else?' },
        { role: 'user', time: '7:03 AM', content: 'No that\'s perfect, thanks' },
        { role: 'agent', time: '7:03 AM', content: 'Have a good one 👋' },
      ],
    },
    {
      id: 'email-autopilot',
      icon: '📬',
      title: 'Email Autopilot',
      description: 'Your inbox cleaned and sorted overnight. Only the important stuff reaches you.',
      bullets: [
        'Scans your inbox overnight and sorts everything automatically',
        'Drafts replies for important emails — you just approve',
        'Unsubscribes from senders you never open',
      ],
      previewMessages: [
        { role: 'agent', time: '8:00 AM', content: 'Your inbox overnight: 127 new emails. Here\'s what happened:\n\n📩 4 need your reply — I drafted responses for each\n📁 12 are FYI — archived with one-line summaries\n🗑️ 89 newsletters and promo — cleaned\n🚫 Unsubscribed from 12 senders you haven\'t opened in 3+ months\n\nWant to review the 4 important ones?' },
        { role: 'user', time: '8:01 AM', content: 'Yeah show me' },
        { role: 'agent', time: '8:01 AM', content: '1. David (RE: Q1 budget) — asking for updated numbers by Friday\n→ My draft: "Hi David, I\'ll have the updated figures to you by Thursday EOD."\n\n2. Lisa (New client onboarding) — needs your signature on the contract\n→ My draft: "Thanks Lisa, I\'ll review and sign today."\n\nWant me to send these drafts or edit first?' },
        { role: 'user', time: '8:02 AM', content: 'Send both, they\'re fine' },
        { role: 'agent', time: '8:02 AM', content: 'Sent ✅ Both delivered.' },
      ],
    },
    {
      id: 'research',
      icon: '🔍',
      title: 'Research Anything',
      description: 'Ask any question — get a real answer with real numbers, not 10 blue links.',
      bullets: [
        'Ask about any topic — prices, comparisons, decisions',
        'Gets you real data with numbers, not generic answers',
        'Can take action on what it finds — search listings, set alerts',
      ],
      previewMessages: [
        { role: 'user', time: '3:15 PM', content: 'Should I buy a used BMW X3 2021? I\'ve been looking at a few' },
        { role: 'agent', time: '3:16 PM', content: 'Good timing — I looked into it. Here\'s what I found:\n\n💰 Average price in Lithuania: €23-27k depending on mileage\n⚠️ The 2020 models had timing chain issues — 2021 fixed that\n📉 Resale: holds about 78% value after 3 years, which is solid for this class\n🔧 Common costs: brake pads at 60k km (~€350), typical service ~€200/year\n🛡️ Insurance estimate for your area: ~€45-60/month\n\nWant me to find specific listings under €25k within 50km of Vilnius?' },
        { role: 'user', time: '3:17 PM', content: 'Yes and only under 80k km' },
        { role: 'agent', time: '3:18 PM', content: 'Found 3 listings. Sending you the details now with links.' },
      ],
    },
    {
      id: 'remember',
      icon: '🧠',
      title: 'Remember Everything',
      description: 'Text it an idea, a quote, a reminder — it saves everything and brings it back when you need it.',
      bullets: [
        'Send a thought, a price, a name — it saves instantly',
        'Sets reminders automatically when you mention a date',
        'Recalls anything you saved, even weeks later',
      ],
      previewMessages: [
        { role: 'user', time: '11:42 AM', content: 'The plumber quoted €400 for the bathroom fix. Also I need to book the dentist next week and that book someone recommended was called Atomic Habits' },
        { role: 'agent', time: '11:42 AM', content: 'All saved ✅\n- Plumber quote: €400 (bathroom)\n- Dentist: I\'ll remind you Monday morning to book\n- Book: Atomic Habits — want me to find a summary or where to buy it?' },
        { role: 'user', time: '11:43 AM', content: 'Just save it for now' },
        { role: 'agent', time: '11:43 AM', content: 'Done. It\'s in your reading list.' },
        { role: 'user', meta: '4 days later', content: 'What was that book someone recommended?' },
        { role: 'agent', content: 'Atomic Habits — you saved it last Thursday. Want the summary now?' },
      ],
    },
    {
      id: 'accountability',
      icon: '🏆',
      title: 'Stay on Track',
      description: 'Weekly check-ins on your goals — gym, savings, learning, whatever you\'re working on.',
      bullets: [
        'Sends you a weekly progress update on your goals',
        'Tracks gym, savings, habits — whatever you set up',
        'Can book things and set price alerts on your behalf',
      ],
      previewMessages: [
        { role: 'agent', time: 'Sunday 9:00 AM', content: 'Weekly check-in time 📋\n\n🏋️ Gym: 2 of 3 sessions done. One more before tonight?\n💰 Savings: €1,840 of €2,700 Q1 goal (68%). On track.\n📚 Spanish on Duolingo: 4-day streak! Don\'t break it.\n🛒 That new monitor you were eyeing — still €389. Want me to watch for a price drop?\n\nOverall: solid week. The gym is the only miss.' },
        { role: 'user', content: 'Book me gym today 5pm and yes watch the monitor price' },
        { role: 'agent', content: 'Gym booked at 5pm ✅\nMonitor price alert set — I\'ll message you if it drops below €350.' },
      ],
    },
    {
      id: 'family',
      icon: '🏠',
      title: 'Family & Home',
      description: 'School group chats filtered, groceries planned, household logistics handled.',
      bullets: [
        'Filters noisy group chats into 2-3 things that matter',
        'Builds grocery lists from your meal plan',
        'Handles signups, payments, and reminders for school events',
      ],
      previewMessages: [
        { role: 'agent', time: '3:30 PM', content: 'School group chat update (47 messages filtered):\n\n1. Field trip Friday — €15 due by Wednesday\n2. No school next Monday (teacher training day)\n3. Bake sale signup — Maria is organizing. I added cookies for you.\n\nAlso: grocery list is ready based on this week\'s meal plan. 12 items.' },
        { role: 'user', content: 'Send me the grocery list and add wine' },
        { role: 'agent', content: 'Here\'s your list:\n🥩 Chicken thighs, ground beef\n🥬 Broccoli, spinach, tomatoes, onions\n🍝 Pasta, rice\n🧀 Mozzarella, parmesan\n🥖 Sourdough bread\n🍷 Red wine\n\nSent to your phone as a checklist ✅' },
      ],
    },
  ];
}

// --- Personality style picker (7 rounds, mixed types) ---

export interface ThisOrThatRound {
  id: number;
  type: 'this-or-that';
  dimension: string;
  context: string;
  userMessage: string;
  optionA: string;
  optionB: string;
  confirmA: string;
  confirmB: string;
  labelA: string;
  labelB: string;
}

export interface SliderLevel {
  label: string;
  preview: string;
}

export interface SliderRound {
  id: number;
  type: 'slider';
  dimension: string;
  context: string;
  levels: SliderLevel[];
  defaultValue: number;
  level5Warning?: string;
}

export type PersonalityRound = ThisOrThatRound | SliderRound;

export const personalityRounds: PersonalityRound[] = [
  // Round 1 — Concise vs Detailed
  {
    id: 1,
    type: 'this-or-that',
    dimension: 'Length',
    context: '{agent} just checked your email overnight...',
    userMessage: 'What happened in my inbox?',
    optionA:
      '34 new emails, 6 worth reading. Most important: your accountant needs receipts by Friday. I drafted a reply.',
    optionB:
      "34 emails overnight. Cleared 20 newsletters and promos — unsubscribed from 3 you never open. 6 need attention. Most urgent: your accountant wants Q4 receipts by Friday or you'll miss the deadline. I drafted a reply saying you'll send Thursday. Other 5 are in your priority folder, sorted by deadline.",
    confirmA: 'Less noise, more signal 👌',
    confirmB: 'Full context, every time ✍️',
    labelA: 'Concise',
    labelB: 'Detailed',
  },
  // Round 2 — Casual vs Professional
  {
    id: 2,
    type: 'this-or-that',
    dimension: 'Tone',
    context: '{agent} found a problem with your calendar...',
    userMessage: 'Anything I should know about tomorrow?',
    optionA:
      "Heads up — you double-booked yourself. Dentist and the sales call are both at 2pm. Want me to move the dentist? Also, you told your wife you'd get the kids at 4 but your last meeting runs til 4:30. Might wanna sort that.",
    optionB:
      "Scheduling conflict tomorrow at 2:00 PM — your dental appointment overlaps with the Henderson call. I'd recommend rescheduling the dentist. Also, your final meeting ends at 4:30 PM but you have a 4:00 PM pickup commitment. Want me to adjust?",
    confirmA: 'Keeping it human 😎',
    confirmB: 'Polished and clear ✓',
    labelA: 'Casual',
    labelB: 'Professional',
  },
  // Round 3 — Emoji & Formatting (slider)
  {
    id: 3,
    type: 'slider',
    dimension: 'Emojis',
    context: '{agent} is giving you your morning update...',
    defaultValue: 3,
    levels: [
      {
        label: 'None',
        preview:
          "Good morning. 12 degrees, rain by afternoon. Three meetings today. Portfolio up 1.2 percent. Your wife's birthday is in 4 days — no reservation yet.",
      },
      {
        label: 'Minimal',
        preview:
          "Morning. 12°C, rain by afternoon. 3 meetings today. Portfolio up 1.2%. Heads up — wife's birthday in 4 days, no restaurant booked.",
      },
      {
        label: 'Balanced',
        preview:
          "Morning! ☀️ 12°C, rain after 3pm.\n3 meetings — busiest at 2pm.\nPortfolio up 1.2% 📈\nWife's birthday in 4 days — no restaurant booked. Want me to find options?",
      },
      {
        label: 'Expressive',
        preview:
          "Morning! ☀️🌧️ 12°C, rain around 3pm — grab a jacket.\n📅 3 meetings, 2pm is the big one\n📈 Portfolio up 1.2%\n🎂 Wife's birthday in 4 days!! Still no reservation 👀 Want me to find somewhere?",
      },
      {
        label: 'Full vibes',
        preview:
          "Rise and shine! ☀️🌧️☕\n📅 3 meetings (2pm = game time 🎯)\n📈 Portfolio up 1.2% 🟢🚀\n🌡️ 12°C → rain at 3pm, jacket!\n🎂🚨 WIFE'S BIRTHDAY IN 4 DAYS 🚨\nNo restaurant. No gift. No plan. You're living dangerously 😅\nWant me to save you? 🙏",
      },
    ],
  },
  // Round 4 — Humor Level (slider)
  {
    id: 4,
    type: 'slider',
    dimension: 'Humor',
    context: '{agent} just noticed you overspent this month...',
    defaultValue: 2,
    level5Warning:
      'Level 5 means {agent} has absolutely no filter. Think: that friend who roasts the shit out of you but always has your back.',
    levels: [
      {
        label: 'Straight',
        preview:
          "You're 23% over budget this month. Dining out is the main driver. You also have 3 unused subscriptions. Here's the breakdown.",
      },
      {
        label: 'Dry',
        preview:
          "23% over budget. Restaurants are the main culprit — 14 transactions. You also have 3 subscriptions you haven't touched since January. Worth a look.",
      },
      {
        label: 'Witty',
        preview:
          "So... 23% over budget. Turns out eating out 14 times adds up. You're also paying for 3 subscriptions you forgot exist — including the gym. Want me to cancel the dead weight?",
      },
      {
        label: 'Playful',
        preview:
          "Budget check: you're 23% over and honestly the restaurant habit is getting ridiculous — 14 times this month. Your Uber Eats driver knows your dog's name at this point. Oh, and you're still paying for a gym you haven't stepped into since January. Want me to cut the dead weight?",
      },
      {
        label: 'No filter',
        preview:
          "OK so budget update: you're 23% over. Again. Fourteen restaurant trips — you're spending money like you're trying to get rid of it. You're still paying for that gym membership, which is basically the most expensive thing you never use. And Spotify Family? You live alone. Who the fuck is on your family plan? Want me to cancel this shit or are we just watching the money burn?",
      },
    ],
  },
  // Round 5 — Proactiveness (slider)
  {
    id: 5,
    type: 'slider',
    dimension: 'Initiative',
    context: "It's Tuesday evening. {agent} noticed something about your week...",
    defaultValue: 3,
    levels: [
      {
        label: 'Only when asked',
        preview: '',
      },
      {
        label: 'Light nudges',
        preview:
          'Reminder: car insurance renews Thursday. Last year you paid €840.',
      },
      {
        label: 'Helpful reminders',
        preview:
          "Car insurance renews Thursday. Last year: €840, but your provider raised rates 12%. Want me to look at alternatives?",
      },
      {
        label: 'Thinks ahead',
        preview:
          "Car insurance renews Thursday — they bumped it from €840 to €940. I found 3 cheaper options, best one saves €180/year, same coverage. Your roadside assistance also expired. Want me to bundle it?",
      },
      {
        label: 'Runs your life',
        preview:
          "Took care of a few things:\n→ Car insurance renewed Thursday at a worse rate, so I found a better deal — saves €180/year, same coverage. Just need your OK to switch.\n→ Roadside assistance expired — added it to the new quote.\n→ You're low on coffee pods. Reorder?\n→ Friday's empty — want me to book that restaurant your wife mentioned?",
      },
    ],
  },
  // Round 6 — Opinionated vs Neutral (slider)
  {
    id: 6,
    type: 'slider',
    dimension: 'Opinions',
    context: 'You asked {agent} to help you pick a new laptop...',
    defaultValue: 3,
    levels: [
      {
        label: 'Just facts',
        preview:
          "5 laptops in your budget. MacBook Air has the best battery. ThinkPad has the best keyboard. Dell has the most ports. Comparison attached.",
      },
      {
        label: 'Leans neutral',
        preview:
          "5 options. MacBook Air and ThinkPad X1 stand out — long battery, portable, well-reviewed. Full comparison attached.",
      },
      {
        label: 'Soft suggestions',
        preview:
          "I'd lean MacBook Air — battery life is unmatched, and since you mostly use browser tools, the ecosystem won't matter. ThinkPad is solid if you prefer Windows. Want me to compare just those two?",
      },
      {
        label: 'Clear opinions',
        preview:
          "Get the MacBook Air. Best battery in the category, fast enough for everything you do, better resale value. The ThinkPad is fine but you'll miss the trackpad within a week. Unless you need Windows software?",
      },
      {
        label: 'Decides for you',
        preview:
          "MacBook Air M3, 16GB, 512GB — the €1,449 one. Best laptop for how you work, not even close. Found it for €1,329 with next-day delivery. Should I order it?",
      },
    ],
  },
  // Round 7 — Challenges You vs Supports You
  {
    id: 7,
    type: 'this-or-that',
    dimension: 'Style',
    context: 'You just told {agent} you want to skip your savings this month to buy something...',
    userMessage:
      "I'm thinking of skipping savings this month. I want to buy that new TV.",
    optionA:
      "You skipped last month too — you're €1,200 behind your goal. The TV is €899 and it's not going anywhere. Save this month, buy it in March, and you're back on track. Or I can find it refurbished for less.",
    optionB:
      "Fair enough — sometimes you should enjoy your money. Good TV by the way, I checked. Want me to find the best price? I'll spread the missed savings across the next few months.",
    confirmA: '{agent} will keep you honest 💪',
    confirmB: '{agent} has your back, always 🤝',
    labelA: 'Challenges you',
    labelB: 'Supports you',
  },
];

export function derivePersonalitySummary(choices: PersonalityChoice[]): string {
  const labels: string[] = [];
  for (const round of personalityRounds) {
    const pick = choices.find((c) => c.round === round.id);
    if (!pick) continue;
    if (round.type === 'this-or-that') {
      labels.push(pick.choice === 'A' ? round.labelA : round.labelB);
    } else {
      const idx = (pick.value ?? round.defaultValue) - 1;
      labels.push(round.levels[idx]?.label ?? '');
    }
  }
  return labels.join(', ');
}

// --- Setup animation config files ---

export const configFiles = [
  { name: 'agent.config.yaml', status: 'created' },
  { name: 'personality.json', status: 'created' },
  { name: 'channel-bridge.ts', status: 'created' },
  { name: 'memory-store.db', status: 'initialized' },
  { name: 'response-engine.wasm', status: 'compiled' },
  { name: 'encryption-keys.pem', status: 'generated' },
];

// --- n8n webhook (routed through backend for auth) ---

export interface OnboardingContext {
  agentName: string;
  selectedScenarios: string[];
  personality: PersonalityChoice[];
}

export type ChatStatus = 'active' | 'confirming' | 'complete';

export interface ChatResponse {
  message: string;
  status: ChatStatus;
}

export async function sendChatMessage(
  sessionId: string,
  message: string,
  context?: OnboardingContext
): Promise<ChatResponse> {
  const payload: Record<string, unknown> = { sessionId, message };
  if (context) {
    payload.context = context;
    // Attach the Stripe checkout session ID on the first message so the backend can link accounts
    const stripeSessionId = localStorage.getItem('stripe_session_id');
    if (stripeSessionId) {
      payload.stripeSessionId = stripeSessionId;
    }
  }

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Chat error: ${res.status}`);
  }

  const data = await res.json();
  // n8n returns an array — grab the first item
  if (Array.isArray(data)) {
    return data[0] as ChatResponse;
  }
  return data as ChatResponse;
}
