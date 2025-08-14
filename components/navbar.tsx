"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import MainMenu from "./main-menu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-background sticky top-0 z-50 border-b">
      <div className="px-5 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              priority
              className="w-16 h-auto"
            />
            <div className="flex flex-col leading-tight">
              <h1 className="text-base md:text-lg font-bold whitespace-nowrap">
                الهيئة الوطنية لأمراض الكلى
              </h1>
              <p className="text-xs md:text-sm tracking-wider text-muted-foreground">
                National Kidney Disease Authority
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block flex-1 px-10">
            <MainMenu />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md hover:bg-muted transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pb-4 border-t border-muted pt-4">
            <MainMenu onClick={() => setMobileOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
