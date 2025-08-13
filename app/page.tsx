// app/page.tsx (Server Component)
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function Index() {
  redirect(`/${routing.defaultLocale}`);
}
