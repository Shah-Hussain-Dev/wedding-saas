"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

function clearLenisWindowRef() {
  if (typeof window === "undefined") return;
  delete (window as Window & { __lenis?: Lenis; lenis?: Lenis }).__lenis;
  delete (window as Window & { __lenis?: Lenis; lenis?: Lenis }).lenis;
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
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      allowNestedScroll: true,
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as Window & { __lenis?: Lenis; lenis?: Lenis }).__lenis = lenis;
      (window as Window & { __lenis?: Lenis; lenis?: Lenis }).lenis = lenis;
    }

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      clearLenisWindowRef();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [disableLenis]);

  return <>{children}</>;
}
