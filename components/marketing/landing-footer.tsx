import Link from "next/link";
import { siteConfig } from "@/config/site";

export function LandingFooter() {
  return (
    <footer className="bg-[#032A23] px-4 py-14 text-[#F7F4ED] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/15 pb-10 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              Bring every celebration into one invitation.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">
              Make it yours, then share it with the people you love.
            </p>
          </div>
          <Link
            href="/templates"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E1C98E] px-6 text-sm font-semibold text-[#032A23] transition-colors hover:bg-white sm:w-auto"
          >
            Choose your invitation
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {siteConfig.name}</span>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3">
            <Link className="min-h-11 inline-flex items-center hover:text-white" href="/templates">Designs</Link>
            <Link className="min-h-11 inline-flex items-center hover:text-white" href="/contact">Contact</Link>
            <Link className="min-h-11 inline-flex items-center hover:text-white" href="/privacy-policy">Privacy</Link>
            <Link className="min-h-11 inline-flex items-center hover:text-white" href="/terms">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
