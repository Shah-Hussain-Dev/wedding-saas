// styles.js — plain CSS (no Tailwind needed). Invitation classes are `wib-*`,
// builder UI classes are `wibu-*`. All invitation sizes are in em so the
// auto-fit step can shrink a crowded page by changing one variable (--fit).

export const CSS = `
/* ---------- invitation pages ---------- */
.wib-page{position:relative;width:148mm;height:210mm;overflow:hidden;box-sizing:border-box;
  background:radial-gradient(ellipse at 50% 35%,var(--bg) 0%,var(--bg2) 100%);color:var(--ink);font-family:var(--font-body);
  box-shadow:0 18px 50px -8px rgba(10,18,30,0.32),0 0 0 1px rgba(0,0,0,0.08),inset 0 0 0 1px rgba(255,255,255,0.55);
  transition:box-shadow .25s ease,transform .25s ease}
.wib-frame{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.wib-inner{position:absolute;inset:0;box-sizing:border-box;padding:16mm 15mm 14mm;display:flex;flex-direction:column;align-items:center;
  text-align:center;overflow:hidden;font-size:calc(var(--fit,1) * 14px);line-height:1.35}
.wib-inner.is-arch{padding:32mm 24mm 22mm}
.wib-inner.is-banner{padding:22mm 15mm 16mm}
.wib-cover{justify-content:center;gap:.45em;font-size:calc(var(--fit,1) * 15.5px)}
.wib-families,.wib-venue,.wib-combined{justify-content:center;gap:.35em}
.wib-divider{display:block;height:auto;margin:.22em auto;flex:none}
.wib-inv{font-size:1.25em;color:var(--accent);line-height:1.3;max-width:92%}
.wib-inv-sub{font-style:italic;font-size:.78em;opacity:.85;max-width:90%}
.wib-kicker{font-family:var(--font-heading);letter-spacing:.34em;text-transform:uppercase;font-size:.74em;color:var(--accent2);margin-top:.5em;padding-left:.34em}
.wib-tagline{font-style:italic;font-size:.95em;opacity:.9}
.wib-name{font-family:var(--font-display);font-size:3.15em;line-height:1.08;color:var(--accent);max-width:100%;overflow-wrap:anywhere}
.wib-amp{font-family:var(--font-display);font-size:1.5em;color:var(--accent2);line-height:1}
.wib-date{font-family:var(--font-heading);letter-spacing:.18em;font-size:.8em;color:var(--accent);text-transform:uppercase;margin-top:.3em;padding-left:.18em}
.wib-cover-place{font-style:italic;font-size:.9em;opacity:.9}
.wib-h{font-family:var(--font-heading);letter-spacing:.3em;text-transform:uppercase;font-size:.88em;color:var(--accent);padding-left:.3em;margin-top:.2em}
.wib-cols{display:grid;grid-template-columns:1fr auto 1fr;gap:.9em;width:100%;align-items:start;margin-top:.3em}
.wib-vline{width:1px;background:var(--line,var(--accent2));align-self:stretch;opacity:.7}
.wib-sidelabel{font-family:var(--font-heading);letter-spacing:.2em;font-size:.6em;text-transform:uppercase;color:var(--accent2)}
.wib-sidename{font-family:var(--font-display);font-size:2em;color:var(--accent);line-height:1.05;margin:.1em 0 .25em;overflow-wrap:anywhere}
.wib-rel{font-family:var(--font-heading);font-size:.5em;letter-spacing:.2em;text-transform:uppercase;color:var(--accent2);margin-top:.9em}
.wib-fam{font-size:.98em;color:var(--accent);line-height:1.25}
.wib-events{width:100%;display:flex;flex-direction:column;gap:.42em;margin-top:.3em}
.wib-event{display:flex;align-items:center;justify-content:space-between;text-align:left;border:1px solid var(--accent2);
  border-radius:.7em;padding:.45em .85em;background:var(--card);box-shadow:0 3px 10px rgba(0,0,0,0.04);transition:all .15s}
.wib-ev-title{font-size:1.08em;color:var(--accent);line-height:1.2}
.wib-ev-meta{font-family:var(--font-heading);font-size:.58em;letter-spacing:.16em;text-transform:uppercase;color:var(--accent2);margin-top:.15em}
.wib-ev-venue{font-size:.8em;font-style:italic;opacity:.85}
.wib-ev-day{font-family:var(--font-heading);font-size:.55em;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);
  border-left:1px solid var(--accent2);padding-left:.9em;margin-left:.9em;white-space:nowrap}
.wib-venue-name{font-family:var(--font-display);font-size:2.2em;line-height:1.05;color:var(--accent);margin-top:.2em;overflow-wrap:anywhere}
.wib-addr{font-size:.92em;line-height:1.35}
.wib-qr{background:#fff;padding:2mm;border:1px solid var(--accent2);border-radius:3mm;width:32mm;height:32mm;box-sizing:border-box;margin-top:.4em;
  box-shadow:0 4px 12px rgba(0,0,0,0.09)}
.wib-qr svg{display:block;width:100%;height:100%}
.wib-qr-note{font-family:var(--font-heading);font-size:.52em;letter-spacing:.2em;text-transform:uppercase;color:var(--accent2)}
.wib-greet{font-style:italic;font-size:1.1em;color:var(--accent);margin-top:.3em}
.wib-msg{font-size:.95em;line-height:1.45;max-width:98%}
.wib-blocktitle{font-family:var(--font-heading);letter-spacing:.26em;text-transform:uppercase;font-size:.78em;color:var(--accent);padding-left:.26em}
.wib-lines{font-size:1em;line-height:1.35;margin-top:.15em}

/* ---------- print: only the A5 pages ---------- */
.wib-print-root{display:none}
@media print{
  @page{size:148mm 210mm;margin:0}
  html,body{margin:0!important;padding:0!important;background:#fff!important}
  body>*:not(.wib-print-root){display:none!important}
  .wib-print-root{display:block!important}
  .wib-print-root .wib-page{break-after:page;page-break-after:always;margin:0;box-shadow:none!important}
  .wib-print-root,.wib-print-root *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}

/* ---------- builder UI ---------- */
.wibu{--u-ink:#1f2330;--u-mute:#64748b;--u-line:#e2e8f0;--u-bg:#f8fafc;--u-brand:#073D31;--u-accent:#C8A45E;
  display:grid;grid-template-columns:minmax(340px,440px) 1fr;height:100vh;overflow:hidden;background:var(--u-bg);color:var(--u-ink);
  font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wibu *{box-sizing:border-box}

/* Left Sidebar with Dedicated Scrollbar */
.wibu-side{background:#fff;border-right:1px solid var(--u-line);display:flex;flex-direction:column;height:100vh;overflow:hidden}
.wibu-head{padding:16px 18px 12px;border-bottom:1px solid var(--u-line)}
.wibu-head h1{margin:0;font-size:17px;font-weight:700;color:#0f172a}
.wibu-head p{margin:3px 0 0;color:var(--u-mute);font-size:12px}
.wibu-tabs{display:flex;gap:2px;padding:8px 10px 0;border-bottom:1px solid var(--u-line);overflow-x:auto;scrollbar-width:none}
.wibu-tabs::-webkit-scrollbar{display:none}
.wibu-tab{border:0;background:none;padding:10px 14px;font:inherit;color:var(--u-mute);cursor:pointer;border-bottom:2.5px solid transparent;white-space:nowrap;min-height:44px}
.wibu-tab[aria-selected=true]{color:var(--u-brand);border-color:var(--u-brand);font-weight:700}
.wibu-body{padding:16px 18px 40px;overflow-y:auto;overflow-x:hidden;flex:1;display:flex;flex-direction:column;gap:14px;scrollbar-gutter:stable}

/* Right Main Stage with Independent Scrollbar & Zoom */
.wibu-main{display:flex;flex-direction:column;min-width:0;height:100vh;overflow-y:auto;overflow-x:hidden;background:#edf2f7;scrollbar-gutter:stable;position:relative}

/* 🌟 DEDICATED LUXURY SCROLLBAR 🌟 */
.wibu-main::-webkit-scrollbar,.wibu-body::-webkit-scrollbar{width:9px;height:9px}
.wibu-main::-webkit-scrollbar-track,.wibu-body::-webkit-scrollbar-track{background:#e2e8f0;border-radius:99px}
.wibu-main::-webkit-scrollbar-thumb,.wibu-body::-webkit-scrollbar-thumb{background:#c5a46a;border-radius:99px;border:2px solid #e2e8f0}
.wibu-main::-webkit-scrollbar-thumb:hover,.wibu-body::-webkit-scrollbar-thumb:hover{background:#073D31}
.wibu-main,.wibu-body{scrollbar-width:thin;scrollbar-color:#c5a46a #e2e8f0}

/* Builder Controls */
.wibu-group{display:flex;flex-direction:column;gap:10px;padding-bottom:14px;border-bottom:1px solid var(--u-line)}
.wibu-group:last-child{border-bottom:0}
.wibu-group>h3{margin:0;font-size:13px;font-weight:700;color:#1e293b}
.wibu-field{display:flex;flex-direction:column;gap:4px}
.wibu-field>span{font-size:12px;font-weight:600;color:#475569}
.wibu-field small{font-size:11.5px;color:var(--u-mute)}
.wibu-in,.wibu-area,.wibu-sel{width:100%;border:1px solid #cbd5e1;border-radius:8px;padding:8px 10px;font:inherit;background:#fff;color:inherit}
.wibu-area{min-height:84px;resize:vertical}
.wibu-in:focus,.wibu-area:focus,.wibu-sel:focus,.wibu-btn:focus-visible,.wibu-chip:focus-visible,.wibu-tab:focus-visible,.wibu-swatch:focus-visible,.wibu-tpl:focus-visible{outline:2px solid var(--u-brand);outline-offset:1px}
.wibu-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.wibu-card{border:1px solid var(--u-line);border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:8px;background:#fcfcfe}
.wibu-card-top{display:flex;justify-content:space-between;align-items:center;gap:6px}
.wibu-btn{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:8px 14px;font:inherit;cursor:pointer;color:inherit;min-height:38px;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
.wibu-btn:hover{background:#f1f5f9}
.wibu-btn.primary{background:var(--u-brand);border-color:var(--u-brand);color:#fff;font-weight:600;box-shadow:0 3px 12px rgba(7,61,49,0.25)}
.wibu-btn.primary:hover{background:#0a4f40}
.wibu-btn.small{padding:4px 10px;font-size:12px;min-height:30px}
.wibu-btn.danger{color:#b42318;border-color:#fecdd3}
.wibu-chips{display:flex;flex-wrap:wrap;gap:6px}
.wibu-chip{border:1px solid #cbd5e1;background:#fff;border-radius:99px;padding:7px 14px;font:inherit;cursor:pointer;min-height:36px;display:inline-flex;align-items:center}
.wibu-chip[aria-pressed=true]{background:var(--u-brand);color:#fff;border-color:var(--u-brand);font-weight:600}

/* Filter pills */
.wibu-filter-pills{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
.wibu-filter-pills::-webkit-scrollbar{display:none}
.wibu-pill{border:1px solid var(--u-line);background:#fff;border-radius:99px;padding:5px 12px;font-size:12px;font-weight:600;color:var(--u-mute);cursor:pointer;white-space:nowrap;transition:all .15s;min-height:32px;display:inline-flex;align-items:center}
.wibu-pill:hover{border-color:var(--u-brand);color:var(--u-brand)}
.wibu-pill[aria-pressed=true]{background:var(--u-brand);color:#fff;border-color:var(--u-brand)}

/* Template Cards Grid */
.wibu-tpls{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.wibu-tpl{border:2px solid var(--u-line);border-radius:10px;padding:8px;background:#fff;cursor:pointer;text-align:left;font:inherit;color:inherit;transition:all .15s}
.wibu-tpl:hover{border-color:#94a3b8;transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,0.06)}
.wibu-tpl[aria-pressed=true]{border-color:var(--u-brand);box-shadow:0 0 0 2px var(--u-brand)}
.wibu-tpl .thumb{overflow:hidden;border-radius:6px;display:block;margin:0 auto 8px;box-shadow:0 0 0 1px var(--u-line)}
.wibu-tpl b{display:block;font-weight:700;font-size:12px;color:#0f172a}
.wibu-tpl small{display:block;font-size:11px;color:var(--u-mute);margin-top:2px}
.wibu-badge-pages{display:inline-block;padding:1px 6px;border-radius:4px;background:#f1f5f9;color:#475569;font-size:10px;font-weight:700;margin-top:4px}

/* Palette Swatches */
.wibu-swatches{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.wibu-swatch{border:2px solid transparent;border-radius:10px;padding:3px;background:none;cursor:pointer;transition:transform .12s}
.wibu-swatch:hover{transform:scale(1.04)}
.wibu-swatch[aria-pressed=true]{border-color:var(--u-brand)}
.wibu-swatch i{display:block;height:34px;border-radius:7px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15),0 2px 6px rgba(0,0,0,0.06)}
.wibu-swatch em{display:block;font-style:normal;font-size:10px;color:var(--u-mute);margin-top:3px;text-align:center;line-height:1.15}
.wibu-colors{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.wibu-colors input{width:100%;height:38px;border:1px solid #cbd5e1;border-radius:8px;padding:2px;background:#fff;cursor:pointer}
.wibu-check{display:flex;align-items:center;gap:8px;cursor:pointer;min-height:36px;font-size:13px}
.wibu-check input{width:18px;height:18px;accent-color:var(--u-brand)}

/* Top Bar & Stage */
.wibu-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 20px;background:#fff;border-bottom:1px solid var(--u-line);position:sticky;top:0;z-index:10;box-shadow:0 1px 4px rgba(0,0,0,0.03)}
.wibu-bar span{color:var(--u-mute);font-size:12.5px}
.wibu-zoom-tools{display:flex;align-items:center;gap:4px;background:#f1f5f9;border-radius:8px;padding:2px}
.wibu-zoom-btn{border:none;background:transparent;padding:4px 8px;font-size:12px;font-weight:700;color:#334155;border-radius:6px;cursor:pointer}
.wibu-zoom-btn:hover{background:#e2e8f0;color:#0f172a}
.wibu-stage{padding:28px 16px 80px;display:flex;flex-direction:column;align-items:center;gap:36px;min-height:100%}
.wibu-pagewrap{border-radius:4px;overflow:visible;background:transparent;transition:transform .2s ease}

/* Mobile View Switcher */
.wibu-mob-toggle{display:none}

@media (max-width:880px){
  .wibu{grid-template-columns:1fr;height:auto;overflow:visible}
  .wibu-side{height:auto;overflow:visible}
  .wibu-main{height:auto;overflow:visible}
  .wibu-mob-toggle{display:flex;width:100%;padding:8px 16px;background:#fff;border-bottom:1px solid var(--u-line);gap:8px;position:sticky;top:0;z-index:20}
  .wibu-mob-toggle button{flex:1;padding:8px 12px;border-radius:8px;border:1px solid var(--u-line);background:#f8fafc;font-size:13px;font-weight:600;color:var(--u-mute);cursor:pointer;min-height:44px}
  .wibu-mob-toggle button[aria-pressed=true]{background:var(--u-brand);color:#fff;border-color:var(--u-brand)}
  .wibu-swatches{grid-template-columns:repeat(3,1fr)}
  .wibu-tpls{grid-template-columns:repeat(2,1fr)}
  .wibu-stage{padding:16px 8px 60px}
}
`;
