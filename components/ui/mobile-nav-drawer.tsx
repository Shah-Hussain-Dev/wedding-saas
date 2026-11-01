"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  House,
  Sparkle,
  ArrowRight,
  BookOpen,
  Tag,
  Scales,
  Eye,
  FlowerLotus,
  ChatCircleDots,
  UserCircle,
  SquaresFour,
  SignOut,
} from "@phosphor-icons/react";
import { siteConfig } from "@/config/site";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  session?: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } | null;
  } | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; weight?: "regular" | "bold" | "fill" | "duotone"; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: House,
  },
  {
    href: "/templates",
    label: "Templates",
    icon: Sparkle,
  },
  {
    href: "/#how-it-works",
    label: "How It Works",
    icon: BookOpen,
  },
  {
    href: "/#lookbook",
    label: "Collections",
    icon: Eye,
  },
  {
    href: "/#pricing",
    label: "Pricing",
    icon: Tag,
  },
  {
    href: "/#comparison",
    label: "Compare",
    icon: Scales,
  },
  {
    href: "/about",
    label: "About",
    icon: FlowerLotus,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: ChatCircleDots,
  },
];

export function MobileNavDrawer({ isOpen, onClose, session }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close drawer ONLY when route actually changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Smooth scroll handler for anchor links
  const handleNavClick = useCallback(
    (href: string) => {
      onClose();
      if (href === "/" && pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (href.startsWith("/#") && pathname === "/") {
        const id = href.replace("/#", "");
        const elem = document.getElementById(id);
        if (elem) {
          setTimeout(() => {
            elem.scrollIntoView({ behavior: "smooth" });
          }, 180);
        }
      }
    },
    [pathname, onClose]
  );

  const isActiveLink = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href === "/templates" && pathname.startsWith("/templates")) return true;
    if (href === "/about" && pathname === "/about") return true;
    if (href === "/contact" && pathname === "/contact") return true;
    return false;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-nav-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={onClose}
          className="fixed inset-0 z-[99] bg-stone-950/65 backdrop-blur-md lg:hidden"
          aria-hidden="true"
        />
      )}
      {isOpen && (
        <motion.aside
          key="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            type: "spring",
            damping: 32,
            stiffness: 300,
            mass: 0.85,
          }}
          onClick={(e) => e.stopPropagation()}
          className="fixed top-0 right-0 bottom-0 z-[100] w-[85vw] max-w-[360px] h-[100dvh] flex flex-col bg-[#FCFBF7] text-[#18211E] shadow-[-24px_0_60px_rgba(7,61,49,0.22)] rounded-l-[28px] sm:rounded-l-[32px] border-l border-t border-b border-[#073D31]/15 lg:hidden overflow-hidden"
          data-lenis-prevent="true"
        >
          {/* Top Specular Edge Highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 z-20" />

          {/* DRAWER HEADER */}
          <div className="shrink-0 px-5 py-4 border-b border-[#073D31]/10 bg-white/75 backdrop-blur-xl flex items-center justify-between gap-3 relative z-10">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2 group cursor-pointer"
              aria-label={`${siteConfig.name} Home`}
            >
              <Image
                src={siteConfig.assets.logo}
                alt={siteConfig.name}
                width={130}
                height={40}
                priority
                className="h-8 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </Link>

            {/* Close Button - compact size */}
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-white/90 border border-[#073D31]/15 text-[#073D31] flex items-center justify-center hover:bg-[#073D31]/10 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#073D31]"
              aria-label="Close navigation menu"
            >
              <X size={15} weight="bold" />
            </button>
          </div>

          {/* SCROLLABLE MENUS ONLY */}
          <div
            data-lenis-prevent="true"
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-1.5 scrollbar-none"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActiveLink(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`group min-h-[50px] px-3.5 py-3 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    active
                      ? "bg-[#073D31] text-[#F7F4ED] shadow-md shadow-[#073D31]/15"
                      : "text-[#18211E] hover:bg-white/80 active:bg-stone-200/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        active
                          ? "bg-white/15 text-[#E1C98E]"
                          : "bg-[#073D31]/[0.06] text-[#073D31] group-hover:bg-[#073D31]/10"
                      }`}
                    >
                      <Icon size={19} weight={active ? "fill" : "duotone"} />
                    </div>
                    <span
                      className={`text-base font-semibold tracking-tight ${
                        active ? "text-white" : "text-[#18211E]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <ArrowRight
                    size={16}
                    weight="bold"
                    className={`transition-transform group-hover:translate-x-0.5 ${
                      active ? "text-[#E1C98E]" : "text-stone-300 group-hover:text-[#073D31]"
                    }`}
                  />
                </Link>
              );
            })}

            {/* DIVIDER */}
            <div className="my-2 border-t border-[#073D31]/10" />

            {/* AUTH / ACCOUNT MENU LINKS */}
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="group min-h-[50px] px-3.5 py-3 rounded-2xl flex items-center justify-between gap-3 text-[#18211E] hover:bg-white/80 active:bg-stone-200/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#073D31]/[0.06] text-[#073D31] flex items-center justify-center shrink-0">
                      <SquaresFour size={19} weight="duotone" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-base font-semibold tracking-tight text-[#18211E]">
                        Dashboard
                      </span>
                      <span className="text-[11px] text-stone-500 truncate font-sans">
                        {session.user?.name || session.user?.email || "My Account"}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} weight="bold" className="text-stone-300 group-hover:text-[#073D31] transition-transform group-hover:translate-x-0.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    signOut({ callbackUrl: "/login" });
                    onClose();
                  }}
                  className="w-full group min-h-[50px] px-3.5 py-3 rounded-2xl flex items-center justify-between gap-3 text-rose-700 hover:bg-rose-50/70 active:bg-rose-100/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center shrink-0">
                      <SignOut size={19} weight="bold" />
                    </div>
                    <span className="text-base font-semibold tracking-tight">
                      Logout
                    </span>
                  </div>
                  <ArrowRight size={16} weight="bold" className="text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="group min-h-[50px] px-3.5 py-3 rounded-2xl flex items-center justify-between gap-3 text-[#18211E] hover:bg-white/80 active:bg-stone-200/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#073D31]/[0.06] text-[#073D31] flex items-center justify-center shrink-0">
                    <UserCircle size={19} weight="duotone" />
                  </div>
                  <span className="text-base font-semibold tracking-tight">
                    Login / Sign In
                  </span>
                </div>
                <ArrowRight size={16} weight="bold" className="text-stone-300 group-hover:text-[#073D31] transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* STICKY DRAWER FOOTER: PRIMARY ACTION ONLY */}
          <div className="shrink-0 px-5 py-4 border-t border-[#073D31]/10 bg-white/90 backdrop-blur-xl flex flex-col gap-2.5 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(7,61,49,0.06)] relative z-10">
            <Link
              href="/templates"
              onClick={onClose}
              className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold uppercase tracking-wider font-sans flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(7,61,49,0.28),inset_0_1px_1px_rgba(255,255,255,0.35)] active:scale-[0.98] transition-all cursor-pointer border border-[#073D31]/20"
            >
              <span>Create Invitation</span>
              <ArrowRight size={15} weight="bold" />
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
