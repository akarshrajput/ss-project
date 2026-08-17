import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      username?: string;
      songId?: string;
      songTitle?: string;
      genre?: string | null;
      mood?: string | null;
      duration?: number;
      rejectionComment?: string | null;
    };

    if (!body.email || !body.songId) {
      return NextResponse.json({ error: "Missing email or songId." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const songLink = `${siteUrl}/song/${body.songId}`;
    const hasComment = Boolean(body.rejectionComment && body.rejectionComment.trim());

    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Song Request Rejected</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%;">
    <tr>
      <td style="padding: 40px 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Song Request Rejected</h1>
              <p style="margin: 0; font-size: 12px; color: #64748b;">We reviewed your request and could not complete this generation at the moment.</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px 16px 32px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Hi ${body.username ? `@${body.username}` : "there"}, your song request has been marked as <strong style="color: #dc2626;">rejected</strong> by our moderation/admin team.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">Song Details</p>
                ${body.songTitle && body.songTitle !== "AI Generated Song" ? `<p style="margin: 0 0 6px 0; font-size: 14px; color: #0f172a;"><strong>Title:</strong> ${body.songTitle}</p>` : ""}
                <p style="margin: 0 0 6px 0; font-size: 14px; color: #0f172a;"><strong>Song ID:</strong> ${body.songId}</p>
                <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Style:</strong> ${[body.genre, body.mood].filter(Boolean).join(" • ") || "Not specified"} • ${body.duration ?? 30}s</p>
              </div>
            </td>
          </tr>

          ${hasComment ? `
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 14px 16px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9a3412;">REASON</p>
                <p style="margin: 0; font-size: 14px; color: #7c2d12; line-height: 1.6; white-space: pre-wrap;">${(body.rejectionComment ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
              </div>
            </td>
          </tr>
          ` : ""}

          <tr>
            <td style="padding: 0 32px 24px 32px; text-align: center;">
              <a href="${songLink}" style="display: inline-block; padding: 14px 32px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; border: 2px solid #4f46e5;">View Song Request</a>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px 24px 32px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 16px 0 0 0; font-size: 12px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; word-break: break-all;"><a href="${songLink}" style="color: #4f46e5; text-decoration: none;">${songLink}</a></p>
            </td>
          </tr>

          <tr>
            <td style="padding: 16px 32px 24px 32px;">
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">You can submit a new request anytime with updated lyrics or style settings. If you didn't request this, you can ignore this email.</p>
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

    await transporter.sendMail({
      from: `"Singify AI" <${process.env.GMAIL_USER}>`,
      to: body.email,
      subject: "Update on your Singify request",
      html,
    });

    return NextResponse.json({ success: true, message: "Rejection email sent successfully." });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
