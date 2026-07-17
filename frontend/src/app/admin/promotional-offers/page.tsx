import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getAppUserProfile } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";
import { sendPromoOffer } from "../actions";

export const metadata: Metadata = buildMetadata({
  title: "Promotional Offers | Admin",
  description: "Send special promo subscription offers directly to users.",
  path: "/admin/promotional-offers",
  noIndex: true,
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default async function PromotionalOffersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = readParam(params.error);
  const notice = readParam(params.notice);

  const user = await getUser();

  if (!user) redirect("/login?next=/admin/promotional-offers");

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") redirect("/dashboard");

  const db = await getMongoDb();
  
  // Fetch promotional subscription history (either currently isPromo: true or has been paid but was started as promo)
  const promos = await db.collection("subscriptions")
    .find({
      $or: [
        { isPromo: true },
        { isPromoPaid: true }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(30)
    .toArray();

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,17,23,0.8)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "0.875rem",
    backdropFilter: "blur(16px)",
    padding: "1.5rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "var(--text-primary)",
    padding: "0.55rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 150ms",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    display: "block",
    marginBottom: "0.4rem",
  };

  const now = new Date();

  return (
    <main className="site-container w-full flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div style={{ maxWidth: 1020, width: "100%" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#34d399", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "999px", padding: "0.3rem 0.85rem", marginBottom: "0.85rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              Admin
            </span>
            <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Promotional Offers
            </h1>
            <p style={{ marginTop: "0.4rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Send trial offers and start 24-hour subscriptions directly for user emails.
            </p>
          </div>
          <a
            href="/admin"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.55rem 1.1rem", borderRadius: "0.5rem",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-secondary)", fontSize: "0.83rem", fontWeight: 600,
              textDecoration: "none", transition: "background 150ms",
            }}
          >
            ← Back to Admin
          </a>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ marginBottom: "1.25rem", fontSize: "0.875rem", color: "#fca5a5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.625rem", padding: "0.75rem 1rem" }}>
            ⚠️ {error}
          </div>
        )}
        {notice && (
          <div style={{ marginBottom: "1.25rem", fontSize: "0.875rem", color: "#86efac", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "0.625rem", padding: "0.75rem 1rem" }}>
            ✓ {notice}
          </div>
        )}

        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "start" }}>
          
          {/* Card: Send Promotional Offer */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Send Offer Email</h2>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Starts a 24h subscription and sends email</p>
              </div>
            </div>

            <form action={sendPromoOffer} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={labelStyle}>User Email</label>
                <input
                  name="userEmail"
                  type="email"
                  required
                  placeholder="user@example.com"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Email Subject</label>
                <input
                  name="subject"
                  type="text"
                  required
                  defaultValue="🎁 Special Premium Offer: 24h Free Access to Songify!"
                  placeholder="Enter email subject line..."
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Custom Message</label>
                <textarea
                  name="message"
                  required
                  placeholder="Type your custom offer message here..."
                  defaultValue={`Hey there,\n\nWe've activated 24 hours of premium subscription access for you on Songify AI!\n\nYou can now generate unlimited high-quality AI songs without any delay or limits.\n\nClick the button below to visit the studio and start creating your music. Enjoy!\n\nBest regards,\nThe Songify Team`}
                  rows={8}
                  style={{
                    ...inputStyle,
                    height: "auto",
                    resize: "vertical",
                  }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.6rem 1.25rem", borderRadius: "0.5rem",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#fff", fontSize: "0.85rem", fontWeight: 600,
                    border: "none", cursor: "pointer",
                    boxShadow: "0 0 14px rgba(16,185,129,0.25)",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Send Offer & Start Subscription
                </button>
              </div>
            </form>
          </div>

          {/* Card: Recent Offers */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>Recent Promo Subscriptions</h2>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Status of offers sent to users</p>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              {promos.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center", padding: "2rem 0" }}>
                  No promotional offers sent yet.
                </p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
                      <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Email</th>
                      <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Expiry</th>
                      <th style={{ textAlign: "center", paddingBottom: "0.5rem" }}>Paid?</th>
                      <th style={{ textAlign: "right", paddingBottom: "0.5rem" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promos.map((promo: any) => {
                      const expires = new Date(promo.expiresAt);
                      const isExpired = expires < now;
                      const hasPaid = promo.isPromoPaid || !promo.isPromo;

                      return (
                        <tr key={promo._id.toString()} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "0.6rem 0", color: "var(--text-primary)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={promo.email}>
                            {promo.email || "No Email"}
                          </td>
                          <td style={{ padding: "0.6rem 0", color: "var(--text-secondary)" }}>
                            {expires.toLocaleDateString()} {expires.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: "0.6rem 0", textAlign: "center" }}>
                            {hasPaid ? (
                              <span style={{ color: "#34d399", fontWeight: 600 }}>Yes</span>
                            ) : (
                              <span style={{ color: "var(--text-muted)" }}>No</span>
                            )}
                          </td>
                          <td style={{ padding: "0.6rem 0", textAlign: "right" }}>
                            {isExpired ? (
                              <span style={{ color: "#f87171", background: "rgba(239,68,68,0.1)", padding: "0.15rem 0.45rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600 }}>Expired</span>
                            ) : (
                              <span style={{ color: "#34d399", background: "rgba(52,211,153,0.1)", padding: "0.15rem 0.45rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600 }}>Active</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
