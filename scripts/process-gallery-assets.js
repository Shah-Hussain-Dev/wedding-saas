const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BRAIN_DIR = 'C:\\Users\\shamshad\\.gemini\\antigravity-ide\\brain\\2d54cc2a-e469-44c2-ade9-68eb332b0c58';
const TARGET_BASE = path.join(__dirname, '..', 'public', 'images', 'gallery-library');

const ASSETS = [
  {
    src: 'pilot_muslim_anime_swing_1792862633481.jpg',
    folder: 'anime',
    name: 'muslim-anime-swing',
  },
  {
    src: 'artwork_2d_beach_roses_1792862730005.jpg',
    folder: 'anime',
    name: 'ocean-rose-whispers',
  },
  {
    src: 'pilot_muslim_sacred_arch_1792862665237.jpg',
    folder: 'muslim',
    name: 'sacred-palace-colonnade',
  },
  {
    src: 'artwork_muslim_garden_walima_1792862792232.jpg',
    folder: 'muslim',
    name: 'walima-twilight-garden',
  },
  {
    src: 'pilot_hindu_royal_vivah_1792862706147.jpg',
    folder: 'hindu',
    name: 'haveli-royal-vivah',
  },
  {
    src: 'artwork_hindu_vedic_mandap_1792862770963.jpg',
    folder: 'hindu',
    name: 'vedic-mandap-ceremony',
  },
  {
    src: 'artwork_hindu_lotus_courtyard_1792862835997.jpg',
    folder: 'hindu',
    name: 'lotus-courtyard-sangeet',
  },
  {
    src: 'pilot_starlit_night_pier_1792862684018.jpg',
    folder: 'universal',
    name: 'starlit-celestial-pier',
  },
  {
    src: 'artwork_universal_glasshouse_1792862813338.jpg',
    folder: 'universal',
    name: 'botanical-glasshouse-promenade',
  },
];

async function processAll() {
  console.log('Starting gallery asset processing...');
  
  for (const asset of ASSETS) {
    const srcPath = path.join(BRAIN_DIR, asset.src);
    if (!fs.existsSync(srcPath)) {
      console.error(`Source file not found: ${srcPath}`);
      continue;
    }

    const destFolder = path.join(TARGET_BASE, asset.folder);
    fs.mkdirSync(destFolder, { recursive: true });

    const fullPath = path.join(destFolder, `${asset.name}.webp`);
    const thumbPath = path.join(destFolder, `${asset.name}-thumb.webp`);

    console.log(`Processing: ${asset.name} (${asset.folder})`);

    // High resolution webp (max width 1200, height 1600)
    await sharp(srcPath)
      .resize({ width: 1200, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 5 })
      .toFile(fullPath);

    // Optimized WebP thumbnail (width 400, height 533)
    await sharp(srcPath)
      .resize({ width: 400, height: 533, fit: 'cover' })
      .webp({ quality: 78, effort: 4 })
      .toFile(thumbPath);

    const fullStats = fs.statSync(fullPath);
    const thumbStats = fs.statSync(thumbPath);
    console.log(`  ✓ Master: ${(fullStats.size / 1024).toFixed(1)} KB`);
    console.log(`  ✓ Thumb:  ${(thumbStats.size / 1024).toFixed(1)} KB`);
  }

  console.log('All gallery assets processed successfully!');
}

processAll().catch(console.error);
