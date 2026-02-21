export interface CheckoutParams {
    tier: string;
}

export async function redirectToCheckout({ tier }: CheckoutParams) {
    const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create checkout session');
    }

    const { url } = await res.json();
    window.location.href = url;
}
