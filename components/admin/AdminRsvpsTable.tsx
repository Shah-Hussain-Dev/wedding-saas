"use client";

import { useState } from "react";
import {
  Heart,
  CheckCircle,
  XCircle,
  ChatCircleDots,
  WhatsappLogo,
  Phone,
  EnvelopeSimple,
  MagnifyingGlass,
  PaperPlaneTilt,
  X,
  Sparkle,
} from "@phosphor-icons/react";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { formatDate } from "@/lib/utils";

export interface AdminRsvpItem {
  id: string;
  guestName: string;
  message?: string | null;
  rsvpJson?: any;
  createdAt: string;
  invitation?: {
    id: string;
    slug: string;
    brideName: string;
    groomName: string;
    templateId: string;
    phone?: string;
    rsvpPhone?: string;
    user?: {
      email: string;
      name?: string;
    };
  };
}

interface AdminRsvpsTableProps {
  rsvps: AdminRsvpItem[];
  onRefresh: () => void;
}

export function AdminRsvpsTable({ rsvps, onRefresh }: AdminRsvpsTableProps) {
  const [search, setSearch] = useState("");
  const [filterAttendance, setFilterAttendance] = useState<"all" | "attending" | "declined">("all");
  
  // Summary modal state
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [selectedCoupleSlug, setSelectedCoupleSlug] = useState<string>("all");
  const [customCouplePhone, setCustomCouplePhone] = useState<string>("");

  // Extract distinct couples from RSVPs
  const distinctCouples = Array.from(
    new Map(
      rsvps
        .filter((r) => r.invitation?.slug)
        .map((r) => [
          r.invitation!.slug,
          {
            slug: r.invitation!.slug,
            brideName: r.invitation!.brideName,
            groomName: r.invitation!.groomName,
            phone: (r.invitation as any)?.phone || (r.invitation as any)?.rsvpPhone || "",
          },
        ])
    ).values()
  );

  const filtered = rsvps.filter((item) => {
    const rsvp = (item.rsvpJson as any) || {};
    const isAttending =
      rsvp.attending === true ||
      rsvp.attending === "yes" ||
      (typeof rsvp === "object" &&
        Object.values(rsvp).some((v: any) => v && (v.attending === true || v.attending === "yes")));

    if (filterAttendance === "attending" && !isAttending) return false;
    if (filterAttendance === "declined" && isAttending) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchGuest = item.guestName.toLowerCase().includes(q);
      const matchCouple = item.invitation
        ? `${item.invitation.brideName} ${item.invitation.groomName}`.toLowerCase().includes(q)
        : false;
      const matchSlug = item.invitation?.slug.toLowerCase().includes(q);
      const matchMsg = item.message?.toLowerCase().includes(q);
      const phone = rsvp.phone || "";
      const matchPhone = String(phone).includes(q);
      if (!matchGuest && !matchCouple && !matchSlug && !matchMsg && !matchPhone) return false;
    }

    return true;
  });

  // Calculate summary metrics for selected couple
  const rsvpsForSummary = selectedCoupleSlug === "all"
    ? rsvps
    : rsvps.filter((r) => r.invitation?.slug === selectedCoupleSlug);

  const targetCouple = distinctCouples.find((c) => c.slug === selectedCoupleSlug);

  const totalResponses = rsvpsForSummary.length;
  let attendingCount = 0;
  let attendingGuestsCount = 0;
  let declinedCount = 0;

  rsvpsForSummary.forEach((item) => {
    const rsvp = (item.rsvpJson as any) || {};
    const isAttending =
      rsvp.attending === true ||
      rsvp.attending === "yes" ||
      (typeof rsvp === "object" &&
        Object.values(rsvp).some((v: any) => v && (v.attending === true || v.attending === "yes")));

    if (isAttending) {
      attendingCount += 1;
      let count = 1;
      if (rsvp.guests) {
        count = parseInt(rsvp.guests, 10) || 1;
      } else if (typeof rsvp === "object") {
        count = Object.values(rsvp).reduce((acc: number, curr: any) => acc + (curr?.guests || 1), 0);
      }
      attendingGuestsCount += count;
    } else {
      declinedCount += 1;
    }
  });

  const generateWhatsAppSummaryUrl = () => {
    const coupleName = targetCouple
      ? `${targetCouple.brideName} & ${targetCouple.groomName}`
      : "Wedding Celebration";
    const coupleSlug = targetCouple ? targetCouple.slug : "";

    let text = `✨ *Wedding RSVP & Guest Summary Report* ✨\n`;
    text += `💍 *Couple:* ${coupleName}\n`;
    if (coupleSlug) text += `🔗 *Live Link:* wedinvites.in/${coupleSlug}\n`;
    text += `\n📊 *Attendance Overview:*\n`;
    text += `• Total RSVP Responses: ${totalResponses}\n`;
    text += `• Total Confirmed Attending Guests: ${attendingGuestsCount}\n`;
    text += `• Regretfully Declined: ${declinedCount}\n`;

    if (rsvpsForSummary.length > 0) {
      text += `\n📋 *Guest Manifest & Wishes:*\n`;
      rsvpsForSummary.slice(0, 15).forEach((item, idx) => {
        const rsvp = (item.rsvpJson as any) || {};
        const isAttending =
          rsvp.attending === true ||
          rsvp.attending === "yes" ||
          (typeof rsvp === "object" &&
            Object.values(rsvp).some((v: any) => v && (v.attending === true || v.attending === "yes")));
        const gCount = rsvp.guests || 1;
        text += `${idx + 1}. *${item.guestName}* — ${isAttending ? `Attending (${gCount} ${gCount === 1 ? "Guest" : "Guests"})` : "Declined"}\n`;
        if (item.message) {
          text += `   _"${item.message}"_\n`;
        }
      });
      if (rsvpsForSummary.length > 15) {
        text += `... and ${rsvpsForSummary.length - 15} more responses recorded in admin dashboard.\n`;
      }
    }

    text += `\n✦ Generated by WedInvites Admin Concierge (wedinvites.in)`;

    const phoneToUse = customCouplePhone.trim() || targetCouple?.phone || "919876543210";
    const sanitizedPhone = phoneToUse.replace(/[^0-9]/g, "");

    return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & Send Summary Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <MagnifyingGlass
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            placeholder="Search by guest, phone, couple or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterAttendance("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterAttendance === "all"
                ? "bg-stone-900 text-amber-400"
                : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900"
            }`}
          >
            All ({rsvps.length})
          </button>
          <button
            onClick={() => setFilterAttendance("attending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterAttendance === "attending"
                ? "bg-emerald-700 text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900"
            }`}
          >
            Attending
          </button>
          <button
            onClick={() => setFilterAttendance("declined")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterAttendance === "declined"
                ? "bg-rose-700 text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900"
            }`}
          >
            Declined
          </button>

          {/* Send Total to Couple Button */}
          <button
            onClick={() => setSummaryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer ml-auto"
          >
            <WhatsappLogo size={16} weight="fill" />
            <span>Send Total to Couple</span>
          </button>
        </div>
      </div>

      {/* RSVPs Table */}
      <DoubleBezelCard className="bg-white border-stone-200 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Guest Info</th>
                <th className="py-3.5 px-4">Wedding / Couple</th>
                <th className="py-3.5 px-4">Status & Guests</th>
                <th className="py-3.5 px-4">Message / Blessing</th>
                <th className="py-3.5 px-4">Date Received</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400 text-xs">
                    No RSVPs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const rsvp = (item.rsvpJson as any) || {};
                  const isAttending =
                    rsvp.attending === true ||
                    rsvp.attending === "yes" ||
                    (typeof rsvp === "object" &&
                      Object.values(rsvp).some(
                        (v: any) => v && (v.attending === true || v.attending === "yes")
                      ));
                  const guestCount = rsvp.guests || 1;
                  const phone = rsvp.phone || "";

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 text-sm">{item.guestName}</div>
                        {phone && (
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 font-mono mt-0.5">
                            <Phone size={11} className="text-stone-400" />
                            <span>{phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.invitation ? (
                          <div>
                            <span className="font-semibold text-stone-900 block">
                              {item.invitation.brideName} & {item.invitation.groomName}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              /{item.invitation.slug}
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">Demo Invitation</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isAttending ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                            <CheckCircle size={13} weight="fill" />
                            <span>Attending ({guestCount} {guestCount === 1 ? "Guest" : "Guests"})</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                            <XCircle size={13} weight="fill" />
                            <span>Regretfully Declined</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {item.message ? (
                          <p className="text-stone-600 text-[11px] italic line-clamp-2 leading-relaxed">
                            &ldquo;{item.message}&rdquo;
                          </p>
                        ) : (
                          <span className="text-stone-300 italic">No message attached</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-stone-500 font-mono">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {phone && (
                          <a
                            href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-bold text-[10px] transition"
                            title="Chat with Guest on WhatsApp"
                          >
                            <WhatsappLogo size={13} weight="fill" />
                            <span>Guest</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </DoubleBezelCard>

      {/* Modal: Send RSVP Total Summary to Couple */}
      {summaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <DoubleBezelCard className="bg-white border-stone-200 max-w-md w-full p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSummaryModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X size={18} weight="bold" />
            </button>

            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <WhatsappLogo size={22} weight="fill" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Admin WhatsApp Dispatch
              </span>
            </div>

            <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
              Send RSVP Summary to Couple
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Compile headcount stats and guest messages to send to the bride & groom on WhatsApp.
            </p>

            <div className="space-y-4">
              {/* Select Couple */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Select Wedding / Couple
                </label>
                <select
                  value={selectedCoupleSlug}
                  onChange={(e) => {
                    setSelectedCoupleSlug(e.target.value);
                    const sel = distinctCouples.find((c) => c.slug === e.target.value);
                    if (sel?.phone) setCustomCouplePhone(sel.phone);
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Weddings Combined ({rsvps.length} RSVPs)</option>
                  {distinctCouples.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.brideName} & {c.groomName} (/{c.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Couple's WhatsApp Phone Number */}
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Couple WhatsApp Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 919876543210"
                  value={customCouplePhone}
                  onChange={(e) => setCustomCouplePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Summary Stats Preview Box */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between font-semibold text-stone-800">
                  <span>Total Responses:</span>
                  <span className="font-mono font-bold">{totalResponses}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Attending Guests:</span>
                  <span className="font-mono font-bold">{attendingGuestsCount}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>Declined:</span>
                  <span className="font-mono font-bold">{declinedCount}</span>
                </div>
              </div>

              {/* Launch WhatsApp button */}
              <a
                href={generateWhatsAppSummaryUrl()}
                target="_blank"
                rel="noreferrer"
                onClick={() => setSummaryModalOpen(false)}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-center"
              >
                <WhatsappLogo size={18} weight="fill" />
                <span>Open WhatsApp & Send Summary</span>
              </a>
            </div>
          </DoubleBezelCard>
        </div>
      )}
    </div>
  );
}
