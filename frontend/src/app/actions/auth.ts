"use server";

import { redirect } from "next/navigation";
import { upsertAppUserProfile } from "@/lib/app-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = getRedirectPath(formData);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(nextPath)}`);
  }

  if (data.user) {
    await upsertAppUserProfile(data.user);
  }

  redirect(nextPath);
}

export async function registerWithPassword(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const nextPath = getRedirectPath(formData);

  if (fullName.length < 2) {
    redirect(`/register?error=${encodeURIComponent("Please enter your full name.")}&next=${encodeURIComponent(nextPath)}`);
  }

  if (password.length < 8) {
    redirect(`/register?error=${encodeURIComponent("Password must be at least 8 characters.")}&next=${encodeURIComponent(nextPath)}`);
  }

  if (password !== confirmPassword) {
    redirect(`/register?error=${encodeURIComponent("Password and confirm password do not match.")}&next=${encodeURIComponent(nextPath)}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    const safeMessage = mapAuthError(error.message);
    redirect(`/register?error=${encodeURIComponent(safeMessage)}&next=${encodeURIComponent(nextPath)}`);
  }

  if (data.user) {
    await upsertAppUserProfile(data.user);
  }

  // Direct register mode requires an immediate session after sign up.
  if (!data.session) {
    const configMessage =
      "Direct signup is disabled in Supabase. Turn off email confirmation in Authentication > Providers > Email.";
    redirect(`/register?error=${encodeURIComponent(configMessage)}&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}
