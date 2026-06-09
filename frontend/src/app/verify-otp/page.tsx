import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { OtpForm } from "./otp-form";

export const metadata = buildMetadata({
  title: "Verify your email - Songify AI",
  description: "Enter your verification code to continue.",
  path: "/verify-otp",
  noIndex: true,
});

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; userId?: string; next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const email = params.email;
  const userId = params.userId; // fallback for backward compatibility
  const nextPath = params.next || "/dashboard";
  const error = params.error;

  if (!email && !userId) {
    redirect("/");
  }

  return (
    <main className="site-container flex min-h-[100dvh] items-center justify-center px-4 py-12">
      <div style={{ width: "100%", maxWidth: 400 }}>
        
        {/* Logo / Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#6366f1", letterSpacing: "-0.05em" }}>
              Songify AI
            </span>
          </Link>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.8rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Verify your email
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            We've sent a 6-digit code to your email.
          </p>
        </div>

        {/* Form Container */}
        <div style={{
          background: "rgba(13,17,23,0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "1rem",
          padding: "2rem",
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", padding: "0.75rem", borderRadius: "0.5rem", fontSize: "0.85rem", marginBottom: "1.5rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <OtpForm email={email} userId={userId} nextPath={nextPath} />
        </div>

      </div>
    </main>
  );
}
