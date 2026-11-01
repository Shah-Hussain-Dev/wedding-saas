"use client";

/** Placeholder while the live template mounts inside the phone mockup. */
export function ReelViewportSkeleton() {
  return (
    <div className="flex h-full min-h-[520px] w-full flex-col items-center justify-center gap-3 bg-[#102A43] px-6 text-center">
      <div className="h-10 w-10 animate-pulse rounded-full bg-[#C5A46A]/30" />
      <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F5EFE3]/80">
        Loading invitation
      </p>
    </div>
  );
}
