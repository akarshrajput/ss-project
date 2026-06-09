import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSubscription, getSubscriptionByStripeSession } from "@/lib/subscription-store";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/payment?error=Missing+session", origin));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.redirect(new URL("/payment?error=Payment+not+completed", origin));
    }

    const userId = session.metadata?.userId;
    if (!userId) {
      return NextResponse.redirect(new URL("/payment?error=Invalid+session+metadata", origin));
    }

    // Avoid creating duplicate subscriptions
    const existing = await getSubscriptionByStripeSession(sessionId);
    if (!existing) {
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null;

      await createSubscription(userId, sessionId, paymentIntentId);
    }

    return NextResponse.redirect(new URL("/studio", origin));
  } catch (error) {
    console.error("Stripe success handler error:", error);
    return NextResponse.redirect(new URL("/payment?error=Payment+verification+failed", origin));
  }
}
