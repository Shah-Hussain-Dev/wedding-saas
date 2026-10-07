"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { AdminCreateModal } from "@/components/admin/AdminCreateModal";
import { AdminInvitationsTable } from "@/components/admin/AdminInvitationsTable";
import { AdminTemplatesTable } from "@/components/admin/AdminTemplatesTable";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { AdminRsvpsTable } from "@/components/admin/AdminRsvpsTable";
import { isUserAdmin } from "@/lib/admin-client";
import {
  Sparkle,
  Crown,
  CurrencyInr,
  Users,
  EnvelopeSimple,
  ChartBar,
  CreditCard,
  Plus,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowsClockwise,
  Heart,
  Globe,
  ChartPieSlice,
  LockKey,
  WarningCircle,
  SignOut,
  ArrowSquareOut,
  User as UserIcon,
  Tag,
} from "@phosphor-icons/react";

export default function AdminDashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "invitations" | "templates" | "rsvps" | "users" | "orders">("overview");

  // Data State
  const [stats, setStats] = useState<any>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [prefilledUserEmail, setPrefilledUserEmail] = useState<string | null>(null);

  const userEmail = session?.user?.email;
  const authorizedAdmin = isUserAdmin(userEmail);

  // Route protection: If unauthenticated, redirect to login
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
    }
  }, [authStatus, router]);

  const loadAllAdminData = async () => {
    if (!authorizedAdmin) return;
    setLoading(true);
    try {
      const [statsRes, invRes, templatesRes, usersRes, ordersRes, rsvpsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/invitations"),
        fetch("/api/admin/templates"),
        fetch("/api/admin/users"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/rsvps"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvitations(invData.invitations || []);
      }
      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.templates || []);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }
      if (rsvpsRes.ok) {
        const rsvpsData = await rsvpsRes.json();
        setRsvps(rsvpsData.rsvps || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorizedAdmin) {
      loadAllAdminData();
    } else {
      setLoading(false);
    }
  }, [authorizedAdmin]);

  // Loading state
  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex flex-col items-center justify-center text-[#1A1A1A]">
        <Sparkle className="h-8 w-8 text-amber-500 animate-spin-slow mb-3" />
        <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">
          Verifying Admin Access...
        </span>
      </div>
    );
  }

  // Not logged in guard
  if (!session) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex flex-col items-center justify-center text-[#1A1A1A] px-4">
        <LockKey className="h-14 w-14 text-amber-600 mb-4" weight="fill" />
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
          Administrator Login Required
        </h2>
        <p className="text-xs text-stone-500 mb-6 text-center max-w-sm">
          This portal is strictly protected and requires authorized administrator credentials to access.
        </p>
        <Link href="/login?callbackUrl=/admin">
          <PremiumButton className="!px-6 !py-3 text-xs font-bold">
            Sign In with Admin Account
          </PremiumButton>
        </Link>
      </div>
    );
  }

  // Logged in as non-admin guard
  if (!authorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex flex-col min-h-screen text-[#1A1A1A]">
        {/* Simple top bar for non-admin screen */}
        <header className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="text-xl font-serif text-primary font-bold lowercase">
            unfold
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            <SignOut size={14} />
            <span>Log Out</span>
          </button>
        </header>

        <main className="flex-grow flex items-center justify-center px-4 pt-16 pb-20">
          <DoubleBezelCard className="p-8 max-w-md w-full bg-white border-rose-200 text-center shadow-xl">
            <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto mb-4">
              <WarningCircle size={28} weight="fill" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              403 · Access Forbidden
            </h2>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Your account (<strong>{userEmail}</strong>) is not authorized as an administrator.
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500 mb-6 text-left space-y-1">
              <span className="font-bold text-stone-700 block">Need Admin Access?</span>
              <span>Please sign in using your designated administrator credentials (`admin@unfoldwed.com`).</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => signOut({ callbackUrl: "/login?callbackUrl=/admin" })}
                className="w-full py-2.5 px-4 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <SignOut size={14} />
                <span>Switch Account</span>
              </button>
              <Link href="/dashboard" className="w-full">
                <PremiumButton className="w-full justify-center !py-2.5 text-xs">
                  Go to Dashboard
                </PremiumButton>
              </Link>
            </div>
          </DoubleBezelCard>
        </main>
      </div>
    );
  }

  const handleOpenCreateForUser = (email: string) => {
    setPrefilledUserEmail(email);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF7] text-[#1A1A1A]">
      {/* ── Dedicated Admin Top Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        {/* Left: Brand + Admin Pill */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-xl font-serif text-primary lowercase tracking-tight font-bold">
            unfold
          </Link>
          <span className="inline-flex items-center gap-1 bg-stone-900 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
            <ShieldCheck size={12} weight="fill" className="text-amber-400" />
            <span>Admin</span>
          </span>
        </div>

        {/* Right: Admin Profile & Logout */}
        <div className="flex items-center gap-3">
          {/* Admin Profile Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-250 shadow-xs">
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[11px] font-bold text-stone-900 block leading-tight">
                {session?.user?.name || "Master Administrator"}
              </span>
              <span className="text-[9px] text-stone-400 font-mono block leading-tight">
                {userEmail}
              </span>
            </div>
          </div>

          {/* View Website */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-stone-250 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold transition"
          >
            <ArrowSquareOut size={14} />
            <span>View Site</span>
          </a>

          {/* Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition cursor-pointer shadow-xs"
            title="Sign out of Admin Portal"
          >
            <SignOut size={14} weight="bold" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      <main className="flex-grow pt-8 px-4 sm:px-6 pb-24 max-w-7xl mx-auto w-full">
        {/* Top Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-700 mb-2">
              <ShieldCheck className="h-4 w-4" weight="fill" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">
                Master Administrator Control Hub
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-stone-900 leading-tight">
              Platform Management Board
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllAdminData}
              className="p-3 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition shadow-sm cursor-pointer"
              title="Refresh All Data"
            >
              <ArrowsClockwise size={18} className={loading ? "animate-spin" : ""} />
            </button>

            <PremiumButton
              onClick={() => {
                setPrefilledUserEmail(null);
                setIsCreateModalOpen(true);
              }}
              className="w-full sm:w-auto !px-6 !py-3 font-bold"
            >
              <div className="flex items-center gap-2">
                <Plus size={16} weight="bold" />
                <span>Create Template for User</span>
              </div>
            </PremiumButton>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-stone-200/50 rounded-2xl border border-stone-200 max-w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <ChartBar size={16} weight="bold" />
            <span>Overview &amp; Stats</span>
          </button>

          <button
            onClick={() => setActiveTab("invitations")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "invitations"
                ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <EnvelopeSimple size={16} weight="bold" />
            <span>All Invitations ({invitations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "templates"
                ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Tag size={16} weight="bold" />
            <span>Templates &amp; Pricing ({templates.length || 16})</span>
          </button>

          <button
            onClick={() => setActiveTab("rsvps")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "rsvps"
                ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Heart size={16} weight="bold" />
            <span>Guest RSVPs ({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Users size={16} weight="bold" />
            <span>User Directory ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <CreditCard size={16} weight="bold" />
            <span>Payment History ({orders.length})</span>
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW & STATS ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* 4 Metric Headline Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Metric 1: Total Revenue */}
              <DoubleBezelCard className="bg-white border-stone-200 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Total Platform Revenue
                    </span>
                    <h3 className="text-3xl font-bold text-stone-950 mt-1 font-mono">
                      ₹{(stats?.summary?.totalRevenueINR || 0).toLocaleString("en-IN")}
                    </h3>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">
                      {stats?.summary?.paidOrdersCount || 0} Paid License checkouts
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <CurrencyInr size={22} weight="bold" />
                  </div>
                </div>
              </DoubleBezelCard>

              {/* Metric 2: Total Invitations */}
              <DoubleBezelCard className="bg-white border-stone-200 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Total Invitations Created
                    </span>
                    <h3 className="text-3xl font-bold text-stone-950 mt-1 font-mono">
                      {stats?.summary?.totalInvitations || invitations.length}
                    </h3>
                    <span className="text-[10px] text-amber-700 font-semibold mt-1 inline-block">
                      {stats?.summary?.paidInvitations || 0} Paid · {stats?.summary?.pendingDrafts || 0} Drafts
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
                    <EnvelopeSimple size={22} weight="bold" />
                  </div>
                </div>
              </DoubleBezelCard>

              {/* Metric 3: Total RSVPs & Guests */}
              <DoubleBezelCard className="bg-white border-stone-200 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Total Guest RSVPs &amp; Wishes
                    </span>
                    <h3 className="text-3xl font-bold text-stone-950 mt-1 font-mono">
                      {stats?.summary?.totalRSVPCount || 0}
                    </h3>
                    <span className="text-[10px] text-indigo-700 font-semibold mt-1 inline-block">
                      {stats?.summary?.totalAttendingGuests || 0} Total Attending Guests
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700">
                    <Heart size={22} weight="fill" />
                  </div>
                </div>
              </DoubleBezelCard>

              {/* Metric 4: Conversion Rate & Users */}
              <DoubleBezelCard className="bg-white border-stone-200 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Paid Conversion Rate
                    </span>
                    <h3 className="text-3xl font-bold text-stone-950 mt-1 font-mono">
                      {stats?.summary?.conversionRate || "0%"}
                    </h3>
                    <span className="text-[10px] text-stone-500 font-semibold mt-1 inline-block">
                      Across {stats?.summary?.totalUsers || users.length} registered accounts
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700">
                    <ChartPieSlice size={22} weight="bold" />
                  </div>
                </div>
              </DoubleBezelCard>
            </div>

            {/* Template Popularity Breakdown Bento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <DoubleBezelCard className="bg-white border-stone-200 p-6 h-full">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        Template Theme Popularity
                      </h3>
                      <p className="text-xs text-stone-500">
                        Distribution of creations across the 10 catalog templates.
                      </p>
                    </div>
                    <Crown size={22} className="text-amber-600" weight="fill" />
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {stats?.templateStats && Object.keys(stats.templateStats).length > 0 ? (
                      Object.entries(stats.templateStats).map(([tId, count]: any) => {
                        const total = stats?.summary?.totalInvitations || 1;
                        const pct = Math.round((count.total / total) * 100);

                        return (
                          <div key={tId} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-stone-900 uppercase tracking-wide">
                                {tId.replace(/-/g, " ")}
                              </span>
                              <span className="font-mono text-stone-500">
                                {count.total} created ({count.paid} paid) · {pct}%
                              </span>
                            </div>
                            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-500 h-full rounded-full transition-all"
                                style={{ width: `${Math.max(pct, 4)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-stone-400 font-mono py-4">NO TEMPLATE USAGE RECORDED</p>
                    )}
                  </div>
                </DoubleBezelCard>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-5 space-y-4">
                <DoubleBezelCard className="bg-white border-stone-200 p-6">
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                    Quick Admin Actions
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Fast shortcuts to administer platform operations.
                  </p>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="w-full p-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Plus size={16} weight="bold" />
                        <span>Create &amp; Comp Invitation for Client</span>
                      </span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("invitations")}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <EnvelopeSimple size={16} weight="bold" />
                        <span>Manage &amp; Edit All Invitations</span>
                      </span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("templates")}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Tag size={16} weight="bold" />
                        <span>Configure Template Prices ({templates.length || 16} Royal Themes)</span>
                      </span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("rsvps")}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Heart size={16} weight="bold" />
                        <span>Inspect Guest RSVPs &amp; Wishes ({rsvps.length})</span>
                      </span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("orders")}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <CreditCard size={16} weight="bold" />
                        <span>Inspect Revenue &amp; Razorpay Logs</span>
                      </span>
                      <span>→</span>
                    </button>
                  </div>
                </DoubleBezelCard>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ALL INVITATIONS ── */}
        {activeTab === "invitations" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                All Client Wedding Invitations
              </h2>
              <p className="text-xs text-stone-500">
                Search, edit in full customizer, toggle paid/draft status, switch template theme, or delete.
              </p>
            </div>

            <AdminInvitationsTable
              invitations={invitations}
              onRefresh={loadAllAdminData}
            />
          </div>
        )}

        {/* ── TAB 2.2: TEMPLATES & PRICING MANAGEMENT ── */}
        {activeTab === "templates" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Template Catalog &amp; Dynamic Pricing
              </h2>
              <p className="text-xs text-stone-500">
                Update live prices in ₹ (INR), toggle active/paused status, and preview all 16 royal wedding themes.
              </p>
            </div>

            <AdminTemplatesTable
              templates={templates}
              onRefresh={loadAllAdminData}
            />
          </div>
        )}

        {/* ── TAB 2.5: GUEST RSVPS ── */}
        {activeTab === "rsvps" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Guest RSVPs &amp; Messages Directory
              </h2>
              <p className="text-xs text-stone-500">
                Live attendance confirmations, guest counts, direct WhatsApp chat links, and wedding blessings across all templates.
              </p>
            </div>

            <AdminRsvpsTable
              rsvps={rsvps}
              onRefresh={loadAllAdminData}
            />
          </div>
        )}

        {/* ── TAB 3: USERS DIRECTORY ── */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Registered Users &amp; Couples Directory
              </h2>
              <p className="text-xs text-stone-500">
                Inspect accounts, lifetime spend, create invitations directly, and manage access.
              </p>
            </div>

            <AdminUsersTable
              users={users}
              onRefresh={loadAllAdminData}
              onCreateInviteForUser={handleOpenCreateForUser}
            />
          </div>
        )}

        {/* ── TAB 4: ORDERS & PAYMENT HISTORY ── */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Orders &amp; Razorpay Payment History
              </h2>
              <p className="text-xs text-stone-500">
                Real-time transaction logs, payment IDs, manual unlock tools, and financial records.
              </p>
            </div>

            <AdminOrdersTable
              orders={orders}
              onRefresh={loadAllAdminData}
            />
          </div>
        )}
      </main>

      {/* Admin Create Invitation Modal */}
      <AdminCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setPrefilledUserEmail(null);
        }}
        onSuccess={loadAllAdminData}
        existingUsers={users.map((u) => ({ email: u.email, name: u.name }))}
      />
    </div>
  );
}
