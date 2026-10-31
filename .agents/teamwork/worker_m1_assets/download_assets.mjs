import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://aqdinvites.com/invites/sheesh-mahal/';

const AUDIO_MANIFEST = [
  {
    src: 'assets/music/music.mp3',
    dest: 'public/templates/sheesh-mahal/audio/music.mp3',
    name: 'music.mp3',
    desc: 'Ambient Shehnai & Sitar wedding soundtrack'
  },
  {
    src: 'assets/cover/sfx-open.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-door-open.mp3',
    name: 'sfx-door-open.mp3',
    desc: 'Heavy royal palace doors opening'
  },
  {
    src: 'assets/letter/sfx-letter.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-letter.mp3',
    name: 'sfx-letter.mp3',
    desc: 'Velvet casket latch & parchment slide'
  },
  {
    src: 'assets/families/sfx-light.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-light.mp3',
    name: 'sfx-light.mp3',
    desc: 'Brass lantern flame ignition'
  },
  {
    src: 'assets/families/sfx-join.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-join.mp3',
    name: 'sfx-join.mp3',
    desc: 'Golden threads meeting at central union'
  },
  {
    src: 'assets/events/sfx-open.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-window-open.mp3',
    name: 'sfx-window-open.mp3',
    desc: 'Carved wooden jharokha window swing'
  },
  {
    src: 'assets/countdown/sfx-tick.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-tick.mp3',
    name: 'sfx-tick.mp3',
    desc: 'Astrolabe metallic gear rotation click'
  },
  {
    src: 'assets/countdown/sfx-lock.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-lock.mp3',
    name: 'sfx-lock.mp3',
    desc: 'Astrolabe alignment chime on wedding date'
  },
  {
    src: 'assets/rsvp/sfx-clink.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-bangle.mp3',
    name: 'sfx-bangle.mp3',
    desc: 'Glass / lac bangle clinking onto stand'
  },
  {
    src: 'assets/rsvp/sfx-roll.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-roll.mp3',
    name: 'sfx-roll.mp3',
    desc: 'Parchment scroll rolling and tying with ribbon'
  },
  {
    src: 'assets/rsvp/sfx-dove.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-dove.mp3',
    name: 'sfx-dove.mp3',
    desc: 'White dove flapping wings to take flight'
  },
  {
    src: 'assets/closing/sfx-float.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-diya.mp3',
    name: 'sfx-diya.mp3',
    desc: 'Water droplet ripple when diya is placed'
  },
  {
    src: 'assets/closing/sfx-shimmer.mp3',
    dest: 'public/templates/sheesh-mahal/audio/sfx-shimmer.mp3',
    name: 'sfx-shimmer.mp3',
    desc: 'Ethereal night reflection shimmer'
  }
];

const VISUAL_MANIFEST = [
  // Cover
  'assets/cover/doors.webp',
  'assets/cover/doors-tab.webp',
  'assets/cover/doors-land.webp',
  'assets/cover/medallion.webp',
  'assets/cover/medallion-tab.webp',
  'assets/cover/medallion-land.webp',
  'assets/cover/mirrors.webp',
  'assets/cover/mirrors-tab.webp',
  'assets/cover/mirrors-land.webp',
  // Hero
  'assets/hero/hall.webp',
  'assets/hero/hall-tab.webp',
  'assets/hero/hall-land.webp',
  'assets/hero/mirrors.webp',
  'assets/hero/mirrors-tab.webp',
  'assets/hero/mirrors-land.webp',
  'assets/hero/gold.webp',
  // Letter
  'assets/letter/casket-lid.webp',
  'assets/letter/casket-open.webp',
  'assets/letter/paper.webp',
  'assets/letter/paper-back.webp',
  'assets/letter/seal.webp',
  'assets/letter/band.webp',
  'assets/letter/marble.webp',
  // Families
  'assets/families/wall.webp',
  'assets/families/wall-mirrors.webp',
  'assets/families/lantern-unlit.webp',
  'assets/families/lantern-lit.webp',
  'assets/families/lantern-glow.webp',
  'assets/families/chain.webp',
  // Events
  'assets/events/arch.webp',
  'assets/events/shutters.webp',
  'assets/events/frame.webp',
  'assets/events/frame-mirrors.webp',
  'assets/events/mehndi.webp',
  'assets/events/nikah.webp',
  'assets/events/baraat.webp',
  'assets/events/walima.webp',
  // Countdown
  'assets/countdown/ceiling.webp',
  'assets/countdown/ceiling-mirrors.webp',
  'assets/countdown/frame.webp',
  'assets/countdown/ring1.webp',
  'assets/countdown/ring2.webp',
  'assets/countdown/ring3.webp',
  'assets/countdown/rete.webp',
  'assets/countdown/tile-on.webp',
  'assets/countdown/tile-off.webp',
  // RSVP
  'assets/rsvp/dove.webp',
  'assets/rsvp/dove-fly.webp',
  'assets/rsvp/paper.webp',
  'assets/rsvp/stand.webp',
  'assets/rsvp/bangle-mehndi.webp',
  'assets/rsvp/bangle-nikah.webp',
  'assets/rsvp/bangle-baraat.webp',
  'assets/rsvp/bangle-walima.webp',
  'assets/rsvp/roll.webp',
  'assets/rsvp/ribbon.webp',
  // Closing
  'assets/closing/moon.webp',
  'assets/closing/scene.webp',
  'assets/closing/scene-tab.webp',
  'assets/closing/scene-land.webp',
  'assets/closing/diya-0.webp',
  'assets/closing/diya-1.webp',
  'assets/closing/diya-2.webp',
  'assets/closing/diya-3.webp'
].map(relPath => ({
  src: relPath,
  dest: `public/templates/sheesh-mahal/${relPath}`,
  name: path.basename(relPath),
  section: relPath.split('/')[1]
}));

