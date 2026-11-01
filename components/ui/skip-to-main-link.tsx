import Link from "next/link";

/** WCAG 2.4.1 — bypass repeated navigation on every page */
export function SkipToMainLink() {
  return (
    <Link href="#main-content" className="skip-link">
      Skip to main content
    </Link>
  );
}
