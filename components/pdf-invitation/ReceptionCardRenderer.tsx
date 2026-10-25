"use client";

import React from "react";
import { getPdfThemeTokens } from "@/lib/pdf-theme-tokens";
import {
  CornerFiligree,
  ArabesqueDivider,
  LotusDivider,
  CelestialDivider,
  GoldenLaurelSprig,
} from "./PdfOrnaments";
import { PdfCardInvitationData } from "./BaratCardRenderer";

interface ReceptionCardRendererProps {
  templateId: string;
  data: PdfCardInvitationData;
  scale?: number;
  className?: string;
  id?: string;
}

export function ReceptionCardRenderer({
  templateId,
  data,
  scale = 1,
  className = "",
  id = "reception-card-print",
}: ReceptionCardRendererProps) {
  const tokens = getPdfThemeTokens(templateId, data.religion);

  // Format date matching Screenshot 2: "Monday, 12th October, 2026"
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

  // Find reception / walima event from events list or use defaults
  const receptionEvent = data.events?.find((e) => {
    const n = (e.name || "").toLowerCase();
    return (
      n.includes("reception") ||
      n.includes("walima") ||
      n.includes("preetibhoj") ||
      n.includes("feast") ||
      n.includes("dinner") ||
      n.includes("banquet")
    );
  });

  const eventTime = receptionEvent?.time || data.weddingTime || "7:30 p.m.";
  const eventVenue = receptionEvent?.venue || data.venueName || "GOMTI LAWN";
  const eventAddress =
    data.venueAddress || "Opp. Shia P.G. College, Sitapur Road, Lucknow";

  // Host Names fallback matching tradition
  const hostNames =
    data.hostNames ||
    data.groomParents ||
    (tokens.tradition === "hindu"
      ? "Mrs. & Mr. Alok Verma"
      : tokens.tradition === "universal"
      ? "Mrs. & Mr. Vikram Malhotra"
      : "Mrs. & Mr. Hashmat Khan");
  const hostRelation = data.hostRelation || "of their Son";

  // Bride Parentage fallback matching tradition
  const parentage =
    data.parentageDetails ||
    (data.brideParents ? `D/o ${data.brideParents}` : "") ||
    (tokens.tradition === "hindu"
      ? "D/o Shri Rajesh Sharma"
      : tokens.tradition === "universal"
      ? "D/o Mr. Arvind Kapoor"
      : "D/o Mohd. Nizamuddin");

  // RSVP lines fallback matching tradition
  const rsvpLines = data.rsvpContact
    ? data.rsvpContact.split("\n")
    : tokens.tradition === "hindu"
    ? [
        "Verma & Sharma Family",
        "With Best Compliments from All Relatives & Friends",
      ]
    : tokens.tradition === "universal"
    ? [
        "Malhotra & Kapoor Family",
        "With Best Compliments from All Relatives & Friends",
      ]
    : [
        "Peer Khan, Suhail Khan, Mohd. Kaif Khan",
        "Mohd. Arif Khan, Mohd. Asif Khan, Anas Khan",
      ];

  const compliments =
    data.complimentsText || "W.B.C.F.: All Relatives & Friends";

  // 3D Gold Embossed Style for Couple Names
  const gold3DCoupleStyle: React.CSSProperties = {
    fontFamily: tokens.coupleFont,
    background:
      "linear-gradient(180deg, #FFF9E6 0%, #F5CE76 25%, #C89433 52%, #855C15 78%, #ECC56C 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter:
      "drop-shadow(0 2px 0 #5a3a08) drop-shadow(0 3px 5px rgba(0,0,0,0.35)) drop-shadow(0 0 10px rgba(220,175,80,0.4))",
  };

  // Cultural divider selector
  const renderDivider = () => {
    if (tokens.tradition === "hindu") {
      return <LotusDivider color={tokens.receptionGoldAccent} />;
    }
    if (tokens.tradition === "universal") {
      return <CelestialDivider color={tokens.receptionGoldAccent} />;
    }
    return (
      <ArabesqueDivider
        color={tokens.receptionGoldAccent}
        jewelColor="#8A1024"
      />
    );
  };

  return (
    <div
      id={id}
      className={`relative overflow-hidden select-none box-border shadow-2xl ${className}`}
      style={{
        // A5 aspect ratio: 148 mm × 210 mm -> Standard 592px × 840px base display
        width: `${592 * scale}px`,
        height: `${840 * scale}px`,
        backgroundColor: tokens.receptionBg || "#FAF7F2",
        color: tokens.receptionPrimaryText || "#680C1F",
        fontFamily: tokens.bodyFont,
        transformOrigin: "center center",
      }}
    >
      {/* ── Double Inset Gold Border Lines (Matching Screenshot 2) ── */}
      <div
        className="absolute inset-4 rounded-xl border-2 pointer-events-none"
        style={{ borderColor: tokens.receptionBorderColor }}
      />
      <div
        className="absolute inset-5 rounded-lg border pointer-events-none"
        style={{ borderColor: tokens.receptionBorderInner }}
      />
      <div
        className="absolute inset-7 rounded-sm border pointer-events-none"
        style={{ borderColor: tokens.receptionBorderInner, opacity: 0.4 }}
      />

      {/* ── Ornate Gold Filigree Corners ── */}
      <CornerFiligree
        position="top-left"
        color={tokens.receptionGoldAccent}
        className="absolute top-4 left-4"
      />
      <CornerFiligree
        position="top-right"
        color={tokens.receptionGoldAccent}
        className="absolute top-4 right-4"
      />
      <CornerFiligree
        position="bottom-left"
        color={tokens.receptionGoldAccent}
        className="absolute bottom-4 left-4"
      />
      <CornerFiligree
        position="bottom-right"
        color={tokens.receptionGoldAccent}
        className="absolute bottom-4 right-4"
      />

      {/* ── Main Content Container (Matching Screenshot 2 & Shah Hussain.pdf Page 2) ── */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between py-10 px-8 text-center">
        {/* SECTION 1: Sacred Invocation & Host Announcement */}
        <div className="space-y-1 mt-1">
          {/* Sacred Blessing / Invocation */}
          <p
            className="text-xs sm:text-[13px] italic font-serif tracking-wider"
            style={{ color: tokens.receptionPrimaryText }}
          >
            {tokens.sacredTranslation || tokens.sacredInvocation}
          </p>

          {/* Host Line */}
          <div className="pt-2">
            <h2
              className="text-2xl sm:text-[27px] font-bold font-serif tracking-wide leading-snug"
              style={{
                fontFamily: tokens.headingFont,
                color: tokens.receptionPrimaryText,
              }}
            >
              {hostNames}
            </h2>
            <p
              className="text-xs sm:text-[13px] italic font-serif mt-1 leading-snug"
              style={{ color: tokens.receptionSecondaryText }}
            >
              Solicit your gracious presence on the <br />
              auspicious occasion of
            </p>
          </div>

          {/* Event Occasion Title */}
          <div className="pt-2">
            <h3
              className="text-3xl sm:text-4xl font-serif font-black tracking-tight capitalize"
              style={{
                fontFamily: tokens.headingFont,
                color: tokens.receptionPrimaryText,
                textShadow:
                  "0 2px 4px rgba(104,12,31,0.2), 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              {data.eventTitle || tokens.receptionEventTitle || "Dawat-e-Walima"}
            </h3>
            <p
              className="text-xs sm:text-[13px] italic font-serif mt-0.5"
              style={{ color: tokens.receptionSecondaryText }}
            >
              {hostRelation}
            </p>
          </div>
        </div>

        {/* SECTION 2: Centerpiece with Golden Laurel Sprigs & 3D Gold Names */}
        <div className="py-1 space-y-1">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* Left Golden Laurel Sprig */}
            <GoldenLaurelSprig
              color={tokens.receptionGoldAccent}
              flip={false}
              className="w-8 h-10 sm:w-10 sm:h-12 flex-shrink-0"
            />

            {/* Couple Names */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span
                className="text-4xl sm:text-5xl font-normal leading-tight"
                style={gold3DCoupleStyle}
              >
                {data.groomName}
              </span>

              <span
                className="text-base sm:text-lg font-bold italic font-serif px-1"
                style={{ color: tokens.receptionPrimaryText }}
              >
                weds
              </span>

              <span
                className="text-4xl sm:text-5xl font-normal leading-tight"
                style={gold3DCoupleStyle}
              >
                {data.brideName}
              </span>
            </div>

            {/* Right Golden Laurel Sprig */}
            <GoldenLaurelSprig
              color={tokens.receptionGoldAccent}
              flip={true}
              className="w-8 h-10 sm:w-10 sm:h-12 flex-shrink-0"
            />
          </div>

          {/* Bride Parentage */}
          {parentage && (
            <p
              className="text-xs sm:text-[13px] italic font-serif pt-0.5"
              style={{ color: tokens.receptionSecondaryText }}
            >
              {parentage}
            </p>
          )}

          {/* First Arabesque Divider */}
          <div className="py-0.5">{renderDivider()}</div>

          {/* Date & Time */}
          <div className="space-y-0.5 py-0.5">
            <p
              className="text-xs sm:text-[13px] font-serif italic"
              style={{ color: tokens.receptionSecondaryText }}
            >
              {tokens.tradition === "muslim" ? "Inshallah" : "With Auspicious Blessings"}
            </p>
            <p
              className="text-xs sm:text-[13px] font-serif italic font-semibold"
              style={{ color: tokens.receptionPrimaryText }}
            >
              on {formattedDate}
            </p>
            <p
              className="text-xs sm:text-[13px] font-serif italic font-semibold"
              style={{ color: tokens.receptionPrimaryText }}
            >
              at {eventTime}
            </p>
          </div>

          {/* Second Arabesque Divider */}
          <div className="py-0.5">{renderDivider()}</div>

          {/* Venue Section */}
          <div className="space-y-0.5 pt-0.5">
            <span
              className="text-xs sm:text-[12px] font-serif italic block tracking-wider"
              style={{ color: tokens.receptionSecondaryText }}
            >
              ~ Venue ~
            </span>
            <h4
              className="text-base sm:text-lg font-serif font-black uppercase tracking-wider"
              style={{
                fontFamily: tokens.headingFont,
                color: tokens.receptionPrimaryText,
              }}
            >
              {eventVenue}
            </h4>
            <p
              className="text-xs sm:text-[12.5px] italic font-serif max-w-sm mx-auto line-clamp-2"
              style={{ color: tokens.receptionSecondaryText }}
            >
              {eventAddress}
            </p>
          </div>
        </div>

        {/* SECTION 3: R.S.V.P. & With Best Compliments From */}
        <div className="space-y-1.5 pt-1">
          <div className="space-y-0.5">
            <span
              className="text-[11px] sm:text-xs uppercase font-serif font-bold tracking-widest block"
              style={{ color: tokens.receptionPrimaryText }}
            >
              R.S.V.P.
            </span>
            {rsvpLines.map((line, idx) => (
              <p
                key={idx}
                className="text-xs sm:text-[12.5px] font-serif italic font-semibold leading-tight"
                style={{ color: tokens.receptionPrimaryText }}
              >
                {line}
              </p>
            ))}
          </div>

          <p
            className="text-[11px] sm:text-xs italic font-serif tracking-wide pt-0.5 font-medium"
            style={{ color: tokens.receptionSecondaryText }}
          >
            {compliments}
          </p>
        </div>
      </div>
    </div>
  );
}
