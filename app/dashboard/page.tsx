"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { GlassNav } from "@/components/ui/glass-nav";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { siteConfig } from "@/config/site";
import { 
  Sparkle, 
  EnvelopeSimple, 
  Users, 
  Link as LinkIcon, 
  Pencil, 
  ShareNetwork, 
  DownloadSimple, 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  SignOut,
  User as UserIcon,
  Phone,
  MagnifyingGlass,
  Heart,
  ChatCircleDots,
  TrashSimple,
  ShieldCheck,
  FilePdf,
  Copy,
  LockKey,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { formatDate, formatDateTime } from "@/lib/utils";
import { PdfPreviewModal } from "@/components/pdf-invitation/PdfPreviewModal";
import { ShareInvitationModal } from "@/components/sharing/ShareInvitationModal";
import { RazorpayCheckoutButton } from "@/components/payment/RazorpayCheckoutButton";

// Helper to robustly extract and format invitation created_at timestamp
function getInviteCreatedAt(invite: any): string {
  if (!invite) return "";
  const raw = invite.createdAt || invite.created_at || invite.updatedAt || invite.updated_at;
  if (raw) {
    const formatted = formatDateTime(raw);
    if (formatted) return formatted;
  }
  if (typeof invite.id === "string" && invite.id.startsWith("demo-")) {
    const ts = parseInt(invite.id.replace("demo-", ""), 10);
    if (!isNaN(ts) && ts > 1000000000000) {
      return formatDateTime(new Date(ts));
    }
  }
  return "";
}

// Helper to robustly extract RSVP attendance & guest count from flat or multi-event json
function parseRsvpData(rsvpJson: any) {
  const rsvp = rsvpJson || {};
  let isAttending = false;
  let guestCount = 1;
  let phone = rsvp.phone || "";
  let eventsList: { name: string; attending: boolean; guests: number }[] = [];

  if (rsvp.attending === true || rsvp.attending === "yes") {
    isAttending = true;
    guestCount = parseInt(rsvp.guests, 10) || 1;
  } else if (rsvp.attending === false || rsvp.attending === "no") {
    isAttending = false;
    guestCount = 0;
  } else if (typeof rsvp === "object") {
    const eventEntries = Object.entries(rsvp).filter(
      ([k, v]: any) => typeof v === "object" && v !== null && ("attending" in v || "guests" in v)
    );
    if (eventEntries.length > 0) {
      eventEntries.forEach(([name, ev]: any) => {
        const evAttending = ev.attending === true || ev.attending === "yes";
        const evGuests = parseInt(ev.guests, 10) || 1;
        eventsList.push({ name, attending: evAttending, guests: evGuests });
        if (evAttending) {
          isAttending = true;
          guestCount = Math.max(guestCount, evGuests);
        }
      });
    }
  }

  return { isAttending, guestCount, phone, eventsList };
}

export default function DashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);

  // Filter & Search states
  const [rsvpSearch, setRsvpSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState<"all" | "attending" | "declined">("all");
  const [selectedInviteFilter, setSelectedInviteFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedPdfInvite, setSelectedPdfInvite] = useState<any | null>(null);
  const [selectedShareInvite, setSelectedShareInvite] = useState<any | null>(null);

  const handleCopyLink = (slug: string) => {
    try {
      const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : siteConfig.url;
      const url = `${origin}/${slug}`;
      navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleDeleteInvitation = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${name}"?\n\nThis will permanently delete the invitation webpage, photos, and all guest RSVPs. This action cannot be reversed.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/invitations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
        setMessages((prev) => prev.filter((m) => m.invitationSlug !== name && m.invitationId !== id));
      } else {
        alert("Unable to delete invitation right now. Please try again or reach out to support.");
      }
    } catch (err) {
      console.error("Delete invitation error:", err);
      // Optimistic cleanup in sandbox/local mode
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "unpaid">("all");

  const loadDashboardData = useCallback(async () => {
    let email: string | null = session?.user?.email || null;

    if (typeof window !== "undefined") {
      try {
        if (!email) {
          email = localStorage.getItem("unfold_user_email");
        } else {
          localStorage.setItem("unfold_user_email", email);
        }
        setConnectedEmail(email);
      } catch (e) {}
    }

    if (email) {
      // Check for any single pending draft created before login
      let pendingDraft: any = null;
      if (typeof window !== "undefined") {
        try {
          const rawDraft = localStorage.getItem("unfold_pending_draft") || sessionStorage.getItem("unfold_pending_draft");
          if (rawDraft) {
            pendingDraft = JSON.parse(rawDraft);
          }
        } catch (_) {}
      }

      try {
        if (pendingDraft) {
          // Claim single pending draft and clear it
          const claimRes = await fetch("/api/invitations/claim", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email.toLowerCase(),
              draft: pendingDraft,
            }),
          });

          if (typeof window !== "undefined") {
            localStorage.removeItem("unfold_pending_draft");
            sessionStorage.removeItem("unfold_pending_draft");
          }

          if (claimRes.ok) {
            const claimData = await claimRes.json();
            setInvitations(claimData.invitations || []);
            setMessages(claimData.messages || []);
            setIsDemoMode(false);
            setLoading(false);
            return;
          }
        }

        // Fetch strictly the user's invitations from database
        const response = await fetch(`/api/invitations?email=${encodeURIComponent(email)}`);
        if (response.ok) {
          const data = await response.json();
          setInvitations(data.invitations || []);
          setMessages(data.messages || []);
          setIsDemoMode(false);
        } else {
          setInvitations([]);
          setMessages([]);
        }
      } catch (err) {
        console.warn("Failed to fetch user invitations:", err);
        setInvitations([]);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Unauthenticated sandbox session
      loadMockDashboardData();
      setLoading(false);
    }
  }, [session]);

  function loadMockDashboardData() {
    setIsDemoMode(true);
    const mockInvitations = [
      {
        id: "demo-invitation-id-1",
        brideName: "Ananya",
        groomName: "Shubham",
        slug: "ananya-shubham-yheb",
        templateId: "royal-majesty",
        weddingDate: "2026-12-22T18:30:00.000Z",
        venueName: "The Ridgewood Grand Palace",
        isPaid: true,
        orderStatus: "paid",
        orderAmount: 1199,
      },
      {
        id: "demo-invitation-id-2",
        brideName: "Ananya",
        groomName: "Shubhamm",
        slug: "ananya-shubhamm",
        templateId: "celestial-rose",
        weddingDate: "2026-12-22T18:30:00.000Z",
        venueName: "The Ridgewood Grand Palace",
        isPaid: false,
        orderStatus: "pending",
        orderAmount: 1499,
      }
    ];
    setInvitations(mockInvitations);

    const mockMessages = [
      {
        id: "m1",
        guestName: "Vikram & Neha Sharma",
        message: "Congratulations! Wishing you a lifetime of royal happiness together.",
        rsvpJson: {
          phone: "+91 91234 56789",
          attending: true,
          guests: 2,
          submittedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        invitationSlug: "ananya-shubham-yheb",
      }
    ];
    setMessages(mockMessages);
  }

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Overall calculations
  let totalAttendingHeadcount = 0;
  let totalAttendingResponses = 0;
  let totalDeclinedResponses = 0;

  messages.forEach((msg) => {
    const { isAttending, guestCount } = parseRsvpData(msg.rsvpJson);
    if (isAttending) {
      totalAttendingResponses += 1;
      totalAttendingHeadcount += guestCount;
    } else {
      totalDeclinedResponses += 1;
    }
  });

  const totalRSVPs = messages.length;

  // Paid vs Unpaid categorizations
  const paidInvitations = invitations.filter((inv) => Boolean(inv.isPaid));
  const unpaidInvitations = invitations.filter((inv) => !Boolean(inv.isPaid));
  const paidCount = paidInvitations.length;
  const unpaidCount = unpaidInvitations.length;

  const displayedInvitations = invitations.filter((invite) => {
    if (paymentFilter === "paid") return Boolean(invite.isPaid);
    if (paymentFilter === "unpaid") return !Boolean(invite.isPaid);
    return true;
  });

  // Filtered guest messages list
  const filteredMessages = messages.filter((msg) => {
    const { isAttending, phone } = parseRsvpData(msg.rsvpJson);

    if (attendanceFilter === "attending" && !isAttending) return false;
    if (attendanceFilter === "declined" && isAttending) return false;

    if (selectedInviteFilter !== "all" && msg.invitationSlug && msg.invitationSlug !== selectedInviteFilter) {
      return false;
    }

    if (rsvpSearch.trim()) {
      const q = rsvpSearch.toLowerCase();
      const matchName = msg.guestName?.toLowerCase().includes(q);
      const matchMsg = msg.message?.toLowerCase().includes(q);
      const matchPhone = String(phone).includes(q);
      if (!matchName && !matchMsg && !matchPhone) return false;
    }

    return true;
  });

  const downloadCSV = () => {
    const headers = ["Guest Name", "Phone", "Status", "Attending Headcount", "Wishes / Note", "Invitation", "Date Received"];
    const rows = filteredMessages.map((msg) => {
      const { isAttending, guestCount, phone, eventsList } = parseRsvpData(msg.rsvpJson);
      const statusText = isAttending
        ? `Attending (${guestCount} ${guestCount === 1 ? "Guest" : "Guests"})`
        : "Declined";
      const eventsSummary = eventsList.length > 0
        ? eventsList.map((e) => `${e.name}: ${e.attending ? `Yes (${e.guests})` : "No"}`).join(" | ")
        : "";

      return [
        `"${(msg.guestName || "").replace(/"/g, '""')}"`,
        `"${(phone || "").replace(/"/g, '""')}"`,
        `"${statusText}"`,
        isAttending ? guestCount : 0,
        `"${(msg.message || eventsSummary || "").replace(/"/g, '""')}"`,
        `"${msg.invitationSlug || msg.invitationCouple || "Wedding"}"`,
        `"${new Date(msg.createdAt).toLocaleString("en-IN")}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wedding_guest_rsvps_manifest.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center text-[#1A1A1A]">
        <Sparkle className="h-10 w-10 text-amber-500 animate-spin-slow mb-2" />
        <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF7] text-[#1A1A1A]">
      <GlassNav />

      <main className="flex-grow pt-32 px-4 sm:px-6 pb-24 max-w-6xl mx-auto w-full">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-600 mb-2">
              <Sparkle className="h-4 w-4" weight="fill" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Wedding Host Hub</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-stone-900 leading-tight">
              Invitations &amp; Guest RSVPs
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {connectedEmail && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold px-3 py-0.5">
                  <CheckCircle size={14} weight="fill" className="text-emerald-600" />
                  <span>Account: {connectedEmail}</span>
                </span>
              )}
              {isDemoMode && !connectedEmail && (
                <span className="inline-block rounded bg-amber-500/10 text-amber-600 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  Developer Sandbox Session
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {connectedEmail && (
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("unfold_user_email");
                  }
                  signOut({ callbackUrl: "/login" });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-stone-250 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                <SignOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            )}

            <Link href="/dashboard/invitation/new">
              <PremiumButton className="w-full sm:w-auto">
                <div className="flex items-center gap-1.5 font-bold">
                  <Plus className="h-4 w-4" weight="bold" />
                  <span>Create New Invite</span>
                </div>
              </PremiumButton>
            </Link>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Metric 1: Total Confirmed Guests */}
          <DoubleBezelCard className="bg-white border-stone-200/60 p-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Attending Guests
                </span>
                <h3 className="text-3xl font-bold text-stone-950 mt-1 font-mono">
                  {totalAttendingHeadcount}
                </h3>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">
                  {totalAttendingResponses} Confirmed RSVPs
                </span>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Users className="h-5 w-5" weight="bold" />
              </div>
            </div>
          </DoubleBezelCard>

          {/* Metric 2: Total Responses */}
          <DoubleBezelCard className="bg-white border-stone-200/60 p-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Total RSVPs Received
                </span>
                <h3 className="text-3xl font-bold text-stone-950 mt-1 font-mono">
                  {totalRSVPs}
                </h3>
                <span className="text-[10px] text-stone-500 font-semibold mt-1 inline-block">
                  {totalDeclinedResponses} Declined
                </span>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
                <EnvelopeSimple className="h-5 w-5" weight="bold" />
              </div>
            </div>
          </DoubleBezelCard>

          {/* Metric 3: Total Invitations / Paid Status */}
          <DoubleBezelCard className="bg-white border-stone-200/60 p-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Total Invitations
                </span>
                <h3 className="text-3xl font-bold text-stone-950 mt-1 font-mono">
                  {invitations.length}
                </h3>
                <div className="text-[10px] font-semibold mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-emerald-700 font-bold">{paidCount} Paid &amp; Live</span>
                  <span className="text-stone-300">•</span>
                  <span className={unpaidCount > 0 ? "text-amber-700 font-bold" : "text-stone-400"}>
                    {unpaidCount} Need Payment
                  </span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700">
                <Heart className="h-5 w-5" weight="fill" />
              </div>
            </div>
          </DoubleBezelCard>

          {/* Metric 4: Platform Status */}
          <DoubleBezelCard className="bg-white border-stone-200/60 p-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  RSVP Collection
                </span>
                <h3 className="text-base font-bold text-emerald-600 mt-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle className="h-4.5 w-4.5" weight="fill" />
                  <span>Real-time Active</span>
                </h3>
                <span className="text-[10px] text-stone-400 font-semibold mt-1 inline-block">
                  Syncing with Cloud
                </span>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400">
                <Clock className="h-5 w-5" weight="bold" />
              </div>
            </div>
          </DoubleBezelCard>
        </div>

        {/* ── Section 1: Invitations & Category Tabs ── */}
        <div className="space-y-4 mb-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Your Digital Wedding Invitations
              </h2>
              <p className="text-xs text-stone-500">
                Manage details, complete payment to publish live, and share your personalized link with guests.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="inline-flex items-center p-1 bg-stone-100/90 rounded-2xl border border-stone-250/70 max-w-full overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => setPaymentFilter("all")}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer min-h-[40px] ${
                  paymentFilter === "all"
                    ? "bg-white text-stone-950 shadow-xs border border-stone-200/80"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                <span>All Invitations</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  paymentFilter === "all" ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-700"
                }`}>
                  {invitations.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentFilter("paid")}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer min-h-[40px] ${
                  paymentFilter === "paid"
                    ? "bg-white text-emerald-950 shadow-xs border border-emerald-300"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                <CheckCircle size={14} weight="fill" className="text-emerald-600" />
                <span>Paid &amp; Live</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  paymentFilter === "paid" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {paidCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentFilter("unpaid")}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer min-h-[40px] ${
                  paymentFilter === "unpaid"
                    ? "bg-white text-amber-950 shadow-xs border border-amber-300"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                <LockKey size={14} weight="fill" className="text-amber-600" />
                <span>Unpaid · Need Payment</span>
                {unpaidCount > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500 text-stone-950 font-bold">
                    {unpaidCount}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-stone-200 text-stone-700">
                    0
                  </span>
                )}
              </button>
            </div>
          </div>

          {invitations.length === 0 ? (
            <DoubleBezelCard className="text-center py-12 bg-white border-stone-200">
              <EnvelopeSimple size={40} className="text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-serif font-bold text-stone-700 mb-1">No Invitations Yet</p>
              <p className="text-xs text-stone-400 mb-4">Create your first bespoke digital invitation in minutes.</p>
              <Link href="/dashboard/invitation/new">
                <PremiumButton>Create Your First Invite</PremiumButton>
              </Link>
            </DoubleBezelCard>
          ) : displayedInvitations.length === 0 ? (
            <DoubleBezelCard className="text-center py-12 bg-white border-stone-200">
              {paymentFilter === "paid" ? (
                <>
                  <LockKey size={40} className="text-amber-500 mx-auto mb-3" weight="fill" />
                  <p className="text-sm font-serif font-bold text-stone-900 mb-1">No Paid Invitations Yet</p>
                  <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
                    You currently have {unpaidCount} invitation draft awaiting payment to go live for guests.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter("unpaid")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <LockKey size={14} weight="fill" />
                    <span>View Unpaid Invitations ({unpaidCount})</span>
                  </button>
                </>
              ) : (
                <>
                  <CheckCircle size={40} className="text-emerald-500 mx-auto mb-3" weight="fill" />
                  <p className="text-sm font-serif font-bold text-stone-900 mb-1">All Caught Up!</p>
                  <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
                    All of your digital wedding invitations are paid, live, and actively collecting RSVPs.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter("all")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <span>View All Invitations ({invitations.length})</span>
                  </button>
                </>
              )}
            </DoubleBezelCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayedInvitations.map((invite) => {
                const createdAtStr = getInviteCreatedAt(invite);
                const isPaid = Boolean(invite.isPaid);

                return (
                  <DoubleBezelCard
                    key={invite.id}
                    className={`bg-white p-6 flex flex-col justify-between gap-5 shadow-xs transition-all relative ${
                      isPaid
                        ? "border-emerald-200/80 hover:border-emerald-300"
                        : "border-amber-300/80 bg-gradient-to-b from-amber-50/25 to-white hover:border-amber-400"
                    }`}
                  >
                    <div>
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/60 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                            {invite.templateId?.replace(/-/g, " ") || "Royal Lotus"}
                          </span>

                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                              <CheckCircle size={12} weight="fill" className="text-emerald-600" />
                              <span>Paid · Live</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                              <LockKey size={12} weight="fill" className="text-amber-700" />
                              <span>Unpaid · Payment Needed</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1 shrink-0">
                          <Calendar size={12} className="text-stone-400" />
                          <span>{formatDate(invite.weddingDate)}</span>
                        </span>
                      </div>

                      {/* Names & Venue */}
                      <h3 className="text-2xl font-serif font-bold text-stone-950">
                        {invite.brideName} &amp; {invite.groomName}
                      </h3>
                      
                      {invite.venueName && (
                        <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                          📍 {invite.venueName}
                        </p>
                      )}

                      {createdAtStr && (
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-2 font-mono">
                          <Clock size={13} weight="bold" className="text-amber-700/80 shrink-0" />
                          <span>Created: <strong className="font-semibold text-stone-700">{createdAtStr}</strong></span>
                        </div>
                      )}

                      {/* Link Row */}
                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        {isPaid ? (
                          <a
                            href={`/${invite.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition truncate max-w-[calc(100%-85px)]"
                            title="Open live invitation in new tab"
                          >
                            <LinkIcon size={14} weight="bold" className="shrink-0 text-emerald-600" />
                            <span className="truncate">{siteConfig.domain}/{invite.slug}</span>
                          </a>
                        ) : (
                          <a
                            href={`/${invite.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-800 transition truncate max-w-[calc(100%-85px)]"
                            title="Preview draft invitation"
                          >
                            <ArrowSquareOut size={14} weight="bold" className="shrink-0 text-amber-600" />
                            <span className="truncate">{siteConfig.domain}/{invite.slug}</span>
                            <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-mono font-normal">Draft</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCopyLink(invite.slug)}
                          className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer min-h-[34px] ${
                            copiedSlug === invite.slug
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                              : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                          }`}
                          title="Copy invitation link to clipboard"
                        >
                          {copiedSlug === invite.slug ? (
                            <>
                              <CheckCircle size={13} weight="fill" className="text-emerald-600" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} weight="bold" className="text-stone-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Middle Status / Payment Action Callout */}
                      {isPaid ? (
                        <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2 text-emerald-900 text-xs">
                          <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0" />
                          <span className="text-[11px] leading-tight">
                            <strong>Live &amp; Verified.</strong> All guest RSVPs are syncing directly to your manifest below.
                          </span>
                        </div>
                      ) : (
                        <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300/90 flex flex-col gap-2.5 shadow-2xs">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                              <LockKey size={18} weight="fill" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                                  Payment Needed to Go Live
                                </h4>
                                <span className="text-xs font-mono font-extrabold text-amber-950 bg-amber-200/70 px-2 py-0.5 rounded-md border border-amber-300">
                                  ₹{invite.orderAmount || 1499}
                                </span>
                              </div>
                              <p className="text-[11px] text-amber-800 mt-1 leading-snug">
                                Complete payment to publish live for guests, remove demo banners, unlock matching PDFs, and activate real-time RSVP collection.
                              </p>
                            </div>
                          </div>

                          <RazorpayCheckoutButton
                            invitationId={invite.id}
                            slug={invite.slug}
                            templateId={invite.templateId}
                            amount={invite.orderAmount || 1499}
                            brideName={invite.brideName}
                            groomName={invite.groomName}
                            onSuccess={() => {
                              loadDashboardData();
                            }}
                            buttonText={`Pay & Unlock Invitation (₹${invite.orderAmount || 1499})`}
                            className="w-full justify-center !py-2.5 !text-xs !font-bold !rounded-xl !shadow-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Buttons */}
                    {isPaid ? (
                      <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => setSelectedPdfInvite(invite)}
                          className="w-full text-center border border-amber-300/90 bg-gradient-to-r from-amber-50 to-amber-100/60 hover:from-amber-100 hover:to-amber-200/60 text-amber-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer min-h-[40px]"
                        >
                          <FilePdf size={15} weight="bold" className="text-amber-700" />
                          <span>Download 2 Matching PDFs</span>
                          <span className="text-[9px] bg-amber-200/90 text-amber-900 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider ml-1">
                            Free Included
                          </span>
                        </button>

                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                          <Link href={`/dashboard/invitation/${invite.id}/edit`} className="w-full sm:flex-1">
                            <button className="w-full text-center border border-stone-250 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[44px]">
                              <Pencil size={14} weight="bold" />
                              <span>Edit Details</span>
                            </button>
                          </Link>

                          {/* Dedicated Copy Link Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(invite.slug)}
                            className={`w-full sm:flex-1 text-center border font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px] ${
                              copiedSlug === invite.slug
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                : "border-stone-250 bg-white hover:bg-stone-50 text-stone-800"
                            }`}
                          >
                            {copiedSlug === invite.slug ? (
                              <>
                                <CheckCircle size={15} weight="fill" />
                                <span>Link Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={15} weight="bold" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          {/* Dedicated Share Link Button (Opens Share Modal) */}
                          <button
                            type="button"
                            onClick={() => setSelectedShareInvite(invite)}
                            className="w-full sm:flex-1 text-center border border-amber-300/80 bg-gradient-to-r from-amber-50 to-amber-100/70 hover:from-amber-100 hover:to-amber-200/70 text-amber-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs min-h-[44px]"
                          >
                            <ShareNetwork size={15} weight="bold" className="text-amber-700" />
                            <span>Share Link</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteInvitation(invite.id, `${invite.brideName} & ${invite.groomName}`)}
                            disabled={deletingId === invite.id}
                            title="Permanently delete invitation and wipe guest data"
                            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-rose-200/80 bg-rose-50/60 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
                          >
                            <TrashSimple size={14} weight="bold" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                          <Link href={`/dashboard/invitation/${invite.id}/edit`} className="w-full sm:flex-1">
                            <button className="w-full text-center border border-stone-250 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[44px]">
                              <Pencil size={14} weight="bold" />
                              <span>Edit Details</span>
                            </button>
                          </Link>

                          <a
                            href={`/${invite.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:flex-1"
                          >
                            <button className="w-full text-center border border-stone-250 bg-white hover:bg-stone-50 text-stone-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[44px]">
                              <ArrowSquareOut size={14} weight="bold" />
                              <span>Preview Draft</span>
                            </button>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              alert("Please complete payment above to unlock full guest sharing (WhatsApp, Instagram, QR codes).");
                            }}
                            className="w-full sm:flex-1 text-center border border-dashed border-stone-300 bg-stone-50 text-stone-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-not-allowed min-h-[44px]"
                            title="Payment required to share with guests"
                          >
                            <LockKey size={14} weight="bold" />
                            <span>Share (Locked)</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteInvitation(invite.id, `${invite.brideName} & ${invite.groomName}`)}
                            disabled={deletingId === invite.id}
                            title="Permanently delete draft invitation"
                            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-rose-200/80 bg-rose-50/60 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
                          >
                            <TrashSimple size={14} weight="bold" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </DoubleBezelCard>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Section 2: Complete Guest RSVPs Manifest & Wishes ── */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-amber-600 mb-1">
                <Heart size={14} weight="fill" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Live Guest Manifest</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Guest RSVPs &amp; Wishes ({messages.length})
              </h2>
              <p className="text-xs text-stone-500">
                Detailed headcount confirmations, contact numbers, and heartfelt notes submitted by your guests.
              </p>
            </div>

            {messages.length > 0 && (
              <button
                onClick={downloadCSV}
                className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Export Guest List (CSV)</span>
              </button>
            )}
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <MagnifyingGlass
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                placeholder="Search by guest name, phone, or message..."
                value={rsvpSearch}
                onChange={(e) => setRsvpSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter by Invitation (if multiple) */}
              {invitations.length > 1 && (
                <select
                  value={selectedInviteFilter}
                  onChange={(e) => setSelectedInviteFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Invitations</option>
                  {invitations.map((inv) => (
                    <option key={inv.slug} value={inv.slug}>
                      /{inv.slug} ({inv.brideName} &amp; {inv.groomName})
                    </option>
                  ))}
                </select>
              )}

              {/* Status Filter Buttons */}
              <button
                onClick={() => setAttendanceFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  attendanceFilter === "all"
                    ? "bg-stone-900 text-amber-400"
                    : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900"
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setAttendanceFilter("attending")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  attendanceFilter === "attending"
                    ? "bg-emerald-700 text-white"
                    : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900"
                }`}
              >
                Attending ({totalAttendingResponses})
              </button>
              <button
                onClick={() => setAttendanceFilter("declined")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  attendanceFilter === "declined"
                    ? "bg-rose-700 text-white"
                    : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900"
                }`}
              >
                Declined ({totalDeclinedResponses})
              </button>
            </div>
          </div>

          {/* Detailed RSVPs Manifest List */}
          {filteredMessages.length === 0 ? (
            <DoubleBezelCard className="text-center py-12 bg-white border-stone-200">
              <EnvelopeSimple size={44} className="text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-serif font-bold text-stone-700 mb-1">No RSVPs Found</p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                {messages.length === 0
                  ? "When your guests confirm attendance and write wedding blessings on your invitation link, they will instantly appear here."
                  : "No guest responses matched your search or filter criteria."}
              </p>
            </DoubleBezelCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMessages.map((msg) => {
                const { isAttending, guestCount, phone, eventsList } = parseRsvpData(msg.rsvpJson);

                return (
                  <DoubleBezelCard
                    key={msg.id}
                    className="bg-white border-stone-200/80 p-5 flex flex-col justify-between gap-4 shadow-xs"
                  >
                    <div>
                      {/* Top row: Guest Name, Attendance Badge, Timestamp */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div>
                          <h4 className="text-base font-serif font-bold text-stone-950">
                            {msg.guestName}
                          </h4>
                          {phone && (
                            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono mt-0.5">
                              <Phone size={12} className="text-stone-400" />
                              <span>{phone}</span>
                            </div>
                          )}
                        </div>

                        {isAttending ? (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold shrink-0">
                            <CheckCircle size={13} weight="fill" className="text-emerald-600" />
                            <span>Attending ({guestCount} {guestCount === 1 ? "Guest" : "Guests"})</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold shrink-0">
                            <XCircle size={13} weight="fill" className="text-rose-600" />
                            <span>Declined</span>
                          </div>
                        )}
                      </div>

                      {/* Message / Blessings Note */}
                      {msg.message ? (
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-700 italic leading-relaxed mb-2">
                          &ldquo;{msg.message}&rdquo;
                        </div>
                      ) : (
                        <p className="text-[11px] text-stone-400 italic mb-2">
                          No note attached.
                        </p>
                      )}

                      {/* Multi-event sub-badges if applicable */}
                      {eventsList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {eventsList.map((ev) => (
                            <span
                              key={ev.name}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                ev.attending
                                  ? "bg-emerald-50/70 text-emerald-800 border-emerald-200/60"
                                  : "bg-stone-100 text-stone-500 border-stone-200"
                              }`}
                            >
                              {ev.name}: {ev.attending ? `Yes (${ev.guests})` : "No"}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom row: Invitation Link & Timestamp */}
                    <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                      <span>
                        {msg.invitationSlug ? `/${msg.invitationSlug}` : "Wedding RSVP"}
                      </span>
                      <span>
                        {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    </div>
                  </DoubleBezelCard>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Section 3: Data Security & Privacy Sovereignty ── */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} weight="fill" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Data Sovereignty &amp; Privacy Protection
              </h3>
              <p className="text-xs text-stone-500 max-w-xl leading-relaxed">
                You retain complete sovereignty over your celebration data. You can delete your invitations, media assets, and guest RSVP manifests anytime directly from this dashboard with immediate cloud purge.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/privacy-policy"
              className="text-xs font-bold text-[#073D31] hover:text-[#C8A45E] transition-colors"
            >
              Privacy Policy &rarr;
            </Link>
            <Link
              href="/refund-policy"
              className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors"
            >
              Refund Policy &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* ── Complimentary PDF Preview Modal ── */}
      {selectedPdfInvite && (
        <PdfPreviewModal
          isOpen={Boolean(selectedPdfInvite)}
          onClose={() => setSelectedPdfInvite(null)}
          templateId={selectedPdfInvite.templateId || "noor-e-nikah"}
          initialData={{
            brideName: selectedPdfInvite.brideName,
            groomName: selectedPdfInvite.groomName,
            weddingDate: selectedPdfInvite.weddingDate,
            weddingTime: selectedPdfInvite.weddingTime,
            venueName: selectedPdfInvite.venueName,
            venueAddress: selectedPdfInvite.venueAddress,
            events: selectedPdfInvite.eventsJson || selectedPdfInvite.events || [],
          }}
        />
      )}

      {/* ── Social & Multi-Channel Share Invitation Modal ── */}
      {selectedShareInvite && (
        <ShareInvitationModal
          isOpen={Boolean(selectedShareInvite)}
          onClose={() => setSelectedShareInvite(null)}
          invite={{
            id: selectedShareInvite.id,
            slug: selectedShareInvite.slug,
            brideName: selectedShareInvite.brideName,
            groomName: selectedShareInvite.groomName,
            weddingDate: selectedShareInvite.weddingDate,
            weddingTime: selectedShareInvite.weddingTime,
            venueName: selectedShareInvite.venueName,
            venueAddress: selectedShareInvite.venueAddress,
            templateId: selectedShareInvite.templateId,
          }}
        />
      )}
    </div>
  );
}
