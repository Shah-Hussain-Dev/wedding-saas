import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("iOS Safari Audio Playback & Media Type Normalization Standards", async (t) => {
  await t.test("Feature 1: Ramayana audio track exists in MP3 format with proper audio/mpeg mapping", () => {
    const mp3Path = path.resolve("public/audio/ramayana-tera-mera-rang.mp3");
    const mpegPath = path.resolve("public/audio/ramayana-tera-mera-rang.mpeg");

    assert.ok(fs.existsSync(mp3Path), "ramayana-tera-mera-rang.mp3 must exist on disk");
    assert.ok(fs.existsSync(mpegPath), "ramayana-tera-mera-rang.mpeg must exist on disk for backward compatibility");

    const mp3Stat = fs.statSync(mp3Path);
    assert.ok(mp3Stat.size > 1000000, "MP3 file must contain valid audio stream (>1MB)");

    const tracksFile = fs.readFileSync(path.resolve("lib/audio-tracks.ts"), "utf8");
    assert.ok(
      tracksFile.includes("/audio/ramayana-tera-mera-rang.mp3"),
      "lib/audio-tracks.ts must register the .mp3 URL"
    );
  });

  await t.test("Feature 2: Public invitation API and slug page transparently normalize .mpeg to .mp3", () => {
    const publicApi = fs.readFileSync(path.resolve("app/api/invitations/public/route.ts"), "utf8");
    assert.ok(
      publicApi.includes("replace(/\\.mpeg$/i, \".mp3\")"),
      "app/api/invitations/public/route.ts must normalize .mpeg to .mp3"
    );

    const slugPage = fs.readFileSync(path.resolve("app/[slug]/page.tsx"), "utf8");
    assert.ok(
      slugPage.includes(".replace(/\\.mpeg$/i, \".mp3\")"),
      "app/[slug]/page.tsx must normalize .mpeg to .mp3 in mergedInvitation"
    );
  });

  await t.test("Feature 3: Royal Lotus template unlocks audio on direct user gesture for iOS Safari WebKit", () => {
    const royalLotus = fs.readFileSync(path.resolve("templates/royal-lotus/page.tsx"), "utf8");

    // Audio element configuration
    assert.ok(royalLotus.includes('playsInline'), "Audio element must have playsInline attribute for iOS");
    assert.ok(royalLotus.includes('preload="auto"'), "Audio element must have preload='auto'");
    assert.ok(royalLotus.includes('type="audio/mpeg"'), "Audio element must include audio/mpeg source");

    // iOS WebKit gesture unlock
    assert.ok(royalLotus.includes("unlockAudioForIOS"), "RoyalLotusIntro must define unlockAudioForIOS");
    assert.ok(royalLotus.includes("onPointerDownCapture={unlockAudioForIOS}"), "Intro container must capture pointerdown for audio unlock");
    assert.ok(royalLotus.includes("onTouchStartCapture={unlockAudioForIOS}"), "Intro container must capture touchstart for audio unlock");
    assert.ok(royalLotus.includes("onTouchStart={unlockAudioForIOS}"), "Rope button must handle touchstart for iOS audio unlock");
  });
});
