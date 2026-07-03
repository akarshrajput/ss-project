import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { signInWithPassword } from "@/app/actions/auth";
import { buildMetadata } from "@/lib/seo";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description: "Sign in to your Songify account.",
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
  const plan = readParam(params.plan);

  const user = await getUser();

  if (user) {
    redirect("/me");
  }

  return (
    <main className="site-container flex w-full flex-1 items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Image
            src="/songify-logo.png"
            alt="Songify"
            width={40}
            height={40}
            className="rounded-[10px] shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          />
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: '"Space Grotesk", sans-serif' }}>Songify</span>
        </div>

        <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
          Sign in
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
          {plan === "24h-unlimited"
            ? "Sign in to get 24-hour unlimited song creation for just $1."
            : "Sign in to access your account."}
        </p>

        <div style={{ background: "rgba(17,24,39,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.75rem", backdropFilter: "blur(20px)" }}>
          <a
            href={`/api/auth/google?next=${encodeURIComponent(plan ? `/payment?plan=${plan}` : nextPath)}`}
            className="w-full flex items-center justify-center gap-2 mb-4"
            style={{ padding: "0.75rem", fontSize: "0.95rem", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "var(--text-primary)", transition: "all 0.2s", textDecoration: "none" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <div className="relative flex items-center py-2 mb-4">
            <div className="flex-grow border-t border-gray-700/50"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-400">Or continue with email</span>
            <div className="flex-grow border-t border-gray-700/50"></div>
          </div>

          <form action={signInWithPassword}>
            <input type="hidden" name="next" value={plan ? `/payment?plan=${plan}` : nextPath} />

          <div className="space-y-4">
            <div>
              <label className="input-label">Email</label>
              <input required name="email" type="email" className="input" placeholder="you@example.com" />
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
        </div>

        <p style={{ marginTop: "1.25rem", fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link href={`/register?next=${encodeURIComponent(nextPath)}${plan ? `&plan=${encodeURIComponent(plan)}` : ""}`} style={{ color: "#a5b4fc", fontWeight: 600, textDecoration: "underline" }}>
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
