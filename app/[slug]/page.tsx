"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { TEMPLATES_MAP, NoorNikah, getTemplateDefaultData } from "@/templates";
import { DoorAnimation } from "@/components/invitation/DoorAnimation";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { LanguageToggle } from "@/components/invitation/LanguageToggle";
import { DemoBanner } from "@/components/preview/DemoBanner";
import { Sparkle, Warning } from "@phosphor-icons/react";

interface LiveInvitationPageProps {
  params: Promise<{ slug: string }>;
}

export default function LiveInvitationPage({ params }: LiveInvitationPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any | null>(null);
  const [hasOpenedDoors, setHasOpenedDoors] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  useEffect(() => {
    async function fetchInvitation() {
      let localItem: any = null;
      if (typeof window !== "undefined") {
        try {
          const storedSingle = localStorage.getItem(`unfold_invitation_${slug}`);
          if (storedSingle) {
            localItem = JSON.parse(storedSingle);
          } else {
            const storedList = localStorage.getItem("unfold_active_invitations");
            if (storedList) {
              const list = JSON.parse(storedList);
              localItem = list.find((item: any) => item.slug === slug || item.id === slug);
            }
          }
        } catch (e) {
          console.warn("Could not check localStorage for invitation slug:", e);
        }
      }

      try {
        const res = await fetch(`/api/invitations/public?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setInvitation(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Invitation API offline. Checking local sandbox store.");
      }

      if (localItem) {
        setInvitation(localItem);
        setLoading(false);
        return;
      }

      // Fallback template for demo
      setIsDemoFallback(true);
      setLoading(false);
      setInvitation({
        id: "demo-id",
        slug: slug,
        templateId: "noor-e-nikah",
        brideName: "Diya",
        groomName: "Shaan",
        weddingDate: "2026-12-22",
        weddingTime: "05:00 PM onwards",
        venueName: "The Ridgewood Estate",
        venueAddress: "Fatehsagar Lake Road, Udaipur, Rajasthan 313001",
        isPublished: false,
        events: [
          { name: "Haldi Ceremony", date: "Dec 21, 2026", time: "10:00 AM", venue: "Courtyard Garden" },
          { name: "Mehendi & Sangeet", date: "Dec 21, 2026", time: "06:00 PM", venue: "Royal Banquet Hall" },
          { name: "Wedding Ceremony (Nikah)", date: "Dec 22, 2026", time: "04:30 PM", venue: "Lakeside Mandap" },
          { name: "Grand Reception", date: "Dec 22, 2026", time: "08:00 PM", venue: "The Ridgewood Grand Ballroom" },
        ],
      });
    }

    fetchInvitation();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-white">
        <Sparkle className="h-10 w-10 text-amber-400 animate-spin-slow mb-4" />
        <span className="text-xs uppercase tracking-widest text-white/60">Preparing Invitation...</span>
      </div>
    );
  }

  if (!invitation) {
    return notFound();
  }

  const templateDefault = getTemplateDefaultData(invitation.templateId || "noor-e-nikah");
  const mergedInvitation = {
    ...templateDefault,
    ...invitation,
    events: invitation.events && invitation.events.length > 0 ? invitation.events : templateDefault.events,
  };
  const SelectedTemplate = TEMPLATES_MAP[invitation.templateId] || NoorNikah;

  const handleOpenDoors = () => {
    setHasOpenedDoors(true);
  };

  const isUnpublished = invitation.isPublished === false;

  return (
    <div className="relative min-h-screen">
      {/* If unpublished (free demo preview mode), display Demo Banner */}
      {isUnpublished && (
        <DemoBanner
          invitationId={invitation.id}
          slug={invitation.slug || slug}
          templateId={invitation.templateId || "royal-lotus"}
          templateName={invitation.brideName ? `${invitation.brideName} & ${invitation.groomName}` : undefined}
          amountPaise={invitation.amountPaise}
          isPublished={false}
          expiresInSeconds={900}
        />
      )}

      {/* Demo Warning Banner (if in fallback mock mode) */}
      {isDemoFallback && (
        <div className="fixed top-0 inset-x-0 z-[100] bg-amber-500 text-stone-950 text-[10px] font-bold py-1 px-4 flex items-center justify-center gap-2 select-none">
          <Warning className="h-3 w-3 shrink-0" weight="fill" />
          <span>Demo Fallback Mode: Database connection not configured in .env</span>
        </div>
      )}

      {/* Render Self-Contained Template */}
      <SelectedTemplate data={mergedInvitation} />
    </div>
  );
}
