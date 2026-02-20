/**
 * Stripe checkout via Payment Links.
 * No backend needed — just redirects to pre-created Stripe Payment Link URLs.
 */

const PAYMENT_LINKS: Record<string, string> = {
    freemium: import.meta.env.VITE_STRIPE_LINK_FREEMIUM || '',
    pro: import.meta.env.VITE_STRIPE_LINK_PRO || '',
    luxury: import.meta.env.VITE_STRIPE_LINK_LUXURY || '',
};

export interface CheckoutParams {
    tier: string;
}

export async function redirectToCheckout({ tier }: CheckoutParams) {
    const paymentLink = PAYMENT_LINKS[tier];

    if (!paymentLink) {
        throw new Error(
            `No payment link found for tier "${tier}". ` +
            `Add VITE_STRIPE_LINK_${tier.toUpperCase()} to .env.local`
        );
    }

    window.location.href = paymentLink;
}
