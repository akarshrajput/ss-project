"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAppUserProfile } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { addNotificationEmail, removeNotificationEmail } from "@/lib/notification-email-store";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email(),
});

async function requireAdminUser() {
  const user = await getUser();

  if (!user) {
    redirect("/login?next=/admin/notification-emails");
  }

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}

export async function addNotificationEmailAction(formData: FormData) {
  const user = await requireAdminUser();
  const emailInput = String(formData.get("email") ?? "").trim();
  
  const parsed = emailSchema.safeParse({ email: emailInput });
  if (!parsed.success) {
    redirect("/admin/notification-emails?error=Please enter a valid email address.");
  }

  await addNotificationEmail(parsed.data.email, user.email || user.id);
  revalidatePath("/admin/notification-emails");
  redirect("/admin/notification-emails?notice=Email added successfully.");
}

export async function removeNotificationEmailAction(formData: FormData) {
  await requireAdminUser();
  const emailInput = String(formData.get("email") ?? "").trim();
  
  if (!emailInput) {
    throw new Error("Invalid email");
  }

  await removeNotificationEmail(emailInput);
  revalidatePath("/admin/notification-emails");
}
