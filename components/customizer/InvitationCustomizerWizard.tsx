"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "motion/react";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { ImageUploader } from "@/components/media/ImageUploader";
import { MultiImageUploader } from "@/components/media/MultiImageUploader";
import { AudioTrackSelector } from "@/components/media/AudioTrackSelector";
import {
  getTemplateMeta,
  defaultCulturalTraditionForTemplate,
  type TemplateId,
} from "@/lib/template-meta";
import { siteConfig } from "@/config/site";
import {
  Sparkle,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Plus,
  Trash,
  MusicNotes,
  Image as ImageIcon,
  CheckCircle,
  Check,
  Crown,
  Camera,
  Info,
  Eye,
  Lock,
  ArrowsClockwise,
  FilePdf,
} from "@phosphor-icons/react";
import { PdfPreviewModal } from "@/components/pdf-invitation/PdfPreviewModal";
import { CulturalTradition } from "@/lib/pdf-theme-tokens";
import { getTemplateDefaultData } from "@/templates";
import {
  writeCustomizerDraft,
  readCustomizerDraft,
  persistCustomizerPendingSubmit,
  consumeCustomizerResumeSubmit,
  migrateCustomizerDraftToTemplate,
} from "@/lib/customizer-preview-sync";
import {
  CustomizerLivePreviewPanel,
  type CustomizerLivePreviewPanelHandle,
} from "@/components/customizer/CustomizerLivePreviewPanel";
import { CustomizerStepAccordion } from "@/components/customizer/CustomizerStepAccordion";
import { CustomizerFloatingActionBar } from "@/components/customizer/CustomizerFloatingActionBar";
import { CustomizerAuthModal } from "@/components/customizer/CustomizerAuthModal";
import { CustomizerSubmitConfirmModal } from "@/components/customizer/CustomizerSubmitConfirmModal";
import {
  CustomizerSubmitSuccessModal,
  type CustomizerSuccessInvite,
} from "@/components/customizer/CustomizerSubmitSuccessModal";
import { ShareInvitationModal } from "@/components/sharing/ShareInvitationModal";
import { CustomizerTemplatePickerModal } from "@/components/customizer/CustomizerTemplatePickerModal";

export interface EventItem {
  name: string;
  enabled: boolean;
  venue: string;
  date: string;
  time: string;
}

export interface ReligionPreset {
  id: CulturalTradition;
  name: string;
  badge: string;
  icon: string;
  sacredInvocation: string;
  sacredVerse: string;
  sacredTranslation: string;
  baratEventTitle: string;
  receptionEventTitle: string;
}

export const RELIGION_PRESETS: Record<CulturalTradition, ReligionPreset> = {
  muslim: {
    id: "muslim",
    name: "Muslim Tradition",
    badge: "Sacred Nikah & Duas",
    icon: "☪️",
    sacredInvocation: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    sacredVerse: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    sacredTranslation: "“And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He placed between you love and mercy.” (Surah Ar-Rum 30:21)",
    baratEventTitle: "The Sacred Nikah & Barat",
    receptionEventTitle: "Dawat-e-Walima",
  },
  hindu: {
    id: "hindu",
    name: "Hindu Vedic Tradition",
    badge: "Vedic Mantras & Vivah",
    icon: "🕉️",
    sacredInvocation: "॥ श्री गणेशाय नमः ॥",
    sacredVerse: "मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः । मङ्गलम् पुण्डरीकाक्षः मङ्गलाय तनो हरिः ॥",
    sacredTranslation: "May Lord Ganesha and the Divine Trinity bless this sacred matrimonial union with eternal joy, harmony, and prosperity.",
    baratEventTitle: "Shubh Vivah & Barat Procession",
    receptionEventTitle: "Preetibhoj & Grand Reception",
  },
  universal: {
    id: "universal",
    name: "Universal & Contemporary",
    badge: "Love Quotes & Nuptials",
    icon: "💫",
    sacredInvocation: "✦ Two Hearts · One Journey ✦",
    sacredVerse: "“In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.”",
    sacredTranslation: "Together with our families, we joyfully invite you to celebrate the beginning of our forever.",
    baratEventTitle: "Wedding Procession & Ceremony",
    receptionEventTitle: "Grand Gala Dinner & Reception",
  },
};

export interface InvitationCustomizerWizardProps {
  templateId: string;
  invitationId?: string | null;
  initialData?: any | null;
  isEditMode?: boolean;
  /** Admin-resolved demo defaults for new customize sessions (not edit mode). */
  demoDefaults?: Record<string, unknown> | null;
}

const STEPS = [
  { id: 1, title: "The Couple", subtitle: "Names, Faith & Link", icon: Heart },
  { id: 2, title: "Date & Venue", subtitle: "Time & Location", icon: Calendar },
  { id: 3, title: "Ceremonies", subtitle: "Event Timeline", icon: Clock },
  { id: 4, title: "Photo & Audio", subtitle: "Portrait & Music", icon: ImageIcon },
  { id: 5, title: "Review & Save", subtitle: "Preview Live", icon: Sparkle },
];

