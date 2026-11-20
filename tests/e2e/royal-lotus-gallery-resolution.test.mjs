import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Royal Lotus data.json contains authentic couple photos instead of empty frames", () => {
  const dataPath = path.resolve("templates/royal-lotus/data.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  const data = JSON.parse(raw);

  assert.ok(Array.isArray(data.gallery), "data.gallery must be an array");
  assert.ok(data.gallery.length >= 5, "data.gallery should have at least 5 photos");

  // Verify no empty crimson-royale frames
  for (const item of data.gallery) {
    assert.ok(
      !item.url.includes("/templates/crimson-royale/gallery-"),
      `Photo ${item.url} should not be an empty crimson-royale template frame`
    );
    assert.ok(
      item.url.startsWith("/images/gallery-library/"),
      `Photo ${item.url} should point to /images/gallery-library/`
    );
  }

  // Check slideshowImages as well
  assert.ok(Array.isArray(data.slideshowImages), "data.slideshowImages must be an array");
  for (const url of data.slideshowImages) {
    assert.ok(
      !url.includes("/templates/crimson-royale/gallery-"),
      `Slideshow photo ${url} should not be an empty crimson-royale frame`
    );
  }
});

test("Royal Lotus page.tsx resolves slideshowImages and galleryImages alongside gallery", () => {
  const pagePath = path.resolve("templates/royal-lotus/page.tsx");
  const content = fs.readFileSync(pagePath, "utf8");

  assert.ok(
    content.includes("data?.slideshowImages"),
    "Royal Lotus page.tsx must check data.slideshowImages"
  );
  assert.ok(
    content.includes("data?.galleryImages"),
    "Royal Lotus page.tsx must check data.galleryImages"
  );
  assert.ok(
    !content.includes("/templates/crimson-royale/gallery-1.webp"),
    "Royal Lotus page.tsx fallback must not contain empty crimson-royale frames"
  );
  assert.ok(
    content.includes("/images/gallery-library/hindu/haveli-royal-vivah.webp"),
    "Royal Lotus page.tsx fallback must contain authentic Hindu couple photos"
  );
});

test("app/[slug]/page.tsx resolves gallery and slideshowImages for devices without localStorage", () => {
  const slugPagePath = path.resolve("app/[slug]/page.tsx");
  const content = fs.readFileSync(slugPagePath, "utf8");

  assert.ok(
    content.includes("candidateSlideshow"),
    "app/[slug]/page.tsx must resolve candidateSlideshow from public API response"
  );
  assert.ok(
    content.includes("candidateGallery"),
    "app/[slug]/page.tsx must resolve candidateGallery in mergedInvitation"
  );
});

test("API routes enrich invitation with gallery, galleryImages and slideshowImages", () => {
  const publicApi = fs.readFileSync("app/api/invitations/public/route.ts", "utf8");
  assert.ok(publicApi.includes("gallery: rawSlideshow"), "Public API must map gallery from slideshowImages");
  assert.ok(publicApi.includes("galleryImages: rawSlideshow"), "Public API must map galleryImages from slideshowImages");

  const idApi = fs.readFileSync("app/api/invitations/[id]/route.ts", "utf8");
  assert.ok(idApi.includes("gallery: rawSlideshow"), "GET /api/invitations/[id] must map gallery");
  assert.ok(idApi.includes("resolvedSlideshow"), "PUT /api/invitations/[id] must resolve slideshow from gallery/slideshowImages");

  const rootApi = fs.readFileSync("app/api/invitations/route.ts", "utf8");
  assert.ok(rootApi.includes("gallery: rawSlideshow"), "GET /api/invitations must map gallery");
  assert.ok(rootApi.includes("resolvedSlideshow"), "POST /api/invitations update must resolve slideshow");
  assert.ok(rootApi.includes("resolvedCreateSlideshow"), "POST /api/invitations create must resolve slideshow");
});

test("Song library includes Ramayana Tera Mera Rang track", () => {
  const audioTracksPath = path.resolve("lib/audio-tracks.ts");
  const content = fs.readFileSync(audioTracksPath, "utf8");

  assert.ok(
    content.includes("ramayana-tera-mera-rang"),
    "lib/audio-tracks.ts must contain ramayana-tera-mera-rang track ID"
  );
  assert.ok(
    content.includes("/audio/ramayana-tera-mera-rang.mpeg"),
    "lib/audio-tracks.ts must point to /audio/ramayana-tera-mera-rang.mpeg"
  );
  assert.ok(
    fs.existsSync(path.resolve("public/audio/ramayana-tera-mera-rang.mpeg")),
    "public/audio/ramayana-tera-mera-rang.mpeg must exist on disk"
  );
});

test("Public invitation API and slug fetcher enforce cache-busting to prevent stale mobile responses", () => {
  const publicApi = fs.readFileSync("app/api/invitations/public/route.ts", "utf8");
  assert.ok(publicApi.includes("force-dynamic"), "Public API must be force-dynamic");
  assert.ok(publicApi.includes("no-store"), "Public API headers must include no-store");

  const slugPage = fs.readFileSync("app/[slug]/page.tsx", "utf8");
  assert.ok(slugPage.includes("_t="), "app/[slug]/page.tsx must use timestamp cache busting param");
  assert.ok(slugPage.includes('cache: "no-store"'), "app/[slug]/page.tsx must use cache: no-store");
});
