"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const current = useLocale(); // "ar" | "en"

  return (
    <div className="flex items-center gap-2">
      <Link
        href={pathname}
        locale="ar"
        aria-pressed={current === "ar"}
        className="flex items-center gap-2"
      >
        <Image
          src="/flags/ar.png"
          alt="Arabic"
          className="w-4 h-4"
          height={20}
          width={20}
          unoptimized
          priority
        />
        <div>العربية</div>
      </Link>
      <div className="border-l h-4" />
      <Link
        href={pathname}
        locale="en"
        aria-pressed={current === "en"}
        className="flex items-center gap-2"
      >
        <Image
          src="/flags/en.png"
          alt="English"
          className="w-4 h-4"
          height={20}
          width={20}
          unoptimized
          priority
        />
        <div>English</div>
      </Link>
    </div>
  );
}
