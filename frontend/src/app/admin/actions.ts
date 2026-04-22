"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAppUserProfile, isComfyUiOnline, setAppUserRole, setComfyUiBaseUrl } from "@/lib/app-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const roleSchema = z.object({
  role: z.enum(["user", "admin"]),
});

async function requireAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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