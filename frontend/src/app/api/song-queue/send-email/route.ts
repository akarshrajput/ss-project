import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      username?: string;
      songId?: string;
      songTitle?: string;
    };

    if (!body.email || !body.songId) {
      return NextResponse.json({ error: "Missing data." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.singify.fun";
    const songLink = `${siteUrl}/song/${body.songId}`;

    // Build a clean, professional HTML email
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #334155; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: left;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <div style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">Singify</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #0f172a;">
                Hi @${body.username},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #475569;">
                Your custom song request for <span style="font-weight: 600; color: #0f172a;">"${body.songTitle}"</span> has been successfully generated and is now available to stream or download.
              </p>
              
              <!-- CTA -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <a href="${songLink}" style="display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: #ffffff; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none;">View Song Page</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;">
                If the button above does not work, copy and paste this link:
              </p>
              <p style="margin: 0; font-size: 14px; word-break: break-all;">
                <a href="${songLink}" style="color: #4f46e5; text-decoration: underline;">${songLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; line-height: 1.5; color: #64748b;">
                You are receiving this email because you requested a song generation on Singify.
              </p>
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} Singify. All rights reserved.
              </p>
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
        pass: process.env.GMAIL_PASS, // This MUST be an "App Password", not your normal login password
      },
    });

    const mailOptions = {
      from: `"Singify AI" <${process.env.GMAIL_USER}>`,
      to: body.email,
      subject: `🎵 Your Song "${body.songTitle}" is Ready! — Singify`,
      html,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email notification sent to:", body.email);
    return NextResponse.json({ success: true, message: "Email sent successfully." });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    console.error("❌ Email sending failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
