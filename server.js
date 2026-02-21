import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// ── Startup validation ──────────────────────────────────────────────
const required = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    VITE_STRIPE_FREEMIUM_PRICE: process.env.VITE_STRIPE_FREEMIUM_PRICE,
    VITE_STRIPE_PRO_PRICE: process.env.VITE_STRIPE_PRO_PRICE,
    VITE_STRIPE_LUXURY_PRICE: process.env.VITE_STRIPE_LUXURY_PRICE,
};

const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);

if (missing.length) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
    console.error('Add them to .env.local and restart.');
    process.exit(1);
}

// ── Tier → Price ID mapping ─────────────────────────────────────────
const TIER_PRICES = {
    freemium: process.env.VITE_STRIPE_FREEMIUM_PRICE,
    pro: process.env.VITE_STRIPE_PRO_PRICE,
    luxury: process.env.VITE_STRIPE_LUXURY_PRICE,
};

// ── Express + Stripe setup ──────────────────────────────────────────
const app = express();
const PORT = 3001;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// ── Create Checkout Session ─────────────────────────────────────────
app.post('/api/create-checkout-session', async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ── Verify Checkout Session ─────────────────────────────────────────
app.get('/api/checkout-session/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(
            req.params.sessionId,
            { expand: ['subscription'] }
        );

        res.json({
            status: session.payment_status,
            customer_email: session.customer_details?.email,
            subscription_status: session.subscription?.status ?? null,
        });
    } catch (error) {
        console.error('Session retrieval error:', error);
        res.status(404).json({ error: 'Session not found' });
    }
});

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
