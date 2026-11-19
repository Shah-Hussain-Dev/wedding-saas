"use client";

import { use, useEffect, useState } from "react";
import { GlassNav } from "@/components/ui/glass-nav";
import { InvitationCustomizerWizard } from "@/components/customizer/InvitationCustomizerWizard";
import { Sparkle, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";

interface EditInvitationPageProps {
  params: Promise<{ id: string }>;
}

export default function EditInvitationPage({ params }: EditInvitationPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvitation() {
      let localItem: any = null;
      if (typeof window !== "undefined") {
        try {
          // Check specific invitation key
          const storedSingle = localStorage.getItem(`unfold_invitation_${id}`);
          if (storedSingle) {
            localItem = JSON.parse(storedSingle);
          } else {
            // Check active list
            const storedList = localStorage.getItem("unfold_active_invitations");
            if (storedList) {
              const list = JSON.parse(storedList);
              localItem = list.find((item: any) => item.id === id || item.slug === id);
            }
          }
        } catch (e) {
          console.warn("Could not read from localStorage:", e);
        }
      }

      try {
        const response = await fetch(`/api/invitations/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInitialData(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch invitation edit data from API. Falling back to local cache.");
      }

      if (localItem) {
        setInitialData(localItem);
        setLoading(false);
        return;
      }

      // If neither API nor local cache has it, try checking draft slug or set default fallback
      setInitialData({
        id: id || "demo-invitation-id",
        templateId: "royal-lotus",
        brideName: "Diya",
        groomName: "Shaan",
        slug: id === "demo-invitation-id" ? "diya-shaan" : id,
        weddingDate: "2026-12-22",
        weddingTime: "06:30 PM onwards",
        venueName: "The Ridgewood Grand Palace",
        venueAddress: "Fatehsagar Lake Road, Udaipur, Rajasthan 313001",
        heroImageUrl: "",
        slideshowImages: [],
        eventsJson: [
          { name: "Haldi Ceremony", enabled: true, venue: "Courtyard Garden", date: "Dec 21, 2026", time: "10:00 AM" },
          { name: "Mehendi & Sangeet", enabled: true, venue: "Royal Banquet Hall", date: "Dec 21, 2026", time: "06:00 PM" },
          { name: "Wedding Nuptials", enabled: true, venue: "Grand Mandap", date: "Dec 22, 2026", time: "04:30 PM" },
          { name: "Grand Reception", enabled: true, venue: "The Grand Ballroom", date: "Dec 22, 2026", time: "08:00 PM" },
        ],
        musicTrack: "/templates/royal-lotus/music.mp3",
      });
      setLoading(false);
    }

    loadInvitation();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex flex-col items-center justify-center text-[#1A1A1A]">
        <Sparkle className="h-10 w-10 text-amber-500 animate-spin-slow mb-2" />
        <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">
          Loading Customizer...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex flex-col items-center justify-center text-[#1A1A1A] px-4">
        <WarningCircle className="h-12 w-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold mb-2">Invitation Not Accessible</h2>
        <p className="text-sm text-stone-500 mb-6 text-center">{error}</p>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-bold uppercase tracking-wider"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const templateId = initialData?.templateId || "royal-lotus";

  return (
    <div
      data-lenis-prevent
      className="flex min-h-screen flex-col bg-[#FCFBF7] text-[#1A1A1A] lg:h-[100dvh] lg:max-h-[100dvh] lg:overflow-hidden lg:bg-[#E8E4DC]"
    >
      <div className="lg:hidden">
        <GlassNav />
      </div>

      <main className="flex min-h-0 flex-1 flex-col pt-28 pb-20 lg:h-full lg:overflow-hidden lg:pt-0 lg:pb-0">
        <div className="flex min-h-0 flex-1 flex-col lg:h-full">
          <InvitationCustomizerWizard
            templateId={templateId}
            invitationId={id}
            initialData={initialData}
            isEditMode={true}
          />
        </div>
      </main>
    </div>
  );
}
