import fs from 'fs';
import path from 'path';

const FONTS_DIR = path.resolve('public/fonts');
if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

// Curated list of premier luxury wedding fonts
const fontList = [
  // Calligraphic & Romantic Scripts
  { family: 'Great Vibes', name: 'great-vibes-v18-latin-regular', query: 'family=Great+Vibes' },
  { family: 'Alex Brush', name: 'alex-brush-v22-latin-regular', query: 'family=Alex+Brush' },
  { family: 'Pinyon Script', name: 'pinyon-script-v22-latin-regular', query: 'family=Pinyon+Script' },
  { family: 'Parisienne', name: 'parisienne-v15-latin-regular', query: 'family=Parisienne' },
  { family: 'Allura', name: 'allura-v21-latin-regular', query: 'family=Allura' },
  { family: 'Italianno', name: 'italianno-v21-latin-regular', query: 'family=Italianno' },
  { family: 'MonteCarlo', name: 'montecarlo-v20-latin-regular', query: 'family=MonteCarlo' },

  // Royal Serif & Heritage Display
  { family: 'Cinzel Decorative', name: 'cinzel-decorative-700', query: 'family=Cinzel+Decorative:wght@700' },
  { family: 'Cinzel', name: 'cinzel-600', query: 'family=Cinzel:wght@600' },
  { family: 'Playfair Display', name: 'playfair-display-700', query: 'family=Playfair+Display:ital,wght@0,700;1,600' },
  { family: 'Cormorant Garamond', name: 'cormorant-garamond-600', query: 'family=Cormorant+Garamond:ital,wght@0,600;1,600' },
  { family: 'Marcellus', name: 'marcellus-regular', query: 'family=Marcellus' },
  { family: 'Bodoni Moda', name: 'bodoni-moda-700', query: 'family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;1,6..96,600' },
  { family: 'Rozha One', name: 'rozha-one-regular', query: 'family=Rozha+One' },

  // Sacred Invocation & Eastern
  { family: 'Amiri', name: 'amiri-regular', query: 'family=Amiri:ital,wght@0,400;0,700;1,400' },

  // Modern Clean Luxury Sans
  { family: 'Plus Jakarta Sans', name: 'plus-jakarta-sans-600', query: 'family=Plus+Jakarta+Sans:wght@500;600;700' },
  { family: 'Montserrat', name: 'montserrat-600', query: 'family=Montserrat:wght@500;600;700' }
];

async function downloadFonts() {
  console.log('Downloading luxury wedding fonts from Google Fonts API...');

  // Use a modern browser user-agent to get WOFF2 formats
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

  const fullCssUrl = `https://fonts.googleapis.com/css2?${fontList.map(f => f.query).join('&')}&display=swap`;
  
  const cssRes = await fetch(fullCssUrl, {
    headers: { 'User-Agent': userAgent }
  });

  if (!cssRes.ok) {
    throw new Error(`Failed to fetch font CSS: ${cssRes.statusText}`);
  }

  let cssContent = await cssRes.text();
  console.log('Font CSS fetched, parsing individual font files...');

  // Regular expression to extract url(...) inside @font-face
  const urlRegex = /url\((https:\/\/[^)]+)\)\s+format\('([^']+)'\)/g;
  let match;
  const urls = [];
  while ((match = urlRegex.exec(cssContent)) !== null) {
    urls.push({
      url: match[1],
      format: match[2]
    });
  }

  console.log(`Found ${urls.length} font asset slices. Downloading to public/fonts/...`);

  let fontIndex = 0;
  for (const item of urls) {
    try {
      const fontFilename = `wedding-font-${fontIndex + 1}.${item.format === 'woff2' ? 'woff2' : 'ttf'}`;
      const destPath = path.join(FONTS_DIR, fontFilename);

      const fontFileRes = await fetch(item.url);
      if (fontFileRes.ok) {
        const buffer = await fontFileRes.arrayBuffer();
        fs.writeFileSync(destPath, Buffer.from(buffer));
        // Replace online URL with local path in cssContent
        cssContent = cssContent.replace(item.url, `/fonts/${fontFilename}`);
        fontIndex++;
      }
    } catch (e) {
      console.warn(`Could not download ${item.url}:`, e);
    }
  }

  // Save the master local fonts.css
  const localCssPath = path.join(FONTS_DIR, 'fonts.css');
  fs.writeFileSync(localCssPath, cssContent);
  console.log(`Successfully downloaded ${fontIndex} local font files and wrote public/fonts/fonts.css!`);
}

downloadFonts().catch(err => {
  console.error('Font download script failed:', err);
});
