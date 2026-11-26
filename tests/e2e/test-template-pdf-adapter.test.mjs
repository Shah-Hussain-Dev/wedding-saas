import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  TEMPLATE_PDF_CONFIGS,
  getPdfConfigForTemplate,
  adaptTemplateDataToPdfState,
} from "../../pdf/template-adapter.js";
import { THEMES, LAYOUTS, FONT_SETS } from "../../pdf/data.js";

function getActivePageCount(state) {
  const p = state.pages || {};
  return Object.values(p).filter(Boolean).length;
}

const ALL_17_TEMPLATES = [
  "sheesh-mahal",
  "royal-majesty",
  "royal-lotus",
  "royal-heritage",
  "royal-grace",
  "royal-elegance",
  "rose-gold-blush",
  "noor-e-nikah",
  "azure-nikah",
  "emerald-qasr",
  "kitab-e-nikah",
  "gul-e-noor",
  "crimson-royale",
  "emerald-noir",
  "modern-minimal",
  "imperial-palace",
  "celestial-rose",
];

describe("Template PDF Adapter Architecture Test Suite", () => {
  test("All 17 templates are registered and configured", () => {
    for (const tId of ALL_17_TEMPLATES) {
      const config = TEMPLATE_PDF_CONFIGS[tId];
      assert.ok(config, `Template ${tId} must have an explicit PDF configuration`);
      assert.ok(THEMES[config.themeId], `Theme ${config.themeId} for ${tId} must exist in THEMES`);
      assert.ok(LAYOUTS[config.layout], `Layout ${config.layout} for ${tId} must exist in LAYOUTS`);
      assert.ok(FONT_SETS[config.fontId], `Font ${config.fontId} for ${tId} must exist in FONT_SETS`);
      assert.ok(
        config.structure === "2-page" || config.structure === "3-page",
        `Structure for ${tId} must be 2-page or 3-page max`
      );
    }
  });

  test("getPdfConfigForTemplate returns robust fallback for unknown templates", () => {
    const unknown = getPdfConfigForTemplate("unknown-custom-theme");
    assert.ok(unknown);
    assert.equal(unknown.faith, "universal");
    assert.equal(unknown.structure, "2-page");
  });

  test("adaptTemplateDataToPdfState produces 2-3 pages max for every template", () => {
    const sampleInput = {
      brideName: "Zoya",
      groomName: "Farhan",
      weddingDate: "2027-02-14",
      weddingTime: "5:00 PM",
      venueName: "The Grand Heritage Lawn",
      venueAddress: "Civil Lines, Lucknow, UP",
      events: [
        { name: "Mehendi & Sangeet", time: "4:00 PM", day: "SATURDAY", venue: "Rose Garden" },
        { name: "Nikah Ceremony", time: "11:00 AM", day: "SUNDAY", venue: "Grand Ballroom" },
        { name: "Walima Banquet", time: "7:30 PM", day: "SUNDAY", venue: "Royal Pavilion" },
      ],
      complimentsText: "With best compliments from family & friends",
    };

    for (const tId of ALL_17_TEMPLATES) {
      const state = adaptTemplateDataToPdfState(tId, sampleInput);
      assert.equal(state.bride, "Zoya");
      assert.equal(state.groom, "Farhan");
      assert.equal(state.venueName, "The Grand Heritage Lawn");
      const url = state.mapUrl || state.venue?.mapUrl || "";
      assert.ok(url.includes("maps.google.com"));

      // Verify page count is 2 or 3
      const pageCount = getActivePageCount(state);
      assert.ok(
        pageCount >= 2 && pageCount <= 3,
        `Template ${tId} resulted in ${pageCount} pages, must be 2 or 3 pages max!`
      );

      // Verify RSVP is never present
      const json = JSON.stringify(state);
      assert.ok(!json.toLowerCase().includes('"rsvp"'), `Template ${tId} must not contain RSVP`);
    }
  });

  test("Cultural traditions format invocations and headings authentically", () => {
    const muslimState = adaptTemplateDataToPdfState("noor-e-nikah", { religion: "muslim" });
    assert.ok(muslimState.invocation.includes("بِسْمِ اللَّهِ"));
    assert.equal(muslimState.faith, "muslim");

    const hinduState = adaptTemplateDataToPdfState("royal-lotus", { religion: "hindu" });
    assert.ok(hinduState.invocation.includes("श्री गणेशाय नमः"));
    assert.equal(hinduState.faith, "hindu");

    const universalState = adaptTemplateDataToPdfState("rose-gold-blush", { religion: "universal" });
    assert.ok(universalState.invocation.includes("love"));
    assert.equal(universalState.faith, "universal");
  });

  test("All user-added events are preserved on PDF and removing an event from PDF leaves website events untouched", () => {
    const websiteEvents = [
      { id: "e1", name: "Roka Ceremony", date: "Dec 18, 2026", time: "11:00 AM", venue: "Home" },
      { id: "e2", name: "Haldi Rasam", date: "Dec 19, 2026", time: "10:00 AM", venue: "Courtyard" },
      { id: "e3", name: "Mehndi Night", date: "Dec 19, 2026", time: "06:00 PM", venue: "Lawn" },
      { id: "e4", name: "Sangeet & Dance", date: "Dec 20, 2026", time: "07:30 PM", venue: "Ballroom" },
      { id: "e5", name: "Shubh Vivah / Wedding", date: "Dec 21, 2026", time: "04:00 PM", venue: "Mandap" },
      { id: "e6", name: "Grand Reception", date: "Dec 22, 2026", time: "08:00 PM", venue: "Grand Palace" },
    ];

    const originalLength = websiteEvents.length;
    const originalEventsJson = JSON.stringify(websiteEvents);

    const pdfState = adaptTemplateDataToPdfState("sheesh-mahal", { events: websiteEvents });

    // Verify all 6 events are present on the PDF
    assert.equal(pdfState.events.length, 6, "All 6 user-added events must be present on the PDF");
    assert.equal(pdfState.events[0].title, "Roka Ceremony");
    assert.equal(pdfState.events[5].title, "Grand Reception");

    // Simulate removing an event from the PDF (e.g. user removes "Roka Ceremony" from PDF stationery)
    const updatedPdfEvents = pdfState.events.filter((ev) => ev.id !== "e1");
    assert.equal(updatedPdfEvents.length, 5, "PDF now has 5 events");

    // Verify website events were completely untouched and unmodified
    assert.equal(websiteEvents.length, originalLength, "Website events count must remain untouched");
    assert.equal(JSON.stringify(websiteEvents), originalEventsJson, "Website events data must remain completely unmodified");
  });
});
