"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { PremiumButton } from "./premium-button";

const NAV_LINKS = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/templates", label: "Templates" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function GlassNav() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-4 md:top-5 left-1/2 z-40 w-[92%] max-w-5xl -translate-x-1/2 rounded-full border px-4 sm:px-6 py-3 backdrop-blur-xl transition-all duration-300 flex items-center justify-between shadow-[0_10px_30px_rgba(7,61,49,0.06)] ${
          scrolled
            ? "bg-[#FCFAF6]/90 border-[#073D31]/15 shadow-[0_15px_35px_rgba(7,61,49,0.1)] py-2.5"
            : "bg-[#FCFAF6]/75 border-[#073D31]/8"
        }`}
      >
        <Link href="/" className="font-serif text-2xl font-bold text-[#073D31] lowercase tracking-tight flex items-center gap-1.5">
          <span>unfold</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A45E]" />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-stone-600 hover:text-[#073D31] transition-colors uppercase tracking-wider font-sans"
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <>
              <Link href="/dashboard" className="text-xs font-semibold text-stone-600 hover:text-[#073D31] transition-colors uppercase tracking-wider font-sans">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs font-semibold text-stone-600 hover:text-[#073D31] transition-colors uppercase tracking-wider font-sans cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-xs font-semibold text-stone-600 hover:text-[#073D31] transition-colors uppercase tracking-wider font-sans">
              Login
            </Link>
          )}
        </div>

        <div className="hidden lg:block">
          <Link
            href="/templates"
            className="px-5 py-2 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold font-sans uppercase tracking-wider transition-all shadow-xs hover:shadow-md hover:scale-105"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-1.5 text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} weight="light" /> : <List size={22} weight="light" />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-20 left-4 right-4 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-2xl flex flex-col gap-1"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium py-3 border-b border-black/[0.04] text-stone-700 hover:text-accent-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-base font-medium py-3 border-b border-black/[0.04]">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: "/login" }); setIsOpen(false); }}
                    className="text-left text-base font-medium py-3"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="text-base font-medium py-3">
                  Login
                </Link>
              )}
              <Link href="/templates" onClick={() => setIsOpen(false)} className="mt-4">
                <PremiumButton className="w-full justify-center">Get Started</PremiumButton>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
