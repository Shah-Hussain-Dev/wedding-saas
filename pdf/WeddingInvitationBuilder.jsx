"use client";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CSS } from "./styles";
import {
  ELEMENT_LIBRARY, FAITHS, FONT_SETS, GOOGLE_FONTS_URL, LAYOUTS, MOTIFS, PAGE_PX, TEMPLATES, THEMES,
  addDays, applyFaith, applyTemplate, initialState, setIn, uid,
} from "./data";
import { ElementRenderer, InvitationPage, visiblePages } from "./pages";

/* ---------- small form primitives ---------- */
const Field = ({ label, hint, children }) => (
  <label className="wibu-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>
);
const Text = ({ value, onChange, ...p }) => (
  <input className="wibu-in" value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...p} />
);
const Area = ({ value, onChange, ...p }) => (
  <textarea className="wibu-area" value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...p} />
);
const Select = ({ value, onChange, options }) => (
  <select className="wibu-sel" value={value} onChange={(e) => onChange(e.target.value)}>
    {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
  </select>
);
const Check = ({ checked, onChange, label }) => (
  <label className="wibu-check"><input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />{label}</label>
);
const Group = ({ title, children }) => (
  <section className="wibu-group">{title && <h3>{title}</h3>}{children}</section>
);

const move = (arr, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const c = [...arr];
  [c[i], c[j]] = [c[j], c[i]];
  return c;
};

/* ---------- template thumbnail ---------- */
const Thumb = memo(function Thumb({ base, t }) {
  const s = 0.27;
  return (
    <span className="thumb" style={{ width: PAGE_PX.w * s, height: PAGE_PX.h * s }}>
      <span style={{ display: "block", width: PAGE_PX.w, height: PAGE_PX.h, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        <InvitationPage pageKey="cover" data={applyTemplate(base, t)} isPrint={true} />
      </span>
    </span>
  );
});

const TABS = [
  ["template", "Template"],
  ["elements", "Stickers & 3D"],
  ["details", "Details"],
  ["events", "Events"],
  ["sections", "Sections"],
  ["style", "Style"],
];

const CATEGORIES = [
  ["all", "All Templates"],
  ["scenic", "🌅 Scenic & Illustrated"],
  ["royal", "👑 3D Royal & Heritage"],
  ["universal", "✨ Universal Multi-Faith"],
  ["botanical", "🌿 Botanical & Floral"],
  ["modern", "📐 Modern & Minimal"],
  ["classic", "🏛️ Classic"],
];

/**
 * <WeddingInvitationBuilder initialData? onChange? storageKey? />
 *  - initialData: a saved state object (same shape as initialState()). Skips localStorage restore.
 *  - onChange(data): called on every edit, e.g. to save to your database.
 */
export default function WeddingInvitationBuilder({ initialData = null, onChange = null, storageKey = "wedding-invitation-builder:v2" } = {}) {
  const [d, setD] = useState(() => initialData || initialState());
  const [tab, setTab] = useState("template");
  const [category, setCategory] = useState("all");
  const [elementCat, setElementCat] = useState("all");
  const [targetPage, setTargetPage] = useState("cover");
  const [activeElement, setActiveElement] = useState(null);
  const [onlyFaith, setOnlyFaith] = useState(false);
  const [mobileView, setMobileView] = useState("editor");
  const [zoomMultiplier, setZoomMultiplier] = useState(1);
  const [fits, setFits] = useState({});
  const [fontsTick, setFontsTick] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [portalNode, setPortalNode] = useState(null);
  const [stageW, setStageW] = useState(560);
  const stageRef = useRef(null);

  /* restore + persist */
  useEffect(() => {
    setMounted(true);
    let host = document.getElementById("wib-portal-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "wib-portal-host";
      host.className = "wib-print-root wib-portal-host";
      document.body.appendChild(host);
    } else {
      host.className = "wib-print-root wib-portal-host";
    }
    setPortalNode(host);

    if (!initialData) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) setD({ ...initialState(), ...JSON.parse(raw) });
      } catch { }
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(storageKey, JSON.stringify(d)); } catch { }
    onChange && onChange(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, hydrated]);

  /* web fonts + re-fit when they finish loading */
  useEffect(() => {
    if (!document.getElementById("wib-fonts")) {
      const l = document.createElement("link");
      l.id = "wib-fonts"; l.rel = "stylesheet"; l.href = GOOGLE_FONTS_URL;
      document.head.appendChild(l);
    }
    const bump = () => setFontsTick((t) => t + 1);
    document.fonts?.addEventListener?.("loadingdone", bump);
    document.fonts?.ready?.then(bump);
    return () => document.fonts?.removeEventListener?.("loadingdone", bump);
  }, []);

  /* preview scale follows the container width */
  /* preview scale follows the container width */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setStageW(e.contentRect.width || window.innerWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [mobileView]);

  // Compute effective scale considering stage width with comfortable mobile padding & zoom control
  const baseScale = Math.max(0.35, Math.min(1.15, (stageW - 28) / PAGE_PX.w));
  const effectiveScale = +(baseScale * zoomMultiplier).toFixed(3);

  const set = useCallback((path, val) => setD((s) => setIn(s, path, val)), []);
  const mutate = useCallback((fn) => setD((s) => fn(s)), []);
  const onFit = useCallback((k, f) => setFits((p) => (p[k] === f ? p : { ...p, [k]: f })), []);

  const sig = useMemo(() => JSON.stringify(d) + "|" + fontsTick, [d, fontsTick]);
  const pages = useMemo(() => visiblePages(d), [d]);
  const theme = THEMES[d.themeId] || THEMES.sheeshMahal || THEMES.maroonGold;

  const coverBase = useMemo(
    () => ({ colors: {}, pages: d.pages, couple: d.couple, heading: d.heading, invocation: d.invocation, date: d.date, venue: { name: d.venue.name } }),
    [d.pages, d.couple, d.heading, d.invocation, d.date, d.venue.name]
  );

  const downloadPdf = () => {
    let host = document.getElementById("wib-portal-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "wib-portal-host";
      host.className = "wib-print-root wib-portal-host";
      document.body.appendChild(host);
      setPortalNode(host);
    } else {
      host.className = "wib-print-root wib-portal-host";
    }
    const prev = document.title;
    document.title = `${d.couple.bride || "Wedding"}-${d.couple.groom || "Invitation"}`.replace(/\s+/g, "-");
    const restore = () => { document.title = prev; window.removeEventListener("afterprint", restore); };
    window.addEventListener("afterprint", restore);
    // Allow DOM to layout print portal before opening browser print preview
    setTimeout(() => {
      window.print();
    }, 60);
  };

  const reset = () => {
    setD(initialState());
  };

  /* Deselect on Escape key */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveElement(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleAddElement = (elem) => {
    const newEl = {
      id: uid(),
      typeId: elem.id,
      category: elem.category,
      name: elem.name,
      page: targetPage,
      x: elem.defaultProps?.x ?? 50,
      y: elem.defaultProps?.y ?? 50,
      scale: elem.defaultProps?.scale ?? 1,
      rotate: elem.defaultProps?.rotate ?? 0,
    };
    setD((s) => ({
      ...s,
      elements: [...(s.elements || []), newEl],
    }));
    setActiveElement({ id: newEl.id, type: "element", el: newEl });
  };

  const handleUpdateElement = (elId, updates) => {
    setD((s) => ({
      ...s,
      elements: (s.elements || []).map((e) => (e.id === elId ? { ...e, ...updates } : e)),
    }));
    setActiveElement((prev) => (prev?.id === elId ? { ...prev, el: { ...prev.el, ...updates } } : prev));
  };

  const handleRemoveElement = (elId) => {
    setD((s) => ({
      ...s,
      elements: (s.elements || []).filter((e) => e.id !== elId),
    }));
    if (activeElement?.id === elId) setActiveElement(null);
  };

  /* filtered templates list */
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesFaith = !onlyFaith || t.faiths.includes(d.faith);
      const matchesCat = category === "all" || t.category === category;
      return matchesFaith && matchesCat;
    });
  }, [d.faith, onlyFaith, category]);

  /* ---------- tabs ---------- */
  const templatesTab = (
    <>
      <Group title="Tradition or Faith (Universal Support)">
        <p style={{ margin: "0 0 6px", fontSize: "11.5px", color: "var(--u-mute)" }}>
          Universal templates support all faiths. Select a tradition to customize invocations and ceremony wording smoothly:
        </p>
        <div className="wibu-chips">
          {Object.entries(FAITHS).map(([id, f]) => (
            <button
              key={id}
              type="button"
              className="wibu-chip"
              aria-pressed={d.faith === id}
              onClick={() => {
                if (d.faith === id) return;
                setD((s) => applyFaith(s, id));
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Templates & Style Elements (2–3 Pages Max)">
        <div className="wibu-filter-pills">
          {CATEGORIES.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="wibu-pill"
              aria-pressed={category === id}
              onClick={() => setCategory(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0" }}>
          <Check
            checked={onlyFaith}
            onChange={setOnlyFaith}
            label={`Filter for ${FAITHS[d.faith]?.label || "current"} only`}
          />
          <small style={{ color: "var(--u-mute)", fontWeight: 700 }}>{filteredTemplates.length} templates</small>
        </div>

        <div className="wibu-tpls">
          {filteredTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              className="wibu-tpl"
              aria-pressed={d.templateId === t.id}
              onClick={() => setD((s) => applyTemplate(s, t))}
            >
              <Thumb base={coverBase} t={t} />
              <b>{t.name}</b>
              <small>{LAYOUTS[t.layout] || t.layout} · {MOTIFS[t.motif] || t.motif}</small>
              <span className="wibu-badge-pages">{t.structure === "2-page" ? "2-Page Card" : "3-Page Suite"}</span>
            </button>
          ))}
        </div>
      </Group>
    </>
  );

  const elementsTab = (
    <>
      <Group title="3D & Realistic Decorative Elements">
        <p style={{ margin: "0 0 6px", fontSize: "11.5px", color: "var(--u-mute)" }}>
          Pick and place authentic 3D decorative elements, temple bells, and ceremony vignettes. Drag and edit them directly on the card!
        </p>

        {/* Target Page Selector */}
        <Field label="Add elements to page">
          <Select
            value={targetPage}
            onChange={setTargetPage}
            options={pages.map((p) => [p.key, p.label])}
          />
        </Field>

        {/* Category Filter Pills */}
        <div className="wibu-elements-filter" style={{ marginTop: "4px" }}>
          {[
            ["all", "All Elements"],
            ["couples", "👫 Anime Couples"],
            ["vignettes", "💛 Vignettes"],
            ["bells", "🔔 Bells"],
            ["arches", "🏛️ Arches"],
            ["flora", "🪷 Lotuses & Flora"],
            ["accents", "👑 3D Props"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="wibu-pill"
              aria-pressed={elementCat === id}
              onClick={() => setElementCat(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid of Elements */}
        <div className="wibu-elements-grid" style={{ marginTop: "10px" }}>
          {ELEMENT_LIBRARY.filter((el) => elementCat === "all" || el.category === elementCat).map((elem) => (
            <div key={elem.id} className="wibu-element-card" onClick={() => handleAddElement(elem)}>
              <div className="wibu-element-preview">
                <ElementRenderer elementId={elem.id} />
              </div>
              <b>{elem.name}</b>
              <button type="button" className="wibu-element-add-btn">
                + Add to Card
              </button>
            </div>
          ))}
        </div>
      </Group>

      {/* Currently Placed Elements on Card */}
      {(d.elements || []).length > 0 && (
        <Group title={`Placed Elements (${(d.elements || []).length})`}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {(d.elements || []).map((el) => (
              <div
                key={el.id}
                className="wibu-card"
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderColor: activeElement?.id === el.id ? "var(--u-brand)" : undefined,
                }}
              >
                <div>
                  <b style={{ fontSize: "12px" }}>{el.name || el.typeId}</b>
                  <small style={{ display: "block", color: "var(--u-mute)", fontSize: "10.5px" }}>
                    {el.page === "cover" ? "Page 1 Cover" : el.page === "combined" ? "Page 2 Combined" : el.page === "families" ? "Page 2 Families" : "Page 3 Venue"} · pos ({el.x}%, {el.y}%)
                  </small>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    className="wibu-btn small"
                    onClick={() => setActiveElement({ id: el.id, type: "element", el })}
                  >
                    Select
                  </button>
                  <button
                    type="button"
                    className="wibu-btn small danger"
                    onClick={() => handleRemoveElement(el.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Group>
      )}
    </>
  );

  const sideEditor = (key, label) => {
    const side = d.families[key];
    return (
      <Group title={label}>
        <Field label="Heading"><Text value={side.title} onChange={(v) => set(`families.${key}.title`, v)} /></Field>
        {side.entries.map((e, i) => (
          <div className="wibu-card" key={e.id}>
            <div className="wibu-row">
              <Field label="Relation"><Text value={e.label} onChange={(v) => set(`families.${key}.entries.${i}.label`, v)} placeholder="Daughter of" /></Field>
              <Field label="Name"><Text value={e.name} onChange={(v) => set(`families.${key}.entries.${i}.name`, v)} /></Field>
            </div>
            <div className="wibu-card-top">
              <span />
              <button type="button" className="wibu-btn small danger" onClick={() => mutate((s) => setIn(s, `families.${key}.entries`, side.entries.filter((x) => x.id !== e.id)))}>Remove</button>
            </div>
          </div>
        ))}
        <div>
          <button type="button" className="wibu-btn small" onClick={() => mutate((s) => setIn(s, `families.${key}.entries`, [...side.entries, { id: uid(), label: "Relation", name: "" }]))}>
            + Add family member
          </button>
        </div>
      </Group>
    );
  };

  const detailsTab = (
    <>
      <Group title="Couple Details">
        <div className="wibu-row">
          <Field label="Bride title"><Text value={d.couple.brideTitle} onChange={(v) => set("couple.brideTitle", v)} placeholder="Dr. / Ms." /></Field>
          <Field label="Bride's name"><Text value={d.couple.bride} onChange={(v) => set("couple.bride", v)} /></Field>
        </div>
        <div className="wibu-row">
          <Field label="Groom title"><Text value={d.couple.groomTitle} onChange={(v) => set("couple.groomTitle", v)} placeholder="Mr." /></Field>
          <Field label="Groom's name"><Text value={d.couple.groom} onChange={(v) => set("couple.groom", v)} /></Field>
        </div>
        <Check checked={d.couple.groomFirst} onChange={(v) => set("couple.groomFirst", v)} label="Show groom's name first" />
        <Field label="Greeting line / Tagline"><Text value={d.couple.tagline} onChange={(v) => set("couple.tagline", v)} placeholder="Together with their families" /></Field>
        <Field label="Header / Callout"><Text value={d.heading} onChange={(v) => set("heading", v)} placeholder="The Wedding Celebration" /></Field>
      </Group>

      <Group title="Sacred or Welcome Invocation">
        <Check checked={d.invocation.enabled} onChange={(v) => set("invocation.enabled", v)} label="Show sacred invocation line" />
        {d.invocation.enabled && (
          <>
            <Field label="Invocation text"><Text value={d.invocation.text} onChange={(v) => set("invocation.text", v)} /></Field>
            <Field label="Translation or subtitle"><Text value={d.invocation.sub} onChange={(v) => set("invocation.sub", v)} /></Field>
            <Field label="Script font">
              <Select value={d.invocation.script || "latin"} onChange={(v) => set("invocation.script", v)}
                options={[["latin", "Default (Latin)"], ["deva", "Devanagari (Sanskrit/Hindi)"], ["arabic", "Nastaliq / Arabic"], ["gurmukhi", "Gurmukhi (Punjabi)"]]} />
            </Field>
          </>
        )}
      </Group>

      <Group title="Wedding Date">
        <Field label="Date"><input type="date" className="wibu-in" value={d.date} onChange={(e) => set("date", e.target.value)} /></Field>
      </Group>
    </>
  );

  const eventsTab = (
    <>
      <Group title="Ceremony & Event Schedule">
        <Field label="Section title"><Text value={d.eventsTitle} onChange={(v) => set("eventsTitle", v)} /></Field>
        {d.events.map((e, i) => (
          <div className="wibu-card" key={e.id}>
            <div className="wibu-card-top">
              <b>{e.title || `Event ${i + 1}`}</b>
              <div style={{ display: "flex", gap: 4 }}>
                <button type="button" className="wibu-btn small" onClick={() => mutate((s) => setIn(s, "events", move(s.events, i, -1)))} disabled={i === 0}>↑</button>
                <button type="button" className="wibu-btn small" onClick={() => mutate((s) => setIn(s, "events", move(s.events, i, 1)))} disabled={i === d.events.length - 1}>↓</button>
                <button type="button" className="wibu-btn small danger" onClick={() => mutate((s) => setIn(s, "events", s.events.filter((x) => x.id !== e.id)))}>✕</button>
              </div>
            </div>
            <Field label="Event name"><Text value={e.title} onChange={(v) => set(`events.${i}.title`, v)} /></Field>
            <div className="wibu-row">
              <Field label="Date"><input type="date" className="wibu-in" value={e.date || ""} onChange={(ev) => set(`events.${i}.date`, ev.target.value)} /></Field>
              <Field label="Timing"><Text value={e.time} onChange={(v) => set(`events.${i}.time`, v)} placeholder="6:30 PM onwards" /></Field>
            </div>
            <Field label="Venue override"><Text value={e.venue} onChange={(v) => set(`events.${i}.venue`, v)} placeholder="Leave blank to use main venue" /></Field>
            <Field label="Special note"><Text value={e.note} onChange={(v) => set(`events.${i}.note`, v)} placeholder="e.g. Baraat arrives at 5:00 PM" /></Field>
          </div>
        ))}
        <div>
          <button type="button" className="wibu-btn small" onClick={() => mutate((s) => setIn(s, "events", [...s.events, { id: uid(), title: "Reception", date: d.date, time: "7:00 PM", venue: "", note: "" }]))}>
            + Add celebration event
          </button>
        </div>
      </Group>
    </>
  );

  const sectionsTab = (
    <>
      <Group title="Families Page Title">
        <Field label="Title"><Text value={d.families.title} onChange={(v) => set("families.title", v)} /></Field>
      </Group>
      {sideEditor("brideSide", "Bride's Family")}
      {sideEditor("groomSide", "Groom's Family")}

      <Group title="Venue Sthal & Google Maps QR">
        <Field label="Section title"><Text value={d.venue.title} onChange={(v) => set("venue.title", v)} /></Field>
        <Field label="Venue name"><Text value={d.venue.name} onChange={(v) => set("venue.name", v)} /></Field>
        <Field label="Full Address"><Area value={d.venue.address} onChange={(v) => set("venue.address", v)} /></Field>
        <Field label="Google Maps URL" hint="Optional. If blank, maps search link is generated automatically from venue name & address.">
          <Text value={d.venue.mapUrl} onChange={(v) => set("venue.mapUrl", v)} placeholder="https://maps.google.com/..." />
        </Field>
        <Check checked={d.venue.showQr} onChange={(v) => set("venue.showQr", v)} label="Show high-resolution Google Maps QR code" />
      </Group>

      <Group title="Warm Blessings & Message to Guests">
        <Field label="Salutation"><Text value={d.message.greeting} onChange={(v) => set("message.greeting", v)} placeholder="Dear Family & Friends," /></Field>
        <Field label="Message body" hint="Tokens {bride} and {groom} will be replaced automatically.">
          <Area value={d.message.body} onChange={(v) => set("message.body", v)} />
        </Field>
      </Group>

      <Group title="Family Well-Wishers & Extended Hosts">
        {d.blocks.map((b, i) => (
          <div className="wibu-card" key={b.id}>
            <div className="wibu-card-top">
              <b>{b.title || `Section ${i + 1}`}</b>
              <button type="button" className="wibu-btn small danger" onClick={() => mutate((s) => setIn(s, "blocks", s.blocks.filter((x) => x.id !== b.id)))}>✕</button>
            </div>
            <Field label="Title"><Text value={b.title} onChange={(v) => set(`blocks.${i}.title`, v)} /></Field>
            <Field label="Entries" hint="One entry per line.">
              <Area value={(b.lines || []).join("\n")} onChange={(v) => set(`blocks.${i}.lines`, v.split("\n"))} />
            </Field>
          </div>
        ))}
        <div>
          <button type="button" className="wibu-btn small" onClick={() => mutate((s) => setIn(s, "blocks", [...s.blocks, { id: uid(), type: "text", title: "With Best Compliments", subtitle: "", lines: ["Family & Well-Wishers"] }]))}>
            + Add host section
          </button>
        </div>
      </Group>
    </>
  );

  const customColor = (key, label) => (
    <Field label={label}>
      <input type="color" aria-label={label} value={d.colors[key] || (key === "bg" ? theme.bg : theme[key])} onChange={(e) => set(`colors.${key}`, e.target.value)} />
    </Field>
  );

  const styleTab = (
    <>
      <Group title="Invitation Structure (Strict 2–3 Pages Max)">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <button
            type="button"
            className="wibu-pill"
            style={{ justifyContent: "center", height: "38px" }}
            aria-pressed={pages.length === 2 || d.structure === "2-page"}
            onClick={() => setD((s) => ({ ...s, structure: "2-page", pages: { cover: true, combined: true, families: false, venue: false } }))}
          >
            ✨ 2-Page Keepsake
          </button>
          <button
            type="button"
            className="wibu-pill"
            style={{ justifyContent: "center", height: "38px" }}
            aria-pressed={pages.length === 3 || d.structure === "3-page"}
            onClick={() => setD((s) => ({ ...s, structure: "3-page", pages: { cover: true, families: true, venue: true, combined: false } }))}
          >
            👑 3-Page Heritage Suite
          </button>
        </div>
        <small style={{ color: "var(--u-mute)", fontSize: "11px", marginTop: "4px" }}>
          {pages.length === 2 ? "2-Page Card: Page 1 Cover + Page 2 Consolidated Celebrations, Venue & QR" : "3-Page Suite: Page 1 Cover + Page 2 Families & Itinerary + Page 3 Venue Sthal & Blessings"}
        </small>
      </Group>

      <Group title="3D Theme Palettes (Sheesh Mahal, Royal Majesty, etc.)">
        <div className="wibu-swatches">
          {Object.entries(THEMES).map(([id, t]) => (
            <button
              key={id}
              type="button"
              className="wibu-swatch"
              aria-pressed={d.themeId === id && !Object.keys(d.colors).length}
              onClick={() => setD((s) => ({ ...s, themeId: id, colors: {} }))}
              title={t.label}
            >
              <i style={{ background: `linear-gradient(135deg, ${t.bg} 0 45%, ${t.accent} 45% 72%, ${t.accent2} 72%)` }} />
              <em>{t.label}</em>
            </button>
          ))}
        </div>
      </Group>

      <Group title="Fine-Tune Custom Hex Colours">
        <div className="wibu-colors">
          {customColor("bg", "Background")}
          {customColor("accent", "Names & headings")}
          {customColor("accent2", "Ornaments & borders")}
        </div>
        <div>
          <button type="button" className="wibu-btn small" onClick={() => set("colors", {})}>Restore theme colours</button>
        </div>
      </Group>

      <Group title="Typography Pairing">
        <Field label="Font pairing">
          <Select value={d.fontId} onChange={(v) => set("fontId", v)} options={Object.entries(FONT_SETS).map(([id, f]) => [id, f.label])} />
        </Field>
      </Group>

      <Group title="Architectural Design & Borders">
        <Field label="Border and ornaments layout">
          <Select value={d.layout} onChange={(v) => set("layout", v)} options={Object.entries(LAYOUTS)} />
        </Field>
        <Field label="Divider & seal motif">
          <Select value={d.motif} onChange={(v) => set("motif", v)} options={Object.entries(MOTIFS)} />
        </Field>
      </Group>
    </>
  );

  const body = { template: templatesTab, elements: elementsTab, details: detailsTab, events: eventsTab, sections: sectionsTab, style: styleTab }[tab];

  return (
    <div className="wibu">
      <style>{CSS}</style>

      {/* 🌟 Mobile Ergonomic Bottom Action Bar (Thumb Zone) 🌟 */}
      <div className="wibu-mob-bottombar print:hidden">
        <div className="wibu-mob-nav-group" role="tablist">
          <button
            type="button"
            className="wibu-mob-nav-btn"
            aria-pressed={mobileView === "editor"}
            onClick={() => setMobileView("editor")}
          >
            <span>✏️</span>
            <span>Customize</span>
          </button>
          <button
            type="button"
            className="wibu-mob-nav-btn"
            aria-pressed={mobileView === "preview"}
            onClick={() => setMobileView("preview")}
          >
            <span>👁️</span>
            <span>Preview ({pages.length})</span>
          </button>
        </div>

        <button
          type="button"
          className="wibu-mob-cta-btn"
          onClick={downloadPdf}
          title="Save as PDF invitation"
        >
          <span>📥</span>
          <span>Save PDF</span>
        </button>
      </div>

      <aside className={`wibu-side ${mobileView === "preview" ? "wibu-hidden-mobile" : ""}`}>
        <div className="wibu-head">
          <h1>PDF Invitation Studio</h1>
          <p>Universal 2–3 page A5 wedding invitations with Canva-style direct editing.</p>
        </div>
        <div className="wibu-tabs" role="tablist">
          {TABS.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className="wibu-tab" onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
        <div className="wibu-body" role="tabpanel">{body}</div>
      </aside>

      <main className={`wibu-main ${mobileView === "editor" ? "wibu-hidden-mobile" : ""}`}>
        <div className="wibu-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>{pages.length} {pages.length === 1 ? "page" : "pages"} ({d.structure === "2-page" ? "2-Page Keepsake" : "3-Page Suite"}) · A5 portrait</span>

            {/* Zoom Controls */}
            <div className="wibu-zoom-tools">
              <button
                type="button"
                className="wibu-zoom-btn"
                onClick={() => setZoomMultiplier((z) => Math.max(0.65, +(z - 0.15).toFixed(2)))}
                title="Zoom Out"
              >
                -
              </button>
              <button
                type="button"
                className="wibu-zoom-btn"
                onClick={() => setZoomMultiplier(1)}
                title="Fit to Screen"
              >
                {Math.round(zoomMultiplier * 100)}%
              </button>
              <button
                type="button"
                className="wibu-zoom-btn"
                onClick={() => setZoomMultiplier((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>

          <span style={{ display: "flex", gap: 8 }}>
            <button type="button" className="wibu-btn" onClick={reset}>Reset</button>
            <button type="button" className="wibu-btn primary" onClick={downloadPdf}>Save as PDF</button>
          </span>
        </div>

        <div className="wibu-stage" ref={stageRef} onClick={() => setActiveElement(null)}>
          {/* Floating Canva Quick Format Toolbar */}
          {activeElement && (
            <div className="wib-floating-toolbar" onClick={(e) => e.stopPropagation()}>
              {activeElement.type === "text" ? (
                <>
                  <span style={{ color: "#94a3b8", fontSize: "11px" }}>Editing: <b style={{ color: "#fff" }}>{activeElement.label}</b></span>
                  <span className="wib-toolbar-sep" />
                  <button
                    type="button"
                    className="wib-toolbar-btn"
                    onClick={() => setTab("details")}
                    title="Open in Sidebar"
                  >
                    📝 Open in Sidebar
                  </button>
                  <span className="wib-toolbar-sep" />
                  <button
                    type="button"
                    className="wib-toolbar-btn"
                    onClick={() => setActiveElement(null)}
                    title="Done"
                  >
                    ✓ Done
                  </button>
                </>
              ) : (
                <>
                  <span style={{ color: "#94a3b8", fontSize: "11px" }}>3D Prop: <b style={{ color: "#fff" }}>{activeElement.el?.name || "Sticker"}</b></span>
                  <span className="wib-toolbar-sep" />
                  <button
                    type="button"
                    className="wib-toolbar-btn"
                    onClick={() => handleUpdateElement(activeElement.id, { scale: +((activeElement.el?.scale || 1) * 1.15).toFixed(2) })}
                    title="Scale Up"
                  >
                    🔍+
                  </button>
                  <button
                    type="button"
                    className="wib-toolbar-btn"
                    onClick={() => handleUpdateElement(activeElement.id, { scale: Math.max(0.4, +((activeElement.el?.scale || 1) * 0.85).toFixed(2)) })}
                    title="Scale Down"
                  >
                    🔍-
                  </button>
                  <button
                    type="button"
                    className="wib-toolbar-btn"
                    onClick={() => handleUpdateElement(activeElement.id, { rotate: ((activeElement.el?.rotate || 0) + 15) % 360 })}
                    title="Rotate 15°"
                  >
                    🔄 Rotate
                  </button>
                  <span className="wib-toolbar-sep" />
                  <button
                    type="button"
                    className="wib-toolbar-btn danger"
                    onClick={() => handleRemoveElement(activeElement.id)}
                    title="Delete from card"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    type="button"
                    className="wib-toolbar-btn"
                    onClick={() => setActiveElement(null)}
                    title="Done"
                  >
                    ✓
                  </button>
                </>
              )}
            </div>
          )}

          {pages.map((p, idx) => (
            <div key={p.key} className="wibu-page-container">
              <div className="wibu-page-badge print:hidden">
                ✦ {p.label.replace(/^Page \d+:\s*/, "")} · Page {idx + 1} of {pages.length} ✦
              </div>
              <div
                className="wibu-pagewrap"
                style={{ width: PAGE_PX.w * effectiveScale, height: PAGE_PX.h * effectiveScale }}
                aria-label={p.label}
              >
                <div style={{ width: PAGE_PX.w, height: PAGE_PX.h, transform: `scale(${effectiveScale})`, transformOrigin: "0 0" }}>
                  <InvitationPage
                    pageKey={p.key}
                    data={d}
                    measure
                    onFit={onFit}
                    sig={sig}
                    isPrint={false}
                    activeElement={activeElement}
                    onSelectElement={setActiveElement}
                    onUpdateText={(path, val) => set(path, val)}
                    onUpdateElement={handleUpdateElement}
                    onRemoveElement={handleRemoveElement}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {portalNode &&
        createPortal(
          <div className="wib-print-root">
            {pages.map((p) => (
              <InvitationPage
                key={p.key}
                pageKey={p.key}
                data={d}
                fit={fits[p.key] || 1}
                isPrint={true}
              />
            ))}
          </div>,
          portalNode
        )}
    </div>
  );
}
