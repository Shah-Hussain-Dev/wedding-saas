const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const list = [
  { id: 'beige-cream-watercolor', file: 'Beige and Cream Watercolor Wedding Invitation Mobile Video.mp4', ss: '00:00:03' },
  { id: 'royal-blue-watercolor', file: 'Blue Watercolor Wedding Invitation Mobile Video.mp4', ss: '00:00:03' },
  { id: 'sage-ivory-botanical', file: 'Green White Illustrative Elegant Wedding Invitation Video Seluler.mp4', ss: '00:00:03' },
  { id: 'rose-gold-blush-floral', file: 'Pink Floral Wedding Invitation Mobile Video.mp4', ss: '00:00:03' },
  { id: 'royal-rajputana-heritage', file: 'Red and Gold Traditional Indian Wedding Invitation Instagram Reel.mp4', ss: '00:00:05' },
  { id: 'cinematic-3d-gold-teaser', file: 'Untitled_Scene_11-23_07_12_39_ae8b08a0_t0.3-6.mp4', ss: '00:00:02' }
];

const postersDir = path.join(rootDir, 'public', 'images', 'video-posters');
if (!fs.existsSync(postersDir)) {
  fs.mkdirSync(postersDir, { recursive: true });
}

for (const item of list) {
  const inPath = path.join(rootDir, 'videos', item.file);
  const outPath = path.join(postersDir, `${item.id}.webp`);
  console.log(`Generating poster for ${item.id}...`);
  execSync(`ffmpeg -y -ss ${item.ss} -i "${inPath}" -vframes 1 -q:v 80 "${outPath}"`, { stdio: 'inherit' });
}

console.log('Posters generated successfully:');
fs.readdirSync(postersDir).forEach(f => {
  const stat = fs.statSync(path.join(postersDir, f));
  console.log(` - ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
});
