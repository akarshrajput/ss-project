"use server";

import nodemailer from "nodemailer";
import { createEmailOtp, verifyEmailOtp, upsertAppUserProfile } from "@/lib/app-store";
import { getUser, signInWithPassword as authSignIn, signUp as authSignUp } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function sendVerificationEmail(email: string, payload?: any, userId?: string) {
  const otp = await createEmailOtp(userId, email, payload);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || process.env.GMAIL_USER,
      pass: process.env.EMAIL_PASS || process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Songify AI" <${process.env.GMAIL_FROM || process.env.EMAIL_USER || process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your email - Songify AI",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin: 0;">Songify AI</h1>
        </div>
        <h2 style="margin-bottom: 20px; color: #0f172a;">Verify your email</h2>
        <p style="font-size: 16px; color: #475569; line-height: 1.5; margin-bottom: 30px;">
          Please use the verification code below to complete your registration. This code will expire in 15 minutes.
        </p>
        <div style="background: rgba(99,102,241,0.05); border: 1px solid rgba(99,102,241,0.2); padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 32px; letter-spacing: 0.2em; color: #4f46e5;">${otp}</h2>
        </div>
        <p style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function submitOtpForm(formData: FormData) {
  const otp = String(formData.get("otp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const userId = String(formData.get("userId") ?? "");
  const nextPath = String(formData.get("nextPath") ?? "/dashboard");

  if (!otp || otp.length !== 6 || !email) {
    redirect(
      `/verify-otp?error=${encodeURIComponent("Invalid code.")}&email=${encodeURIComponent(email)}&userId=${userId}&next=${encodeURIComponent(nextPath)}`
    );
  }

  // ── Step 1: Verify OTP purely in MongoDB ──────────────────────────────────
  const result = await verifyEmailOtp(email, otp);

  if (!result) {
    redirect(
      `/verify-otp?error=${encodeURIComponent("Invalid or expired code.")}&email=${encodeURIComponent(email)}&userId=${userId}&next=${encodeURIComponent(nextPath)}`
    );
  }

  // ── Step 2: If OTP carried a registration payload, create the account ─────
  if (typeof result === "object" && result !== null && result.password) {
    // Try to sign in first — handles the case where a Supabase account already
    // exists (e.g. a previous failed registration attempt that seeded the user
    // into Supabase but not MongoDB).
    const { session: signInSession, user: signInUser, error: signInError } =
      await authSignIn({
        email: result.email,
        password: result.password,
      });

    if (signInSession) {
      // Account already existed — make sure MongoDB profile is marked verified
      if (signInUser) await upsertAppUserProfile(signInUser, true);
      redirect(nextPath);
    }

    // Sign-in failed → user doesn't exist yet → create them in Supabase
    // (MongoDB already has the verified flag from verifyEmailOtp above)
    const { user: signUpUser, error: signUpError } = await authSignUp({
      email: result.email,
      password: result.password,
      options: {
        data: { full_name: result.fullName },
        // Skip Supabase's own email confirmation — we already confirmed via OTP
        emailRedirectTo: undefined,
      },
    });

    if (signUpError) {
      redirect(
        `/verify-otp?error=${encodeURIComponent(signUpError.message)}&email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`
      );
    }

    if (signUpUser) {
      // Create the MongoDB profile for the brand-new user
      await upsertAppUserProfile(signUpUser, true);

      // Immediately sign them in so they have an active session
      const { session: newSession } = await authSignIn({
        email: result.email,
        password: result.password,
      });

      if (newSession) {
        redirect(nextPath);
      }
    }
  }

  redirect(nextPath);
}
