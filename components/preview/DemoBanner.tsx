"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { RazorpayCheckoutButton } from "@/components/payment/RazorpayCheckoutButton";
import { useTemplatePricing } from "@/lib/hooks/use-template-pricing";
import {
  Clock,
  Sparkle,
  PencilSimple,
  CheckCircle,
  CaretDown,
  CaretUp,
  User,
  House,
} from "@phosphor-icons/react";

interface DemoBannerProps {
  invitationId?: string;
  slug: string;
  templateId: string;
  templateName?: string;
  brideName?: string;
  groomName?: string;
  amountPaise?: number;
  isPublished?: boolean;
  isPaid?: boolean;
  expiresInSeconds?: number;
  isHeroTapped?: boolean;
}

export function DemoBanner({
  invitationId = "demo-inv",
  slug,
  templateId,
  templateName = "Royal Wedding Invitation",
  brideName,
  groomName,
  amountPaise,
  isPublished = false,
  isPaid = false,
  expiresInSeconds = 900,
  isHeroTapped = false,
}: DemoBannerProps) {
  const { data: session } = useSession();
  const { getPriceFormatted, getPriceNumber } = useTemplatePricing();
  
  const dynamicPriceInr = getPriceNumber(templateId, 1199);
  const dynamicPriceFormatted = getPriceFormatted(templateId, `₹${dynamicPriceInr.toLocaleString("en-IN")}`);
  const effectiveAmountPaise = dynamicPriceInr * 100;

  const nameParts = (templateName || "").split("&").map(s => s.trim());
  const effectiveBrideName = brideName || nameParts[0] || "Bride";
  const effectiveGroomName = groomName || nameParts[1] || "Groom";

  // Check if paid in local storage or via verified payment props
  const checkIsUnlocked = () => {
    if (isPaid) return true;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`unfold_invitation_${slug}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.isPaid === true || parsed.order?.status === "paid" || parsed.orderStatus === "paid") {
            return true;
          }
        }
      } catch (_) {}
    }
    return false;
  };

  const [timeLeft, setTimeLeft] = useState(expiresInSeconds);
  const [isUnlocked, setIsUnlocked] = useState(checkIsUnlocked);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    setIsUnlocked(checkIsUnlocked());
  }, [isPaid, slug]);

  useEffect(() => {
    if (isUnlocked) return;

    const storageKey = `unfold_demo_timer_${slug || templateId || "demo"}`;
    const now = Math.floor(Date.now() / 1000);
    const storedStart = typeof window !== "undefined" ? sessionStorage.getItem(storageKey) : null;

    let startTime = storedStart ? parseInt(storedStart, 10) : NaN;
    if (isNaN(startTime) || now - startTime >= expiresInSeconds || startTime > now) {
      startTime = now;
      if (typeof window !== "undefined") {
        sessionStorage.setItem(storageKey, String(now));
      }
    }

    const calculateRemaining = () => {
      const currentNow = Math.floor(Date.now() / 1000);
      const elapsed = currentNow - startTime;
      const remaining = Math.max(0, expiresInSeconds - elapsed);
      if (remaining <= 0) {
        startTime = Math.floor(Date.now() / 1000);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(storageKey, String(startTime));
        }
        return expiresInSeconds;
      }
      return remaining;
    };

    setTimeLeft(calculateRemaining());

    const timer = setInterval(() => {
      setTimeLeft(calculateRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [slug, templateId, isUnlocked, expiresInSeconds]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleUnlockSuccess = (liveUrl: string) => {
    setIsUnlocked(true);
  };

  // If already unlocked / published, render sleek top live status bar and NEVER show payment button again
  if (isUnlocked) {
    return (
      <div className="fixed top-2.5 inset-x-3 sm:inset-x-auto sm:left-6 sm:top-4 sm:translate-x-0 z-[999] flex items-center justify-between sm:justify-start gap-3 bg-stone-950/85 text-white backdrop-blur-xl border border-emerald-400/40 px-4 py-1.5 rounded-full shadow-2xl animate-fade-in pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" weight="fill" />
          <span className="text-[11px] font-semibold text-emerald-200">Live Website Active</span>
        </div>

        <span className="text-white/20 text-xs">|</span>

        <Link
          href={`/customize/${templateId}?slug=${slug}`}
          className="flex items-center gap-1 text-[11px] font-semibold text-stone-300 hover:text-amber-300 transition-colors"
        >
          <PencilSimple className="h-3.5 w-3.5" />
          <span>Edit Details</span>
        </Link>

        <span className="text-white/20 text-xs">|</span>

        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <House className="h-3.5 w-3.5" weight="bold" />
          <span>Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      {/* ── Top Ultra-Compact Demo Badge & Timer (Left on desktop with space for music button, Centered on mobile) ── */}
      <div
        className={`absolute inset-x-2 sm:inset-x-auto sm:left-20 sm:translate-x-0 ${isHeroTapped ? "hidden" : "flex"} items-center justify-center sm:justify-start pointer-events-none transition-all duration-300`}
        style={{ top: "max(10px, env(safe-area-inset-top, 10px))" }}
      >
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-stone-950/85 hover:bg-stone-950 text-white backdrop-blur-md border border-amber-400/30 px-2.5 sm:px-3 py-1 rounded-full shadow-lg transition-all">
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider text-amber-300 whitespace-nowrap">
            Live Demo · {dynamicPriceFormatted}
          </span>

          <span className="text-white/20 text-xs">|</span>

          {/* Countdown timer */}
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-stone-200">
            <Clock className="h-3 w-3 text-amber-400" />
            <span>{formattedTime}</span>
          </div>

          <span className="text-white/20 text-xs">|</span>

          {/* Edit Details Link */}
          <Link
            href={`/customize/${templateId}?slug=${slug}`}
            className="flex items-center gap-0.5 text-[10px] font-bold text-stone-300 hover:text-amber-300 transition-colors"
          >
            <PencilSimple className="h-3 w-3" />
            <span>Edit</span>
          </Link>

          <span className="text-white/20 text-xs">|</span>

          {/* Login / Dashboard Link based on session */}
          {session?.user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <User className="h-3 w-3" weight="bold" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 hover:text-amber-200 transition-colors"
            >
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Bottom Clean & Simple Floating Unlock CTA ── */}
      <div
        className={`fixed bottom-3.5 left-3.5 right-[68px] sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-auto z-[990] ${isHeroTapped ? "hidden" : "flex"} items-center justify-center pointer-events-none transition-all duration-300`}
        style={{ bottom: "max(14px, env(safe-area-inset-bottom, 14px))" }}
      >
        <div className="pointer-events-auto w-full sm:w-auto">
          <RazorpayCheckoutButton
            invitationId={invitationId}
            slug={slug}
            templateId={templateId}
            brideName={effectiveBrideName}
            groomName={effectiveGroomName}
            amount={dynamicPriceInr}
            amountPaise={effectiveAmountPaise}
            buttonText={`Unlock Website · ${dynamicPriceFormatted}`}
            className="!w-full sm:!w-auto !py-2.5 sm:!py-3 !px-5 sm:!px-7 !text-xs sm:!text-sm !rounded-full !shadow-[0_10px_30px_rgba(245,158,11,0.35)] !border !border-amber-300/40 font-bold tracking-wide active:scale-98 transition-transform whitespace-nowrap"
            onSuccess={handleUnlockSuccess}
          />
        </div>
      </div>
    </div>
  );
}
