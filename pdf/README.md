# Wedding invitation builder (Next.js)

A client component that lets a user pick a faith and a template, fill in every detail, and save a print-ready A5 PDF.

## Install

```bash
npm i qrcode.react   # v4.1 or newer, the only dependency
```

Copy this folder to `components/wedding-invitation/` (App Router or Pages Router, React 18 or 19). No Tailwind needed: styles are injected by the component.

## Use

```jsx
// app/invitation/page.jsx
import WeddingInvitationBuilder from "@/components/wedding-invitation/WeddingInvitationBuilder";

export default function Page() {
  return <WeddingInvitationBuilder />;
}
```

Props (all optional):

| Prop | Purpose |
| --- | --- |
| `initialData` | A saved state object. Skips the localStorage restore. |
| `onChange(data)` | Called on every edit. Use it to save to your database. |
| `storageKey` | localStorage key for the draft. |

The whole invitation is one JSON object (see `initialState()` in `data.js`), so loading and saving drafts from your backend is a plain `JSON.stringify` / `JSON.parse`.

## What the user can change

- **Template tab:** faith (Hindu, Muslim, Christian, Sikh, interfaith) and 10 starting templates.
- **Details tab:** names and prefixes, date, invocation and its script, both families (add or remove any number of relations), venue, Google Maps link, and the invitation message.
- **Events tab:** any number of events with date, time, place and note. Reorder, remove, or add from faith-specific suggestions.
- **Sections tab:** extra blocks such as guest lists, hosts, RSVP and contact details.
- **Style tab:** 10 colour themes with per-colour overrides, 5 font pairings, 6 border designs, divider motifs, and which pages are included.

The QR code and the "View on Google Maps" button use the pasted map link, or a Maps search built from the venue name and address.

## How the PDF is made

"Save as PDF" opens the browser print dialog for a hidden print copy of the pages (A5, no margins). Choosing "Save as PDF" gives a vector PDF with selectable text and a live map link. No server or PDF library is needed. Pages that are too full are scaled down automatically so nothing is cut off.

## Add your own

All content lives in `data.js`.

- **New template:** add an entry to `TEMPLATES` (layout, theme, font pairing, divider motif, and the faiths it suits).
- **New theme:** add an entry to `THEMES`. Use light text for `ink` on dark backgrounds.
- **New faith:** add an entry to `FAITHS` with its invocation, wording, event suggestions and default sections.
- **New border design:** add a branch to `Frame` in `pages.jsx` and a name in `LAYOUTS`.
- **New font pairing:** add to `FONT_SETS` and include the family in `GOOGLE_FONTS_URL`.

## Notes

- Fonts load from Google Fonts. For production, self-host them with `next/font` and point the `--font-*` variables at them.
- Check the wording of each faith's default text with someone from that community before you ship it. The defaults are neutral starting points.
- Print backgrounds are forced on with `print-color-adjust: exact`. In Chrome and Edge the PDF matches the preview; in Safari, tick "Background graphics" if prompted.
