"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { List, X, Sparkle, ArrowRight, Crown, MoonStars, FlowerLotus } from "@phosphor-icons/react";

const NAV_LINKS = [
  { href: "/templates", label: "Templates", hasMega: true },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const FEATURED_MEGA_TEMPLATES = [
  {
    id: "celestial-rose",
    name: "Celestial Rose Dreamscape",
    tag: "Awwwards 3D",
    desc: "Starlight terrace video & scratch stars",
    video: "/videos/royal-prestige.mp4",
  },
  {
    id: "imperial-palace",
    name: "Imperial Palace",
    tag: "Signature Royale",
    desc: "3D Monumental double palace doors",
    image: "/templates/imperial-palace/ballroom.jpg",
  },
  {
    id: "noor-e-nikah",
    name: "Noor-e-Nikah",
    tag: "Sacred Nikah",
    desc: "Embossed floral envelope & 24K gold",
    image: "/templates/noor-e-nikah/envelope-bg.jpg",
  },
];

export function GlassNav() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const diff = latest - previous;

    setScrolled(latest > 20);

    // Never hide if mobile drawer or mega menu is open
    if (isOpen || megaOpen) {
      setHidden(false);
      lastScrollY.current = latest;
      return;
    }

    // Always keep visible when near the top of the page
    if (latest < 40) {
      setHidden(false);
    } 
    // User scrolling down significantly -> hide navbar
    else if (diff > 6 && latest > 70) {
      setHidden(true);
    } 
    // User scrolling up even a bit -> reveal navbar smoothly
    else if (diff < -5) {
      setHidden(false);
    }

    lastScrollY.current = latest;
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{
          y: hidden ? -90 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onMouseLeave={() => setMegaOpen(false)}
        className={`fixed top-3 sm:top-5 left-1/2 z-50 w-[95%] max-w-6xl -translate-x-1/2 rounded-full border px-5 sm:px-7 py-2.5 sm:py-3 backdrop-blur-xl transition-all duration-300 flex items-center justify-between shadow-[0_10px_30px_rgba(7,61,49,0.06)] ${
          hidden ? "pointer-events-none" : "pointer-events-auto"
        } ${
          scrolled
            ? "bg-[#FCFAF6]/95 border-[#073D31]/15 shadow-[0_15px_35px_rgba(7,61,49,0.12)] py-2 sm:py-2.5"
            : "bg-[#FCFAF6]/85 border-[#073D31]/10"
        }`}
      >
        {/* Brand Monogram */}
        <Link
          href="/"
          className="font-serif text-xl sm:text-2xl font-bold text-[#073D31] tracking-tight flex items-center gap-1.5 cursor-pointer shrink-0 mr-4"
        >
          <span>wedinvites</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A45E]" />
        </Link>

        {/* Desktop Links with .roll effect */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-6 whitespace-nowrap">
          {NAV_LINKS.map((link) => (
            <div
              key={link.href}
              onMouseEnter={() => link.hasMega && setMegaOpen(true)}
              className="relative py-1"
            >
              <Link
                href={link.href}
                className="group text-[11px] xl:text-xs font-semibold text-stone-600 hover:text-[#073D31] transition-colors uppercase tracking-wider font-sans block cursor-pointer"
              >
                <span className="roll">
                  <span className="roll__a">{link.label}</span>
                  <span className="roll__b" aria-hidden="true">{link.label}</span>
                </span>
              </Link>
            </div>
          ))}

          {session ? (
            <div className="flex items-center gap-3 pl-3 border-l border-stone-300/80">
              <Link
                href="/dashboard"
                className="group text-[11px] xl:text-xs font-semibold text-[#073D31] hover:text-[#032A23] transition-colors uppercase tracking-wider font-sans cursor-pointer"
              >
                <span className="roll">
                  <span className="roll__a">Dashboard</span>
                  <span className="roll__b" aria-hidden="true">Dashboard</span>
                </span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="group text-[11px] xl:text-xs font-semibold text-stone-400 hover:text-rose-600 transition-colors uppercase tracking-wider font-sans cursor-pointer"
              >
                <span className="roll">
                  <span className="roll__a">Logout</span>
                  <span className="roll__b" aria-hidden="true">Logout</span>
                </span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="group text-[11px] xl:text-xs font-semibold text-stone-600 hover:text-[#073D31] transition-colors uppercase tracking-wider font-sans cursor-pointer pl-3 border-l border-stone-300/80"
            >
              <span className="roll">
                <span className="roll__a">Login</span>
                <span className="roll__b" aria-hidden="true">Login</span>
              </span>
            </Link>
          )}
        </div>

        {/* Primary CTA */}
        <div className="hidden lg:flex items-center shrink-0 ml-3">
          <Link
            href="/templates"
            className="group whitespace-nowrap px-5 py-2.5 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-[11px] xl:text-xs font-bold font-sans uppercase tracking-wider transition-all shadow-xs hover:shadow-md hover:scale-105 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Create Invitation</span>
            <ArrowRight size={13} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden w-11 h-11 flex items-center justify-center text-[#073D31] rounded-full hover:bg-black/5 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#073D31]"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>

        {/* Desktop Mega Menu Dropdown */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
              className="absolute top-14 left-1/2 -translate-x-1/2 w-[720px] rounded-3xl bg-[#FCFAF6] border border-[#073D31]/15 shadow-2xl p-6 grid grid-cols-3 gap-4"
            >
              {FEATURED_MEGA_TEMPLATES.map((item) => (
                <Link
                  key={item.id}
                  href={`/preview/${item.id}`}
                  onClick={() => setMegaOpen(false)}
                  className="group block rounded-2xl overflow-hidden bg-stone-900 border border-black/5 p-2 shadow-sm hover:border-[#C8A45E]/60 transition-all cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mb-2">
                    {item.video ? (
                      <video
                        src={item.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover brightness-[0.9] group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-cover bg-center brightness-[0.9] group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[8px] font-bold tracking-wider text-[#E1C98E] uppercase">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="font-serif text-xs font-bold text-white group-hover:text-[#E1C98E] transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 font-sans line-clamp-1 mt-0.5">
                    {item.desc}
                  </p>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-18 left-4 right-4 rounded-3xl border border-[#073D31]/15 bg-[#FCFAF6] p-6 shadow-2xl flex flex-col gap-1"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium py-3 border-b border-[#073D31]/8 text-[#18211E] hover:text-[#073D31] flex items-center justify-between transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowRight size={14} className="text-[#C8A45E]" />
                </Link>
              ))}

              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium py-3 border-b border-[#073D31]/8 text-[#18211E]"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/login" });
                      setIsOpen(false);
                    }}
                    className="text-left text-base font-medium py-3 text-rose-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium py-3 text-[#18211E]"
                >
                  Login
                </Link>
              )}

              <Link
                href="/templates"
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full py-3.5 rounded-full bg-[#073D31] text-[#F7F4ED] text-xs font-bold uppercase tracking-wider font-sans flex items-center justify-center gap-2 shadow-md"
              >
                <span>Create Invitation</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
