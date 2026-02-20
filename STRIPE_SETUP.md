# Stripe Integration Setup Guide

## 🎯 Overview

Your website now has a fully functional Stripe checkout integration with three pricing tiers:
- **Starter (Freemium)** - $29/month or $23/month annually
- **Pro** - $59/month or $47/month annually
- **Enterprise (Luxury)** - $129/month or $103/month annually

## 📋 Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Your Stripe API keys from the Dashboard

## 🔑 Step 1: Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

## 🔧 Step 2: Configure Environment Variables

Update your `.env.local` file with your actual Stripe keys:

```bash
# Replace these placeholder values with your actual Stripe keys
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
```

**⚠️ IMPORTANT:**
- The `VITE_STRIPE_PUBLIC_KEY` is safe to expose (it's used in the frontend)
- The `STRIPE_SECRET_KEY` must NEVER be exposed to the frontend (only used in server.js)

Your `.env.local` should look like this:

```env
# Stripe Price IDs (Frontend)
VITE_STRIPE_FREMIUM_PRICE=price_1T31KELaHog9suoID1FAmxV8
VITE_STRIPE_PRO_PRICE=price_1T31KRLaHog9suoIkvzNvvP8
VITE_STRIPE_LUXURY_PRICE=price_1T31KeLaHog9suoISz1Hzvz9
VITE_STRIPE_PAYMENT_METHOD=pm_card_visa

# Stripe Keys
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_ACTUAL_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY

# API URL (for development)
VITE_API_URL=http://localhost:3001
```

## 🚀 Step 3: Run the Application

You need to run **both** the frontend and backend servers:

### Option A: Run both servers simultaneously (Recommended)

```bash
npm run dev:all
```

This will start:
- Frontend (Vite) on `http://localhost:5173`
- Backend API on `http://localhost:3001`

### Option B: Run servers separately

In one terminal:
```bash
npm run dev
```

In another terminal:
```bash
npm run dev:api
```

## 🧪 Step 4: Test the Integration

1. Open your browser to `http://localhost:5173`
2. Navigate to the Pricing section (scroll down or click "Pricing" in navigation)
3. Toggle between **Monthly** and **Annual** billing to see price changes
4. Click **"Get Started →"** on any pricing tier
5. You should be redirected to the actual Stripe Checkout page

### Using Stripe Test Cards

When testing, use these test card numbers:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires authentication:** `4000 0025 0000 3155`

Use any future expiration date, any 3-digit CVC, and any postal code.

## 📁 Project Structure

```
openclaw-onboard/
├── server.js                    # Backend API server (handles Stripe checkout)
├── .env.local                   # Environment variables (DO NOT commit)
├── .env.example                 # Example environment variables
├── src/
│   ├── lib/
│   │   ├── stripe.ts           # Frontend Stripe integration
│   │   └── data/
│   │       └── pricing.ts      # Pricing tiers with Stripe price IDs
│   ├── components/
│   │   └── sections/
│   │       └── Pricing.tsx     # Pricing component with checkout buttons
│   └── pages/
│       └── SuccessPage.tsx     # Success page after payment
└── api/
    └── create-checkout-session.ts  # API endpoint (reference)
```

## 🔍 How It Works

1. **User clicks "Get Started"** on a pricing tier
2. **Frontend** calls the backend API (`/api/create-checkout-session`) with the price ID
3. **Backend** creates a Stripe Checkout Session using your secret key
4. **Frontend** redirects the user to the Stripe-hosted checkout page
5. **User completes payment** on Stripe's secure checkout
6. **Stripe redirects** back to your success page (`/success`)

## 🐛 Troubleshooting

### "Failed to create checkout session"
- Check that your `STRIPE_SECRET_KEY` is correct in `.env.local`
- Ensure the backend server is running (`npm run dev:api`)
- Check the browser console and backend terminal for error messages

### "No checkout URL or session ID received"
- Verify your `VITE_STRIPE_PUBLIC_KEY` is set correctly
- Check that the API URL is correct (`http://localhost:3001`)

### Blank/white page
- Make sure both frontend AND backend servers are running
- Check browser console for errors
- Verify all environment variables are prefixed correctly (`VITE_` for frontend vars)

### CORS errors
- The backend (`server.js`) has CORS enabled
- If issues persist, check that `VITE_API_URL` matches where your API is running

## 📝 Next Steps

1. **Test with real Stripe test mode** - Use test cards to complete the flow
2. **Customize success page** - Edit `src/pages/SuccessPage.tsx`
3. **Add webhooks** - Handle post-payment events (subscription created, payment succeeded, etc.)
4. **Production deployment** - Switch to live keys and deploy both frontend + backend

## 🔒 Security Notes

- **NEVER** commit `.env.local` to version control (it's in `.gitignore`)
- The `STRIPE_SECRET_KEY` should ONLY be used server-side
- All payment processing happens on Stripe's secure servers
- Your frontend only receives a session ID, never card details

## 🎨 Customization

### Change pricing
Edit `src/lib/data/pricing.ts` to update prices and features.

### Change success page
Edit `src/pages/SuccessPage.tsx` to customize the post-payment experience.

### Add more tiers
Add new objects to `pricingTiers` array and create corresponding Stripe price IDs.

---

**Need help?** Check the Stripe documentation: https://stripe.com/docs/checkout/quickstart
