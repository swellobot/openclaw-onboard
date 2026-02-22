import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { sessionId } = req.query;

    const session = await stripe.checkout.sessions.retrieve(
      sessionId as string,
      { expand: ['subscription'] }
    );

    const subscription = session.subscription as Stripe.Subscription | null;

    res.json({
      status: session.payment_status,
      customer_email: session.customer_details?.email,
      subscription_status: subscription?.status ?? null,
    });
  } catch (error: any) {
    console.error('Session retrieval error:', error);
    res.status(404).json({ error: 'Session not found' });
  }
}
