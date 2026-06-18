import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

// Load ../../.env.local (the project env file lives one level above frontend/)
const envPath = path.resolve(process.cwd(), "../.env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_PASS;
console.log("Login as:", user, "| pass length:", pass ? pass.length : "MISSING");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

try {
  await transporter.verify();
  console.log("✅ SMTP auth OK");
  const info = await transporter.sendMail({
    from: `"Songify AI" <${user}>`,
    to: "asdfasdfasdfasdf@mailinator.com",
    subject: "Songify SMTP test",
    text: "This is a test email confirming SMTP works from no-reply@songify.fun.",
  });
  console.log("✅ Sent:", info.messageId, "| accepted:", info.accepted, "| response:", info.response);
} catch (err) {
  console.error("❌ FAILED:", err.message);
  process.exit(1);
}
