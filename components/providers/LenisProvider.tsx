"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

type LenisWindow = Window & { __lenis?: Lenis };

function getLenisWindow(): LenisWindow {
  return window as unknown as LenisWindow;
}

function clearLenisWindowRef() {
  if (typeof window === "undefined") return;
  delete getLenisWindow().__lenis;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  const disableLenis = pathname?.startsWith("/customize");

  useEffect(() => {
    if (disableLenis) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      clearLenisWindowRef();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove(
          "lenis",
          "lenis-smooth",
          "lenis-stopped",
          "lenis-scrolling"
        );
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }
      return;
    }

    let cancelled = false;
    let lenis: Lenis | null = null;

    const startLenis = () => {
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        allowNestedScroll: true,
      });

      lenisRef.current = lenis;
      if (typeof window !== "undefined") {
        getLenisWindow().__lenis = lenis;
      }

      function raf(time: number) {
        if (!lenis) return;
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }

      rafRef.current = requestAnimationFrame(raf);
    };

    const idle = window.requestIdleCallback?.(() => startLenis(), {
      timeout: 2200,
    });
    const fallback = window.setTimeout(startLenis, 2200);

    return () => {
      cancelled = true;
      if (idle !== undefined) {
        window.cancelIdleCallback?.(idle);
      }
      window.clearTimeout(fallback);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      clearLenisWindowRef();
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [disableLenis]);

  return <>{children}</>;
}
