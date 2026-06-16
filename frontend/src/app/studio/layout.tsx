import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getAppUserProfile } from "@/lib/app-store";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (user) {
    const profile = await getAppUserProfile(user.id);
    if (profile && profile.isVerified === false) {
      redirect(`/verify-otp?userId=${encodeURIComponent(user.id)}&next=/studio`);
    }
  }

  return <>{children}</>;
}
