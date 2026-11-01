"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";

export const HOW_IT_WORKS_STEPS = [
  {
    num: "01",
    title: "Choose a design",
    description:
      "Browse curated templates and preview real motion, music, and sample content before you commit.",
    image: "/marketing/how-it-works-step-1.jpg",
    imageAlt: "Browse luxury wedding invitation templates on your phone",
  },
  {
    num: "02",
    title: "Make it your own",
    description:
      "Add names, dates, venues, and photos in the live editor — your invitation updates as you type.",
    image: "/marketing/how-it-works-step-2.jpg",
    imageAlt: "Customize names, dates, and venue with live preview",
  },
  {
    num: "03",
    title: "Publish and share",
    description:
      "Your link goes live on WhatsApp instantly. Collect RSVPs and edit anytime until your wedding day.",
    image: "/marketing/how-it-works-step-3.jpg",
    imageAlt: "Share your invitation on WhatsApp and collect RSVPs",
  },
] as const;

interface HowItWorksEditorialProps {
  /** Show primary CTA to template catalog (home page). */
  showBrowseCta?: boolean;
  className?: string;
}

export function HowItWorksEditorial({
  showBrowseCta = false,
  className = "",
}: HowItWorksEditorialProps) {
  return (
    <section
      id="how-it-works"
      className={`scroll-mt-24 border-t border-[#073D31]/8 bg-white py-12 sm:scroll-mt-28 sm:py-16 md:py-20 ${className}`}
    >
      <div className="page-container">
        <div className="mx-auto mb-8 max-w-2xl sm:mb-10 md:mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A45E] font-sans">
            How it works
          </p>
          <h2 className="mt-2 font-serif text-2xl font-medium text-[#18211E] sm:text-3xl md:text-4xl leading-[1.15]">
            From idea to invitation in three steps
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#76766F] font-sans sm:text-base">
            No design skills or printing delays — pick a masterpiece, personalize in minutes, and share one
            beautiful link with everyone you love.
          </p>

          {showBrowseCta ? (
            <Link
              href="/templates"
              className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#073D31] px-6 text-sm font-bold text-[#F7F4ED] shadow-[0_8px_24px_rgba(7,61,49,0.18)] transition-all hover:bg-[#032A23] active:scale-[0.98] font-sans"
            >
              Browse templates
              <ArrowUpRight size={16} weight="bold" className="text-[#E1C98E]" />
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <article
              key={step.num}
              className="overflow-hidden rounded-2xl border border-[#073D31]/8 bg-[#F7F4ED]/60"
            >
              <div className="relative aspect-[4/3] w-full border-b border-[#073D31]/8 bg-[#F7F4ED]">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={showBrowseCta && index === 0}
                />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#C8A45E] font-sans">
                  {step.num}
                </p>
                <h3 className="mt-1 font-serif text-lg font-bold text-[#18211E]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#76766F] font-sans">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
