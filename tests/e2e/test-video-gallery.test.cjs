const fs = require('fs');
const path = require('path');

console.log('--- STARTING VIDEO GALLERY VERIFICATION TEST ---');

const videoIds = [
  'royal-rajputana-heritage',
  'beige-cream-watercolor',
  'royal-blue-watercolor',
  'sage-ivory-botanical',
  'rose-gold-blush-floral',
  'cinematic-3d-gold-teaser'
];

const videoFiles = [
  'Red and Gold Traditional Indian Wedding Invitation Instagram Reel.mp4',
  'Beige and Cream Watercolor Wedding Invitation Mobile Video.mp4',
  'Blue Watercolor Wedding Invitation Mobile Video.mp4',
  'Green White Illustrative Elegant Wedding Invitation Video Seluler.mp4',
  'Pink Floral Wedding Invitation Mobile Video.mp4',
  'Untitled_Scene_11-23_07_12_39_ae8b08a0_t0.3-6.mp4'
];

// Check each video file exists on disk
for (const filename of videoFiles) {
  const p = path.join(process.cwd(), 'videos', filename);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing video: ${p}`);
  }
  const stat = fs.statSync(p);
  console.log(`✓ Video verified: ${filename} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

// Check each poster exists on disk
for (const id of videoIds) {
  const p = path.join(process.cwd(), 'public', 'images', 'video-posters', `${id}.webp`);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing poster: ${p}`);
  }
  const stat = fs.statSync(p);
  console.log(`✓ Poster verified: ${id}.webp (${(stat.size / 1024).toFixed(1)} KB)`);
}

// Check streaming API route exists
const apiRoute = path.join(process.cwd(), 'app', 'api', 'videos', '[id]', 'route.ts');
if (!fs.existsSync(apiRoute)) throw new Error('Streaming API route missing');
console.log('✓ API route verified: app/api/videos/[id]/route.ts');

// Check Videos page exists
const pageFile = path.join(process.cwd(), 'app', 'videos', 'page.tsx');
if (!fs.existsSync(pageFile)) throw new Error('Videos page missing');
console.log('✓ Landing page verified: app/videos/page.tsx');

console.log('--- ALL VIDEO GALLERY VERIFICATION CHECKS PASSED ---');
