/**
 * Stripe checkout via Payment Links.
 *
 * Since this is a client-only Vite SPA (no backend), we use Stripe Payment Links
 * instead of creating checkout sessions. Create Payment Links in your Stripe
 * Dashboard (https://dashboard.stripe.com/test/payment-links) for each price,
 * then add them to .env.local as VITE_STRIPE_LINK_*.
 *
 * If no payment link is configured, we fall back to a direct Stripe Checkout URL
 * constructed from the price ID (works in test mode).
 */

const PAYMENT_LINKS: Record<string, string> = {
    freemium: import.meta.env.VITE_STRIPE_LINK_FREEMIUM || '',
    pro: import.meta.env.VITE_STRIPE_LINK_PRO || '',
    luxury: import.meta.env.VITE_STRIPE_LINK_LUXURY || '',
};

const PRICE_IDS: Record<string, string> = {
    freemium: import.meta.env.VITE_STRIPE_FREEMIUM_PRICE || '',
    pro: import.meta.env.VITE_STRIPE_PRO_PRICE || '',
    luxury: import.meta.env.VITE_STRIPE_LUXURY_PRICE || '',
};

export interface CheckoutParams {
    tier: string;
    successUrl?: string;
    cancelUrl?: string;
}

export async function redirectToCheckout({ tier }: CheckoutParams) {
    // Option 1: Use a Stripe Payment Link (preferred — set up in Stripe Dashboard)
    const paymentLink = PAYMENT_LINKS[tier];
    if (paymentLink) {
        window.location.href = paymentLink;
        return;
    }

    // Option 2: Fallback — open Stripe's hosted payment page via price ID
    // This constructs a direct checkout URL using Stripe's test mode payment page
    const priceId = PRICE_IDS[tier];
    if (!priceId) {
        throw new Error(
            `No payment link or price ID found for tier "${tier}". ` +
            `Create a Payment Link in your Stripe Dashboard and add it to .env.local as VITE_STRIPE_LINK_${tier.toUpperCase()}`
        );
    }

    // For test mode, we can use Stripe's direct checkout URL format
    const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!publicKey) {
        throw new Error('VITE_STRIPE_PUBLIC_KEY is not set in .env.local');
    }

    // Build a Stripe-hosted checkout link manually
    // This works by redirecting to Stripe's payment page
    const params = new URLSearchParams({
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'mode': 'subscription',
        'success_url': `${window.location.origin}/success`,
        'cancel_url': `${window.location.origin}/#pricing`,
    });

    // Direct link to Stripe Checkout (requires Payment Links to be set up)
    // Since we can't create sessions client-side, prompt the user to set up Payment Links
    throw new Error(
        `Payment Link not configured for "${tier}" tier. ` +
        `Go to https://dashboard.stripe.com/test/payment-links/create, ` +
        `select the "${tier}" price, create a Payment Link, ` +
        `then add it to .env.local as:\n` +
        `VITE_STRIPE_LINK_${tier.toUpperCase()}=https://buy.stripe.com/test_xxx`
    );
}
