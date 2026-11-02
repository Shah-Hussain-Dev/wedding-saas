export function LandingSectionPlaceholder({
  className = "min-h-[28rem] w-full bg-[#F7F4ED]",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`landing-section-deferred ${className}`}
    />
  );
}
