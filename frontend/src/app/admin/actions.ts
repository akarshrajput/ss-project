"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAppUserProfile, isComfyUiOnline, setAppUserRole, setComfyUiBaseUrl } from "@/lib/app-store";
import { getUser } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";
import { sendPromoOfferEmail } from "@/lib/notification-email-store";

const roleSchema = z.object({
  role: z.enum(["user", "admin"]),
});

async function requireAdminUser() {
  const user = await getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const profile = await getAppUserProfile(user.id);
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}

export async function saveComfyUiUrl(formData: FormData) {
  const user = await requireAdminUser();
  const comfyUiUrl = String(formData.get("comfyUiUrl") ?? "").trim();

  if (!comfyUiUrl) {
    redirect("/admin?error=Please enter a ComfyUI URL.");
  }

  try {
    new URL(comfyUiUrl);
  } catch {
    redirect("/admin?error=Please enter a valid absolute ComfyUI URL.");
  }

  await setComfyUiBaseUrl(comfyUiUrl, user.id);
  revalidatePath("/admin");
  revalidatePath("/studio");
  redirect("/admin?notice=ComfyUI URL saved.");
}

export async function testComfyUiUrl(formData: FormData) {
  await requireAdminUser();
  const comfyUiUrl = String(formData.get("comfyUiUrl") ?? "").trim();

  if (!comfyUiUrl) {
    redirect("/admin?error=Please enter a ComfyUI URL to test.");
  }

  try {
    new URL(comfyUiUrl);
  } catch {
    redirect("/admin?error=Please enter a valid absolute ComfyUI URL.");
  }

  const online = await isComfyUiOnline(comfyUiUrl);
  redirect(online ? "/admin?notice=ComfyUI server is running." : "/admin?error=ComfyUI server is off or unreachable.");
}

export async function saveUserRole(formData: FormData) {
  const currentUser = await requireAdminUser();
  const userId = String(formData.get("userId") ?? "").trim();
  const roleResult = roleSchema.safeParse({ role: String(formData.get("role") ?? "") });

  if (!userId || !roleResult.success) {
    redirect("/admin?error=Please choose a valid user and role.");
  }

  if (userId === currentUser.id && roleResult.data.role !== "admin") {
    redirect("/admin?error=You cannot remove your own admin role here.");
  }

  await setAppUserRole(userId, roleResult.data.role);
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin?notice=User role updated.");
}

export async function sendPromoOffer(formData: FormData) {
  await requireAdminUser();
  const email = String(formData.get("userEmail") ?? "").trim().toLowerCase();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!email) {
    redirect("/admin/promotional-offers?error=Please enter a target email.");
  }
  if (!subject) {
    redirect("/admin/promotional-offers?error=Please enter an email subject.");
  }
  if (!message) {
    redirect("/admin/promotional-offers?error=Please type a promotional message.");
  }

  try {
    const db = await getMongoDb();
    
    // Look up user by email to retrieve their userId if they exist
    const user = await db.collection("users").findOne({ email });
    const userId = user ? user.userId : "";

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const subscription = {
      userId: userId || "",
      email,
      plan: "24h-unlimited",
      stripeSessionId: "promo_" + email.replace(/[^a-zA-Z0-9]/g, "_") + "_" + now.getTime(),
      stripePaymentIntentId: null,
      amount: 0,
      currency: "usd",
      status: "active",
      startsAt: now,
      expiresAt,
      createdAt: now,
      isPromo: true,
    };

    // Insert the new active promo subscription
    await db.collection("subscriptions").insertOne(subscription);

    // Send the email with the custom message and subject
    await sendPromoOfferEmail(email, subject, message);
    
    revalidatePath("/admin/promotional-offers");
    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to send promo offer:", error);
    redirect(`/admin/promotional-offers?error=Failed to process promo offer: ${error instanceof Error ? error.message : String(error)}`);
  }

  redirect(`/admin/promotional-offers?notice=Promo offer email sent and 24h subscription started for ${email}`);
}