"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAppUserProfile, setAppUserRole, AppUserRole } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { getSubscriptionHistory } from "@/lib/subscription-store";

export async function updateUserRole(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/login?next=/admin/users");
  }

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const targetUserId = formData.get("userId") as string;
  const newRole = formData.get("role") as AppUserRole;

  if (!targetUserId || !newRole || !["admin", "user"].includes(newRole)) {
    throw new Error("Invalid input");
  }

  // Optional: Prevent an admin from demoting themselves (failsafe)
  if (targetUserId === user.id && newRole !== "admin") {
    throw new Error("You cannot demote yourself.");
  }

  await setAppUserRole(targetUserId, newRole);

  revalidatePath("/admin/users");
}

export async function deleteAppUser(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/login?next=/admin/users");
  }

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const targetUserId = formData.get("userId") as string;
  if (!targetUserId) {
    throw new Error("Invalid input");
  }

  if (targetUserId === user.id) {
    throw new Error("You cannot delete yourself.");
  }

  // Delete from MongoDB
  const { getMongoDb } = await import("@/lib/mongodb");
  const db = await getMongoDb();
  
  await db.collection("users").deleteOne({ userId: targetUserId });
  await db.collection("email_otps").deleteMany({ userId: targetUserId });
  // Also delete their songs and subscriptions to clean up
  await db.collection("subscriptions").deleteMany({ userId: targetUserId });
  await db.collection("song_queue").deleteMany({ userId: targetUserId });
  
  revalidatePath("/admin/users");
}

export async function fetchUserSubscriptionHistory(targetUserId: string) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  if (!targetUserId) {
    throw new Error("Invalid user ID");
  }

  const history = await getSubscriptionHistory(targetUserId);
  
  return history.map(sub => ({
    plan: sub.plan,
    status: sub.status,
    amount: sub.amount,
    currency: sub.currency,
    startsAt: sub.startsAt.toISOString(),
    expiresAt: sub.expiresAt.toISOString(),
    createdAt: sub.createdAt.toISOString(),
  }));
}
