import Link from "next/link";
import type { Metadata } from "next";
import { signInWithPassword } from "@/app/actions/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description: "Sign in to Songify to access your audio dashboard and saved library.",
  path: "/login",
  noIndex: true,
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const nextPath = readParam(params.next, "/dashboard");
  const error = readParam(params.error);
  const notice = readParam(params.notice);

  return (
    <main className="site-container flex w-full flex-1 items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #2dd4bf)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif' }}>Songify</span>
        </div>

        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Sign in to access your dashboard, library, and downloads.
        </p>

        <form
          action={signInWithPassword}
          style={{ background: "rgba(17,24,39,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.75rem", backdropFilter: "blur(20px)" }}
        >
          <input type="hidden" name="next" value={nextPath} />

          <div className="space-y-4">
            <div>
              <label className="input-label">Email</label>
              <input required name="email" type="email" className="input" placeholder="you@company.com" />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input required minLength={8} name="password" type="password" className="input" placeholder="••••••••" />
            </div>

            {error && <div className="alert-error">{error}</div>}
            {notice && <div className="alert-success">{notice}</div>}

            <button
              type="submit"
              className="btn-primary w-full"
              style={{ justifyContent: "center", padding: "0.75rem", fontSize: "0.95rem", marginTop: "0.5rem" }}
            >
              Sign in
            </button>
          </div>
        </form>

        <p style={{ marginTop: "1.25rem", fontSize: "0.875rem", color: "var(--text-muted)", textAlign: "center" }}>
          New here?{" "}
          <Link href={`/register?next=${encodeURIComponent(nextPath)}`} style={{ color: "#a5b4fc", fontWeight: 600, textDecoration: "none" }}>
            Create account →
          </Link>
        </p>
      </div>
    </main>
  );
}
