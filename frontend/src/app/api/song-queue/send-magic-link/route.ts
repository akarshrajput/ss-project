import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      songId?: string;
      lyrics?: string;
      theme?: string | null;
      genre?: string | null;
      mood?: string | null;
      duration?: number;
    };

    if (!body.email || !body.songId) {
      return NextResponse.json({ error: "Missing email or songId." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    params.append("verifyEmail", body.email);
    params.append("action", "quickGen");
    params.append("songId", body.songId);
    if (body.lyrics) params.append("lyrics", body.lyrics);
    if (body.theme) params.append("theme", body.theme);
    if (body.genre) params.append("genre", body.genre);
    if (body.mood) params.append("mood", body.mood);
    if (body.duration) params.append("duration", body.duration.toString());
    
    const accessLink = `${siteUrl}/song/${body.songId}?${params.toString()}`;

    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Song is Ready</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    @media (prefers-color-scheme: dark) {
      body { background-color: #0a0e27; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Your Song is Ready</h1>
              <p style="margin: 0; font-size: 12px; color: #64748b;">We prepared a secure link so you can access your request.</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">Click the button below to open your song page and download the file when it's available.</p>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 32px 24px 32px; text-align: center;">
              <a href="${accessLink}" style="display: inline-block; padding: 14px 32px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; border: 2px solid #4f46e5;">Download Song</a>
            </td>
          </tr>
          
          <!-- Fallback Link -->
          <tr>
            <td style="padding: 0 32px 24px 32px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 16px 0 0 0; font-size: 12px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; word-break: break-all;"><a href="${accessLink}" style="color: #4f46e5; text-decoration: none;">${accessLink}</a></p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 16px 32px 24px 32px;">
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">This link will verify your email and take you to your song page. If you didn't request this, you can ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
      subject: `Your Song Request — Songify`,
      html,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Magic link sent successfully." });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
