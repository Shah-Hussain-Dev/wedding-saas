import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getReelByTemplateId } from "@/config/template-reels";
import { reelMp4Exists } from "@/lib/reel-assets";
import { ReelDetailExperience } from "@/components/reels/reel-detail-experience";

interface PageProps {
  params: Promise<{ templateId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { templateId } = await params;
  const reel = getReelByTemplateId(templateId);
  if (!reel) {
    return { title: "Reel not found" };
  }
  return {
    title: `${reel.name} — Template reel`,
    description: reel.tagline,
    alternates: { canonical: `/reels/${reel.templateId}` },
    openGraph: {
      title: `${reel.name} reel | ${siteConfig.name}`,
      description: reel.description,
      url: `${siteConfig.url}/reels/${reel.templateId}`,
      images: reel.posterUrl ? [{ url: reel.posterUrl, alt: reel.name }] : undefined,
    },
  };
}

export default async function ReelDetailPage({ params }: PageProps) {
  const { templateId } = await params;
  const reel = getReelByTemplateId(templateId);
  if (!reel) notFound();

  const downloadAvailable = reelMp4Exists(reel.downloadVideoPath);

  return (
    <div className="bg-[#FCFBF7] min-h-[100dvh]">
      <ReelDetailExperience reel={reel} downloadAvailable={downloadAvailable} />
    </div>
  );
}
