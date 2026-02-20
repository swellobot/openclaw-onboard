import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      {
        name: "stripe-api",
        configureServer(server) {
          server.middlewares.use("/api/create-checkout-session", async (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: "Method not allowed" }));
              return;
            }

            let body = "";
            req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
            req.on("end", async () => {
              try {
                const Stripe = (await import("stripe")).default;
                const stripe = new Stripe(env.STRIPE_SECRET_KEY);

                const { tier, successUrl, cancelUrl } = JSON.parse(body);

                const priceMap: Record<string, string> = {
                  freemium: env.STRIPE_FREMIUM_PRICE,
                  pro: env.STRIPE_PRO_PRICE,
                  luxury: env.STRIPE_LUXURY_PRICE,
                };

                const priceId = priceMap[tier];

                if (!priceId) {
                  res.statusCode = 400;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ error: `Unknown tier: ${tier}` }));
                  return;
                }

                const origin = req.headers.origin || req.headers.referer || "http://localhost:5173";

                const session = await stripe.checkout.sessions.create({
                  payment_method_types: ["card"],
                  line_items: [{ price: priceId, quantity: 1 }],
                  mode: "subscription",
                  success_url: successUrl || `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                  cancel_url: cancelUrl || `${origin}/#pricing`,
                });

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ sessionId: session.id, url: session.url }));
              } catch (error: any) {
                console.error("Stripe checkout error:", error.message);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: error.message }));
              }
            });
          });
        },
      },
    ],
  };
});
