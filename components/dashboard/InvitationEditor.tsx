"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { Sparkle, Trash, Plus, ArrowLeft, Image, MusicNotes } from "@phosphor-icons/react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface EventItem {
  name: string;
  enabled: boolean;
  venue: string;
  date: string;
  time: string;
}

interface InvitationFormValues {
  templateId: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  slug: string;
  heroImageUrl: string;
  slideshowImagesText: string; // newline separated URLs
  musicTrack: string;
  showDressCode: boolean;
  dressCodeText: string;
  showTransport: boolean;
  transportText: string;
  events: EventItem[];
}

interface InvitationEditorProps {
  initialData?: any;
  invitationId?: string;
  initialTemplateId?: string;
}

export function InvitationEditor({ initialData, invitationId, initialTemplateId }: InvitationEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "events" | "media" | "extras">("details");

  const defaultValues: InvitationFormValues = {
    templateId: initialData?.templateId || initialTemplateId || "royal-lotus",
    brideName: initialData?.brideName || "Siya",
    groomName: initialData?.groomName || "Kabir",
    weddingDate: initialData?.weddingDate ? new Date(initialData.weddingDate).toISOString().split("T")[0] : "2026-12-14",
    weddingTime: initialData?.weddingTime || "6:30 PM onwards",
    venueName: initialData?.venueName || "The Maharaja Palace",
    venueAddress: initialData?.venueAddress || "The Maharaja Palace, Lake Pichola Road, Udaipur, Rajasthan",
    slug: initialData?.slug || "siya-kabir",
    heroImageUrl: initialData?.heroImageUrl || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
    slideshowImagesText: initialData?.slideshowImages ? (Array.isArray(initialData.slideshowImages) ? initialData.slideshowImages.join("\n") : "") : "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=500&auto=format&fit=crop\nhttps://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=500&auto=format&fit=crop",
    musicTrack: initialData?.musicTrack || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    showDressCode: initialData?.showDressCode ?? true,
    dressCodeText: initialData?.dressCodeText || "Royal Traditional Indian. Pastel lehengas, silk sarees, sherwanis, or bandhgalas.",
    showTransport: initialData?.showTransport ?? true,
    transportText: initialData?.transportText || "Valet parking is available at the main palace porch. Dedicated shuttle services are arranged.",
    events: initialData?.eventsJson || [
      { name: "Mehendi", enabled: true, venue: "Lotus Courtyard", date: "12 DECEMBER · 4:00 PM", time: "4:00 PM" },
      { name: "Haldi", enabled: true, venue: "Poolside Courtyard", date: "13 DECEMBER · 10:00 AM", time: "10:00 AM" },
      { name: "Sangeet", enabled: true, venue: "Royal Ballroom", date: "13 DECEMBER · 7:30 PM", time: "7:30 PM" },
      { name: "Shaadi", enabled: true, venue: "Lake Mandap", date: "14 DECEMBER · 6:30 PM", time: "6:30 PM" },
      { name: "Reception", enabled: true, venue: "Palace Lawns", date: "14 DECEMBER · 9:00 PM", time: "9:00 PM" },
      { name: "Vidaai", enabled: true, venue: "Main Courtyard", date: "15 DECEMBER · 9:00 AM", time: "9:00 AM" },
    ],
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvitationFormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "events",
  });

  const watchSlug = watch("slug");
  const watchBrideName = watch("brideName");
  const watchGroomName = watch("groomName");
  const watchTemplateId = watch("templateId");

  const onSubmit = async (values: InvitationFormValues) => {
    setIsSubmitting(true);
    try {
      const slideshowImages = values.slideshowImagesText
        .split("\n")
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const normalizedSlug = (values.slug || `${values.brideName}-${values.groomName}`)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const payload = {
        id: invitationId || initialData?.id || `inv-${Date.now()}`,
        brideName: values.brideName,
        groomName: values.groomName,
        weddingDate: new Date(values.weddingDate).toISOString(),
        weddingTime: values.weddingTime,
        venueName: values.venueName,
        venueAddress: values.venueAddress,
        slug: normalizedSlug,
        heroImageUrl: values.heroImageUrl,
        slideshowImages,
        musicTrack: values.musicTrack,
        showDressCode: values.showDressCode,
        dressCodeText: values.dressCodeText,
        showTransport: values.showTransport,
        transportText: values.transportText,
        eventsJson: values.events,
        templateId: values.templateId || "royal-lotus",
      };

      // Always save to client-side storage for instant offline/sandbox reliability
      if (typeof window !== "undefined") {
        try {
          const existingStr = localStorage.getItem("unfold_active_invitations");
          const existing = existingStr ? JSON.parse(existingStr) : [];
          // Remove if matching id or old slug
          const filtered = existing.filter((item: any) => 
            item.id !== payload.id && 
            item.slug !== payload.slug && 
            (initialData?.slug ? item.slug !== initialData.slug : true)
          );
          const updated = [payload, ...filtered];
          localStorage.setItem("unfold_active_invitations", JSON.stringify(updated));
          localStorage.setItem(`unfold_invitation_${payload.slug}`, JSON.stringify(payload));
          if (initialData?.slug && initialData.slug !== payload.slug) {
            localStorage.removeItem(`unfold_invitation_${initialData.slug}`);
          }
        } catch (storageErr) {
          console.warn("Could not save to localStorage:", storageErr);
        }
      }

      const endpoint = invitationId ? `/api/invitations/${invitationId}` : "/api/invitations";
      const method = invitationId ? "PUT" : "POST";

      try {
        await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (apiErr) {
        console.warn("API save warning:", apiErr);
      }

      router.push("/dashboard");
    } catch (err) {
      console.warn("Failed to complete save, redirecting to dashboard:", err);
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formBrideName = watchBrideName;
  const formGroomName = watchGroomName;

  const [religionFilter, setReligionFilter] = useState<"all" | "hindu" | "muslim">("all");

  const templateOptions = [
    { id: "noor-e-nikah", name: "Noor-e-Nikah", style: "Sacred Elegance", religion: ["muslim"], religionLabel: "Muslim", color: "border-[#D4AF37] bg-[#FAF8F5]" },
    { id: "emerald-qasr", name: "Emerald Qasr", style: "Ottoman Royale", religion: ["muslim"], religionLabel: "Muslim", color: "border-[#0F382E] bg-[#EAF2EF]" },
    { id: "gul-e-noor", name: "Gul-e-Noor", style: "Blush Velvet & Rose", religion: ["muslim"], religionLabel: "Muslim", color: "border-[#D4849A] bg-[#FFF5F7]" },
    { id: "azure-nikah", name: "Azure Nikah", style: "Royal Sapphire", religion: ["muslim"], religionLabel: "Muslim", color: "border-[#0F2342] bg-[#E8EEF5]" },
    { id: "kitab-e-nikah", name: "Kitab-e-Nikah", style: "Sacred Velvet & Gold", religion: ["muslim"], religionLabel: "Muslim", color: "border-[#5E1A29] bg-[#FDF6F8]" },
    { id: "crimson-royale", name: "Crimson Royale", style: "Royal Court", religion: ["hindu"], religionLabel: "Hindu", color: "border-[#7c2c3b] bg-[#fff5f6]" },
    { id: "royal-lotus", name: "Royal Lotus", style: "Royal Palace", religion: ["hindu"], religionLabel: "Hindu", color: "border-[#D4AF37] bg-[#FAF7F0]" },
    { id: "emerald-noir", name: "Emerald Noir", style: "Luxury Dark", religion: ["muslim"], religionLabel: "Muslim", color: "border-[#082F27] bg-[#E8F0ED]" },
    { id: "royal-elegance", name: "Royal Elegance", style: "Classic Indian", religion: ["hindu", "muslim", "universal"], religionLabel: "Universal", color: "border-[#B89730] bg-[#FAF7F0]" },
    { id: "modern-minimal", name: "Modern Minimal", style: "Contemporary", religion: ["hindu", "muslim", "universal"], religionLabel: "Universal", color: "border-stone-400 bg-stone-100" },
  ];

  const visibleTemplates = templateOptions.filter((t) => {
    if (religionFilter === "all") return true;
    return t.religion.includes(religionFilter);
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-8 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#b89730]">Customizer form</span>
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 leading-tight">
            {invitationId ? "Edit Invitation details" : "Design your Invitation"}
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-mono uppercase">
            Editing URL slug: /{watchSlug || "slug"}
          </p>
        </div>
      </div>

      {/* Editor Tabs Navigation */}
      <div className="flex border-b border-stone-200 mb-8 overflow-x-auto gap-2 select-none">
        {[
          { id: "details", label: "Core Details" },
          { id: "events", label: "Wedding Events" },
          { id: "media", label: "Media Uploads" },
          { id: "extras", label: "Additional Info" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
              activeTab === tab.id
                ? "border-[#082F27] text-[#082F27]"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Tab 1: Core Details */}
        {activeTab === "details" && (
          <DoubleBezelCard className="bg-white border-stone-200/50 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-150">
              <h3 className="font-serif text-xl text-stone-900 font-bold lowercase">
                choose template design
              </h3>
              
              {/* Religion Category Filter Pills */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-full w-fit">
                {[
                  { key: "all", label: "All" },
                  { key: "hindu", label: "🕉️ Hindu" },
                  { key: "muslim", label: "🌙 Muslim" },
                ].map((rf) => (
                  <button
                    key={rf.key}
                    type="button"
                    onClick={() => setReligionFilter(rf.key as any)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      religionFilter === rf.key
                        ? "bg-[#082F27] text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {rf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {visibleTemplates.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setValue("templateId", t.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                    watchTemplateId === t.id
                      ? `${t.color} shadow-md scale-[1.02]`
                      : "border-stone-200 bg-white hover:border-stone-300 opacity-80"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-stone-500 block">
                        {t.style}
                      </span>
                      <span className="text-[8px] font-bold text-stone-600 bg-black/5 px-1.5 py-0.2 rounded">
                        {t.religionLabel === "Hindu" ? "🕉️" : t.religionLabel === "Muslim" ? "🌙" : "✦"}
                      </span>
                    </div>
                    <span className="font-serif text-sm font-bold text-stone-900 block leading-tight">
                      {t.name}
                    </span>
                  </div>
                  {watchTemplateId === t.id ? (
                    <span className="inline-block mt-3 text-[8px] uppercase tracking-wider font-bold bg-[#082F27] text-white px-2 py-0.5 rounded-full w-fit">
                      Selected
                    </span>
                  ) : (
                    <span className="inline-block mt-3 text-[8px] uppercase tracking-wider font-semibold text-stone-400">
                      Click to choose
                    </span>
                  )}
                </button>
              ))}
            </div>

            <h3 className="font-serif text-xl text-stone-900 font-bold pt-4 pb-2 border-b border-stone-150 lowercase">
              bride and groom details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-stone-500">Bride's First Name</label>
                <input
                  type="text"
                  {...register("brideName", { required: true })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-stone-500">Groom's First Name</label>
                <input
                  type="text"
                  {...register("groomName", { required: true })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-stone-500">Wedding Date</label>
                <input
                  type="date"
                  {...register("weddingDate", { required: true })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27] text-stone-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-stone-500">Wedding Start Time</label>
                <input
                  type="text"
                  placeholder="e.g. 7:00 PM onwards"
                  {...register("weddingTime", { required: true })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-stone-500">Invitation URL Slug</label>
              <div className="flex rounded-xl overflow-hidden border border-stone-200">
                <span className="bg-stone-100 px-4 py-3 text-xs text-stone-400 select-none flex items-center font-mono">
                  {siteConfig.domain}/
                </span>
                <input
                  type="text"
                  placeholder="priya-arjun"
                  {...register("slug", { required: true })}
                  className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-[#082F27]"
                />
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-stone-100">
              <h3 className="font-serif text-xl text-stone-900 font-bold lowercase">
                primary wedding venue
              </h3>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-stone-500">Venue Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grand Ballroom, The Leela Palace"
                  {...register("venueName", { required: true })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-stone-500">Full Venue Address</label>
                <input
                  type="text"
                  placeholder="Street address, city, pin code"
                  {...register("venueAddress", { required: true })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27]"
                />
              </div>
            </div>
          </DoubleBezelCard>
        )}

        {/* Tab 2: Events Scheduler */}
        {activeTab === "events" && (
          <DoubleBezelCard className="bg-white border-stone-200/50 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-stone-150">
              <h3 className="font-serif text-xl text-stone-900 font-bold lowercase">
                wedding ceremonies itinerary
              </h3>
              
              <button
                type="button"
                onClick={() => append({ name: "New Event", enabled: true, venue: "", date: "", time: "" })}
                className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 hover:underline"
              >
                <Plus className="h-4 w-4" />
                <span>Add Ceremony</span>
              </button>
            </div>

            <div className="space-y-6">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-5 rounded-xl border border-stone-150 bg-stone-50/50 relative"
                >
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase text-stone-400 font-bold">Event Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sangeet Party"
                        {...register(`events.${idx}.name` as const)}
                        className="w-full bg-transparent border-b border-stone-200 py-1 text-sm focus:outline-none focus:border-amber-400 text-stone-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase text-stone-400 font-bold">Ceremony Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Friday, 27 November"
                        {...register(`events.${idx}.date` as const)}
                        className="w-full bg-transparent border-b border-stone-200 py-1 text-sm focus:outline-none focus:border-amber-400 text-stone-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase text-stone-400 font-bold">Ceremony Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 8:00 PM"
                        {...register(`events.${idx}.time` as const)}
                        className="w-full bg-transparent border-b border-stone-200 py-1 text-sm focus:outline-none focus:border-amber-400 text-stone-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase text-stone-400 font-bold">Ceremony Venue</label>
                      <input
                        type="text"
                        placeholder="e.g. Grand Ballroom"
                        {...register(`events.${idx}.venue` as const)}
                        className="w-full bg-transparent border-b border-stone-200 py-1 text-sm focus:outline-none focus:border-amber-400 text-stone-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DoubleBezelCard>
        )}

        {/* Tab 3: Media Uploads */}
        {activeTab === "media" && (
          <DoubleBezelCard className="bg-white border-stone-200/50 space-y-6">
            <h3 className="font-serif text-xl text-stone-900 font-bold pb-2 border-b border-stone-150 lowercase">
              images and music assets
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-stone-500 flex items-center gap-1">
                <Image className="h-4 w-4" />
                <span>Hero Background Image URL</span>
              </label>
              <input
                type="text"
                {...register("heroImageUrl")}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-stone-500 flex items-center gap-1">
                <Image className="h-4 w-4" />
                <span>Slideshow Gallery Image URLs (One URL per line)</span>
              </label>
              <textarea
                rows={6}
                placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                {...register("slideshowImagesText")}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27] resize-none font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-stone-500 flex items-center gap-1">
                <MusicNotes className="h-4 w-4" />
                <span>Background Music Track URL (MP3)</span>
              </label>
              <input
                type="text"
                placeholder="Provide romantic MP3 loop link"
                {...register("musicTrack")}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27]"
              />
            </div>
          </DoubleBezelCard>
        )}

        {/* Tab 4: Extras */}
        {activeTab === "extras" && (
          <DoubleBezelCard className="bg-white border-stone-200/50 space-y-8">
            {/* Dress code */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-stone-900 font-bold lowercase">
                  dress code settings
                </h3>
                <input
                  type="checkbox"
                  {...register("showDressCode")}
                  className="w-4 h-4 text-[#082F27] border-stone-300 rounded focus:ring-[#082F27]"
                />
              </div>

              {watch("showDressCode") && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-stone-500">Dress Code Guidelines</label>
                  <textarea
                    rows={3}
                    placeholder="Describe color palette or style requirements..."
                    {...register("dressCodeText")}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27] resize-none"
                  />
                </div>
              )}
            </div>

            {/* Travel / Transport info */}
            <div className="space-y-4 pt-6 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-stone-900 font-bold lowercase">
                  lodging & transport details
                </h3>
                <input
                  type="checkbox"
                  {...register("showTransport")}
                  className="w-4 h-4 text-[#082F27] border-stone-300 rounded focus:ring-[#082F27]"
                />
              </div>

              {watch("showTransport") && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-stone-500">Travel Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about lodging, parking, airports, or shuttle coordinates..."
                    {...register("transportText")}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-transparent text-sm focus:outline-none focus:border-[#082F27] resize-none"
                  />
                </div>
              )}
            </div>
          </DoubleBezelCard>
        )}

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-stone-200">
          <Link href="/dashboard">
            <button
              type="button"
              className="px-6 py-3 rounded-full border border-stone-250 text-stone-700 hover:bg-stone-50 text-xs font-bold uppercase transition-all"
            >
              Cancel
            </button>
          </Link>
          
          <PremiumButton
            type="submit"
            disabled={isSubmitting}
            className="px-8 flex justify-between gap-4 font-bold"
          >
            {isSubmitting ? "Generating..." : invitationId ? "Save Invitation" : "Create Invitation"}
          </PremiumButton>
        </div>
      </form>
    </div>
  );
}
