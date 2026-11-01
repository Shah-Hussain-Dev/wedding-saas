import { cn } from "@/lib/utils";

/** Plain sans-serif styling for currency — use on all price amounts. */
export const priceFontClass = "font-sans font-semibold tabular-nums tracking-normal";

export function priceClassName(className?: string) {
  return cn(priceFontClass, className);
}

export function PriceText({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return <span className={priceClassName(className)} {...props} />;
}
