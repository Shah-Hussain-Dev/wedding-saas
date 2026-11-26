"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FONT_SETS, SCRIPT_FONTS, THEMES, mapLink } from "./data";

// useLayoutEffect warns during server rendering on React 18, so fall back to useEffect there.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ---------------- style resolution ---------------- */
export function resolveStyle(d) {
  const t = THEMES[d.themeId] || THEMES.maroonGold;
  const f = FONT_SETS[d.fontId] || FONT_SETS.classic;
  const c = d.colors || {};
  return {
    "--bg": c.bg || t.bg,
    "--bg2": c.bg || t.bg2,
    "--ink": t.ink,
    "--accent": c.accent || t.accent,
    "--accent2": c.accent2 || t.accent2,
    "--card": t.card,
    "--font-display": f.display,
    "--font-heading": f.heading,
    "--font-body": f.body,
  };
}

/**
 * Evaluates visible pages with strict 2-3 page maximum!
 * 2-Page mode: Cover + Combined Celebration Itinerary & Venue
 * 3-Page mode: Cover + Families & Events + Venue & Blessings
 */
export function visiblePages(d) {
  const out = [];
  if (d.pages.cover) {
    out.push({ key: "cover", label: "Page 1: Royal Cover" });
  }

  if (d.pages.combined || d.structure === "2-page") {
    // 2-Page format: Combined Itinerary, Venue, QR & Blessings
    out.push({ key: "combined", label: "Page 2: Celebration & Venue" });
  } else {
    // 3-Page format: Families & Events, then Venue & Blessings
    if (d.pages.families) {
      out.push({ key: "families", label: "Page 2: Families & Itinerary" });
    }
    if (d.pages.venue) {
      out.push({ key: "venue", label: "Page 3: Venue & Blessings" });
    }
  }

  // Strict enforcement: Never exceed 3 pages!
  return out.length ? out.slice(0, 3) : [{ key: "cover", label: "Page 1: Royal Cover" }];
}

