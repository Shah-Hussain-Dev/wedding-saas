"use client";

import { useState, useEffect } from "react";
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
} from "@phosphor-icons/react";
import { formatDate } from "@/lib/utils";

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

  useEffect(() => {
    async function loadDashboardData() {
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
    }

    function loadMockDashboardData() {
      setIsDemoMode(true);
      const mockInvitations = [
        {
          id: "demo-invitation-id",
          brideName: "Siya",
          groomName: "Kabir",
          slug: "siya-kabir",
          templateId: "royal-lotus",
          weddingDate: "2026-12-14T18:30:00.000Z",
          venueName: "The Maharaja Palace, Udaipur",
        }
      ];
      setInvitations(mockInvitations);

      const mockMessages = [
        {
          id: "m1",
          guestName: "Vikram & Neha Sharma",
          message: "Congratulations Siya & Kabir! Wishing you a lifetime of love and royal happiness together.",
          rsvpJson: {
            phone: "+91 91234 56789",
            attending: true,
            guests: 2,
            submittedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          invitationSlug: "siya-kabir",
        },
        {
          id: "m2",
          guestName: "Aarav Patel",
          message: "Heartiest congratulations on your auspicious wedding celebration!",
          rsvpJson: {
            phone: "+91 91234 56789",
            attending: true,
            guests: 1,
            submittedAt: new Date().toISOString(),
          },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          invitationSlug: "siya-kabir",
        }
      ];
      setMessages(mockMessages);
    }

    loadDashboardData();
  }, [session]);

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

          {/* Metric 3: Active Invitations */}
          <DoubleBezelCard className="bg-white border-stone-200/60 p-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Active Invitations
                </span>
                <h3 className="text-3xl font-bold text-stone-950 mt-1 font-mono">
                  {invitations.length}
                </h3>
                <span className="text-[10px] text-indigo-700 font-semibold mt-1 inline-block">
                  Live &amp; Accessible
                </span>
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

        {/* ── Section 1: Active Invitations ── */}
        <div className="space-y-4 mb-14">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Your Digital Wedding Invitations
              </h2>
              <p className="text-xs text-stone-500">
                Manage details, customize your story, and copy your personalized link to share with guests.
              </p>
            </div>
          </div>

          {invitations.length === 0 ? (
            <DoubleBezelCard className="text-center py-12 bg-white border-stone-200">
              <EnvelopeSimple size={40} className="text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-serif font-bold text-stone-700 mb-1">No Active Invitations Yet</p>
              <p className="text-xs text-stone-400 mb-4">Create your first bespoke digital invitation in minutes.</p>
              <Link href="/dashboard/invitation/new">
                <PremiumButton>Create Your First Invite</PremiumButton>
              </Link>
            </DoubleBezelCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {invitations.map((invite) => (
                <DoubleBezelCard key={invite.id} className="bg-white border-stone-200 p-6 flex flex-col justify-between gap-5 shadow-xs">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                        {invite.templateId?.replace(/-/g, " ") || "Royal Lotus"}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {formatDate(invite.weddingDate)}
                      </span>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-stone-950">
                      {invite.brideName} &amp; {invite.groomName}
                    </h3>
                    
                    {invite.venueName && (
                      <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                        📍 {invite.venueName}
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <a
                        href={`/${invite.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition"
                      >
                        <LinkIcon size={14} weight="bold" />
                        <span>{siteConfig.domain}/{invite.slug}</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                    <Link href={`/dashboard/invitation/${invite.id}/edit`} className="flex-1 min-w-[110px]">
                      <button className="w-full text-center border border-stone-250 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer">
                        <Pencil size={14} weight="bold" />
                        <span>Edit Details</span>
                      </button>
                    </Link>

                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/${invite.slug}`;
                        navigator.clipboard.writeText(url);
                        setCopiedSlug(invite.slug);
                        setTimeout(() => setCopiedSlug(null), 2500);
                      }}
                      className={`flex-1 min-w-[110px] text-center border font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
                          <ShareNetwork size={15} weight="bold" />
                          <span>Share Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteInvitation(invite.id, `${invite.brideName} & ${invite.groomName}`)}
                      disabled={deletingId === invite.id}
                      title="Permanently delete invitation and wipe guest data"
                      className="px-3 py-2.5 rounded-xl border border-rose-200/80 bg-rose-50/60 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <TrashSimple size={14} weight="bold" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </DoubleBezelCard>
              ))}
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
    </div>
  );
}
