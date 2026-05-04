export function deriveUsernameFromEmail(emailAddress: string): string {
  const localPart = emailAddress.trim().toLowerCase().split("@")[0] ?? "";
  const normalized = localPart
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (normalized.length >= 3) {
    return normalized;
  }

  return `${normalized || "song"}_user`;
}
