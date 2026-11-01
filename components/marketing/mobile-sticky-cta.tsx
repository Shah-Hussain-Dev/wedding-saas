"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { landingCopy } from "@/config/landing-copy";

const FOOTER_CTA_SELECTOR = "[data-landing-footer-cta]";

export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.querySelector(FOOTER_CTA_SELECTOR);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { root: null, threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!visible || footerInView) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#073D31]/10 bg-[#FCFAF6]/95 backdrop-blur-md px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(7,61,49,0.12)] md:hidden"
      aria-hidden={false}
    >
      <Link
        href={landingCopy.primaryCtaHref}
        className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#073D31] text-xs font-bold uppercase tracking-wider text-[#F7F4ED] transition-transform active:scale-[0.98]"
      >
        {landingCopy.stickyCtaLabel}
      </Link>
    </div>
  );
}
