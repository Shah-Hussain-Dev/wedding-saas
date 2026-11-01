export function LandingSectionSkeleton({ className = "min-h-[420px]" }: { className?: string }) {
  return (
    <div
      className={`w-full animate-pulse bg-[#EFE9DD]/40 ${className}`}
      aria-hidden
    />
  );
}
