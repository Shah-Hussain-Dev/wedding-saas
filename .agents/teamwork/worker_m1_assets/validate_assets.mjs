import fs from 'fs';
import path from 'path';

const EXPECTED_AUDIO = [
  'music.mp3',
  'sfx-door-open.mp3',
  'sfx-letter.mp3',
  'sfx-light.mp3',
  'sfx-join.mp3',
  'sfx-window-open.mp3',
  'sfx-tick.mp3',
  'sfx-lock.mp3',
  'sfx-bangle.mp3',
  'sfx-roll.mp3',
  'sfx-dove.mp3',
  'sfx-diya.mp3',
  'sfx-shimmer.mp3'
];

const EXPECTED_VISUAL = {
  cover: [
    'doors.webp', 'doors-tab.webp', 'doors-land.webp',
    'medallion.webp', 'medallion-tab.webp', 'medallion-land.webp',
    'mirrors.webp', 'mirrors-tab.webp', 'mirrors-land.webp'
  ],
  hero: [
    'hall.webp', 'hall-tab.webp', 'hall-land.webp',
    'mirrors.webp', 'mirrors-tab.webp', 'mirrors-land.webp',
    'gold.webp'
  ],
  letter: [
    'casket-lid.webp', 'casket-open.webp', 'paper.webp',
    'paper-back.webp', 'seal.webp', 'band.webp', 'marble.webp'
  ],
  families: [
    'wall.webp', 'wall-mirrors.webp', 'lantern-unlit.webp',
    'lantern-lit.webp', 'lantern-glow.webp', 'chain.webp'
  ],
  events: [
    'arch.webp', 'shutters.webp', 'frame.webp',
    'frame-mirrors.webp', 'mehndi.webp', 'nikah.webp',
    'baraat.webp', 'walima.webp'
  ],
  countdown: [
    'ceiling.webp', 'ceiling-mirrors.webp', 'frame.webp',
    'ring1.webp', 'ring2.webp', 'ring3.webp', 'rete.webp',
    'tile-on.webp', 'tile-off.webp'
  ],
  rsvp: [
    'dove.webp', 'dove-fly.webp', 'paper.webp', 'stand.webp',
    'bangle-mehndi.webp', 'bangle-nikah.webp', 'bangle-baraat.webp',
    'bangle-walima.webp', 'roll.webp', 'ribbon.webp'
  ],
  closing: [
    'moon.webp', 'scene.webp', 'scene-tab.webp', 'scene-land.webp',
    'diya-0.webp', 'diya-1.webp', 'diya-2.webp', 'diya-3.webp'
  ]
};

function checkWebP(filePath) {
  const buf = Buffer.alloc(12);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buf, 0, 12, 0);
  fs.closeSync(fd);
  const riff = buf.subarray(0, 4).toString('ascii');
  const webp = buf.subarray(8, 12).toString('ascii');
  return riff === 'RIFF' && webp === 'WEBP';
}

function checkMP3(filePath) {
  const buf = Buffer.alloc(4);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buf, 0, 4, 0);
  fs.closeSync(fd);
  if (buf.subarray(0, 3).toString('ascii') === 'ID3') return true;
  if (buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0) return true;
  return false;
}

let totalFiles = 0;
let totalBytes = 0;
const errors = [];

console.log('=== VALIDATING AUDIO REPOSITORY ===');
const audioDir = 'public/templates/sheesh-mahal/audio';
for (const file of EXPECTED_AUDIO) {
  const fp = path.join(audioDir, file);
  if (!fs.existsSync(fp)) {
    errors.push(`Missing audio file: ${fp}`);
    continue;
  }
  const stat = fs.statSync(fp);
  if (stat.size === 0) {
    errors.push(`Empty audio file: ${fp}`);
    continue;
  }
  if (!checkMP3(fp)) {
    errors.push(`Corrupt MP3 header: ${fp}`);
    continue;
  }
  totalFiles++;
  totalBytes += stat.size;
  console.log(`[PASS] audio/${file} (${stat.size} bytes)`);
}

console.log('\n=== VALIDATING VISUAL ASSETS REPOSITORY ===');
const baseAssetsDir = 'public/templates/sheesh-mahal/assets';
for (const [section, files] of Object.entries(EXPECTED_VISUAL)) {
  console.log(`\n-- Section: ${section} (${files.length} files) --`);
  for (const file of files) {
    const fp = path.join(baseAssetsDir, section, file);
    if (!fs.existsSync(fp)) {
      errors.push(`Missing visual file: ${fp}`);
      continue;
    }
    const stat = fs.statSync(fp);
    if (stat.size === 0) {
      errors.push(`Empty visual file: ${fp}`);
      continue;
    }
    if (!checkWebP(fp)) {
      errors.push(`Corrupt WebP header: ${fp}`);
      continue;
    }
    totalFiles++;
    totalBytes += stat.size;
    console.log(`[PASS] assets/${section}/${file} (${stat.size} bytes)`);
  }
}

console.log('\n======================================');
console.log(`Total Assets Validated: ${totalFiles}`);
console.log(`Total Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB (${totalBytes.toLocaleString()} bytes)`);
console.log(`Errors Found: ${errors.length}`);
if (errors.length > 0) {
  console.error('Errors:', errors);
  process.exit(1);
} else {
  console.log('ALL ASSETS FULLY VALIDATED AND AUTHENTIC.');
  process.exit(0);
}
