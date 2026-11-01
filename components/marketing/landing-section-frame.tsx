"use client";

import { cn } from "@/lib/utils";
import { SectionBackdrop, type DecorPreset } from "@/components/decor/section-decor";

/** Decorative background patterns — no borders. Used on even-index landing sections only. */
export type LandingSectionPattern =
  | "none"
  | "dot-gold"
  | "diagonal-weave"
  | "mandala-corners"
  | "lotus-arch"
  | "constellation"
  | "paisley-vine";

interface LandingSectionFrameProps {
  children: React.ReactNode;
  pattern?: LandingSectionPattern;
  decor?: DecorPreset;
  /** Soft vignette for dark child sections */
  dark?: boolean;
  className?: string;
}

function PatternLayers({
  pattern,
  dark = false,
}: {
  pattern: LandingSectionPattern;
  dark?: boolean;
}) {
  const ink = dark ? "rgba(225, 201, 142, 0.22)" : "rgba(200, 164, 94, 0.2)";
  const forest = dark ? "rgba(225, 201, 142, 0.12)" : "rgba(7, 61, 49, 0.08)";

  switch (pattern) {
    case "dot-gold":
      return (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] sm:opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${ink} 1px, transparent 0)`,
            backgroundSize: "22px 22px",
          }}
          aria-hidden
        />
      );
    case "diagonal-weave":
      return (
        <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, ${forest} 0, ${forest} 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, ${ink} 0, ${ink} 1px, transparent 0, transparent 50%)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>
      );
    case "mandala-corners":
      return (
        <>
          <svg
            className="pointer-events-none absolute -left-8 -top-8 h-48 w-48 text-[#C8A45E]/25 sm:h-64 sm:w-64"
            viewBox="0 0 200 200"
            aria-hidden
          >
            <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 6" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            {[0, 45, 90, 135].map((deg) => (
              <line
                key={deg}
                x1="100"
                y1="12"
                x2="100"
                y2="188"
                stroke="currentColor"
                strokeWidth="0.4"
                transform={`rotate(${deg} 100 100)`}
              />
            ))}
          </svg>
          <svg
            className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 scale-x-[-1] scale-y-[-1] text-[#C8A45E]/25 sm:h-64 sm:w-64"
            viewBox="0 0 200 200"
            aria-hidden
          >
            <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 6" />
          </svg>
        </>
      );
    case "lotus-arch":
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <svg
            className="absolute left-1/2 top-0 w-[min(100%,720px)] -translate-x-1/2 text-[#073D31]/10"
            viewBox="0 0 720 120"
            preserveAspectRatio="xMidYMin slice"
          >
            <path
              d="M0 120 Q360 0 720 120"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M40 120 Q360 24 680 120"
              fill="none"
              stroke="#C8A45E"
              strokeOpacity="0.35"
              strokeWidth="1.25"
            />
          </svg>
          <div
            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#C8A45E]/10 to-transparent"
            aria-hidden
          />
        </div>
      );
    case "constellation":
      return (
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: `radial-gradient(1.5px 1.5px at 20% 30%, ${ink} 99%, transparent), radial-gradient(1px 1px at 70% 20%, ${ink} 99%, transparent), radial-gradient(1.25px 1.25px at 40% 70%, ${ink} 99%, transparent), radial-gradient(1px 1px at 85% 65%, ${ink} 99%, transparent), radial-gradient(1px 1px at 15% 80%, ${ink} 99%, transparent)`,
            backgroundSize: "100% 100%",
          }}
          aria-hidden
        />
      );
    case "paisley-vine":
      return (
        <>
          <svg
            className="pointer-events-none absolute right-0 top-1/4 h-40 w-40 text-[#073D31]/12 sm:h-56 sm:w-56"
            viewBox="0 0 120 120"
            aria-hidden
          >
            <path
              d="M60 10 C90 10 110 40 60 110 C10 40 30 10 60 10 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M60 25 C75 25 85 45 60 95 C35 45 45 25 60 25 Z"
              fill="none"
              stroke="#C8A45E"
              strokeOpacity="0.4"
              strokeWidth="0.75"
            />
          </svg>
          <svg
            className="pointer-events-none absolute bottom-8 left-4 h-32 w-32 rotate-180 text-[#073D31]/10"
            viewBox="0 0 120 120"
            aria-hidden
          >
            <path
              d="M10 60 Q60 10 110 60 Q60 110 10 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          </svg>
        </>
      );
    default:
      return null;
  }
}

/**
 * Even landing sections: decorative pattern backdrop only (no borders).
 * Odd sections: render children directly via pattern="none" or omit wrapper.
 */
export function LandingSectionFrame({
  children,
  pattern = "none",
  decor,
  dark = false,
  className,
}: LandingSectionFrameProps) {
  if (pattern === "none" && !decor) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        pattern !== "none" && "py-4 sm:py-6",
        className
      )}
    >
      <div className="relative mx-auto max-w-[1400px]">
        {decor ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <SectionBackdrop preset={decor} />
          </div>
        ) : null}

        {pattern !== "none" ? (
          <>
            <PatternLayers pattern={pattern} dark={dark} />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply bg-cover bg-center"
              style={{ backgroundImage: "url(/marketing/landing-paper-texture.jpg)" }}
              aria-hidden
            />
            {/* Soft inset glow — frame feel without border lines */}
            <div
              className={cn(
                "pointer-events-none absolute inset-3 sm:inset-5 md:inset-6 rounded-[20px] sm:rounded-[28px]",
                dark
                  ? "shadow-[inset_0_0_80px_rgba(200,164,94,0.12)]"
                  : "shadow-[inset_0_0_60px_rgba(200,164,94,0.15),inset_0_0_120px_rgba(7,61,49,0.04)]"
              )}
              aria-hidden
            />
          </>
        ) : null}

        <div className="relative z-[2]">{children}</div>
      </div>
    </div>
  );
}
