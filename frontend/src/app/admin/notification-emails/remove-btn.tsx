"use client";

import { useTransition } from "react";
import { removeNotificationEmailAction } from "./actions";

export function RemoveButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm(`Remove ${email} from notifications?`)) {
          startTransition(async () => {
            const formData = new FormData();
            formData.append("email", email);
            await removeNotificationEmailAction(formData);
          });
        }
      }}
      disabled={isPending}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.4rem",
        padding: "0.4rem 0.8rem", borderRadius: "0.5rem",
        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
        color: "#fca5a5", fontSize: "0.75rem", fontWeight: 600,
        cursor: isPending ? "not-allowed" : "pointer",
        opacity: isPending ? 0.6 : 1,
        transition: "background 150ms",
      }}
    >
      {isPending ? "Removing..." : "Remove"}
    </button>
  );
}
