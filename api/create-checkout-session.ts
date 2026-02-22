import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const TIER_PRICES: Record<string, string | undefined> = {
  freemium: process.env.VITE_STRIPE_FREEMIUM_PRICE,
  pro: process.env.VITE_STRIPE_PRO_PRICE,
  luxury: process.env.VITE_STRIPE_LUXURY_PRICE,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { tier } = req.body;

    const priceId = TIER_PRICES[tier];
    if (!priceId) {
      return res.status(400).json({
        error: `Invalid tier "${tier}". Valid tiers: ${Object.keys(TIER_PRICES).join(', ')}`,
      });
    }

    const origin = req.headers.origin || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}