export function InvitationCustomizerWizard({
  templateId,
  invitationId,
  initialData,
  isEditMode: initialIsEditMode = false,
  demoDefaults = null,
}: InvitationCustomizerWizardProps) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const previewPanelRef = useRef<CustomizerLivePreviewPanelHandle>(null);
  const draftHydratedRef = useRef(false);

  const isEdit = initialIsEditMode || Boolean(invitationId && !invitationId.startsWith("demo-"));
  const meta = getTemplateMeta(templateId);

  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const [openSteps, setOpenSteps] = useState<number[]>([1]);
  const [activeStep, setActiveStep] = useState<number>(1);

  const isStepOpen = useCallback((stepId: number) => openSteps.includes(stepId), [openSteps]);

  // Form State
  const templateDefault = getTemplateDefaultData(templateId);
  const defaultBride =
    initialData?.brideName ||
    initialData?.couple?.brideName ||
    templateDefault?.couple?.brideName ||
    templateDefault?.brideName ||
    (templateId.includes("nikah") || templateId === "emerald-qasr" || templateId === "gul-e-noor" ? "Diya" : "Ananya");
  const defaultGroom =
    initialData?.groomName ||
    initialData?.couple?.groomName ||
    templateDefault?.couple?.groomName ||
    templateDefault?.groomName ||
    (templateId.includes("nikah") || templateId === "emerald-qasr" || templateId === "gul-e-noor" ? "Shaan" : "Shubham");

  const [brideName, setBrideName] = useState(defaultBride);
  const [groomName, setGroomName] = useState(defaultGroom);
  const [weddingDate, setWeddingDate] = useState(
    initialData?.weddingDate
      ? initialData.weddingDate.split("T")[0]
      : "2026-12-22"
  );
  const [weddingTime, setWeddingTime] = useState(initialData?.weddingTime || "06:30 PM onwards");
  const [venueName, setVenueName] = useState(initialData?.venueName || "The Ridgewood Grand Palace");
  const [venueAddress, setVenueAddress] = useState(
    initialData?.venueAddress || "Fatehsagar Lake Road, Udaipur, Rajasthan 313001"
  );
  // Helper function to generate slug from couple names
  const generateSlugFromNames = (bride: string, groom: string) => {
    const cleanBride = (bride || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const cleanGroom = (groom || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const parts = [cleanBride, cleanGroom].filter(Boolean);
    return parts.join("-").replace(/^-+|-+$/g, "");
  };

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    Boolean(initialData?.slug && isEdit)
  );
  const [slug, setSlug] = useState(
    initialData?.slug || generateSlugFromNames(defaultBride, defaultGroom)
  );
  const [heroImageUrl, setHeroImageUrl] = useState(initialData?.heroImageUrl || "");
  const [heroBgChoice, setHeroBgChoice] = useState<"default" | "custom">(
    initialData?.heroImageUrl ? "custom" : "default"
  );
  const [slideshowImages, setSlideshowImages] = useState<string[]>(
    Array.isArray(initialData?.slideshowImages)
      ? initialData.slideshowImages
      : Array.isArray(initialData?.gallery)
      ? initialData.gallery
      : []
  );
  const searchParams = useSearchParams();
  const paramMusicTrack = searchParams?.get("musicTrack");

  const [musicTrack, setMusicTrack] = useState(() => {
    if (initialData?.musicTrack) return initialData.musicTrack;
    if (paramMusicTrack) return paramMusicTrack;
    if (typeof window !== "undefined") {
      try {
        const previewMusic = localStorage.getItem(`unfold_preview_music_${templateId}`);
        if (previewMusic) return previewMusic;
      } catch (_) {}
    }
    return `/templates/${templateId}/music.mp3`;
  });

  useEffect(() => {
    if (paramMusicTrack && !initialData?.musicTrack) {
      setMusicTrack(paramMusicTrack);
    }
  }, [paramMusicTrack, initialData?.musicTrack]);

  const defaultEvents: EventItem[] = [
    { name: "Haldi Ceremony", enabled: true, venue: "Courtyard Garden", date: "Dec 21, 2026", time: "10:00 AM" },
    { name: "Mehendi & Sangeet", enabled: true, venue: "Royal Banquet Hall", date: "Dec 21, 2026", time: "06:00 PM" },
    { name: "Wedding Nuptials", enabled: true, venue: "Grand Mandap / Lake Lawn", date: "Dec 22, 2026", time: "04:30 PM" },
    { name: "Grand Reception & Feast", enabled: true, venue: "The Grand Ballroom", date: "Dec 22, 2026", time: "08:00 PM" },
  ];

  const templateLockedReligion = defaultCulturalTraditionForTemplate(templateId);

  const [religion, setReligion] = useState<CulturalTradition>(templateLockedReligion);
  const [sacredInvocation, setSacredInvocation] = useState(
    initialData?.sacredInvocation ||
      RELIGION_PRESETS[templateLockedReligion]?.sacredInvocation ||
      ""
  );
  const [sacredVerse, setSacredVerse] = useState(
    initialData?.sacredVerse || RELIGION_PRESETS[templateLockedReligion]?.sacredVerse || ""
  );
  const [sacredTranslation, setSacredTranslation] = useState(
    initialData?.sacredTranslation ||
      RELIGION_PRESETS[templateLockedReligion]?.sacredTranslation ||
      ""
  );
  const [isCustomizingInvocation, setIsCustomizingInvocation] = useState(false);

  useEffect(() => {
    setReligion(defaultCulturalTraditionForTemplate(templateId));
  }, [templateId]);

  const [events, setEvents] = useState<EventItem[]>(
    Array.isArray(initialData?.eventsJson) && initialData.eventsJson.length > 0
      ? initialData.eventsJson
      : Array.isArray(initialData?.events) && initialData.events.length > 0
      ? initialData.events
      : defaultEvents
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [savedInvite, setSavedInvite] = useState<CustomizerSuccessInvite | null>(null);
  const [savedInvitationId, setSavedInvitationId] = useState<string | null>(
    invitationId && !invitationId.startsWith("demo-") ? invitationId : null
  );
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildDraftPayload = useCallback(() => {
    const normalizedSlug = (slug || `${brideName}-${groomName}`)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return {
      id: invitationId || `demo-${Date.now()}`,
      slug: normalizedSlug,
      templateId,
      brideName,
      groomName,
      weddingDate,
      weddingTime,
      venueName,
      venueAddress,
      religion,
      sacredInvocation,
      sacredVerse,
      sacredTranslation,
      heroImageUrl: heroBgChoice === "custom" ? heroImageUrl : "",
      slideshowImages,
      gallery: slideshowImages.length > 0 ? slideshowImages : heroImageUrl ? [heroImageUrl] : [],
      galleryImages: slideshowImages.length > 0 ? slideshowImages : heroImageUrl ? [heroImageUrl] : [],
      musicTrack,
      eventsJson: events,
      events,
      updatedAt: new Date().toISOString(),
    };
  }, [
    slug,
    brideName,
    groomName,
    invitationId,
    templateId,
    weddingDate,
    weddingTime,
    venueName,
    venueAddress,
    religion,
    sacredInvocation,
    sacredVerse,
    sacredTranslation,
    heroBgChoice,
    heroImageUrl,
    slideshowImages,
    musicTrack,
    events,
  ]);

  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      writeCustomizerDraft(templateId, buildDraftPayload());
    }, 450);
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [buildDraftPayload, templateId]);

  const handleSaveForLater = () => {
    writeCustomizerDraft(templateId, buildDraftPayload());
    setSaveSuccessMsg("Draft saved on this device — continue anytime.");
  };

  const handleSelectTemplate = useCallback(
    (nextTemplateId: TemplateId) => {
      if (nextTemplateId === templateId) {
        setIsTemplatePickerOpen(false);
        return;
      }
      const payload = buildDraftPayload();
      migrateCustomizerDraftToTemplate(templateId, nextTemplateId, payload);

      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (musicTrack) {
        params.set("musicTrack", musicTrack);
      }
      const query = params.toString();
      setIsTemplatePickerOpen(false);
      router.push(`/customize/${nextTemplateId}${query ? `?${query}` : ""}`);
      setSaveSuccessMsg("Template changed — your details were kept.");
    },
    [buildDraftPayload, templateId, searchParams, musicTrack, router]
  );

  // Sync initialData changes if loaded asynchronously
  useEffect(() => {
    if (initialData) {
      if (
        typeof initialData.templateId === "string" &&
        initialData.templateId !== templateId
      ) {
        return;
      }
      if (initialData.brideName) setBrideName(initialData.brideName);
      if (initialData.groomName) setGroomName(initialData.groomName);
      if (initialData.weddingDate) setWeddingDate(initialData.weddingDate.split("T")[0]);
      if (initialData.weddingTime) setWeddingTime(initialData.weddingTime);
      if (initialData.venueName) setVenueName(initialData.venueName);
      if (initialData.venueAddress) setVenueAddress(initialData.venueAddress);
      if (initialData.slug) {
        setSlug(initialData.slug);
        if (isEdit) setIsSlugManuallyEdited(true);
      }
      if (initialData.sacredInvocation) setSacredInvocation(initialData.sacredInvocation);
      if (initialData.sacredVerse) setSacredVerse(initialData.sacredVerse);
      if (initialData.sacredTranslation) setSacredTranslation(initialData.sacredTranslation);
      if (initialData.heroImageUrl) {
        setHeroImageUrl(initialData.heroImageUrl);
        setHeroBgChoice("custom");
      }
      if (Array.isArray(initialData.slideshowImages)) {
        setSlideshowImages(initialData.slideshowImages);
      } else if (Array.isArray(initialData.gallery)) {
        setSlideshowImages(initialData.gallery);
      }
      if (initialData.musicTrack) setMusicTrack(initialData.musicTrack);
      if (Array.isArray(initialData.eventsJson) && initialData.eventsJson.length > 0) {
        setEvents(initialData.eventsJson);
      } else if (Array.isArray(initialData.events) && initialData.events.length > 0) {
        setEvents(initialData.events);
      }
    }
  }, [initialData, isEdit, templateId]);

  useEffect(() => {
    if (draftHydratedRef.current) return;
    const draft = readCustomizerDraft(templateId);
    const hydrateFrom = draft ?? (!isEdit && !initialData && demoDefaults ? demoDefaults : null);
    if (!hydrateFrom) return;

    if (isEdit && initialData && draft) {
      const serverTemplate =
        typeof initialData.templateId === "string" ? initialData.templateId : null;
      if (!serverTemplate || serverTemplate === templateId) return;
    } else if (initialData && !isEdit && draft) {
      return;
    }

    draftHydratedRef.current = true;

    const source = hydrateFrom;
    if (typeof source.brideName === "string" && source.brideName) setBrideName(source.brideName);
    if (typeof source.groomName === "string" && source.groomName) setGroomName(source.groomName);
    if (typeof source.weddingDate === "string" && source.weddingDate) {
      setWeddingDate(source.weddingDate.split("T")[0]);
    }
    if (typeof source.weddingTime === "string") setWeddingTime(source.weddingTime);
    if (typeof source.venueName === "string") setVenueName(source.venueName);
    if (typeof source.venueAddress === "string") setVenueAddress(source.venueAddress);
    if (typeof source.slug === "string" && source.slug) {
      setSlug(source.slug);
      setIsSlugManuallyEdited(true);
    }
    if (typeof source.sacredInvocation === "string") setSacredInvocation(source.sacredInvocation);
    if (typeof source.sacredVerse === "string") setSacredVerse(source.sacredVerse);
    if (typeof source.sacredTranslation === "string") setSacredTranslation(source.sacredTranslation);
    if (typeof source.heroImageUrl === "string" && source.heroImageUrl) {
      setHeroImageUrl(source.heroImageUrl);
      setHeroBgChoice("custom");
    }
    if (Array.isArray(source.slideshowImages)) setSlideshowImages(source.slideshowImages as string[]);
    if (typeof source.musicTrack === "string") setMusicTrack(source.musicTrack);
    if (Array.isArray(source.eventsJson)) setEvents(source.eventsJson as EventItem[]);
    else if (Array.isArray(source.events)) setEvents(source.events as EventItem[]);
    if (typeof source.id === "string" && source.id && !String(source.id).startsWith("demo-")) {
      setSavedInvitationId(source.id);
    }
  }, [templateId, initialData, isEdit, demoDefaults]);

  // Auto-update slug live from bride & groom names unless user explicitly customized the slug
  useEffect(() => {
    if (!isSlugManuallyEdited) {
      const generated = generateSlugFromNames(brideName, groomName);
      if (generated) {
        setSlug(generated);
      }
    }
  }, [brideName, groomName, isSlugManuallyEdited]);

  const handleAddEvent = () => {
    setEvents([
      ...events,
      { name: "Special Ceremony", enabled: true, venue: "Palace Lawns", date: "Dec 23, 2026", time: "11:00 AM" },
    ]);
  };

  const handleRemoveEvent = (index: number) => {
    setEvents(events.filter((_, idx) => idx !== index));
  };

  const handleEventChange = (index: number, field: keyof EventItem, value: any) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: value };
    setEvents(updated);
  };

  const getStepValidationError = useCallback(
    (step: number): string | null => {
      if (step === 1) {
        if (!brideName.trim()) return "Please enter the bride's name (The Couple section).";
        if (!groomName.trim()) return "Please enter the groom's name (The Couple section).";
        if (!slug.trim()) return "Please set your invitation web link (The Couple section).";
      }
      if (step === 2) {
        if (!weddingDate) return "Please select your wedding date (Date & Venue section).";
        if (!venueName.trim()) return "Please enter your venue name (Date & Venue section).";
        if (!venueAddress.trim()) return "Please enter the venue address (Date & Venue section).";
      }
      return null;
    },
    [brideName, groomName, slug, weddingDate, venueName, venueAddress]
  );

  const findFirstInvalidStep = useCallback((): { step: number; message: string } | null => {
    for (let s = 1; s <= 5; s += 1) {
      const message = getStepValidationError(s);
      if (message) return { step: s, message };
    }
    return null;
  }, [getStepValidationError]);

  const isFormComplete = useMemo(
    () => findFirstInvalidStep() === null,
    [findFirstInvalidStep]
  );

  const isLoggedIn = Boolean(session?.user?.email);

  const persistBeforeAuth = useCallback(() => {
    const payload = buildDraftPayload();
    writeCustomizerDraft(templateId, payload);
    persistCustomizerPendingSubmit(templateId, payload);
  }, [buildDraftPayload, templateId]);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    if (!consumeCustomizerResumeSubmit()) return;
    if (findFirstInvalidStep() === null) {
      setIsConfirmModalOpen(true);
    }
  }, [sessionStatus, findFirstInvalidStep]);

  const scrollToCustomizerStep = useCallback((step: number) => {
    requestAnimationFrame(() => {
      const scroller = sidebarScrollRef.current;
      const el = document.getElementById(`customizer-step-${step}`);
      if (!scroller || !el) return;
      const top =
        scroller.scrollTop +
        el.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top -
        12;
      scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }, []);

  const openCustomizerStep = useCallback(
    (step: number) => {
      setOpenSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
      setActiveStep(step);
      scrollToCustomizerStep(step);
    },
    [scrollToCustomizerStep]
  );

  const focusCustomizerStep = useCallback(
    (step: number) => {
      openCustomizerStep(step);
    },
    [openCustomizerStep]
  );

  const toggleCustomizerStep = useCallback(
    (stepId: number) => {
      setValidationError(null);
      const opening = !openSteps.includes(stepId);
      setOpenSteps((prev) =>
        prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
      );
      if (opening) {
        setActiveStep(stepId);
        scrollToCustomizerStep(stepId);
      }
    },
    [openSteps, scrollToCustomizerStep]
  );

  const handleSectionContinue = (stepId: number) => {
    setValidationError(null);
    setActiveStep(stepId);
    const message = getStepValidationError(stepId);
    if (message) {
      setValidationError(message);
      openCustomizerStep(stepId);
      return;
    }
    if (stepId < 5) {
      openCustomizerStep(stepId + 1);
    } else {
      scrollToCustomizerStep(5);
    }
  };

  const handleFloatingSaveContinue = () => {
    handleSectionContinue(activeStep);
  };

  const handlePreviewFullscreen = () => {
    writeCustomizerDraft(templateId, buildDraftPayload());
    const faith =
      religion === "muslim" ? "muslim" : religion === "hindu" ? "hindu" : "universal";
    const href = `/preview/${templateId}/interactive?customizer=1&faith=${faith}&musicTrack=${encodeURIComponent(musicTrack)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const requestSubmitFlow = () => {
    setValidationError(null);
    const invalid = findFirstInvalidStep();
    if (invalid) {
      setValidationError(invalid.message);
      openCustomizerStep(invalid.step);
      return;
    }
    if (!session?.user?.email) {
      persistBeforeAuth();
      setIsAuthModalOpen(true);
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleAuthSuccess = () => {
    consumeCustomizerResumeSubmit();
    setIsConfirmModalOpen(true);
  };

  const handleSaveInvitation = async () => {
    setValidationError(null);

    const invalid = findFirstInvalidStep();
    if (invalid) {
      setValidationError(invalid.message);
      focusCustomizerStep(invalid.step);
      return;
    }

    if (!session?.user?.email) {
      persistBeforeAuth();
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    const normalizedSlug = (slug || `${brideName}-${groomName}`)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const targetEmail = session.user.email;

    const isAlreadyPaid = Boolean(
      initialData?.isPaid === true ||
      initialData?.order?.status === "paid" ||
      initialData?.orderStatus === "paid"
    );

    const payload = {
      ...buildDraftPayload(),
      slug: normalizedSlug,
      isPaid: isAlreadyPaid,
      isPublished: isAlreadyPaid && Boolean(initialData?.isPublished),
      userEmail: targetEmail,
      email: targetEmail,
      createdAt: initialData?.createdAt || initialData?.created_at || new Date().toISOString(),
    };

    const persistLocal = (record: Record<string, unknown>, slugKey: string, idKey?: string) => {
      if (typeof window === "undefined") return;
      try {
        const payloadStr = JSON.stringify(record);
        localStorage.setItem(`unfold_invitation_${slugKey}`, payloadStr);
        if (idKey) localStorage.setItem(`unfold_invitation_${idKey}`, payloadStr);
        localStorage.setItem("unfold_pending_draft", payloadStr);
        sessionStorage.setItem("unfold_pending_draft", payloadStr);
      } catch (err) {
        console.warn("Local storage write error:", err);
      }
    };

    let finalSlug = normalizedSlug;
    let finalId = savedInvitationId || invitationId || payload.id;

    const activeId =
      savedInvitationId && !savedInvitationId.startsWith("demo-")
        ? savedInvitationId
        : invitationId && !invitationId.startsWith("demo-")
          ? invitationId
          : null;

    try {
      if (activeId) {
        const res = await fetch(`/api/invitations/${activeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.status === 401 || res.status === 403) {
          persistBeforeAuth();
          setIsAuthModalOpen(true);
          setIsSubmitting(false);
          setIsConfirmModalOpen(false);
          return;
        }

        if (res.ok) {
          const updated = await res.json();
          finalSlug = updated.slug || normalizedSlug;
          finalId = updated.id || activeId;
          setSlug(finalSlug);
          setSavedInvitationId(finalId);
          persistLocal({ ...payload, ...updated }, finalSlug, finalId);
        } else {
          console.warn("PUT /api/invitations/[id] returned non-ok status:", res.status);
        }
      } else {
        const res = await fetch("/api/invitations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.status === 401) {
          persistBeforeAuth();
          setIsAuthModalOpen(true);
          setIsSubmitting(false);
          setIsConfirmModalOpen(false);
          return;
        }

        if (res.ok) {
          const created = await res.json();
          if (created?.slug) {
            finalSlug = created.slug;
            setSlug(created.slug);
          }
          if (created?.id) {
            finalId = created.id;
            setSavedInvitationId(created.id);
          }
          persistLocal({ ...payload, ...created }, finalSlug, finalId || undefined);
        }
      }
    } catch (err) {
      console.warn("Backend sync fallback:", err);
      persistLocal(payload, normalizedSlug, activeId || undefined);
    }

    if (targetEmail && typeof window !== "undefined") {
      localStorage.setItem("unfold_user_email", targetEmail.toLowerCase());
    }

    const successRecord: CustomizerSuccessInvite = {
      id: String(finalId || `local-${finalSlug}`),
      slug: finalSlug,
      brideName,
      groomName,
      weddingDate,
      weddingTime,
      venueName,
      venueAddress,
      templateId,
    };
    setSavedInvite(successRecord);
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(true);
    setSaveSuccessMsg("Invitation saved to your dashboard.");
    setIsSubmitting(false);
  };

  const editorTitle = useMemo(
    () => (isEdit ? "Edit your invitation" : "Customize your invitation"),
    [isEdit]
  );

  const isStepComplete = useCallback(
    (stepId: number) => getStepValidationError(stepId) === null,
    [getStepValidationError]
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col lg:grid lg:h-[100dvh] lg:max-h-[100dvh] lg:grid-cols-[minmax(min(100%,320px),26rem)_minmax(0,1fr)] lg:overflow-hidden lg:items-stretch">
      <aside
        ref={sidebarScrollRef}
        data-lenis-prevent
        data-lenis-prevent-wheel
        className="customizer-sidebar-scroll flex min-h-0 w-full min-w-0 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#FAFAF8] lg:max-h-[100dvh] lg:min-h-0 lg:border-r lg:border-[#073D31]/10 lg:h-[100dvh]"
      >
        <div className="shrink-0 border-b border-[#073D31]/8 px-3 pt-5 pb-4 sm:px-4 lg:px-4 lg:pt-4">
      {/* Top Breadcrumbs / Back Navigation */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href={isEdit ? "/dashboard" : `/preview/${templateId}`}
          className="inline-flex min-h-[44px] items-center gap-1.5 font-sans text-xs font-semibold text-[#76766F] transition-colors hover:text-[#18211E]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isEdit ? "Dashboard" : "Template overview"}</span>
        </Link>

        {isEdit ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#C8A45E]/30 bg-[#C8A45E]/10 px-3 py-1 text-[11px] font-bold text-[#8B6914]">
            <Lock size={12} weight="bold" />
            <span className="max-w-[8rem] truncate sm:max-w-none">{meta.name}</span>
          </span>
        ) : null}
      </div>

      {/* Header Banner — reference-style */}
      <div>
        <h1 className="font-serif text-2xl font-medium leading-tight text-[#18211E] sm:text-3xl">
          {editorTitle}
        </h1>
        <p className="mt-1 font-sans text-xs text-[#76766F]">
          {meta.name} · {meta.style}
          {!isEdit && " · Free live demo"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsTemplatePickerOpen(true)}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-[#C8A45E]/35 bg-[#C8A45E]/10 px-4 font-sans text-xs font-bold text-[#8B6914] transition-colors hover:border-[#C8A45E]/55"
          >
            <ArrowsClockwise size={16} weight="bold" />
            Change template
          </button>
          <button
            type="button"
            onClick={handleSaveForLater}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#073D31]/15 bg-white px-4 font-sans text-xs font-bold text-[#073D31] transition-colors hover:border-[#073D31]/30"
          >
            Save for later
          </button>
        </div>
      </div>
        </div>

      <div className="mx-auto w-full max-w-3xl shrink-0 px-3 pb-8 pt-2 sm:px-4 lg:mx-0 lg:max-w-none lg:px-4 lg:pb-10">
      {/* ── Compact progress (mobile) ── */}
      <div className="mb-4 rounded-xl border border-stone-200/80 bg-white px-3 py-2.5 shadow-sm lg:hidden">
        <p className="font-sans text-[11px] font-semibold text-[#76766F]">
          {openSteps.length} section{openSteps.length === 1 ? "" : "s"} open
          {activeStep > 0 ? ` · Editing ${STEPS[activeStep - 1].title}` : ""}
        </p>
      </div>

      {/* Validation Error Toast */}
      {validationError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
          <span>{validationError}</span>
        </motion.div>
      )}

      {/* Save Success Toast */}
      {saveSuccessMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" weight="fill" />
          <span>{saveSuccessMsg}</span>
        </motion.div>
      )}

      {/* ── Accordion sections (desktop) + steps (mobile) ── */}
      <div className="space-y-2 lg:space-y-2.5">
        <CustomizerStepAccordion
          step={STEPS[0]}
          isOpen={isStepOpen(1)}
          isComplete={isStepComplete(1)}
          canOpen
          onToggle={() => toggleCustomizerStep(1)}
          sectionId="customizer-step-1"
        >
        {isStepOpen(1) && (
          <motion.div
            key="step1"
            className="min-w-0 max-w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DoubleBezelCard className="min-w-0 max-w-full overflow-hidden space-y-6 border-0 bg-transparent p-4 shadow-none sm:p-5 lg:border-stone-200/80 lg:bg-white lg:p-4 lg:shadow-sm">
              <div className="flex items-center gap-3 border-b border-stone-150 pb-4 lg:hidden">
                <div className="h-10 w-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <Heart className="h-5 w-5" weight="fill" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-stone-900 font-bold">The Couple</h2>
                  <p className="text-xs text-stone-500">Enter bride & groom names to customize the monogram & text.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Bride's First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="e.g. Diya"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Groom's First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="e.g. Shaan"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                    Your Custom Invitation Web Link *
                  </label>
                  {isSlugManuallyEdited && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSlugManuallyEdited(false);
                        const generated = generateSlugFromNames(brideName, groomName);
                        if (generated) setSlug(generated);
                      }}
                      className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ArrowsClockwise size={12} weight="bold" />
                      <span>Auto from names</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-stone-50/50 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 sm:flex-row lg:flex-col">
                  <span className="bg-stone-100 px-3.5 py-2.5 text-xs text-stone-500 select-none flex items-center font-mono border-b border-stone-200 sm:border-b-0 sm:border-r sm:py-3 lg:border-b lg:border-r-0 lg:py-2.5">
                    {siteConfig.domain}/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                      setSlug(val);
                      if (val.trim() === "") {
                        setIsSlugManuallyEdited(false);
                      } else {
                        setIsSlugManuallyEdited(true);
                      }
                    }}
                    placeholder="diya-shaan"
                    className="w-full px-3 py-3 text-sm focus:outline-none bg-transparent font-mono text-stone-800"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1.5">
                  This will be your shareable URL slug for WhatsApp and guest invitations.
                </p>
              </div>

              {/* Sacred blessings — tradition is set by this template ({meta.religionLabel}) */}
              <div className="pt-5 border-t border-stone-200/80 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Sacred invocations &amp; blessings
                  </label>
                  <p className="text-xs text-stone-500">
                    This design uses {meta.religionLabel} wording. You can edit the blessing text below; it applies to your live invitation and complimentary PDFs.
                  </p>
                </div>

                {/* Active Tradition Blessing Showcase Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/5 via-stone-50 to-stone-100/80 border border-amber-500/30 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 flex items-center gap-1.5 font-mono">
                      <Sparkle size={12} weight="fill" className="text-amber-600" />
                      Sacred Invocations &amp; Blessings ({RELIGION_PRESETS[religion].name})
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCustomizingInvocation(!isCustomizingInvocation)}
                      className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2 cursor-pointer"
                    >
                      {isCustomizingInvocation ? "Close Wording Editor" : "Customize Blessing Wording"}
                    </button>
                  </div>

                  <div className="text-center py-3 px-4 bg-white/90 rounded-lg border border-stone-200/80 shadow-xs space-y-1.5">
                    <div className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug">
                      {sacredInvocation}
                    </div>
                    {sacredVerse && (
                      <div className="text-xs text-stone-700 italic font-serif leading-relaxed max-w-xl mx-auto">
                        {sacredVerse}
                      </div>
                    )}
                    {sacredTranslation && (
                      <div className="text-[11px] text-stone-500 font-sans max-w-xl mx-auto">
                        {sacredTranslation}
                      </div>
                    )}
                  </div>

                  {/* Optional Customizer Drawer */}
                  {isCustomizingInvocation && (
                    <div className="pt-3 border-t border-stone-200 space-y-3 mt-2 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Sacred Header / Invocatory Title
                        </label>
                        <input
                          type="text"
                          value={sacredInvocation}
                          onChange={(e) => setSacredInvocation(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-900 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Holy Verse / Romantic Quote
                        </label>
                        <textarea
                          rows={2}
                          value={sacredVerse}
                          onChange={(e) => setSacredVerse(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-900 text-xs focus:outline-none focus:border-amber-500 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Translation / Meaning Line
                        </label>
                        <input
                          type="text"
                          value={sacredTranslation}
                          onChange={(e) => setSacredTranslation(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-900 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const preset = RELIGION_PRESETS[religion];
                            setSacredInvocation(preset.sacredInvocation);
                            setSacredVerse(preset.sacredVerse);
                            setSacredTranslation(preset.sacredTranslation);
                          }}
                          className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                        >
                          Reset to preset wording
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DoubleBezelCard>
          </motion.div>
        )}
        </CustomizerStepAccordion>

        <CustomizerStepAccordion
          step={STEPS[1]}
          isOpen={isStepOpen(2)}
          isComplete={isStepComplete(2)}
          canOpen
          onToggle={() => toggleCustomizerStep(2)}
          sectionId="customizer-step-2"
        >
        {isStepOpen(2) && (
          <motion.div
            key="step2"
            className="min-w-0 max-w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DoubleBezelCard className="min-w-0 max-w-full overflow-hidden bg-white border-stone-200/80 p-4 sm:p-6 lg:p-4 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-150">
                <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Calendar className="h-5 w-5" weight="fill" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-stone-900 font-bold">Date & Venue</h2>
                  <p className="text-xs text-stone-500">Set the main wedding celebration day and venue destination.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Wedding Day *
                  </label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Auspicious Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={weddingTime}
                    onChange={(e) => setWeddingTime(e.target.value)}
                    placeholder="e.g. 06:30 PM onwards"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Venue Name *
                </label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. The Ridgewood Grand Palace"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-500 bg-stone-50/50 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Venue Address & Map Location *
                </label>
                <input
                  type="text"
                  required
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="e.g. Fatehsagar Lake Road, Udaipur, Rajasthan"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-500 bg-stone-50/50 text-stone-900"
                />
              </div>
            </DoubleBezelCard>
          </motion.div>
        )}
        </CustomizerStepAccordion>

        <CustomizerStepAccordion
          step={STEPS[2]}
          isOpen={isStepOpen(3)}
          isComplete={isStepComplete(3)}
          canOpen
          onToggle={() => toggleCustomizerStep(3)}
          sectionId="customizer-step-3"
        >
        {isStepOpen(3) && (
          <motion.div
            key="step3"
            className="min-w-0 max-w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DoubleBezelCard className="min-w-0 max-w-full overflow-hidden bg-white border-stone-200/80 p-4 sm:p-6 lg:p-4 space-y-6">
              <div className="flex flex-col gap-3 border-b border-stone-150 pb-4 lg:items-stretch sm:flex-row sm:items-start sm:justify-between lg:flex-col">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Clock className="h-5 w-5" weight="fill" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-xl text-stone-900 font-bold sm:text-2xl">Ceremonies Itinerary</h2>
                    <p className="text-xs text-stone-500">Add or edit all wedding functions, times, and halls.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs sm:w-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Ceremony</span>
                </button>
              </div>

              <div className="space-y-4">
                {events.map((evt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 relative space-y-3 transition-all hover:border-amber-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
                        Ceremony #{idx + 1}
                      </span>
                      {events.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEvent(idx)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          title="Remove ceremony"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Ceremony Name</label>
                        <input
                          type="text"
                          value={evt.name}
                          onChange={(e) => handleEventChange(idx, "name", e.target.value)}
                          placeholder="e.g. Sangeet Celebration"
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white focus:outline-none focus:border-amber-500 text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Date</label>
                        <input
                          type="text"
                          value={evt.date}
                          onChange={(e) => handleEventChange(idx, "date", e.target.value)}
                          placeholder="e.g. Dec 21, 2026"
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white focus:outline-none focus:border-amber-500 text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Time</label>
                        <input
                          type="text"
                          value={evt.time}
                          onChange={(e) => handleEventChange(idx, "time", e.target.value)}
                          placeholder="e.g. 07:00 PM"
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white focus:outline-none focus:border-amber-500 text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Venue / Lawn</label>
                        <input
                          type="text"
                          value={evt.venue}
                          onChange={(e) => handleEventChange(idx, "venue", e.target.value)}
                          placeholder="e.g. Royal Palace Lawn"
                          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white focus:outline-none focus:border-amber-500 text-stone-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DoubleBezelCard>
          </motion.div>
        )}
        </CustomizerStepAccordion>

        <CustomizerStepAccordion
          step={STEPS[3]}
          isOpen={isStepOpen(4)}
          isComplete={isStepComplete(4)}
          canOpen
          onToggle={() => toggleCustomizerStep(4)}
          sectionId="customizer-step-4"
        >
        {isStepOpen(4) && (
          <motion.div
            key="step4"
            className="min-w-0 max-w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DoubleBezelCard className="min-w-0 max-w-full overflow-hidden bg-white border-stone-200/80 p-4 sm:p-6 lg:p-4 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-150">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <ImageIcon className="h-5 w-5" weight="fill" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-stone-900 font-bold">Couple Portrait & Music</h2>
                  <p className="text-xs text-stone-500">Upload your couple photo and set the background audio track.</p>
                </div>
              </div>

              {/* Opening Hero Background Choice & Photo */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    1. Opening Hero Portal Background
                  </label>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
                    <Sparkle size={12} weight="fill" className="text-emerald-500" />
                    <span>100% Optional</span>
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                  Choose whether you want to use the template&apos;s default handcrafted royal palace artwork or upload your own romantic couple portrait.
                </p>

                {/* Choice Selector Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 mb-4">
                  {/* Option A: Template Default */}
                  <div
                    onClick={() => {
                      setHeroBgChoice("default");
                      setHeroImageUrl("");
                    }}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                      heroBgChoice === "default" && !heroImageUrl
                        ? "border-amber-600 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/20"
                        : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          heroBgChoice === "default" && !heroImageUrl
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        <Crown size={22} weight="fill" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-xs font-bold text-stone-900 truncate">Template Signature Artwork</h3>
                          {heroBgChoice === "default" && !heroImageUrl && (
                            <CheckCircle size={17} weight="fill" className="text-amber-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                          Use the template&apos;s handcrafted royal palace gateway. No photo upload needed.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-400 font-medium">
                      <span>Instant &amp; Ready</span>
                      <span className="text-amber-700 font-semibold uppercase tracking-wider">Default &amp; Recommended</span>
                    </div>
                  </div>

                  {/* Option B: Upload Own Portrait */}
                  <div
                    onClick={() => setHeroBgChoice("custom")}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                      heroBgChoice === "custom" || heroImageUrl
                        ? "border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-600/20"
                        : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          heroBgChoice === "custom" || heroImageUrl
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        <Camera size={22} weight="fill" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-xs font-bold text-stone-900 truncate">Upload Our Own Photo</h3>
                          {(heroBgChoice === "custom" || heroImageUrl) && (
                            <CheckCircle size={17} weight="fill" className="text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                          Personalize the opening portal with your own portrait photo.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-400 font-medium">
                      <span>Customized Portal</span>
                      <span className="text-emerald-700 font-semibold uppercase tracking-wider">1080 × 1920 px (9:16)</span>
                    </div>
                  </div>
                </div>

                {/* Custom Photo Uploader Container with Dimension Specs */}
                {(heroBgChoice === "custom" || heroImageUrl) && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/90 border border-stone-200/90 space-y-4 animate-in fade-in duration-200">
                    {/* Size & Clearance Specification Callout */}
                    <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-3">
                      <Info size={20} weight="fill" className="text-amber-700 shrink-0 mt-0.5" />
                      <div className="space-y-1.5 text-[11px] leading-relaxed">
                        <p className="font-bold text-amber-950 text-xs">
                          Recommended Photo Size: <span className="underline decoration-amber-500 underline-offset-2">1080 × 1920 px (9:16 Portrait)</span> or <span className="underline decoration-amber-500 underline-offset-2">1200 × 1600 px (3:4)</span>
                        </p>
                        <p className="text-amber-800">
                          • <strong>File Requirements:</strong> PNG, JPG, or WebP up to 8MB.<br />
                          • <strong>Facial Clearance Guarantee:</strong> For optimal mobile presentation, keep faces centered or in the upper-middle area so bottom text cards do not cover them.
                        </p>
                      </div>
                    </div>

                    <ImageUploader
                      initialUrl={heroImageUrl}
                      onUploadSuccess={(url: string) => {
                        setHeroImageUrl(url);
                        setHeroBgChoice("custom");
                      }}
                      onImageUploaded={(url: string) => {
                        setHeroImageUrl(url);
                        if (!url) setHeroBgChoice("default");
                      }}
                      label="Select or Drag Couple Portrait"
                    />

                    {heroImageUrl && (
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                        <span className="text-stone-500">Currently using custom couple portrait</span>
                        <button
                          type="button"
                          onClick={() => {
                            setHeroImageUrl("");
                            setHeroBgChoice("default");
                          }}
                          className="text-amber-700 hover:text-amber-900 font-semibold hover:underline"
                        >
                          Revert to Default Artwork
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Multiple Gallery Photos */}
              <div className="pt-4 border-t border-stone-150">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  2. Cherished Memories & Gallery Photos (Multi-Upload)
                </label>
                <p className="text-xs text-stone-500 mb-3">
                  Upload 1 to 6 photos. The gallery bento grid will automatically adapt to show only your uploaded photos.
                </p>
                <MultiImageUploader
                  images={slideshowImages}
                  onChange={setSlideshowImages}
                  maxImages={6}
                  label="Add Gallery Photos"
                  tradition={religion}
                  enableLibrary={true}
                />
              </div>

              {/* 3. Audio & Wedding Soundtrack Selector */}
              <div className="pt-4 border-t border-stone-150">
                <AudioTrackSelector
                  selectedTrackUrl={musicTrack}
                  onChange={(url) => setMusicTrack(url)}
                  templateDefaultUrl={`/audio/wedding-ambience.mp3`}
                />
              </div>
            </DoubleBezelCard>
          </motion.div>
        )}
        </CustomizerStepAccordion>

        <CustomizerStepAccordion
          step={STEPS[4]}
          isOpen={isStepOpen(5)}
          isComplete={isStepComplete(5)}
          canOpen
          onToggle={() => toggleCustomizerStep(5)}
          sectionId="customizer-step-5"
        >
        {isStepOpen(5) && (
          <motion.div
            key="step5"
            className="min-w-0 max-w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DoubleBezelCard className="min-w-0 max-w-full overflow-hidden bg-white border-stone-200/80 p-4 sm:p-6 lg:p-4 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-150">
                <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Sparkle className="h-5 w-5 text-amber-600" weight="fill" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-stone-900 font-bold">
                    {isEdit ? "Review & Save Changes" : "Review Your Invitation"}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {isEdit
                      ? "Review your updated details below before saving."
                      : "Everything is ready! Click below to generate your live interactive preview."}
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-3">
                <div className="min-w-0 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">Couple</span>
                  <span className="font-serif text-lg font-bold text-stone-900 block break-words">{brideName} & {groomName}</span>
                  <span className="mt-1 block break-all text-xs font-mono text-amber-700">{siteConfig.domain}/{slug}</span>
                </div>

                <div className="min-w-0 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">Tradition &amp; Blessings</span>
                  <span className="font-serif text-base font-bold text-stone-900 flex flex-wrap items-center gap-1.5">
                    <span>{RELIGION_PRESETS[religion].icon}</span>
                    <span>{RELIGION_PRESETS[religion].name}</span>
                  </span>
                  <span className="mt-1 block break-words text-xs leading-relaxed text-amber-900/90">{sacredInvocation}</span>
                </div>

                <div className="min-w-0 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">Date & Time</span>
                  <span className="font-serif text-lg font-bold text-stone-900 block">{weddingDate}</span>
                  <span className="text-xs text-stone-600">{weddingTime}</span>
                </div>

                <div className="min-w-0 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">Venue</span>
                  <span className="font-serif text-base font-bold text-stone-900 block break-words">{venueName}</span>
                  <span className="text-xs text-stone-600 break-words">{venueAddress}</span>
                </div>

                <div className="min-w-0 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">Ceremonies ({events.length})</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {events.map((evt, idx) => (
                      <span key={idx} className="text-xs bg-white border border-stone-200 px-2.5 py-1 rounded-lg text-stone-700 font-medium">
                        {evt.name} · {evt.time}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="min-w-0 p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-0.5">Photos Attached</span>
                    <span className="text-xs text-stone-700 font-medium">
                      {heroImageUrl ? "✓ Main Hero Portrait" : "Template Royal Artwork"} · {slideshowImages.length} Gallery Photo{slideshowImages.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {heroImageUrl && (
                    <img src={heroImageUrl} alt="Hero portrait preview" className="h-10 w-10 rounded-lg object-cover border border-stone-300" />
                  )}
                </div>
              </div>

                {/* ── Complimentary PDF Benefit Showcase Card ── */}
                <div className="flex min-w-0 flex-col justify-between gap-4 rounded-2xl border-2 border-[#C8A45E]/40 bg-gradient-to-br from-amber-500/10 via-[#073D31]/5 to-transparent p-4 shadow-sm sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C8A45E]" />
                      <span className="text-[10px] uppercase font-bold text-[#8C6D23] tracking-widest font-sans">
                        Complimentary Stationery Included
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Two Matching Printable PDF Invitations
                    </h3>
                    <p className="text-xs text-stone-600 max-w-md leading-relaxed">
                      Included free with your website: <strong>Barat / Ceremony</strong> and <strong>Reception / Walima</strong> invitations matching {meta.name}&apos;s gold foil styling.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] font-bold text-xs uppercase tracking-wider font-sans transition-all shadow-md hover:scale-105 active:scale-98 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <FilePdf size={16} weight="bold" className="text-[#C8A45E]" />
                    <span>Preview &amp; Download PDFs</span>
                  </button>
                </div>

                {/* Status Note */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" weight="fill" />
                <div className="text-xs text-emerald-900">
                  <span className="font-bold block">
                    {isEdit ? "Instant Cloud & Dashboard Synchronization" : "Free Instant Live Demo Preview"}
                  </span>
                  <span>
                    {isEdit
                      ? "Your changes will be saved to your dashboard and live link immediately."
                      : "You will be able to test all animations, music, and the scratch reveal card. If you like it, unlock your permanent live website with one-time payment."}
                  </span>
                </div>
              </div>
            </DoubleBezelCard>
          </motion.div>
        )}
        </CustomizerStepAccordion>
      </div>
      </div>

      <CustomizerFloatingActionBar
        isFormComplete={isFormComplete}
        isLoggedIn={isLoggedIn}
        isEdit={isEdit}
        isSubmitting={isSubmitting}
        activeStep={activeStep}
        onSaveContinue={handleFloatingSaveContinue}
        onPreview={handlePreviewFullscreen}
        onPrimaryAction={requestSubmitFlow}
      />

      {/* ── Complimentary PDF Preview Modal ── */}
      <PdfPreviewModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        templateId={templateId}
        hideReligionSelector
        initialData={{
          brideName,
          groomName,
          weddingDate,
          weddingTime,
          venueName,
          venueAddress,
          events,
          religion,
          sacredInvocation,
          sacredVerse,
          sacredTranslation,
        }}
      />

      <CustomizerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthSuccess}
        defaultName={`${brideName} & ${groomName}`}
        onBeforeAuth={persistBeforeAuth}
      />

      <CustomizerSubmitConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => void handleSaveInvitation()}
        isSubmitting={isSubmitting}
        coupleLabel={`${brideName} & ${groomName}`}
      />

      <CustomizerSubmitSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        invite={savedInvite}
        onShare={() => {
          setIsSuccessModalOpen(false);
          setIsShareModalOpen(true);
        }}
        onOpenFullscreenPreview={handlePreviewFullscreen}
      />

      {savedInvite ? (
        <ShareInvitationModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          invite={savedInvite}
        />
      ) : null}

      <CustomizerTemplatePickerModal
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        currentTemplateId={templateId}
        onSelectTemplate={handleSelectTemplate}
        activeReligion={religion}
      />
      </aside>

      <aside className="hidden lg:flex lg:min-h-0 lg:h-full lg:max-h-full lg:flex-col lg:overflow-hidden">
        <CustomizerLivePreviewPanel
          ref={previewPanelRef}
          templateId={templateId}
          templateName={meta.name}
          religion={religion}
          musicTrack={musicTrack}
        />
      </aside>
    </div>
  );
}
