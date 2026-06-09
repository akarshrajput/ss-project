import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAppUserProfile } from "@/lib/app-store";

export default async function PaymentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const profile = await getAppUserProfile(user.id);
    if (profile && profile.isVerified === false) {
      redirect(`/verify-otp?userId=${encodeURIComponent(user.id)}&next=/payment`);
    }
  }

  return <>{children}</>;
}
