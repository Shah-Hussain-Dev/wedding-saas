import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getReelCatalog } from "@/config/template-reels";
import { TEMPLATE_META, type TemplateId } from "@/lib/template-meta";
import { ReelCatalogGrid } from "@/components/reels/reel-catalog-grid";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Template Reels — Vertical previews",
  description:
    "Autoplay mobile invitation reels for Rose Gold Blush Royal and more — same customize flow as live templates, built for social video.",
  alternates: { canonical: "/reels" },
  openGraph: {
    title: `Template Reels | ${siteConfig.name}`,
    description: "Autoplay mobile invitation reels — video feel, template content.",
    url: `${siteConfig.url}/reels`,
  },
};

const COMING_SOON_IDS: TemplateId[] = [
  "celestial-rose",
  "imperial-palace",
  "noor-e-nikah",
];

export default function ReelsCatalogPage() {
  const published = getReelCatalog();
  const comingSoonNames = COMING_SOON_IDS.map((id) => TEMPLATE_META[id].name);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "WedInvites template reels",
    itemListElement: published.map((reel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: reel.name,
      url: `${siteConfig.url}/reels/${reel.templateId}`,
    })),
  };

  return (
    <div className="bg-[#FCFBF7] pb-16 pt-6 sm:pt-10">
      <JsonLd data={structuredData} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#073D31] font-semibold">
            Mobile story previews
          </p>
          <h1 className="mt-2 font-serif text-2xl sm:text-4xl font-medium tracking-tight text-[#18211E]">
            Template reels
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#76766F] font-sans leading-relaxed">
            Watch each theme play like a social reel inside a phone frame — the same animated mobile
            invitation you customize today. Pause anytime; MP4 export coming soon.
          </p>
        </header>

        <ReelCatalogGrid published={published} comingSoonNames={comingSoonNames} />
      </div>
    </div>
  );
}
