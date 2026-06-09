"use client";

import { submitOtpForm } from "@/app/actions/otp";

export function OtpForm({ 
  email, 
  userId, 
  nextPath 
}: { 
  email: string | undefined;
  userId: string | undefined;
  nextPath: string;
}) {
  return (
    <form action={submitOtpForm} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <input type="hidden" name="email" value={email || ""} />
      <input type="hidden" name="userId" value={userId || ""} />
      <input type="hidden" name="nextPath" value={nextPath} />

      <div>
        <label htmlFor="otp" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          6-Digit Code
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          required
          maxLength={6}
          autoComplete="one-time-code"
          placeholder="123456"
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            color: "var(--text-primary)",
            fontSize: "1.2rem",
            letterSpacing: "0.5em",
            textAlign: "center",
            outline: "none",
            transition: "border-color 200ms",
          }}
          onFocus={(e) => e.target.style.borderColor = "#6366f1"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
      </div>

      <button
        type="submit"
        style={{
          background: "#6366f1",
          color: "#ffffff",
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.75rem",
          fontSize: "0.95rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 200ms",
          marginTop: "0.5rem",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#4f46e5"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#6366f1"}
      >
        Verify & Continue
      </button>
    </form>
  );
}
