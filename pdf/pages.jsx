"use client";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
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
const parse = (iso) => (iso ? new Date(iso + "T00:00:00") : null);
const part = (iso, o) => (parse(iso) ? parse(iso).toLocaleDateString("en-IN", o) : "");
const longDate = (iso) => part(iso, { day: "2-digit", month: "long", year: "numeric" });
const weekday = (iso) => part(iso, { weekday: "long" });

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

/* ---------------- page bodies ---------------- */
function Lines({ text }) {
  return (text || "").split("\n").map((l, i) => <div key={i}>{l}</div>);
}

/** Page 1: Royal Cover */
function Cover({ d }) {
  const { bride, groom, brideTitle, groomTitle, groomFirst, tagline } = d.couple;
  const b = `${brideTitle} ${bride}`.trim();
  const g = `${groomTitle} ${groom}`.trim();
  const [first, second] = groomFirst ? [g, b] : [b, g];
  const inv = d.invocation;

  return (
    <>
      {inv.enabled && inv.text && (
        <div
          className="wib-inv"
          dir={inv.script === "arabic" ? "rtl" : "ltr"}
          style={{
            fontFamily: SCRIPT_FONTS[inv.script] || undefined,
            fontSize: inv.text.length <= 3 ? "2.8em" : inv.text.length > 40 ? "0.95em" : undefined,
          }}
        >
          {inv.text}
        </div>
      )}
      {inv.enabled && inv.sub && <div className="wib-inv-sub">{inv.sub}</div>}
      <div className="wib-kicker">{d.heading}</div>
      <Divider motif={d.motif} d={d} />
      {tagline && <div className="wib-tagline">{tagline}</div>}
      <div className="wib-name">{first}</div>
      <div className="wib-amp">&amp;</div>
      <div className="wib-name">{second}</div>
      <Divider motif={d.motif} d={d} />
      {d.date && (
        <div className="wib-date">
          {weekday(d.date)} · {longDate(d.date)}
        </div>
      )}
      {d.venue.name && <div className="wib-cover-place">{d.venue.name}</div>}
    </>
  );
}

function Side({ d, side, name, title }) {
  return (
    <div>
      <div className="wib-sidelabel">{side.title}</div>
      <div className="wib-sidename">{`${title} ${name}`.trim()}</div>
      {side.entries.map((e) => (
        <div key={e.id}>
          {e.label && <div className="wib-rel">{e.label}</div>}
          <div className="wib-fam">{e.name}</div>
        </div>
      ))}
    </div>
  );
}

