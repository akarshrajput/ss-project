"use server";

import { redirect } from "next/navigation";
import { upsertAppUserProfile } from "@/lib/app-store";
import { hasActiveSubscription } from "@/lib/subscription-store";
import { getUser, signInWithPassword as authSignIn, signUp as authSignUp, signOut as authSignOut, updateUser as authUpdateUser } from "@/lib/auth";

function getRedirectPath(formData: FormData, fallback = "/dashboard") {
  const next = String(formData.get("next") ?? fallback);
  if (!next.startsWith("/")) {
    return fallback;
  }
  return next;
}

function mapAuthError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("for security purposes") || lower.includes("you can only request this after")) {
    return "Too many signup requests. Please wait about 30 seconds and try again.";
  }

  if (lower.includes("email rate limit exceeded")) {
    return "Email rate limit reached. Please wait a moment, then try again.";
  }

  return message;
}

export async function signOut() {
  await authSignOut();
  redirect("/");
}

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = getRedirectPath(formData);

  const { user, error } = await authSignIn({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextPath)}`);
  }

  if (user) {
    await upsertAppUserProfile(user);
    
    // If user is heading to payment but already has an active subscription, send them to studio
    if (nextPath.startsWith("/payment")) {
      const hasSub = await hasActiveSubscription(user.id);
      if (hasSub) {
        redirect("/studio");
      }
    }
  }

  redirect(nextPath);
}

export async function registerWithPassword(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const nextPath = getRedirectPath(formData);
  const plan = String(formData.get("plan") ?? "");

  if (fullName.length < 2) {
    redirect(`/register?error=${encodeURIComponent("Please enter your full name.")}&next=${encodeURIComponent(nextPath)}${plan ? `&plan=${encodeURIComponent(plan)}` : ""}`);
  }

  if (password.length < 8) {
    redirect(`/register?error=${encodeURIComponent("Password must be at least 8 characters.")}&next=${encodeURIComponent(nextPath)}${plan ? `&plan=${encodeURIComponent(plan)}` : ""}`);
  }

  if (password !== confirmPassword) {
    redirect(`/register?error=${encodeURIComponent("Password and confirm password do not match.")}&next=${encodeURIComponent(nextPath)}${plan ? `&plan=${encodeURIComponent(plan)}` : ""}`);
  }

  if (plan === "24h-unlimited") {
    // We do NOT create the account yet. We save the payload and send OTP.
    const { sendVerificationEmail } = await import("@/app/actions/otp");
    await sendVerificationEmail(email, { email, password, fullName, plan });
    redirect(`/verify-otp?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectTo = plan
    ? `${siteUrl}/api/auth/callback?next=${encodeURIComponent(`/payment?plan=${plan}`)}`
    : `${siteUrl}/api/auth/callback?next=${encodeURIComponent(nextPath)}`;

  const { user, session, error } = await authSignUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    const safeMessage = mapAuthError(error.message);
    redirect(`/register?error=${encodeURIComponent(safeMessage)}&next=${encodeURIComponent(nextPath)}${plan ? `&plan=${encodeURIComponent(plan)}` : ""}`);
  }

  if (user) {
    const isVerified = plan !== "24h-unlimited";
    await upsertAppUserProfile(user, isVerified);
  }

  // If email confirmation is enabled globally, the session will be null.
  if (!session && plan !== "24h-unlimited") {
    redirect(`/register?notice=${encodeURIComponent("Check your email to verify your account. Click the link we sent to continue.")}&next=${encodeURIComponent(nextPath)}${plan ? `&plan=${encodeURIComponent(plan)}` : ""}`);
  }

  redirect(nextPath);
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirect(`/me?tab=settings&error=${encodeURIComponent("Password must be at least 8 characters.")}`);
  }

  if (password !== confirmPassword) {
    redirect(`/me?tab=settings&error=${encodeURIComponent("Passwords do not match.")}`);
  }

  const { error } = await authUpdateUser({ password });

  if (error) {
    redirect(`/me?tab=settings&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/me?tab=settings&notice=${encodeURIComponent("Password updated successfully.")}`);
}
