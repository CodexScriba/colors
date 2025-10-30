"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Palette } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavLinks } from "./navbar/nav-links";
import { SearchBar } from "./navbar/search-bar";
import { AuthButtons } from "./navbar/auth-buttons";
import { ThemeToggle } from "./navbar/theme-toggle";
import { LanguageSwitcher } from "./navbar/language-switcher";
import { MobileMenu } from "./navbar/mobile-menu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.header
      className={cn(
        "fixed top-4 left-1/2 z-50 transition-all duration-300",
        isScrolled && "top-0"
      )}
      initial={false}
      animate={{
        x: "-50%",
        width: isScrolled ? "100%" : "calc(100% - 2rem)",
        maxWidth: isScrolled ? "100%" : "1280px",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <motion.nav
        className={cn(
          "flex items-center justify-between gap-4 border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "transition-all duration-300",
          isScrolled ? "rounded-none shadow-sm" : "rounded-full shadow-md"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold transition-colors hover:text-primary"
        >
          <Palette className="h-6 w-6" />
          <span className="hidden sm:inline-block">Colors</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <NavLinks />
        </div>

        {/* Search Bar - Hidden on small screens */}
        <div className="hidden flex-1 justify-center lg:flex">
          <SearchBar className="max-w-md" />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex">
            <AuthButtons />
          </div>

          {/* Theme & Language Toggles - Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </motion.nav>

      {/* Mobile Search Bar - Below navbar on small screens */}
      <motion.div
        className={cn(
          "mt-2 px-4 lg:hidden",
          isScrolled && "px-4"
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar />
      </motion.div>
    </motion.header>
  );
}
