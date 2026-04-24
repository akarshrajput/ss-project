import { NextResponse } from "next/server";

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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.songify.fun";
    const songLink = `${siteUrl}/song/${body.songId}`;

    // Build a beautiful HTML email matching Songify's dark theme
    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#060810;font-family:'Inter',system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#2dd4bf);display:inline-block;"></div>
        <span style="font-size:1.2rem;font-weight:700;color:#f1f5f9;font-family:'Space Grotesk',sans-serif;letter-spacing:-0.02em;">Songify</span>
      </div>
    </div>

    <!-- Card -->
    <div style="background:rgba(17,24,39,0.95);border:1px solid rgba(99,102,241,0.25);border-radius:16px;padding:32px 28px;text-align:center;">
      
      <!-- Emoji icon -->
      <div style="width:64px;height:64px;border-radius:50%;background:rgba(99,102,241,0.15);border:2px solid rgba(99,102,241,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;">
        🎵
      </div>

      <h1 style="font-size:1.5rem;font-weight:700;color:#f1f5f9;margin:0 0 8px;font-family:'Space Grotesk',sans-serif;">
        Your Song is Ready!
      </h1>
      
      <p style="font-size:0.95rem;color:#94a3b8;line-height:1.7;margin:0 0 8px;">
        Hey <strong style="color:#a5b4fc;">@${body.username}</strong>,
      </p>
      
      <p style="font-size:0.92rem;color:#94a3b8;line-height:1.7;margin:0 0 24px;">
        Great news! Your song <strong style="color:#f1f5f9;">"${body.songTitle}"</strong> has been generated and is now live on Songify. 🎶
      </p>

      <!-- CTA Button -->
      <a href="${songLink}" style="display:inline-block;padding:14px 36px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;font-size:1rem;font-weight:700;text-decoration:none;box-shadow:0 0 24px rgba(99,102,241,0.4);">
        🎧 Listen to Your Song
      </a>

      <p style="font-size:0.78rem;color:#475569;margin:20px 0 0;line-height:1.6;">
        Or copy this link: <a href="${songLink}" style="color:#6366f1;text-decoration:underline;">${songLink}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:28px;">
      <p style="font-size:0.75rem;color:#475569;line-height:1.6;">
        You're receiving this because you requested a song on <a href="${siteUrl}" style="color:#6366f1;text-decoration:none;">Songify</a>.<br/>
        © ${new Date().getFullYear()} Songify · AI Song Generator
      </p>
    </div>
  </div>
</body>
</html>`;

    // For now, log the email. In production, integrate with a service like Resend, SendGrid, etc.
    // TODO: Replace with actual email sending service
    console.log("📧 Email notification:");
    console.log(`   To: ${body.email}`);
    console.log(`   Subject: 🎵 Your Song "${body.songTitle}" is Ready! — Songify`);
    console.log(`   Song Link: ${songLink}`);

    return NextResponse.json({ success: true, message: "Email notification logged." });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