/** Page 2 of 3-Page Cards: Families & Auspicious Ceremonies */
function Families({ d }) {
  const c = d.couple;
  const bride = <Side d={d} side={d.families.brideSide} name={c.bride} title={c.brideTitle} />;
  const groom = <Side d={d} side={d.families.groomSide} name={c.groom} title={c.groomTitle} />;
  return (
    <>
      <div className="wib-h">{d.families.title}</div>
      <Divider motif={d.motif} d={d} />
      <div className="wib-cols">
        {c.groomFirst ? groom : bride}
        <div className="wib-vline" />
        {c.groomFirst ? bride : groom}
      </div>
      {d.events.length > 0 && (
        <>
          <div className="wib-h" style={{ marginTop: "0.8em" }}>{d.eventsTitle}</div>
          <Divider motif={d.motif} d={d} />
          <div className="wib-events">
            {d.events.map((e) => (
              <div className="wib-event" key={e.id}>
                <div>
                  <div className="wib-ev-title">{e.title}</div>
                  <div className="wib-ev-meta">{[e.date && longDate(e.date), e.time].filter(Boolean).join("  ·  ")}</div>
                  {e.venue && <div className="wib-ev-venue">{e.venue}</div>}
                  {e.note && <div className="wib-ev-venue">{e.note}</div>}
                </div>
                {e.date && <div className="wib-ev-day">{weekday(e.date)}</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/** Page 3 of 3-Page Cards: Venue Sthal, Route Map QR & Blessings (NO RSVP!) */
function VenuePage({ d }) {
  const link = mapLink(d.venue);
  const fill = (s) => (s || "").replaceAll("{bride}", d.couple.bride).replaceAll("{groom}", d.couple.groom);
  return (
    <>
      <div className="wib-h">{d.venue.title}</div>
      <Divider motif={d.motif} d={d} />
      {d.venue.name && <div className="wib-venue-name">{d.venue.name}</div>}
      {d.venue.address && <div className="wib-addr"><Lines text={d.venue.address} /></div>}
      {d.venue.showQr && link && (
        <>
          <div className="wib-qr">
            <QRCodeSVG value={link} level="M" marginSize={0} fgColor="#111111" bgColor="#ffffff" />
          </div>
          <div className="wib-qr-note">Scan for directions</div>
        </>
      )}
      {(d.message.greeting || d.message.body) && (
        <>
          <Divider motif={d.motif} d={d} />
          {d.message.greeting && <div className="wib-greet">{d.message.greeting}</div>}
          <div className="wib-msg">{fill(d.message.body)}</div>
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
function CombinedCelebrationPage({ d }) {
  const link = mapLink(d.venue);
  const fill = (s) => (s || "").replaceAll("{bride}", d.couple.bride).replaceAll("{groom}", d.couple.groom);

  return (
    <>
      <div className="wib-h">{d.eventsTitle || "Auspicious Celebrations"}</div>
      <Divider motif={d.motif} d={d} />

      {/* Itinerary Timeline */}
      <div className="wib-events" style={{ gap: "0.35em", width: "100%" }}>
        {d.events.slice(0, 3).map((e) => (
          <div className="wib-event" key={e.id} style={{ padding: "0.4em 0.8em" }}>
            <div>
              <div className="wib-ev-title" style={{ fontSize: "1.05em" }}>{e.title}</div>
              <div className="wib-ev-meta" style={{ fontSize: "0.55em" }}>
                {[e.date && longDate(e.date), e.time].filter(Boolean).join("  ·  ")}
              </div>
              {e.venue && <div className="wib-ev-venue">{e.venue}</div>}
            </div>
            {e.date && <div className="wib-ev-day" style={{ fontSize: "0.52em" }}>{weekday(e.date)}</div>}
          </div>
        ))}
      </div>

      <Divider motif={d.motif} d={d} />

      {/* Combined Venue & Map QR side-by-side */}
      <div style={{ display: "grid", gridTemplateColumns: link ? "1fr auto" : "1fr", gap: "1em", alignItems: "center", width: "100%", margin: "0.3em 0" }}>
        <div style={{ textAlign: "left" }}>
          <div className="wib-sidelabel">{d.venue.title || "The Venue"}</div>
          <div className="wib-venue-name" style={{ fontSize: "1.5em", margin: "0.1em 0" }}>{d.venue.name}</div>
          <div className="wib-addr" style={{ fontSize: "0.85em" }}><Lines text={d.venue.address} /></div>
        </div>

        {d.venue.showQr && link && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="wib-qr" style={{ width: "26mm", height: "26mm", padding: "1.5mm" }}>
              <QRCodeSVG value={link} level="M" marginSize={0} fgColor="#111111" bgColor="#ffffff" />
            </div>
            <span className="wib-qr-note" style={{ fontSize: "0.45em", marginTop: "3px" }}>Scan Map</span>
          </div>
        )}
      </div>

      {/* Family Gratitude & Message */}
      {(d.message.greeting || d.message.body) && (
        <div style={{ marginTop: "0.3em", width: "100%" }}>
          <div className="wib-msg" style={{ fontSize: "0.88em", fontStyle: "italic", opacity: 0.9 }}>
            {fill(d.message.body)}
          </div>
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
 * One A5 page. When `measure` is true the page shrinks its text (via --fit)
 * until the content fits, and reports the factor with onFit(key, factor) so
 * the print copy can reuse it.
 */
export function InvitationPage({ pageKey, data, fit = 1, measure = false, onFit, sig }) {
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
    pageKey === "cover" && (data.layout === "arch" || data.layout === "palaceArch" || data.layout === "sheeshMirror" || data.layout === "lotusTemple") ? "is-arch" : "",
    data.layout === "banner" ? "is-banner" : "",
  ].join(" ");

  return (
    <div className="wib-page" style={style}>
      <Frame layout={data.layout} cover={pageKey === "cover"} />
      <div ref={ref} className={cls} style={measure ? undefined : { "--fit": fit }}>
        <Body d={data} />
      </div>
    </div>
  );
}
