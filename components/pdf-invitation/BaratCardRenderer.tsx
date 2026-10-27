"use client";

import React from "react";
import { getPdfThemeTokens, CulturalTradition } from "@/lib/pdf-theme-tokens";
import {
  CornerFiligree,
  ArabesqueDivider,
  LotusDivider,
  CelestialDivider,
} from "./PdfOrnaments";

export interface PdfCardInvitationData {
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  hostNames?: string;
  hostRelation?: string;
  groomParents?: string;
  brideParents?: string;
  parentageDetails?: string;
  rsvpContact?: string;
  complimentsText?: string;
  recipientName?: string;
  recipientCity?: string;
  eventTitle?: string;
  religion?: CulturalTradition;
  sacredInvocation?: string;
  sacredVerse?: string;
  sacredTranslation?: string;
  events?: { name: string; date?: string; time?: string; venue?: string }[];
}

interface BaratCardRendererProps {
  templateId: string;
  data: PdfCardInvitationData;
  scale?: number;
  className?: string;
  id?: string;
  editable?: boolean;
  onUpdateRecipient?: (name: string, city: string) => void;
}

export function BaratCardRenderer({
  templateId,
  data,
  scale = 1,
  className = "",
  id = "barat-card-print",
  editable = false,
  onUpdateRecipient,
}: BaratCardRendererProps) {
  const tokens = getPdfThemeTokens(templateId, data.religion);

  // Format wedding date into formal card date string matching screenshot: "— Monday, 12th October, 2026 —"
  const formatCardDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch (_) { }
    return dateStr || "Monday, 12th October, 2026";
  };

  const formattedDate = formatCardDate(data.weddingDate);
  const eventHeaderTitle = data.eventTitle || tokens.baratEventTitle || "Dawat-e-Walima";

  const gold3DHeaderStyle: React.CSSProperties = {
    fontFamily: tokens.headingFont,
    background: "linear-gradient(180deg, #FFF7DA 0%, #F5CE76 25%, #C89433 55%, #855C15 80%, #ECC56C 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 2px 0 #3a2205) drop-shadow(0 3px 6px rgba(0,0,0,0.85)) drop-shadow(0 0 14px rgba(245,206,118,0.35))",
  };

  const gold3DCoupleStyle: React.CSSProperties = {
    fontFamily: tokens.coupleFont,
    background: "linear-gradient(180deg, #FFF9E6 0%, #F8D988 28%, #D49F39 55%, #8C5E13 80%, #ECC56C 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 2px 0 #4a2f06) drop-shadow(0 4px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 18px rgba(248,217,136,0.45))",
  };

  const goldLineStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, transparent 0%, ${tokens.coverBorderColor} 15%, #FFF2D6 50%, ${tokens.coverBorderColor} 85%, transparent 100%)`,
    boxShadow: "0 1px 3px rgba(0,0,0,0.6)",
  };

  return (
    <div
      id={id}
      className={`relative overflow-hidden select-none box-border shadow-2xl ${className}`}
      style={{
        // A5 aspect ratio: 148 mm × 210 mm -> Standard 592px × 840px base display
        width: `${592 * scale}px`,
        height: `${840 * scale}px`,
        background: tokens.coverBg,
        color: tokens.coverTextColor,
        fontFamily: tokens.bodyFont,
        transformOrigin: "center center",
      }}
    >
      {/* ── Dual Gold Border & Inset Margins (Matching Screenshot 1) ── */}
      <div
        className="absolute inset-4 rounded-xl border-2 pointer-events-none"
        style={{ borderColor: tokens.coverBorderColor }}
      />
      <div
        className="absolute inset-5 rounded-lg border pointer-events-none"
        style={{ borderColor: tokens.coverBorderInner }}
      />
      <div
        className="absolute inset-7 rounded-sm border pointer-events-none"
        style={{ borderColor: tokens.coverBorderInner, opacity: 0.5 }}
      />

      {/* ── 4 Ornate 3D Gold Filigree Corners ── */}
      <CornerFiligree
        position="top-left"
        color={tokens.coverBorderColor}
        className="absolute top-4 left-4"
      />
      <CornerFiligree
        position="top-right"
        color={tokens.coverBorderColor}
        className="absolute top-4 right-4"
      />
      <CornerFiligree
        position="bottom-left"
        color={tokens.coverBorderColor}
        className="absolute bottom-4 left-4"
      />
      <CornerFiligree
        position="bottom-right"
        color={tokens.coverBorderColor}
        className="absolute bottom-4 right-4"
      />

      {/* ── Main Content Container ── */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between py-14 px-8 text-center">
        {/* TOP: Event Occasion Title & Date (Matching Screenshot 1) */}
        <div className="space-y-1.5 mt-2">
          {/* Sacred Invocation / Divine Blessing */}
          <div
            className="text-sm sm:text-base tracking-widest font-serif opacity-95 transition-all"
            style={{
              color: tokens.coverSubtextColor,
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
            }}
          >
            {data.sacredInvocation || tokens.sacredInvocation}
          </div>

          <h2
            className="text-4xl sm:text-[44px] font-serif font-bold tracking-tight capitalize leading-tight"
            style={gold3DHeaderStyle}
          >
            {eventHeaderTitle}
          </h2>

          <p
            className="text-sm sm:text-base italic font-serif tracking-wide pt-0.5"
            style={{
              color: tokens.coverSubtextColor,
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
            }}
          >
            — {formattedDate} —
          </p>
        </div>

        {/* CENTER: Magnificent Couple Calligraphy with 3D Gold Emboss (Unobstructed View) */}
        <div className="my-auto py-6">
          <h1
            className="text-6xl sm:text-7xl font-normal leading-tight tracking-normal"
            style={gold3DCoupleStyle}
          >
            {data.groomName} <span className="text-4xl sm:text-5xl opacity-90 font-serif">&amp;</span> {data.brideName}
          </h1>
        </div>

        {/* BOTTOM: Recipient Honor Section (Matching Screenshot 1 & Shah Hussain.pdf) */}
        <div className="space-y-3 mb-4">
          <span
            className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-serif font-bold block"
            style={{
              color: tokens.coverHighlight,
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
            }}
          >
            WE ARE DELIGHTED TO INVITE YOU
          </span>

          {/* Dedicated Space for Guest Name & City with 3 Gold Underlines */}
          <div className="max-w-[320px] mx-auto space-y-2 pt-1">
            {/* 1. Recipient Guest Name Line */}
            <div className="relative">
              {editable ? (
                <input
                  type="text"
                  value={data.recipientName || ""}
                  placeholder="Type Guest Name (or leave blank for writing)"
                  onChange={(e) =>
                    onUpdateRecipient?.(e.target.value, data.recipientCity || "")
                  }
                  className="w-full text-center text-xl sm:text-2xl italic font-serif bg-transparent border-none outline-none focus:ring-1 focus:ring-[#C8A45E]/60 rounded py-0.5"
                  style={{
                    fontFamily: tokens.coupleFont,
                    color: tokens.coverHighlight,
                    textShadow: "0 2px 4px rgba(0,0,0,0.9)",
                  }}
                />
              ) : (
                <p
                  className="text-xl sm:text-2xl italic font-serif min-h-[30px] flex items-center justify-center leading-normal"
                  style={{
                    fontFamily: tokens.coupleFont,
                    color: tokens.coverHighlight,
                    textShadow: "0 2px 4px rgba(0,0,0,0.9)",
                  }}
                >
                  {data.recipientName || (
                    <span className="opacity-0 select-none">&nbsp;</span>
                  )}
                </p>
              )}
              {/* Golden Underline Line 1 */}
              <div className="w-full h-[1.5px] mt-0.5" style={goldLineStyle} />
            </div>

            {/* 2. City / Location Line */}
            <div className="relative">
              {editable ? (
                <input
                  type="text"
                  value={data.recipientCity || ""}
                  placeholder="Type City (e.g. Lucknow)"
                  onChange={(e) =>
                    onUpdateRecipient?.(data.recipientName || "", e.target.value)
                  }
                  className="w-full text-center text-sm sm:text-base italic font-serif bg-transparent border-none outline-none focus:ring-1 focus:ring-[#C8A45E]/60 rounded py-0.5"
                  style={{
                    fontFamily: tokens.headingFont,
                    color: tokens.coverSubtextColor,
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                  }}
                />
              ) : (
                <p
                  className="text-sm sm:text-base italic font-serif min-h-[22px] flex items-center justify-center"
                  style={{
                    fontFamily: tokens.headingFont,
                    color: tokens.coverSubtextColor,
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                  }}
                >
                  {data.recipientCity || (
                    <span className="opacity-0 select-none">&nbsp;</span>
                  )}
                </p>
              )}
              {/* Golden Underline Line 2 */}
              <div className="w-full h-[1.5px] mt-0.5" style={goldLineStyle} />
            </div>

            {/* 3. Golden Underline Line 3 (Third Line from Screenshot 1) */}
            <div className="pt-1">
              <div className="w-full h-[1.5px]" style={goldLineStyle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
