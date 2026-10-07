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
  amountPaise?: number;
  isPublished?: boolean;
  expiresInSeconds?: number;
}

export function DemoBanner({
  invitationId = "demo-inv",
  slug,
  templateId,
  templateName = "Royal Wedding Invitation",
  amountPaise,
  isPublished = false,
  expiresInSeconds = 900,
}: DemoBannerProps) {
  const { data: session } = useSession();
  const { getPriceFormatted, getPriceNumber } = useTemplatePricing();
  
  const dynamicPriceInr = getPriceNumber(templateId, 1199);
  const dynamicPriceFormatted = getPriceFormatted(templateId, "₹1,199");
  const effectiveAmountPaise = amountPaise !== undefined && amountPaise !== 149900
    ? amountPaise
    : dynamicPriceInr * 100;

  const [timeLeft, setTimeLeft] = useState(expiresInSeconds);
  const [isUnlocked, setIsUnlocked] = useState(isPublished);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    setIsUnlocked(isPublished);
  }, [isPublished]);

  useEffect(() => {
    if (isUnlocked) return;

    const storageKey = `unfold_demo_timer_${slug}`;
    const storedStart = sessionStorage.getItem(storageKey);
    const now = Math.floor(Date.now() / 1000);

    let startTime = now;
    if (storedStart) {
      startTime = parseInt(storedStart, 10);
    } else {
      sessionStorage.setItem(storageKey, String(now));
    }

    const elapsed = now - startTime;
    const remaining = Math.max(0, expiresInSeconds - elapsed);
    setTimeLeft(remaining);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [slug, isUnlocked, expiresInSeconds]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleUnlockSuccess = (liveUrl: string) => {
    setIsUnlocked(true);
  };

  // If already unlocked / published, render sleek top live status bar and NEVER show payment button again
  if (isUnlocked) {
    return (
      <div className="fixed top-2.5 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[999] flex items-center justify-between sm:justify-center gap-3 bg-stone-950/85 text-white backdrop-blur-xl border border-emerald-400/40 px-4 py-1.5 rounded-full shadow-2xl animate-fade-in pointer-events-auto">
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
      {/* ── Top Ultra-Compact Demo Badge & Timer (Non-blocking) ── */}
      <div className="absolute top-2 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center">
        <div className="pointer-events-auto flex items-center gap-2 bg-stone-950/80 hover:bg-stone-950 text-white backdrop-blur-md border border-amber-400/30 px-3 py-1 rounded-full shadow-lg transition-all">
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider text-amber-300">
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

      {/* ── Bottom Floating Sleek Unlock Pill / Bar (Only in unpaid demo) ── */}
      <div className="absolute bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 flex flex-col items-center">
        {isMinimized ? (
          /* Minimized Compact Floating Unlock Pill */
          <div className="pointer-events-auto flex items-center gap-2 bg-stone-950/90 backdrop-blur-xl border border-amber-400/40 px-3 py-1.5 rounded-full shadow-2xl animate-fade-in hover:scale-105 transition-all">
            <button
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 text-[10px] font-bold uppercase tracking-wider pr-1"
            >
              <Sparkle className="h-3.5 w-3.5 text-amber-400 animate-pulse" weight="fill" />
              <span>Details</span>
              <CaretUp className="h-3 w-3" />
            </button>

            <span className="text-white/20 text-xs">|</span>

            <RazorpayCheckoutButton
              invitationId={invitationId}
              slug={slug}
              templateId={templateId}
              amountPaise={effectiveAmountPaise}
              buttonText={`Unlock Website (${dynamicPriceFormatted})`}
              className="!py-1.5 !px-3.5 !text-[11px] !rounded-full !shadow-md"
              onSuccess={handleUnlockSuccess}
            />
          </div>
        ) : (
          /* Expanded Card */
          <div className="pointer-events-auto w-full max-w-md bg-stone-950/95 backdrop-blur-2xl border border-amber-400/40 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-3 animate-fade-in">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Sparkle className="h-4 w-4 text-amber-300" weight="fill" />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-white leading-tight">
                    Love your customized invitation?
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    Unlock permanent website link, guest RSVPs &amp; WhatsApp sharing.
                  </p>
                </div>
              </div>

              {/* Minimize button */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Minimize banner"
              >
                <CaretDown className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <span className="text-[10px] text-stone-400 font-mono">
                One-time: <strong className="text-white">{dynamicPriceFormatted}</strong>
              </span>

              <RazorpayCheckoutButton
                invitationId={invitationId}
                slug={slug}
                templateId={templateId}
                amountPaise={effectiveAmountPaise}
                buttonText={`Unlock Website Now (${dynamicPriceFormatted})`}
                className="!py-2 !px-4 !text-xs !rounded-xl !shadow-lg"
                onSuccess={handleUnlockSuccess}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
