import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Register",
  description: "Public registration is disabled on Songify.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  redirect("/login?notice=Public+registration+is+disabled&next=/admin");
}
