"use client";

import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { Calendar } from "lucide-react";
import React from "react";
import { LanguageSwitcher } from "./land-switcher";
import { useLocale } from "next-intl";

const TopBar = () => {
  const lang = useLocale();
  return (
    <header className="w-full bg-primary border-b-3 border-rose-500 text-sm">
      <div className="px-5 lg:px-10 flex items-center justify-between text-primary-foreground h-16">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <p>
            {format(new Date(), "MMMM dd, yyyy hh:mm a", {
              locale: lang === "ar" ? arSA : enUS,
            })}
          </p>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default TopBar;
