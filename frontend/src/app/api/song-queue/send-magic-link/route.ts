import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      lyrics?: string;
      basePrompt?: string;
      duration?: number;
    };

    if (!body.email) {
      return NextResponse.json({ error: "Missing email." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    params.append("verifyEmail", body.email);
    params.append("action", "quickGen");
    if (body.lyrics) params.append("lyrics", body.lyrics);
    if (body.basePrompt) params.append("basePrompt", body.basePrompt);
    if (body.duration) params.append("duration", body.duration.toString());
    
    const verificationLink = `${siteUrl}/?${params.toString()}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f4f4f5; color: #334155;">
  <div style="max-width: 520px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; padding: 32px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <h2 style="color: #0f172a;">Confirm Your Request</h2>
    <p style="font-size: 16px; line-height: 1.6; color: #475569;">
      Click the button below to continue to the next step of your song generation request.
    </p>
    <a href="${verificationLink}" style="display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: #ffffff; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none; margin: 24px 0; cursor: pointer;">
      Continue
    </a>
    <p style="font-size: 14px; color: #64748b;">
      If the button does not work, copy and paste this link:
      <br/><br/>
      <a href="${verificationLink}" style="color: #4f46e5; word-break: break-all;">${verificationLink}</a>
    </p>
  </div>
</body>
</html>`;

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.warn("⚠️ GMAIL_USER or GMAIL_PASS is not set in environment variables. Email not sent.");
      return NextResponse.json({ success: true, message: "Email logged. Missing credentials to send." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Songify AI" <${process.env.GMAIL_USER}>`,
      to: body.email,
      subject: `Confirm Your Request — Songify`,
      html,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Magic link sent successfully." });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
