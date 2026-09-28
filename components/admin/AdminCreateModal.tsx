"use client";

import { useState } from "react";
import { X, Sparkle, Crown, CheckCircle, UserPlus, Calendar, MapPin, Heart } from "@phosphor-icons/react";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { PremiumButton } from "@/components/ui/premium-button";

interface AdminCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingUsers?: Array<{ email: string; name?: string }>;
}

const TEMPLATES_LIST = [
  { id: "noor-e-nikah", name: "Noor-e-Nikah (Sacred Elegance)" },
  { id: "emerald-qasr", name: "Emerald Qasr (Ottoman Royale)" },
  { id: "gul-e-noor", name: "Gul-e-Noor (Blush Velvet & Rose)" },
  { id: "azure-nikah", name: "Azure Nikah (Royal Sapphire)" },
  { id: "kitab-e-nikah", name: "Kitab-e-Nikah (Sacred Velvet & Gold)" },
  { id: "crimson-royale", name: "Crimson Royale (Royal Court)" },
  { id: "royal-lotus", name: "Royal Lotus (Royal Heritage)" },
  { id: "emerald-noir", name: "Emerald Noir (Luxury Dark)" },
  { id: "royal-elegance", name: "Royal Elegance (Classic South Asian)" },
  { id: "modern-minimal", name: "Modern Minimal (Contemporary)" },
  { id: "rose-gold-blush", name: "Rose Gold Blush (Dual Faith & Universal)" },
  { id: "royal-grace", name: "Royal Grace (Botanical Velvet & Gold)" },
  { id: "royal-heritage", name: "Royal Heritage (Powder Blue & Coral Mediterranean)" },
  { id: "royal-majesty", name: "Royal Majesty (French Château & Regency Ballroom)" },
  { id: "celestial-rose", name: "Celestial Rose Dreamscape (Awwwards 3D & Ethereal Parallax)" },
  { id: "imperial-palace", name: "Imperial Palace (Grand European & Royal Indian Palace)" },
];

export function AdminCreateModal({
  isOpen,
  onClose,
  onSuccess,
  existingUsers = [],
}: AdminCreateModalProps) {
  const [targetEmail, setTargetEmail] = useState("");
  const [brideName, setBrideName] = useState("Diya");
  const [groomName, setGroomName] = useState("Shaan");
  const [templateId, setTemplateId] = useState("noor-e-nikah");
  const [weddingDate, setWeddingDate] = useState("2026-12-22");
  const [weddingTime, setWeddingTime] = useState("06:30 PM onwards");
  const [venueName, setVenueName] = useState("The Ridgewood Grand Palace");
  const [venueAddress, setVenueAddress] = useState("Fatehsagar Lake Road, Udaipur, Rajasthan");
  const [isPublished, setIsPublished] = useState(true); // default to paid/VIP for admin creations
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim() || !targetEmail.includes("@")) {
      setError("Please enter a valid target user email.");
      return;
    }
    if (!brideName.trim() || !groomName.trim()) {
      setError("Please specify bride and groom names.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserEmail: targetEmail.trim().toLowerCase(),
          brideName: brideName.trim(),
          groomName: groomName.trim(),
          templateId,
          weddingDate,
          weddingTime,
          venueName,
          venueAddress,
          isPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create invitation");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Admin create invitation error:", err);
      setError(err.message || "Failed to create invitation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#FCFBF7] rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8 text-stone-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
          title="Close modal"
        >
          <X size={18} weight="bold" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
            <UserPlus size={22} weight="fill" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Create Template for User
            </h3>
            <p className="text-xs text-stone-500">
              Generate an invitation directly assigned to any user account.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target User Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Target User Email (Existing or New Account) *
            </label>
            <input
              type="email"
              required
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="e.g. client@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500 bg-white"
            />
            {existingUsers.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                <span className="text-[10px] text-stone-400 font-medium">Quick Pick:</span>
                {existingUsers.slice(0, 3).map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => setTargetEmail(u.email)}
                    className="text-[10px] text-amber-700 font-semibold bg-amber-50 border border-amber-200/80 rounded px-1.5 py-0.2 hover:bg-amber-100"
                  >
                    {u.email}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Template Choice */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Select Template Theme *
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500 bg-white font-medium text-stone-800"
            >
              {TEMPLATES_LIST.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Couple Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Bride's Name *
              </label>
              <input
                type="text"
                required
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="Diya"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Groom's Name *
              </label>
              <input
                type="text"
                required
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="Shaan"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Wedding Date
              </label>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Auspicious Time
              </label>
              <input
                type="text"
                value={weddingTime}
                onChange={(e) => setWeddingTime(e.target.value)}
                placeholder="06:30 PM onwards"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Venue Name
            </label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="The Ridgewood Grand Palace"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Payment / Publication Status Toggle */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-950 block">
                Publication Status (VIP / Comped Pass)
              </span>
              <span className="text-[11px] text-amber-800">
                {isPublished
                  ? "Mark as Paid & Live (Bypasses paywall ₹1,499 for client)"
                  : "Keep as Unpaid Demo Draft"}
              </span>
            </div>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-5 w-5 rounded accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold uppercase tracking-wider transition"
            >
              Cancel
            </button>
            <PremiumButton
              type="submit"
              disabled={submitting}
              className="!px-6 !py-2.5 text-xs font-bold"
            >
              <Sparkle size={14} weight="fill" />
              <span>{submitting ? "Creating..." : "Create & Link Template"}</span>
            </PremiumButton>
          </div>
        </form>
      </div>
    </div>
  );
}
