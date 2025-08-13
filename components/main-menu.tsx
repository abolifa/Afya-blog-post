"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

type MenuItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

function isExternal(href: string) {
  return /^(https?:)?\/\//i.test(href) || /^(mailto:|tel:)/i.test(href);
}

function withLocale(href: string, locale: string) {
  if (!href) return href;
  if (isExternal(href) || href.startsWith("#")) return href;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) return href;
  const path = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${path}`;
}

export default function MainMenu({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  const locale = useLocale();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["awareness"],
    queryFn: async () => {
      const res = await api.get(`/awareness`);
      return res.data as { id: number; title: string }[];
    },
  });

  const awarenessChildren: { label: string; href: string }[] = isLoading
    ? [{ label: "جار التحميل...", href: "#" }]
    : isError
    ? [{ label: "تعذر التحميل", href: "#" }]
    : (data?.length ?? 0) > 0
    ? (data ?? []).map((item) => ({
        label: item.title,
        href: `/awareness/${item.id}`,
      }))
    : [{ label: "لا توجد بيانات", href: "#" }];

  const menuItems: MenuItem[] = [
    { label: "الرئيسية", href: "/" },
    { label: "من نحن", href: "/about" },
    { label: "التوعية الصحية", children: awarenessChildren },
    { label: "الخريطة التفاعلية", href: "/map" },
    {
      label: "تواصل معنا",
      children: [
        { label: "اتصل بنا", href: "/contact/phone" },
        { label: "البريد الإلكتروني", href: "/contact/email" },
      ],
    },
    { label: "البوابة الإلكترونية", href: "https://portal.romuz.com.ly" },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    const target = withLocale(href, locale);
    return pathname === target;
  };

  return (
    <nav className="flex flex-col md:flex-row gap-4 md:gap-6">
      {menuItems.map((item) =>
        item.children ? (
          <DropdownMenu key={item.label} dir="rtl">
            <DropdownMenuTrigger
              className={clsx(
                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary focus:outline-none",
                item.children.some((child) => isActive(child.href))
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" sideOffset={8} className="w-56">
              {item.children.map((child) => {
                const href = withLocale(child.href, locale);
                const external = isExternal(href);
                const placeholder = href === "#";
                return (
                  <DropdownMenuItem
                    key={child.label}
                    asChild={!placeholder}
                    disabled={placeholder}
                  >
                    {placeholder ? (
                      <div className="flex items-center gap-2 opacity-70 cursor-not-allowed">
                        <span className="font-bold">-</span>
                        <span>{child.label}</span>
                      </div>
                    ) : (
                      <Link
                        href={href}
                        onClick={onClick}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-2"
                      >
                        <span className="font-bold">-</span>
                        <span>{child.label}</span>
                      </Link>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          (() => {
            const href = withLocale(item.href!, locale);
            const external = isExternal(href);
            return (
              <Link
                key={item.label}
                href={href}
                onClick={onClick}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })()
        )
      )}
    </nav>
  );
}
