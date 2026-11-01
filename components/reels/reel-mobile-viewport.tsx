"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { REEL_LOGICAL_WIDTH_PX } from "@/components/reels/reel-playback-context";

interface ReelMobileViewportProps {
  scrollRootRef: React.RefObject<HTMLDivElement | null>;
  children: ReactNode;
  onFrameHeightChange?: (height: number) => void;
}

/** Renders children at 390px logical width, scaled to fit the phone frame (mobile preview fidelity). */
export function ReelMobileViewport({
  scrollRootRef,
  children,
  onFrameHeightChange,
}: ReelMobileViewportProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [beatHeight, setBeatHeight] = useState(640);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setScale(w > 0 ? w / REEL_LOGICAL_WIDTH_PX : 1);
      if (h > 0) {
        setBeatHeight(h);
        onFrameHeightChange?.(h);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onFrameHeightChange]);

  const logicalHeightPx =
    scale > 0 && beatHeight > 0 ? Math.ceil(beatHeight / scale) : beatHeight;

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;
    const blockScroll = (e: Event) => {
      e.preventDefault();
    };
    root.addEventListener("wheel", blockScroll, { passive: false });
    root.addEventListener("touchmove", blockScroll, { passive: false });
    return () => {
      root.removeEventListener("wheel", blockScroll);
      root.removeEventListener("touchmove", blockScroll);
    };
  }, [scrollRootRef]);

  return (
    <div ref={frameRef} className="absolute inset-0 overflow-hidden bg-[#102A43]">
      <div
        className="origin-top-left will-change-transform"
        style={{
          width: REEL_LOGICAL_WIDTH_PX,
          transform: `scale(${scale})`,
          height: logicalHeightPx,
        }}
      >
        <div
          ref={scrollRootRef}
          className="reel-scroll-root reel-scroll-root--locked h-full w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-none"
          style={
            {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              ["--reel-beat-h" as string]: `${Math.round(beatHeight / (scale || 1))}px`,
            } as React.CSSProperties
          }
        >
          <style>{`
            .reel-scroll-root::-webkit-scrollbar{display:none}
            .reel-beat-frame{
              height:var(--reel-beat-h);
              min-height:var(--reel-beat-h);
              max-height:var(--reel-beat-h);
              overflow:hidden;
              scroll-snap-align:start;
              scroll-snap-stop:always;
              flex-shrink:0;
              box-sizing:border-box;
            }
          `}</style>
          <div className="flex min-h-0 w-full flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}
