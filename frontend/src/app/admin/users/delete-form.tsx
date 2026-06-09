"use client";

import { useFormStatus } from "react-dom";
import { deleteAppUser } from "./actions";

function DeleteSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: "none",
        border: "none",
        color: pending ? "var(--text-muted)" : "#fca5a5",
        cursor: pending ? "not-allowed" : "pointer",
        padding: "0.4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: pending ? 0.5 : 1,
        transition: "opacity 200ms ease",
      }}
      title="Delete User"
      onClick={(e) => {
        if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"/>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      </svg>
    </button>
  );
}

export function DeleteUserForm({ userId }: { userId: string }) {
  return (
    <form action={deleteAppUser}>
      <input type="hidden" name="userId" value={userId} />
      <DeleteSubmit />
    </form>
  );
}