/* ---------------- date helpers ---------------- */
const parse = (iso) => {
  if (!iso) return null;
  if (iso instanceof Date && !isNaN(iso.getTime())) return iso;
  if (typeof iso === "string") {
    const trimmed = iso.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return new Date(trimmed + "T00:00:00");
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};
const part = (iso, o) => {
  const p = parse(iso);
  return p ? p.toLocaleDateString("en-IN", o) : (typeof iso === "string" ? iso : "");
};
const longDate = (iso) => part(iso, { day: "2-digit", month: "long", year: "numeric" });
const weekday = (iso) => {
  const p = parse(iso);
  return p ? p.toLocaleDateString("en-IN", { weekday: "long" }).toUpperCase() : "";
};

/* ---------------- monogram helper ---------------- */
export function getInitials(d) {
  if (!d?.couple) return "✦";
  const b = (d.couple.bride || "").trim().charAt(0).toUpperCase();
  const g = (d.couple.groom || "").trim().charAt(0).toUpperCase();
  if (b && g) return d.couple.groomFirst ? `${g}&${b}` : `${b}&${g}`;
  return b || g || "✦";
}

/* ---------------- ornaments (SVG, themed via inline style) ---------------- */
const line = (c, w) => ({ stroke: `var(--${c})`, strokeWidth: w, fill: "none" });
const fillOf = (c, o = 1) => ({ fill: `var(--${c})`, fillOpacity: o, stroke: "none" });

function starPoints(cx, cy, R, r, n = 8) {
  return Array.from({ length: n * 2 }, (_, i) => {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const rad = i % 2 ? r : R;
    return `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

const CORNERS = [
  [9, 9, 1, 1],
  [139, 9, -1, 1],
  [9, 201, 1, -1],
  [139, 201, -1, -1],
];

function Sprig() {
  return (
    <g>
      <path d="M0 0 C8 1 14 5 17 13" style={line("accent2", 0.35)} strokeLinecap="round" />
      {[[4, 0.9, 20], [8, 2.4, 35], [11.5, 5, 55], [14.5, 9, 70]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2.6" ry="1" transform={`rotate(${r} ${x} ${y})`} style={fillOf("accent2", 0.45)} />
      ))}
      <circle cx="17.5" cy="14" r="1.2" style={fillOf("accent", 0.8)} />
    </g>
  );
}

function Blossom() {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="0" cy="-3" rx="1.7" ry="3" transform={`rotate(${r})`} style={fillOf("accent2", 0.5)} />
      ))}
      <circle r="1.1" style={fillOf("accent", 0.85)} />
      <path d="M4 4 C10 5 14 9 15 15" style={line("accent2", 0.35)} />
      <ellipse cx="9" cy="6.5" rx="2.4" ry=".9" transform="rotate(35 9 6.5)" style={fillOf("accent2", 0.4)} />
      <ellipse cx="13" cy="11.5" rx="2.4" ry=".9" transform="rotate(65 13 11.5)" style={fillOf("accent2", 0.4)} />
    </g>
  );
}

function GeoStar() {
  return (
    <g>
      <polygon points={starPoints(0, 0, 6, 3, 8)} style={line("accent2", 0.35)} />
      <polygon points={starPoints(0, 0, 3.4, 1.7, 8)} style={fillOf("accent2", 0.35)} />
      <circle r="0.9" style={fillOf("accent")} />
    </g>
  );
}

function DecoCorner() {
  return (
    <g>
      <path d="M0 0 L14 0 L14 3 L3 3 L3 14 L0 14 Z" style={fillOf("accent2", 0.75)} />
      <path d="M5 5 L12 5 L12 6.5 L6.5 6.5 L6.5 12 L5 12 Z" style={fillOf("accent", 0.6)} />
      <polygon points="12,12 14,10 16,12 14,14" style={fillOf("accent2")} />
      <line x1="0" y1="0" x2="18" y2="18" style={line("accent2", 0.3)} />
    </g>
  );
}

function CelestialCorner() {
  return (
    <g>
      <polygon points={starPoints(4, 4, 4.5, 1.8, 4)} style={fillOf("accent2", 0.85)} />
      <circle cx="12" cy="3" r="0.9" style={fillOf("accent", 0.7)} />
      <circle cx="3" cy="12" r="0.9" style={fillOf("accent", 0.7)} />
      <circle cx="9" cy="9" r="0.5" style={fillOf("accent2", 0.5)} />
      <path d="M0 16 C8 15 15 8 16 0" style={line("accent2", 0.25)} strokeDasharray="1 1.2" />
    </g>
  );
}

function BotanicalCorner() {
  return (
    <g>
      <path d="M0 0 C4 2 10 7 12 16" style={line("accent2", 0.4)} strokeLinecap="round" />
      <path d="M0 0 C2 4 7 10 16 12" style={line("accent2", 0.4)} strokeLinecap="round" />
      <ellipse cx="6" cy="3.5" rx="2.5" ry="1.1" transform="rotate(35 6 3.5)" style={fillOf("accent2", 0.55)} />
      <ellipse cx="3.5" cy="6" rx="2.5" ry="1.1" transform="rotate(55 3.5 6)" style={fillOf("accent2", 0.55)} />
      <ellipse cx="10" cy="8" rx="2.2" ry="0.9" transform="rotate(50 10 8)" style={fillOf("accent2", 0.5)} />
      <ellipse cx="8" cy="10" rx="2.2" ry="0.9" transform="rotate(40 8 10)" style={fillOf("accent2", 0.5)} />
      <circle cx="13" cy="17" r="1.1" style={fillOf("accent")} />
      <circle cx="17" cy="13" r="1.1" style={fillOf("accent")} />
    </g>
  );
}

function BaroqueCorner() {
  return (
    <g>
      <path d="M0 0 C6 0 12 4 14 10 C15 14 12 18 8 16 C5 14 6 9 10 8 C13 7 17 11 16 16" style={line("accent2", 0.4)} />
      <circle cx="14" cy="10" r="1.1" style={fillOf("accent", 0.85)} />
      <path d="M0 0 C0 6 4 12 10 14 C14 15 18 12 16 8 C14 5 9 6 8 10 C7 13 11 17 16 16" style={line("accent2", 0.3)} />
      <circle cx="10" cy="14" r="0.8" style={fillOf("accent2")} />
    </g>
  );
}

function CrosshairCorner() {
  return (
    <g>
      <line x1="-3" y1="0" x2="6" y2="0" style={line("accent2", 0.45)} />
      <line x1="0" y1="-3" x2="0" y2="6" style={line("accent2", 0.45)} />
      <circle cx="0" cy="0" r="1.2" style={fillOf("accent")} />
    </g>
  );
}

/* ── 3D Architectural Frame Ornaments ── */
function MirrorFacetCorner() {
  return (
    <g>
      <polygon points="0,0 8,0 12,4 4,12 0,8" style={fillOf("accent2", 0.4)} />
      <polygon points="2,2 7,2 9,4 4,9 2,7" style={fillOf("accent", 0.7)} />
      <line x1="0" y1="0" x2="16" y2="16" style={line("accent2", 0.3)} />
      <circle cx="12" cy="12" r="1.2" style={fillOf("accent")} />
    </g>
  );
}

function LotusBudCorner() {
  return (
    <g>
      <path d="M0 0 C6 2 12 8 14 16" style={line("accent2", 0.45)} />
      <ellipse cx="6" cy="4" rx="2.5" ry="1.2" transform="rotate(30 6 4)" style={fillOf("accent2", 0.6)} />
      <ellipse cx="11" cy="9" rx="2.2" ry="1" transform="rotate(50 11 9)" style={fillOf("accent2", 0.6)} />
      <circle cx="15" cy="17" r="1.4" style={fillOf("accent")} />
    </g>
  );
}

function RegencyBezelCorner() {
  return (
    <g>
      <rect x="0" y="0" width="14" height="14" style={line("accent2", 0.5)} />
      <rect x="2.5" y="2.5" width="9" height="9" style={line("accent", 0.3)} />
      <circle cx="7" cy="7" r="1.8" style={fillOf("accent2", 0.85)} />
    </g>
  );
}

export function Frame({ layout, cover }) {
  const corner = (Comp, dx = 0) =>
    CORNERS.map(([x, y, sx, sy], i) => (
      <g key={i} transform={`translate(${x + dx * sx} ${y + dx * sy}) scale(${sx} ${sy})`}>
        <Comp />
      </g>
    ));

  return (
    <svg className="wib-frame" viewBox="0 0 148 210" preserveAspectRatio="none" aria-hidden="true">
      {/* Background fill layer to guarantee background color is rendered even if Chrome 'Background graphics' option is disabled */}
      <rect width="148" height="210" fill="var(--bg)" />

      {/* 1. ROYAL */}
      {layout === "royal" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.5)} />
          <rect x="7.2" y="7.2" width="133.6" height="195.6" style={line("accent2", 0.2)} />
          {corner(Sprig, 2)}
        </>
      )}

      {/* 2. MANDAP ARCH */}
      {layout === "arch" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.5)} />
          {cover ? (
            <>
              <path d="M22 198 V82 A52 52 0 0 1 126 82 V198 Z" style={line("accent2", 0.5)} />
              <path d="M25 198 V82 A49 49 0 0 1 123 82 V198" style={line("accent2", 0.2)} />
              <circle cx="74" cy="22" r="6.5" style={line("accent2", 0.3)} />
              <polygon points={starPoints(74, 22, 4.8, 2.2, 8)} style={fillOf("accent", 0.75)} />
            </>
          ) : (
            <rect x="7.2" y="7.2" width="133.6" height="195.6" style={line("accent2", 0.2)} />
          )}
          {corner(Sprig, 2)}
        </>
      )}

      {/* 3. SHEESH MAHAL 3D MIRROR JHAROKHA */}
      {layout === "sheeshMirror" && (
        <>
          {/* Double 3D Beveled Outer Frame */}
          <rect x="4.5" y="4.5" width="139" height="201" style={line("accent2", 0.7)} />
          <rect x="7" y="7" width="134" height="196" style={line("accent2", 0.25)} strokeDasharray="3 1.5" />
          <rect x="9.5" y="9.5" width="129" height="191" style={line("accent", 0.35)} />
          {corner(MirrorFacetCorner, 0)}
          {cover ? (
            <>
              {/* Mughal Cusped 7-Lobe Palace Arch */}
              <path
                d="M17 198 V74 C17 62 25 54 36 50 C48 46 54 35 74 22 C94 35 100 46 112 50 C123 54 131 62 131 74 V198 Z"
                style={line("accent2", 0.65)}
              />
              <path
                d="M20 198 V76 C20 64 27 57 37 53 C49 49 55 38 74 26 C93 38 99 49 111 53 C121 57 128 64 128 76 V198"
                style={line("accent2", 0.2)}
              />
              {/* Suspended Crystal Chandelier Pendant */}
              <line x1="74" y1="22" x2="74" y2="38" style={line("accent2", 0.4)} />
              <polygon points="74,38 70,44 78,44" style={fillOf("accent2", 0.9)} />
              <circle cx="74" cy="46" r="1.4" style={fillOf("accent")} />
            </>
          ) : (
            <rect x="11.5" y="11.5" width="125" height="187" style={line("accent2", 0.2)} />
          )}
        </>
      )}

      {/* 4. ROYAL LOTUS 3D MANDAPAM */}
      {layout === "lotusTemple" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.6)} />
          <rect x="7.5" y="7.5" width="133" height="195" style={line("accent2", 0.25)} />
          {corner(LotusBudCorner, 0)}
          {cover ? (
            <>
              <path d="M22 198 V78 C22 46 44 28 74 28 C104 28 126 46 126 78 V198 Z" style={line("accent2", 0.55)} />
              {/* Sacred Lotus Apex */}
              <g transform="translate(74 27)">
                <ellipse cx="0" cy="-1.5" rx="1.6" ry="3.2" style={fillOf("accent", 0.85)} />
                <ellipse cx="-2.6" cy="-0.6" rx="1.4" ry="2.8" transform="rotate(-38 -2.6 -0.6)" style={fillOf("accent2", 0.75)} />
                <ellipse cx="2.6" cy="-0.6" rx="1.4" ry="2.8" transform="rotate(38 2.6 -0.6)" style={fillOf("accent2", 0.75)} />
              </g>
            </>
          ) : (
            <rect x="10" y="10" width="128" height="190" style={line("accent2", 0.2)} />
          )}
        </>
      )}

      {/* 5. ROYAL MAJESTY 3D REGENCY BEVEL */}
      {layout === "majestyBezel" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.65)} />
          <rect x="8" y="8" width="132" height="194" style={line("accent", 0.35)} />
          <rect x="10" y="10" width="128" height="190" style={line("accent2", 0.2)} strokeDasharray="2 1.5" />
          {corner(RegencyBezelCorner, 0)}
          <g transform="translate(74 8)">
            <polygon points="0,-2 3,0 0,2 -3,0" style={fillOf("accent")} />
          </g>
          <g transform="translate(74 202)">
            <polygon points="0,-2 3,0 0,2 -3,0" style={fillOf("accent")} />
          </g>
        </>
      )}

      {/* 6. ROYAL HERITAGE 3D RAJPUTANA LATTICE */}
      {layout === "heritageSandstone" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.6)} />
          <rect x="7.5" y="7.5" width="133" height="195" style={line("accent2", 0.25)} />
          {corner(Sprig, 1)}
          {cover ? (
            <>
              <path d="M19 198 V80 C19 50 42 30 74 30 C106 30 129 50 129 80 V198 Z" style={line("accent2", 0.55)} />
              {/* Scalloped Jali Apex */}
              <circle cx="74" cy="20" r="4.5" style={line("accent2", 0.35)} />
              <polygon points={starPoints(74, 20, 3.4, 1.5, 8)} style={fillOf("accent", 0.8)} />
            </>
          ) : (
            <rect x="10" y="10" width="128" height="190" style={line("accent2", 0.2)} />
          )}
        </>
      )}

      {/* 7. ROYAL GRACE 3D OLIVE CARTOUCHE */}
      {layout === "graceMehndi" && (
        <>
          <rect x="6" y="6" width="136" height="198" rx="2" style={line("accent2", 0.45)} />
          <rect x="8.5" y="8.5" width="131" height="193" rx="1" style={line("accent2", 0.2)} />
          {corner(BotanicalCorner, 0)}
        </>
      )}

      {/* 8. ROYAL ELEGANCE 3D CRIMSON GOLD CREST */}
      {layout === "crimsonGoldCrest" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.7)} />
          <rect x="7.5" y="7.5" width="133" height="195" style={line("accent2", 0.25)} strokeDasharray="3 2" />
          <rect x="9.5" y="9.5" width="129" height="191" style={line("accent", 0.4)} />
          {corner(BaroqueCorner, 1)}
          <g transform="translate(74 7.5)">
            <polygon points={starPoints(0, 0, 4.2, 1.8, 8)} style={fillOf("accent2", 0.9)} />
          </g>
        </>
      )}

      {/* 9. ROSE GOLD 3D TWILIGHT */}
      {layout === "twilightRose" && (
        <>
          <rect x="5.5" y="5.5" width="137" height="199" style={line("accent2", 0.55)} />
          <rect x="8" y="8" width="132" height="194" style={line("accent2", 0.25)} />
          {corner(CelestialCorner, 1)}
          <g transform="translate(74 8)">
            <polygon points={starPoints(0, 0, 3, 1.2, 4)} style={fillOf("accent")} />
          </g>
        </>
      )}

      {/* 10. ART DECO GATSBY */}
      {layout === "artdeco" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.6)} />
          <rect x="8" y="8" width="132" height="194" style={line("accent2", 0.25)} strokeDasharray="3 1.5" />
          <rect x="10.5" y="10.5" width="127" height="189" style={line("accent2", 0.35)} />
          {corner(DecoCorner, 0)}
          <g transform="translate(74 8)">
            <polygon points="0,-2.5 4,0 0,2.5 -4,0" style={fillOf("accent")} />
            <line x1="-16" y1="0" x2="-6" y2="0" style={line("accent2", 0.4)} />
            <line x1="6" y1="0" x2="16" y2="0" style={line("accent2", 0.4)} />
          </g>
          <g transform="translate(74 202)">
            <polygon points="0,-2.5 4,0 0,2.5 -4,0" style={fillOf("accent")} />
            <line x1="-16" y1="0" x2="-6" y2="0" style={line("accent2", 0.4)} />
            <line x1="6" y1="0" x2="16" y2="0" style={line("accent2", 0.4)} />
          </g>
        </>
      )}

      {/* 11. CELESTIAL STARLIGHT */}
      {layout === "celestial" && (
        <>
          <rect x="6" y="6" width="136" height="198" style={line("accent2", 0.35)} strokeDasharray="1 2.5" />
          <rect x="8.5" y="8.5" width="131" height="193" style={line("accent2", 0.2)} />
          {corner(CelestialCorner, 1)}
          <g transform="translate(74 9)">
            <path d="M-0.8 -3.2 A3.5 3.5 0 1 0 2.2 2.8 A2.6 2.6 0 1 1 -0.8 -3.2 Z" style={fillOf("accent2", 0.8)} />
            <polygon points={starPoints(2.8, -0.6, 2, 0.8, 4)} style={fillOf("accent")} />
          </g>
          <g transform="translate(74 201)">
            <polygon points={starPoints(0, 0, 3.2, 1.2, 8)} style={fillOf("accent2", 0.8)} />
          </g>
        </>
      )}

      {/* 12. BOTANICAL OLIVE VINES */}
      {layout === "botanical" && (
        <>
          <rect x="6.5" y="6.5" width="135" height="197" rx="2" style={line("accent2", 0.4)} />
          <rect x="9" y="9" width="130" height="192" rx="1" style={line("accent2", 0.2)} />
          {corner(BotanicalCorner, 0)}
        </>
      )}

      {/* 13. BAROQUE */}
      {layout === "baroque" && (
        <>
          <rect x="5.5" y="5.5" width="137" height="199" style={line("accent2", 0.55)} />
          <rect x="7.8" y="7.8" width="132.4" height="194.4" style={line("accent2", 0.2)} />
          <rect x="9.8" y="9.8" width="128.4" height="190.4" style={line("accent2", 0.35)} strokeDasharray="1.5 1.5" />
          {corner(BaroqueCorner, 1)}
        </>
      )}

      {/* 14. PALACE ARCH */}
      {layout === "palaceArch" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.55)} />
          <rect x="7" y="7" width="134" height="196" style={line("accent2", 0.2)} />
          {cover ? (
            <>
              <path
                d="M18 198 V76 C18 64 26 56 38 52 C50 48 56 36 74 24 C92 36 98 48 110 52 C122 56 130 64 130 76 V198 Z"
                style={line("accent2", 0.55)}
              />
              <line x1="74" y1="24" x2="74" y2="38" style={line("accent2", 0.35)} />
              <circle cx="74" cy="38" r="1.6" style={fillOf("accent2")} />
            </>
          ) : (
            <rect x="9.5" y="9.5" width="129" height="191" style={line("accent2", 0.25)} />
          )}
          {corner(Sprig, 1)}
        </>
      )}

      {/* 15. MODERN ARCHITECTURAL EDGE */}
      {layout === "modernEdge" && (
        <>
          <rect x="7" y="7" width="134" height="196" style={line("accent2", 0.3)} />
          <rect x="10.5" y="10.5" width="127" height="189" style={line("accent", 0.65)} />
          {CORNERS.map(([x, y], i) => (
            <g key={i} transform={`translate(${x - 2} ${y - 2})`}>
              <CrosshairCorner />
            </g>
          ))}
        </>
      )}

      {/* 16. GEOMETRIC */}
      {layout === "geometric" && (
        <>
          <rect x="6" y="6" width="136" height="198" style={line("accent2", 0.5)} />
          <rect x="8.2" y="8.2" width="131.6" height="193.6" style={line("accent2", 0.2)} />
          {corner(GeoStar, 9)}
        </>
      )}

      {/* 17. FLORAL */}
      {layout === "floral" && (
        <>
          <rect x="6" y="6" width="136" height="198" rx="1" style={line("accent2", 0.3)} />
          {corner(Blossom, 4)}
        </>
      )}

      {/* 18. MINIMAL */}
      {layout === "minimal" && (
        <>
          <rect x="9" y="9" width="130" height="192" style={line("accent2", 0.3)} />
          <polygon points="74,6.5 76.5,9 74,11.5 71.5,9" style={fillOf("accent2")} />
          <polygon points="74,198.5 76.5,201 74,203.5 71.5,201" style={fillOf("accent2")} />
        </>
      )}

      {/* 19. BANNER */}
      {layout === "banner" && (
        <>
          <rect x="0" y="0" width="148" height="17" style={fillOf("accent")} />
          <rect x="0" y="19" width="148" height="0.6" style={fillOf("accent2")} />
          <rect x="0" y="198" width="148" height="12" style={fillOf("accent")} />
          <rect x="0" y="196.4" width="148" height="0.6" style={fillOf("accent2")} />
          {Array.from({ length: 13 }, (_, i) => (
            <polygon key={i} points={starPoints(6 + i * 11.5, 8.5, 3.6, 1.7, 4)} style={fillOf("accent2", 0.8)} />
          ))}
          <rect x="9" y="26" width="130" height="162" style={line("accent2", 0.3)} />
        </>
      )}

      {/* 20. SCENIC VERANDA RECEPTION */}
      {layout === "scenicVeranda" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.6)} />
          <rect x="7.5" y="7.5" width="133" height="195" style={line("accent2", 0.25)} />
          <path d="M16 80 C16 48 36 22 74 22 C112 22 132 48 132 80" style={line("accent2", 0.6)} />
          <path d="M22 80 C22 52 40 28 74 28 C108 28 126 52 126 80" style={line("accent2", 0.3)} strokeDasharray="2 1.5" />
          <rect x="12" y="184" width="124" height="2" style={fillOf("accent2", 0.7)} />
          <rect x="12" y="196" width="124" height="2.5" style={fillOf("accent2", 0.8)} />
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={16 + i * 8.6} y="186" width="3.5" height="10" rx="0.8" style={fillOf("accent2", 0.4)} />
          ))}
          <line x1="74" y1="22" x2="74" y2="34" style={line("accent2", 0.4)} />
          <polygon points="74,34 76.5,38 74,42 71.5,38" style={fillOf("accent", 0.8)} />
        </>
      )}

      {/* 21. SACRED LOTUS JHAROKHA */}
      {layout === "lotusJharokha" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.65)} />
          <rect x="8" y="8" width="132" height="194" style={line("accent2", 0.2)} />
          <path d="M18 196 V75 C18 60 28 50 42 46 C48 42 54 30 74 18 C94 30 100 42 106 46 C120 50 130 60 130 75 V196" style={line("accent2", 0.6)} />
          <g transform="translate(22 186) scale(0.75)">
            <ellipse cx="0" cy="0" rx="6" ry="12" style={fillOf("accent", 0.65)} />
            <ellipse cx="-4" cy="2" rx="5" ry="10" transform="rotate(-30)" style={fillOf("accent2", 0.7)} />
            <ellipse cx="4" cy="2" rx="5" ry="10" transform="rotate(30)" style={fillOf("accent2", 0.7)} />
          </g>
          <g transform="translate(126 186) scale(0.75)">
            <ellipse cx="0" cy="0" rx="6" ry="12" style={fillOf("accent", 0.65)} />
            <ellipse cx="-4" cy="2" rx="5" ry="10" transform="rotate(-30)" style={fillOf("accent2", 0.7)} />
            <ellipse cx="4" cy="2" rx="5" ry="10" transform="rotate(30)" style={fillOf("accent2", 0.7)} />
          </g>
        </>
      )}

      {/* 22. FUNCTION VIGNETTES */}
      {layout === "functionVignettes" && (
        <>
          <rect x="5.5" y="5.5" width="137" height="199" rx="3" style={line("accent2", 0.55)} />
          <rect x="8" y="8" width="132" height="194" rx="2" style={line("accent2", 0.2)} />
          <line x1="20" y1="18" x2="128" y2="18" style={line("accent2", 0.4)} strokeDasharray="3 2" />
          <line x1="20" y1="192" x2="128" y2="192" style={line("accent2", 0.4)} strokeDasharray="3 2" />
          <circle cx="74" cy="18" r="2.2" style={fillOf("accent")} />
          <circle cx="74" cy="192" r="2.2" style={fillOf("accent")} />
          {corner(DecoCorner, 0)}
        </>
      )}

      {/* 23. CHHATRI GROVE */}
      {layout === "chhatriGrove" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.55)} />
          <rect x="7.5" y="7.5" width="133" height="195" style={line("accent2", 0.2)} />
          <g transform="translate(26 22)">
            <path d="M-12 0 C-12 -10 0 -14 0 -14 C0 -14 12 -10 12 0 Z" style={fillOf("accent2", 0.7)} />
            <line x1="0" y1="-14" x2="0" y2="-18" style={line("accent", 0.6)} />
            <circle cx="0" cy="-18" r="1.2" style={fillOf("accent")} />
          </g>
          <g transform="translate(122 22)">
            <path d="M-12 0 C-12 -10 0 -14 0 -14 C0 -14 12 -10 12 0 Z" style={fillOf("accent2", 0.7)} />
            <line x1="0" y1="-14" x2="0" y2="-18" style={line("accent", 0.6)} />
            <circle cx="0" cy="-18" r="1.2" style={fillOf("accent")} />
          </g>
          <path d="M10 196 C20 186 35 186 42 196" style={line("accent2", 0.45)} />
          <path d="M138 196 C128 186 113 186 106 196" style={line("accent2", 0.45)} />
        </>
      )}

      {/* 24. ROSE PAVILION */}
      {layout === "rosePavilion" && (
        <>
          <rect x="5.5" y="5.5" width="137" height="199" style={line("accent2", 0.5)} />
          <rect x="8.5" y="8.5" width="131" height="193" style={line("accent2", 0.25)} />
          <path d="M16 196 V40 C16 26 34 16 74 16 C114 16 132 26 132 40 V196" style={line("accent2", 0.55)} />
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={28 + i * 11.5} cy={22 + (i % 2) * 2} r="2.2" style={fillOf("accent", 0.6)} />
          ))}
          {corner(BotanicalCorner, 0)}
        </>
      )}

      {/* 25. TEMPLE BELLS */}
      {layout === "templeBells" && (
        <>
          <rect x="5" y="5" width="138" height="200" style={line("accent2", 0.6)} />
          <rect x="7.5" y="7.5" width="133" height="195" style={line("accent2", 0.2)} />
          <g transform="translate(24 8)">
            <line x1="0" y1="0" x2="0" y2="16" style={line("accent2", 0.6)} strokeDasharray="1.5 1" />
            <path d="M-6 24 C-6 17 -3 16 0 16 C3 16 6 17 6 24 Z" style={fillOf("accent2", 0.85)} />
            <circle cx="0" cy="25" r="1.4" style={fillOf("accent")} />
          </g>
          <g transform="translate(124 8)">
            <line x1="0" y1="0" x2="0" y2="16" style={line("accent2", 0.6)} strokeDasharray="1.5 1" />
            <path d="M-6 24 C-6 17 -3 16 0 16 C3 16 6 17 6 24 Z" style={fillOf("accent2", 0.85)} />
            <circle cx="0" cy="25" r="1.4" style={fillOf("accent")} />
          </g>
          <path d="M60 196 C60 186 68 180 74 176 C80 180 88 186 88 196" style={line("accent2", 0.45)} />
          {corner(Sprig, 1)}
        </>
      )}
    </svg>
  );
}

export function Divider({ motif = "diamond", w = 46, d = null }) {
  const initials = getInitials(d);

  const M = {
    diamond: <path d="M0 -1.7 L1.7 0 L0 1.7 L-1.7 0Z" style={fillOf("accent2")} />,
    star: <polygon points={starPoints(0, 0, 2.6, 1.2, 8)} style={fillOf("accent2")} />,
    cross: <path d="M0 -2.6V2.6M-1.7 -0.8H1.7" style={{ ...line("accent2", 0.65) }} strokeLinecap="round" />,
    lotus: (
      <g style={fillOf("accent2", 0.85)}>
        <ellipse cx="0" cy="-1.1" rx=".9" ry="2" />
        <ellipse cx="-1.7" cy="-.4" rx=".8" ry="1.8" transform="rotate(-42 -1.7 -.4)" />
        <ellipse cx="1.7" cy="-.4" rx=".8" ry="1.8" transform="rotate(42 1.7 -.4)" />
      </g>
    ),
    monogram: (
      <g>
        <circle cx="0" cy="0" r="4.6" style={line("accent2", 0.45)} />
        <circle cx="0" cy="0" r="3.7" style={line("accent2", 0.2)} strokeDasharray="0.8 0.6" />
        <text
          x="0"
          y="1.3"
          textAnchor="middle"
          style={{
            fill: "var(--accent)",
            fontSize: initials.length > 3 ? "2.4px" : "3.1px",
            fontFamily: "var(--font-heading)",
            letterSpacing: "0.2px",
            fontWeight: "700",
          }}
        >
          {initials}
        </text>
      </g>
    ),
    sunburst: (
      <g>
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i * Math.PI) / 8;
          const len = i % 2 === 0 ? 3.8 : 2.4;
          return (
            <line
              key={i}
              x1={0}
              y1={0}
              x2={+(len * Math.cos(a)).toFixed(2)}
              y2={+(len * Math.sin(a)).toFixed(2)}
              style={line("accent2", 0.4)}
            />
          );
        })}
        <circle cx="0" cy="0" r="1.2" style={fillOf("accent")} />
      </g>
    ),
    olive: (
      <g>
        <path d="M-4.5 1 C-2 -1.5 2 -1.5 4.5 1" style={line("accent2", 0.45)} strokeLinecap="round" />
        <ellipse cx="-2.5" cy="-1.2" rx="1.4" ry="0.6" transform="rotate(-30 -2.5 -1.2)" style={fillOf("accent2", 0.7)} />
        <ellipse cx="2.5" cy="-1.2" rx="1.4" ry="0.6" transform="rotate(30 2.5 -1.2)" style={fillOf("accent2", 0.7)} />
        <circle cx="0" cy="-1.6" r="0.8" style={fillOf("accent")} />
      </g>
    ),
    crescent: (
      <g>
        <path d="M-0.8 -2.6 A2.8 2.8 0 1 0 1.8 2.2 A2.2 2.2 0 1 1 -0.8 -2.6 Z" style={fillOf("accent2", 0.85)} />
        <polygon points={starPoints(1.8, -0.6, 1.8, 0.7, 4)} style={fillOf("accent")} />
      </g>
    ),
    peacock: (
      <g>
        <path d="M0 2.8 C0.5 0.5 -0.5 -1.2 0 -2.8" style={line("accent2", 0.4)} />
        <ellipse cx="0" cy="-1.4" rx="1.8" ry="1.2" style={line("accent2", 0.35)} />
        <circle cx="0" cy="-1.4" r="0.75" style={fillOf("accent")} />
        <circle cx="-1.4" cy="0.4" r="0.4" style={fillOf("accent2", 0.7)} />
        <circle cx="1.4" cy="0.4" r="0.4" style={fillOf("accent2", 0.7)} />
      </g>
    ),
    knot: (
      <g>
        <path
          d="M-2.4 0 C-2.4 -1.5 0 -1.5 0 0 C0 1.5 2.4 1.5 2.4 0 C2.4 -1.5 0 -1.5 0 0 C0 1.5 -2.4 1.5 -2.4 0 Z"
          style={line("accent2", 0.55)}
          strokeLinecap="round"
        />
        <circle cx="0" cy="0" r="0.7" style={fillOf("accent")} />
      </g>
    ),
    none: null,
  };

  const gap = motif === "none" ? 0 : motif === "monogram" ? 6.5 : 5;
  return (
    <svg className="wib-divider" viewBox="-30 -6 60 12" style={{ width: `${w}mm` }} aria-hidden="true">
      <line x1="-28" x2={-gap} y1="0" y2="0" style={line("accent2", 0.25)} />
      <line x1={gap} x2="28" y1="0" y2="0" style={line("accent2", 0.25)} />
      <circle cx="-28.4" cy="0" r=".55" style={fillOf("accent2")} />
      <circle cx="28.4" cy="0" r=".55" style={fillOf("accent2")} />
      {M[motif] || M.diamond}
    </svg>
  );
}

/* ---------------- page bodies & Canva direct editing ---------------- */
function Lines({ text }) {
  return (text || "").split("\n").map((l, i) => <div key={i}>{l}</div>);
}

/**
 * Canva-Style In-Place Direct Editable Text Component
 * Robust React implementation using controlled inline inputs when active,
 * preventing any contentEditable DOM reconciliation conflicts or removeChild errors.
 */
export function EditableText({
  path,
  value,
  placeholder,
  tag = "div",
  className = "",
  style = {},
  editProps = {},
  dir = undefined,
  children = null,
}) {
  const { isPrint = false, activeElement = null, onSelectElement = null, onUpdateText = null } = editProps;
  const isSelected = activeElement?.path === path;
  const Tag = tag;
  const rawValue = typeof value === "string" ? value : children ? String(children) : "";
  const displayVal = rawValue || placeholder || "";

  if (isPrint || !onSelectElement) {
    return (
      <Tag className={className} style={style} dir={dir}>
        {displayVal}
      </Tag>
    );
  }

  const handleClick = (e) => {
    e.stopPropagation();
    onSelectElement({ id: path, type: "text", path, label: placeholder || path });
  };

  const isMultiLine = displayVal.includes("\n") || path.includes("address") || path.includes("body");

  return (
    <Tag
      className={`${className} wib-editable ${isSelected ? "wib-selected-text" : ""}`}
      style={{
        ...style,
        position: "relative",
      }}
      dir={dir}
      onClick={handleClick}
      title={isSelected ? undefined : "Click to edit directly on canvas"}
    >
      {isSelected ? (
        isMultiLine ? (
          <textarea
            autoFocus
            rows={Math.max(2, (rawValue || "").split("\n").length)}
            value={rawValue}
            onChange={(e) => onUpdateText && onUpdateText(path, e.target.value)}
            className="wib-inline-editor"
            style={{
              font: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              fontWeight: "inherit",
              color: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              textAlign: "inherit",
              lineHeight: "inherit",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <input
            type="text"
            autoFocus
            value={rawValue}
            onChange={(e) => onUpdateText && onUpdateText(path, e.target.value)}
            className="wib-inline-editor"
            style={{
              font: "inherit",
              fontSize: "inherit",
              fontFamily: "inherit",
              fontWeight: "inherit",
              color: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              textAlign: "inherit",
              lineHeight: "inherit",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )
      ) : (
        <span>{displayVal}</span>
      )}

      {isSelected && (
        <span className="wib-handles-wrap" aria-hidden="true">
          <span className="wib-handle tl" />
          <span className="wib-handle tr" />
          <span className="wib-handle bl" />
          <span className="wib-handle br" />
        </span>
      )}
    </Tag>
  );
}

/**
 * Movable 3D and Decorative Element on Preview Canvas
 * Allows smooth mouse/touch dragging, scaling, and removal.
 */
function MovableElementItem({ el, isPrint, isSelected, onSelect, onUpdate, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(null);

  const handlePointerDown = (e) => {
    if (isPrint) return;
    // CRITICAL: Do not initiate drag or pointer capture if user clicked delete or action button
    if (e.target.closest(".wib-el-action") || e.target.closest(".wib-el-delete")) {
      return;
    }
    e.stopPropagation();
    onSelect();
    const parent = e.currentTarget.closest(".wib-page");
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: el.x ?? 50,
      initialY: el.y ?? 50,
      pageW: rect.width,
      pageH: rect.height,
    };
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dragStartRef.current) return;
    const { startX, startY, initialX, initialY, pageW, pageH } = dragStartRef.current;
    const deltaXPercent = ((e.clientX - startX) / pageW) * 100;
    const deltaYPercent = ((e.clientY - startY) / pageH) * 100;
    const newX = Math.round(Math.max(5, Math.min(95, initialX + deltaXPercent)));
    const newY = Math.round(Math.max(5, Math.min(95, initialY + deltaYPercent)));
    onUpdate({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      // Keep element selected after dragging so user can continue editing or delete
      onSelect();
    }
  };

  const scale = el.scale ?? 1;
  const rotate = el.rotate ?? 0;

  return (
    <div
      className={`wib-element-item ${isSelected ? "wib-element-selected" : ""} ${isDragging ? "is-dragging" : ""}`}
      style={{
        left: `${el.x ?? 50}%`,
        top: `${el.y ?? 50}%`,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={(e) => {
        // Prevent click from bubbling to wibu-stage which would deselect it
        e.stopPropagation();
        onSelect();
      }}
      title={isPrint ? undefined : "Drag to move · Click to select · Hover to delete"}
    >
      <ElementRenderer elementId={el.typeId || el.id} />
      {!isPrint && (
        <button
          type="button"
          className={`wib-el-action wib-el-delete ${isSelected ? "is-visible" : ""}`}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove();
          }}
          title="Remove element"
          aria-label="Remove element"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Canvas Elements Overlay Layer for Movable Stickers & 3D Props
 */
export function CanvasElementsLayer({
  elements = [],
  pageKey,
  isPrint = false,
  activeElement = null,
  onSelectElement = null,
  onUpdateElement = null,
  onRemoveElement = null,
}) {
  const pageElements = (elements || []).filter((e) => (e.page || "cover") === pageKey);

  if (!pageElements.length) return null;

  return (
    <div className="wib-elements-layer">
      {pageElements.map((el) => {
        const isSelected = activeElement?.id === el.id;
        return (
          <MovableElementItem
            key={el.id}
            el={el}
            isPrint={isPrint}
            isSelected={isSelected}
            onSelect={() => onSelectElement && onSelectElement({ id: el.id, type: "element", el })}
            onUpdate={(updates) => onUpdateElement && onUpdateElement(el.id, updates)}
            onRemove={() => onRemoveElement && onRemoveElement(el.id)}
          />
        );
      })}
    </div>
  );
}

/** Page 1: Royal Cover with Direct In-Preview Editing */
function Cover({ d, editProps = {} }) {
  const { bride, groom, brideTitle, groomTitle, groomFirst, tagline } = d.couple;
  const b = `${brideTitle} ${bride}`.trim();
  const g = `${groomTitle} ${groom}`.trim();
  const [first, second] = groomFirst ? [g, b] : [b, g];
  const firstPath = groomFirst ? "couple.groom" : "couple.bride";
  const secondPath = groomFirst ? "couple.bride" : "couple.groom";
  const inv = d.invocation;

  return (
    <>
      {inv.enabled && inv.text && (
        <EditableText
          path="invocation.text"
          value={inv.text}
          className="wib-inv"
          dir={inv.script === "arabic" ? "rtl" : "ltr"}
          style={{
            fontFamily: SCRIPT_FONTS[inv.script] || undefined,
            fontSize: inv.text.length <= 3 ? "2.8em" : inv.text.length > 40 ? "0.95em" : undefined,
          }}
          editProps={editProps}
        />
      )}
      {inv.enabled && inv.sub && (
        <EditableText path="invocation.sub" value={inv.sub} className="wib-inv-sub" editProps={editProps} />
      )}
      <EditableText path="heading" value={d.heading} className="wib-kicker" editProps={editProps} />
      <Divider motif={d.motif} d={d} />
      {tagline && (
        <EditableText path="couple.tagline" value={tagline} className="wib-tagline" editProps={editProps} />
      )}
      <EditableText path={firstPath} value={first} className="wib-name" editProps={editProps} />
      <div className="wib-amp">&amp;</div>
      <EditableText path={secondPath} value={second} className="wib-name" editProps={editProps} />
      <Divider motif={d.motif} d={d} />
      {d.date && (
        <div className="wib-date">
          {weekday(d.date)} · {longDate(d.date)}
        </div>
      )}
      {d.venue.name && (
        <EditableText path="venue.name" value={d.venue.name} className="wib-cover-place" editProps={editProps} />
      )}
    </>
  );
}

function Side({ d, side, name, title, sideKey, editProps }) {
  const namePath = sideKey === "brideSide" ? "couple.bride" : "couple.groom";
  return (
    <div>
      <div className="wib-sidelabel">{side.title}</div>
      <EditableText path={namePath} value={`${title} ${name}`.trim()} className="wib-sidename" editProps={editProps} />
      {side.entries.map((e, idx) => (
        <div key={e.id}>
          {e.label && <div className="wib-rel">{e.label}</div>}
          <EditableText
            path={`families.${sideKey}.entries.${idx}.name`}
            value={e.name}
            className="wib-fam"
            editProps={editProps}
          />
        </div>
      ))}
    </div>
  );
}

/** Page 2 of 3-Page Cards: Families & Auspicious Ceremonies */
function Families({ d, editProps = {} }) {
  const c = d.couple;
  const bride = <Side d={d} side={d.families.brideSide} name={c.bride} title={c.brideTitle} sideKey="brideSide" editProps={editProps} />;
  const groom = <Side d={d} side={d.families.groomSide} name={c.groom} title={c.groomTitle} sideKey="groomSide" editProps={editProps} />;
  return (
    <>
      <EditableText path="families.title" value={d.families.title} className="wib-h" editProps={editProps} />
      <Divider motif={d.motif} d={d} />
      <div className="wib-cols">
        {c.groomFirst ? groom : bride}
        <div className="wib-vline" />
        {c.groomFirst ? bride : groom}
      </div>
      {d.events.length > 0 && (
        <>
          <EditableText path="eventsTitle" value={d.eventsTitle} className="wib-h" style={{ marginTop: "0.8em" }} editProps={editProps} />
          <Divider motif={d.motif} d={d} />
          <div className="wib-events">
            {d.events.map((e, idx) => (
              <div className="wib-event" key={e.id}>
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <EditableText path={`events.${idx}.title`} value={e.title} className="wib-ev-title" editProps={editProps} />
                  <div className="wib-ev-meta">{[e.date && longDate(e.date), e.time].filter(Boolean).join("  ·  ")}</div>
                  {e.venue && <div className="wib-ev-venue">{e.venue}</div>}
                  {e.note && <div className="wib-ev-venue">{e.note}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {e.date && <div className="wib-ev-day">{weekday(e.date)}</div>}
                  {!isPrint && editProps.onRemoveEvent && (
                    <button
                      type="button"
                      className="wib-event-del-btn"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        editProps.onRemoveEvent(e.id);
                      }}
                      title="Remove event from PDF invitation"
                      aria-label={`Remove ${e.title} from PDF`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/** Page 3 of 3-Page Cards: Venue Sthal, Route Map QR & Blessings (NO RSVP!) */
function VenuePage({ d, editProps = {} }) {
  const { isPrint = false } = editProps;
  const link = mapLink(d.venue);
  const fill = (s) => (s || "").replaceAll("{bride}", d.couple.bride).replaceAll("{groom}", d.couple.groom);
  return (
    <>
      <EditableText path="venue.title" value={d.venue.title} className="wib-h" editProps={editProps} />
      <Divider motif={d.motif} d={d} />
      {d.venue.name && <EditableText path="venue.name" value={d.venue.name} className="wib-venue-name" editProps={editProps} />}
      {d.venue.address && <EditableText path="venue.address" value={d.venue.address} className="wib-addr" editProps={editProps} />}

      {/* Clickable Map Hyperlink Button */}
      {link && (
        <div className="wib-map-link-wrap" style={{ marginTop: "0.5em", marginBottom: "0.3em" }}>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="wib-map-link-btn"
            title="Open address in Google Maps"
            onClick={(e) => isPrint && e.preventDefault()}
          >
            <span>📍</span> {d.venue.buttonText || "Open in Google Maps"} ↗
          </a>
        </div>
      )}

      {d.venue.showQr && link && (
        <>
          <div className="wib-qr">
            <QRCodeSVG value={link} level="M" marginSize={0} fgColor="#111111" bgColor="#ffffff" />
          </div>
          <div className="wib-qr-note">Scan or click link above</div>
        </>
      )}
      {(d.message.greeting || d.message.body) && (
        <>
          <Divider motif={d.motif} d={d} />
          {d.message.greeting && <EditableText path="message.greeting" value={d.message.greeting} className="wib-greet" editProps={editProps} />}
          <EditableText path="message.body" value={fill(d.message.body)} className="wib-msg" editProps={editProps} />
        </>
      )}
      {d.blocks && d.blocks.length > 0 && (
        <div style={{ marginTop: "0.6em", width: "100%" }}>
          {d.blocks.slice(0, 1).map((b) => (
            <div key={b.id}>
              {b.title && <div className="wib-blocktitle" style={{ fontSize: "0.7em" }}>{b.title}</div>}
              <div className="wib-lines" style={{ fontSize: "0.85em", opacity: 0.9 }}>
                {b.lines.filter(Boolean).join(" · ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/**
 * 2-Page Cards: Consolidated Celebration Program & Venue (NO RSVP!)
 * Combines Ceremonies + Sthal Venue + Map QR + Family Gratitude on Page 2
 */
function CombinedCelebrationPage({ d, editProps = {} }) {
  const { isPrint = false } = editProps;
  const link = mapLink(d.venue);
  const fill = (s) => (s || "").replaceAll("{bride}", d.couple.bride).replaceAll("{groom}", d.couple.groom);

  return (
    <>
      <EditableText path="eventsTitle" value={d.eventsTitle || "Auspicious Celebrations"} className="wib-h" editProps={editProps} />
      <Divider motif={d.motif} d={d} />

      {/* Itinerary Timeline */}
      <div className="wib-events" style={{ gap: "0.35em", width: "100%" }}>
        {d.events.map((e, idx) => (
          <div className="wib-event" key={e.id} style={{ padding: "0.45em 0.85em" }}>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <EditableText path={`events.${idx}.title`} value={e.title} className="wib-ev-title" style={{ fontSize: "1.05em" }} editProps={editProps} />
              <div className="wib-ev-meta" style={{ fontSize: "0.55em" }}>
                {[e.date && longDate(e.date), e.time].filter(Boolean).join("  ·  ")}
              </div>
              {e.venue && <div className="wib-ev-venue">{e.venue}</div>}
              {e.note && <div className="wib-ev-venue">{e.note}</div>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {e.date && <div className="wib-ev-day" style={{ fontSize: "0.52em" }}>{weekday(e.date)}</div>}
              {!isPrint && editProps.onRemoveEvent && (
                <button
                  type="button"
                  className="wib-event-del-btn"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    editProps.onRemoveEvent(e.id);
                  }}
                  title="Remove event from PDF invitation"
                  aria-label={`Remove ${e.title} from PDF`}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Divider motif={d.motif} d={d} />

      {/* Combined Venue & Map QR side-by-side with Clickable Google Maps Button */}
      <div style={{ display: "grid", gridTemplateColumns: link ? "1fr auto" : "1fr", gap: "1.1em", alignItems: "center", width: "100%", margin: "0.4em 0" }}>
        <div style={{ textAlign: "left" }}>
          <div className="wib-sidelabel">{d.venue.title || "The Venue"}</div>
          <EditableText path="venue.name" value={d.venue.name} className="wib-venue-name" style={{ fontSize: "1.45em", margin: "0.1em 0" }} editProps={editProps} />
          <EditableText path="venue.address" value={d.venue.address} className="wib-addr" style={{ fontSize: "0.85em" }} editProps={editProps} />
          {link && (
            <div className="wib-map-link-wrap" style={{ marginTop: "0.45em" }}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="wib-map-link-btn"
                title="Open location in Google Maps"
                onClick={(e) => isPrint && e.preventDefault()}
              >
                <span>📍</span> {d.venue.buttonText || "Open in Google Maps"} ↗
              </a>
            </div>
          )}
        </div>

        {d.venue.showQr && link && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="wib-qr" style={{ width: "26mm", height: "26mm", padding: "1.5mm" }}>
              <QRCodeSVG value={link} level="M" marginSize={0} fgColor="#111111" bgColor="#ffffff" />
            </div>
            <span className="wib-qr-note" style={{ fontSize: "0.45em", marginTop: "3px" }}>Scan or Click Link</span>
          </div>
        )}
      </div>

      {/* Family Gratitude & Message */}
      {(d.message.greeting || d.message.body) && (
        <div style={{ marginTop: "0.3em", width: "100%" }}>
          <EditableText path="message.body" value={fill(d.message.body)} className="wib-msg" style={{ fontSize: "0.88em", fontStyle: "italic", opacity: 0.9 }} editProps={editProps} />
        </div>
      )}

      {/* Extended Host Blessings */}
      {d.blocks && d.blocks.length > 0 && (
        <div style={{ marginTop: "0.4em", fontSize: "0.78em", opacity: 0.85 }}>
          {d.blocks[0].title && <span style={{ fontFamily: "var(--font-heading)", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent)" }}>{d.blocks[0].title}: </span>}
          <span>{d.blocks[0].lines.filter(Boolean).join(" · ")}</span>
        </div>
      )}
    </>
  );
}

const BODIES = {
  cover: Cover,
  families: Families,
  venue: VenuePage,
  combined: CombinedCelebrationPage,
};

/**
 * 3D & Realistic Decorative Element Vector Renderer
 */
export function ElementRenderer({ elementId }) {
  switch (elementId) {
    case "bells-hanging-pair":
      return (
        <svg viewBox="0 0 140 60" width="120" height="52" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.18))" }}>
          <defs>
            <linearGradient id="bellGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#eab308" />
              <stop offset="85%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          <g transform="translate(40, 2)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 1" />
            <path d="M-13 40 C-13 26 -6 20 0 20 C6 20 13 26 13 40 Z" fill="url(#bellGoldGrad)" stroke="#78350f" strokeWidth="0.8" />
            <ellipse cx="0" cy="40" rx="13" ry="3.5" fill="#92400e" />
            <circle cx="0" cy="44" r="3.2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.6" />
          </g>
          <g transform="translate(100, 6)">
            <line x1="0" y1="0" x2="0" y2="18" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 1" />
            <path d="M-12 36 C-12 24 -5 18 0 18 C5 18 12 24 12 36 Z" fill="url(#bellGoldGrad)" stroke="#78350f" strokeWidth="0.8" />
            <ellipse cx="0" cy="36" rx="12" ry="3.2" fill="#92400e" />
            <circle cx="0" cy="40" r="3" fill="#fbbf24" stroke="#78350f" strokeWidth="0.6" />
          </g>
        </svg>
      );
    case "bell-corner-single":
      return (
        <svg viewBox="0 0 60 70" width="55" height="65" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.18))" }}>
          <line x1="30" y1="0" x2="30" y2="28" stroke="#dc2626" strokeWidth="2.2" strokeDasharray="4 1.5" />
          <path d="M15 54 C15 36 22 28 30 28 C38 28 45 36 45 54 Z" fill="#d97706" stroke="#78350f" strokeWidth="1" />
          <ellipse cx="30" cy="54" rx="15" ry="4" fill="#92400e" />
          <circle cx="30" cy="59" r="4" fill="#f59e0b" />
        </svg>
      );
    case "arch-mughal-crest":
      return (
        <svg viewBox="0 0 160 70" width="150" height="65" style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))" }}>
          <path d="M10 65 C10 40 30 20 60 18 C70 12 80 8 80 8 C80 8 90 12 100 18 C130 20 150 40 150 65" fill="none" stroke="var(--accent2)" strokeWidth="2" />
          <path d="M22 65 C22 46 38 30 62 26 C72 20 80 15 80 15 C80 15 88 20 98 26 C122 30 138 46 138 65" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="80" cy="8" r="3.5" fill="var(--accent)" />
        </svg>
      );
    case "arch-rose-marble-header":
      return (
        <svg viewBox="0 0 170 65" width="160" height="60" style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))" }}>
          <path d="M15 55 Q 85 5 155 55" fill="none" stroke="#15803d" strokeWidth="3" />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i} transform={`translate(${22 + i * 16}, ${45 - Math.sin((i / 8) * Math.PI) * 32})`}>
              <circle cx="0" cy="0" r="6" fill="#f43f5e" />
              <circle cx="0" cy="0" r="3.5" fill="#fda4af" />
            </g>
          ))}
        </svg>
      );
    case "flora-lotus-bloom":
      return (
        <svg viewBox="0 0 80 80" width="70" height="70" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.16))" }}>
          <ellipse cx="40" cy="40" rx="9" ry="24" fill="#ec4899" />
          <ellipse cx="32" cy="42" rx="8" ry="21" transform="rotate(-28 32 42)" fill="#f472b6" />
          <ellipse cx="48" cy="42" rx="8" ry="21" transform="rotate(28 48 42)" fill="#f472b6" />
          <ellipse cx="26" cy="48" rx="7" ry="17" transform="rotate(-52 26 48)" fill="#fb7185" />
          <ellipse cx="54" cy="48" rx="7" ry="17" transform="rotate(52 54 48)" fill="#fb7185" />
          <circle cx="40" cy="40" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        </svg>
      );
    case "flora-lotus-pair-bottom":
      return (
        <svg viewBox="0 0 150 55" width="140" height="50" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>
          <g transform="translate(30, 25) scale(0.65)">
            <ellipse cx="0" cy="0" rx="8" ry="22" fill="#ec4899" />
            <ellipse cx="-7" cy="2" rx="7" ry="19" transform="rotate(-28)" fill="#f472b6" />
            <ellipse cx="7" cy="2" rx="7" ry="19" transform="rotate(28)" fill="#f472b6" />
          </g>
          <line x1="45" y1="28" x2="105" y2="28" stroke="var(--accent2)" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="75" cy="28" r="3" fill="var(--accent)" />
          <g transform="translate(120, 25) scale(0.65)">
            <ellipse cx="0" cy="0" rx="8" ry="22" fill="#ec4899" />
            <ellipse cx="-7" cy="2" rx="7" ry="19" transform="rotate(-28)" fill="#f472b6" />
            <ellipse cx="7" cy="2" rx="7" ry="19" transform="rotate(28)" fill="#f472b6" />
          </g>
        </svg>
      );
    case "flora-marigold-toran":
      return (
        <svg viewBox="0 0 160 38" width="150" height="35" style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))" }}>
          <path d="M8 8 Q 80 28 152 8" fill="none" stroke="#16a34a" strokeWidth="2.5" />
          {Array.from({ length: 11 }, (_, i) => (
            <circle
              key={i}
              cx={14 + i * 13.2}
              cy={8 + Math.sin((i / 10) * Math.PI) * 16}
              r="4.8"
              fill={i % 2 === 0 ? "#f59e0b" : "#ea580c"}
              stroke="#b45309"
              strokeWidth="0.8"
            />
          ))}
        </svg>
      );
    case "flora-banana-palm":
      return (
        <svg viewBox="0 0 75 90" width="70" height="85" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>
          <path d="M38 85 C38 50 20 25 5 10 C30 20 45 40 45 85" fill="#15803d" />
          <path d="M38 85 C42 45 60 22 72 8 C55 22 45 42 40 85" fill="#16a34a" />
          <line x1="38" y1="85" x2="38" y2="10" stroke="#14532d" strokeWidth="1.5" />
        </svg>
      );
    case "accent-royal-chhatri":
      return (
        <svg viewBox="0 0 90 80" width="80" height="72" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.2))" }}>
          <path d="M10 45 C10 18 45 10 45 10 C45 10 80 18 80 45 Z" fill="#991b1b" stroke="#d97706" strokeWidth="1.5" />
          <line x1="45" y1="10" x2="45" y2="0" stroke="#d97706" strokeWidth="2" />
          <circle cx="45" cy="0" r="3" fill="#f59e0b" />
          <line x1="45" y1="45" x2="45" y2="78" stroke="#d97706" strokeWidth="3" />
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={i} cx={15 + i * 10} cy={48} r="2.2" fill="#fbbf24" />
          ))}
        </svg>
      );
    case "accent-moroccan-lantern":
      return (
        <svg viewBox="0 0 50 95" width="45" height="85" style={{ filter: "drop-shadow(0 6px 12px rgba(217,119,6,0.25))" }}>
          <line x1="25" y1="0" x2="25" y2="20" stroke="#b45309" strokeWidth="1.5" strokeDasharray="2 1" />
          <polygon points="25,20 38,32 12,32" fill="#d97706" stroke="#78350f" strokeWidth="1" />
          <rect x="15" y="32" width="20" height="34" fill="#fef08a" stroke="#b45309" strokeWidth="1.5" rx="2" />
          <line x1="25" y1="32" x2="25" y2="66" stroke="#b45309" strokeWidth="1" />
          <polygon points="15,66 35,66 25,78" fill="#d97706" stroke="#78350f" strokeWidth="1" />
          <circle cx="25" cy="84" r="2.5" fill="#f59e0b" />
        </svg>
      );
    case "accent-royal-peacock":
      return (
        <svg viewBox="0 0 95 65" width="85" height="60" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.18))" }}>
          <path d="M15 50 C25 25 50 15 85 10 C60 25 45 40 35 55 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
          <ellipse cx="25" cy="38" rx="8" ry="14" fill="#0369a1" />
          <circle cx="22" cy="22" r="5" fill="#0284c7" />
          <circle cx="20" cy="21" r="1.2" fill="#fff" />
          {Array.from({ length: 4 }, (_, i) => (
            <circle key={i} cx={45 + i * 10} cy={24 + i * 6} r="3" fill="#10b981" stroke="#fbbf24" strokeWidth="1" />
          ))}
        </svg>
      );
    case "accent-wax-seal-gold":
      return (
        <svg viewBox="0 0 65 65" width="60" height="60" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))" }}>
          <defs>
            <radialGradient id="waxGrad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
          </defs>
          <circle cx="32.5" cy="32.5" r="28" fill="url(#waxGrad)" stroke="#b45309" strokeWidth="2" />
          <circle cx="32.5" cy="32.5" r="20" fill="none" stroke="#fef08a" strokeWidth="1.2" strokeDasharray="2 1.5" />
          <text x="32.5" y="37" textAnchor="middle" fill="#78350f" fontSize="13" fontFamily="serif" fontWeight="bold">✦</text>
        </svg>
      );
    case "accent-diya-glow":
      return (
        <svg viewBox="0 0 60 50" width="55" height="46" style={{ filter: "drop-shadow(0 4px 10px rgba(245,158,11,0.35))" }}>
          <ellipse cx="30" cy="36" rx="22" ry="9" fill="#d97706" stroke="#92400e" strokeWidth="1.2" />
          <ellipse cx="30" cy="34" rx="16" ry="6" fill="#92400e" />
          <path d="M30 10 C34 18 36 24 30 30 C24 24 26 18 30 10 Z" fill="#fbbf24" stroke="#ea580c" strokeWidth="1" />
          <circle cx="30" cy="22" r="3" fill="#ffffff" />
        </svg>
      );
    case "vignette-haldi-moment":
      return (
        <svg viewBox="0 0 110 90" width="98" height="80" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.18))" }}>
          <circle cx="55" cy="45" r="38" fill="#fef9c3" stroke="#eab308" strokeWidth="2.5" />
          <circle cx="55" cy="45" r="33" fill="none" stroke="#ca8a04" strokeWidth="1" strokeDasharray="3 2" />
          <text x="55" y="42" textAnchor="middle" fill="#854d0e" fontSize="16">💛</text>
          <text x="55" y="58" textAnchor="middle" fill="#713f12" fontSize="9" fontWeight="bold" fontFamily="sans-serif">HALDI</text>
        </svg>
      );
    case "vignette-mehndi-moment":
      return (
        <svg viewBox="0 0 110 90" width="98" height="80" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.18))" }}>
          <circle cx="55" cy="45" r="38" fill="#ecfdf5" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="55" cy="45" r="33" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="3 2" />
          <text x="55" y="42" textAnchor="middle" fill="#065f46" fontSize="16">🌿</text>
          <text x="55" y="58" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="bold" fontFamily="sans-serif">MEHNDI</text>
        </svg>
      );
    case "vignette-sangeet-moment":
      return (
        <svg viewBox="0 0 110 90" width="98" height="80" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.18))" }}>
          <circle cx="55" cy="45" r="38" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="55" cy="45" r="33" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 2" />
          <text x="55" y="42" textAnchor="middle" fill="#1e40af" fontSize="16">💃🕺</text>
          <text x="55" y="58" textAnchor="middle" fill="#1e3a8a" fontSize="9" fontWeight="bold" fontFamily="sans-serif">SANGEET</text>
        </svg>
      );
    case "vignette-wedding-moment":
      return (
        <svg viewBox="0 0 110 90" width="98" height="80" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.18))" }}>
          <circle cx="55" cy="45" r="38" fill="#fff1f2" stroke="#f43f5e" strokeWidth="2.5" />
          <circle cx="55" cy="45" r="33" fill="none" stroke="#e11d48" strokeWidth="1" strokeDasharray="3 2" />
          <text x="55" y="42" textAnchor="middle" fill="#9f1239" fontSize="16">👑</text>
          <text x="55" y="58" textAnchor="middle" fill="#881337" fontSize="9" fontWeight="bold" fontFamily="sans-serif">WEDDING</text>
        </svg>
      );
    default:
      return (
        <div style={{ padding: "4px 8px", background: "rgba(255,255,255,0.8)", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "11px", fontWeight: "bold" }}>
          ✦
        </div>
      );
  }
}

/**
 * One A5 page. When `measure` is true the page shrinks its text (via --fit)
 * until the content fits, and reports the factor with onFit(key, factor) so
 * the print copy can reuse it.
 */
export function InvitationPage({
  pageKey,
  data,
  fit = 1,
  measure = false,
  onFit,
  sig,
  isPrint = false,
  activeElement = null,
  onSelectElement = null,
  onUpdateText = null,
  onUpdateElement = null,
  onRemoveElement = null,
  onRemoveEvent = null,
}) {
  const style = useMemo(() => resolveStyle(data), [data]);
  const ref = useRef(null);
  const Body = BODIES[pageKey] || BODIES.cover;

  useIsoLayoutEffect(() => {
    if (!measure || !ref.current) return;
    const el = ref.current;
    let f = 1;
    el.style.setProperty("--fit", "1");
    for (let i = 0; i < 16 && f > 0.55 && el.scrollHeight > el.clientHeight + 1; i++) {
      f = +(f * 0.96).toFixed(3);
      el.style.setProperty("--fit", String(f));
    }
    onFit && onFit(pageKey, f);
  }, [sig, measure, pageKey, onFit]);

  const cls = [
    "wib-inner",
    `wib-${pageKey}`,
    pageKey === "cover" && (data.layout === "arch" || data.layout === "palaceArch" || data.layout === "sheeshMirror" || data.layout === "lotusTemple" || data.layout === "lotusJharokha" || data.layout === "scenicVeranda") ? "is-arch" : "",
    data.layout === "banner" ? "is-banner" : "",
  ].join(" ");

  const editProps = {
    isPrint,
    activeElement,
    onSelectElement,
    onUpdateText,
    onRemoveEvent,
  };

  return (
    <div
      className="wib-page"
      style={style}
      onClick={(e) => {
        if (!isPrint && onSelectElement && e.target === e.currentTarget) {
          onSelectElement(null);
        }
      }}
    >
      <Frame layout={data.layout} cover={pageKey === "cover"} />
      <div ref={ref} className={cls} style={measure ? undefined : { "--fit": fit }}>
        <Body d={data} editProps={editProps} />
      </div>
      <CanvasElementsLayer
        elements={data.elements}
        pageKey={pageKey}
        isPrint={isPrint}
        activeElement={activeElement}
        onSelectElement={onSelectElement}
        onUpdateElement={onUpdateElement}
        onRemoveElement={onRemoveElement}
      />
    </div>
  );
}
