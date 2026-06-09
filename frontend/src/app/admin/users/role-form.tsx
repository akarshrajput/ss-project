"use client";

import { useFormStatus } from "react-dom";
import { AppUserRole } from "@/lib/app-store";
import { updateUserRole } from "./actions";

function SubmitButton({ currentRole }: { currentRole: AppUserRole }) {
  const { pending } = useFormStatus();
  
  const isCurrentlyAdmin = currentRole === "admin";
  const label = pending ? "Updating..." : (isCurrentlyAdmin ? "Demote to User" : "Make Admin");
  
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: "0.4rem 0.8rem",
        borderRadius: "0.4rem",
        border: "none",
        fontSize: "0.75rem",
        fontWeight: 600,
        cursor: pending ? "not-allowed" : "pointer",
        background: isCurrentlyAdmin ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
        color: isCurrentlyAdmin ? "#fca5a5" : "#86efac",
        transition: "opacity 150ms",
        opacity: pending ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  );
}

export function RoleForm({ userId, currentRole }: { userId: string; currentRole: AppUserRole }) {
  const targetRole = currentRole === "admin" ? "user" : "admin";
  
  return (
    <form action={updateUserRole}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="role" value={targetRole} />
      <SubmitButton currentRole={currentRole} />
    </form>
  );
}
