import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getUser } from "@/lib/auth";

export async function POST() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Songify — 24h Unlimited Song Creation",
              description: "Generate unlimited AI songs for 24 hours with no delays.",
            },
            unit_amount: 100, // $1.00
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        plan: "24h-unlimited",
      },
      customer_email: user.email,
      success_url: `${siteUrl}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