function validateWebpHeader(buf) {
  if (buf.length < 12) return false;
  const riff = buf.subarray(0, 4).toString('ascii');
  const webp = buf.subarray(8, 12).toString('ascii');
  return riff === 'RIFF' && webp === 'WEBP';
}

function validateMp3Header(buf) {
  if (buf.length < 4) return false;
  // ID3 header: "ID3"
  if (buf.subarray(0, 3).toString('ascii') === 'ID3') return true;
  // MPEG sync word: 11 set bits (0xFF followed by 0xE0 or higher)
  if (buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0) return true;
  return false;
}

async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.warn(`Retry ${attempt}/${maxRetries} for ${url}: ${err.message}`);
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

async function main() {
  console.log(`Starting asset download pipeline...`);
  console.log(`Total audio files: ${AUDIO_MANIFEST.length}`);
  console.log(`Total visual files: ${VISUAL_MANIFEST.length}`);
  console.log(`Grand total: ${AUDIO_MANIFEST.length + VISUAL_MANIFEST.length} assets`);

  const results = {
    audio: [],
    visual: [],
    errors: []
  };

  // 1. Audio Downloads
  console.log('\n--- Downloading Audio Assets ---');
  for (const item of AUDIO_MANIFEST) {
    const fullUrl = new URL(item.src, BASE_URL).href;
    const destPath = path.resolve(item.dest);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    try {
      const buf = await fetchWithRetry(fullUrl);
      const isMp3 = validateMp3Header(buf);
      if (!isMp3) {
        throw new Error(`Invalid MP3 header (first 4 bytes: ${buf.subarray(0, 4).toString('hex')})`);
      }
      fs.writeFileSync(destPath, buf);
      const stats = fs.statSync(destPath);
      console.log(`[AUDIO OK] ${item.name} (${stats.size.toLocaleString()} bytes) -> ${item.dest}`);
      results.audio.push({
        name: item.name,
        src: fullUrl,
        dest: item.dest,
        size: stats.size,
        valid: true
      });
    } catch (err) {
      console.error(`[AUDIO FAIL] ${item.name}: ${err.message}`);
      results.errors.push({ name: item.name, dest: item.dest, error: err.message });
    }
  }

  // 2. Visual Downloads
  console.log('\n--- Downloading Visual Assets ---');
  for (const item of VISUAL_MANIFEST) {
    const fullUrl = new URL(item.src, BASE_URL).href;
    const destPath = path.resolve(item.dest);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    try {
      const buf = await fetchWithRetry(fullUrl);
      const isWebp = validateWebpHeader(buf);
      if (!isWebp) {
        throw new Error(`Invalid WebP header (first 12 bytes: ${buf.subarray(0, 12).toString('hex')})`);
      }
      fs.writeFileSync(destPath, buf);
      const stats = fs.statSync(destPath);
      console.log(`[VISUAL OK] ${item.section}/${item.name} (${stats.size.toLocaleString()} bytes) -> ${item.dest}`);
      results.visual.push({
        name: item.name,
        section: item.section,
        src: fullUrl,
        dest: item.dest,
        size: stats.size,
        valid: true
      });
    } catch (err) {
      console.error(`[VISUAL FAIL] ${item.name}: ${err.message}`);
      results.errors.push({ name: item.name, dest: item.dest, error: err.message });
    }
  }

  // Write verification report
  fs.writeFileSync(
    '.agents/teamwork/worker_m1_assets/download_summary.json',
    JSON.stringify(results, null, 2)
  );

  console.log('\n======================================');
  console.log(`Download Pipeline Completed:`);
  console.log(`Audio: ${results.audio.length}/${AUDIO_MANIFEST.length} succeeded`);
  console.log(`Visual: ${results.visual.length}/${VISUAL_MANIFEST.length} succeeded`);
  console.log(`Total Downloaded: ${results.audio.length + results.visual.length}`);
  console.log(`Errors: ${results.errors.length}`);
  console.log('======================================');

  if (results.errors.length > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error in download pipeline:', err);
  process.exit(1);
});
