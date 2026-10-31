import fs from 'fs';
import path from 'path';

const baseUrl = 'https://aqdinvites.com/invites/sheesh-mahal/';

const cssFiles = [
  'assets/cover/beda901c97.css',
  'assets/hero/7bbc2d4d2a.css',
  'assets/letter/ccaa93138c.css',
  'assets/families/9b2914cc1e.css',
  'assets/events/717b519022.css',
  'assets/countdown/cfd796cda3.css',
  'assets/rsvp/0ee6818ba8.css',
  'assets/closing/4bd959f9db.css',
  'css/007234ef6e.css',
  'css/1b51875257.css',
  'css/8647abf050.css',
  'css/82755858dd.css',
  'css/39e5cd7270.css',
  'css/647b3e70da.css',
  'css/4f1e219d7e.css',
  'css/41e3debf30.css',
  'css/f304a094ab.css',
  'css/9e86b95303.css'
];

const jsFiles = [
  'js/9ce6a602cb.js',
  'js/9d960c97da.js',
  'js/cab8ad18d0.js',
  'js/86109e910c.js',
  'js/5d667f0d1b.js',
  'js/fd5e8812d4.js',
  'js/67062d11f3.js',
  'js/4fcdd2c4c0.js',
  'js/9f609920c1.js',
  'js/b672bc1327.js',
  'js/0a1eef2209.js',
  'js/b8647fffa5.js',
  'js/dd11b867a6.js',
  'js/3904bd8af0.js',
  'js/2812262112.js',
  'js/a96c99de75.js',
  'js/dde9f85e25.js',
  'js/3efa463bf6.js',
  'js/3cf0d46f42.js'
];

async function run() {
  const results = {
    cssUrls: {},
    assetsFound: new Set(),
    keyframes: {},
    audioCandidates: new Set(),
    jsStrings: new Set(),
    cssTexts: {}
  };

  console.log('Fetching CSS files...');
  for (const f of cssFiles) {
    try {
      const url = new URL(f, baseUrl).href;
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Failed ${url}: ${res.status}`);
        continue;
      }
      const text = await res.text();
      results.cssTexts[f] = text;

      // Match url(...)
      const urlMatches = [...text.matchAll(/url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/gi)];
      results.cssUrls[f] = urlMatches.map(m => m[1]);
      for (const m of urlMatches) {
        try {
          const resolved = new URL(m[1], url).href;
          results.assetsFound.add(resolved);
        } catch (e) {
          results.assetsFound.add(m[1]);
        }
      }

      // Match @keyframes
      const kfMatches = [...text.matchAll(/@keyframes\s+([a-zA-Z0-9_-]+)\s*\{([^}]+(?:\{[^}]+\}[^}]*)*)\}/gi)];
      for (const km of kfMatches) {
        results.keyframes[km[1]] = km[2].trim();
      }
    } catch (e) {
      console.error(`Error fetching CSS ${f}:`, e.message);
    }
  }

  console.log('Fetching JS files...');
  for (const f of jsFiles) {
    try {
      const url = new URL(f, baseUrl).href;
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Failed ${url}: ${res.status}`);
        continue;
      }
      const text = await res.text();

      // Look for audio patterns
      const audioMatches = [...text.matchAll(/['"`]([^'"`]*\.(?:mp3|m4a|ogg|wav)[^'"`]*)['"`]/gi)];
      for (const m of audioMatches) {
        results.audioCandidates.add(m[1]);
        try {
          results.assetsFound.add(new URL(m[1], url).href);
        } catch {}
      }

      // Look for image/asset patterns in JS
      const assetMatches = [...text.matchAll(/['"`]([^'"`]*\.(?:webp|png|jpg|jpeg|svg)[^'"`]*)['"`]/gi)];
      for (const m of assetMatches) {
        results.jsStrings.add(m[1]);
        try {
          results.assetsFound.add(new URL(m[1], url).href);
        } catch {}
      }

      // Also search for general "audio", "sound", "track", "music" occurrences
      const musicMatches = [...text.matchAll(/(?:audio|sound|music|track|howler|tone|play|volume)[^;{}()]{0,60}/gi)];
      if (musicMatches.length > 0) {
        // console.log(`JS ${f} has sound references:`, musicMatches.slice(0, 5).map(m => m[0]));
      }
    } catch (e) {
      console.error(`Error fetching JS ${f}:`, e.message);
    }
  }

  // Convert Sets to Arrays for serialization
  const out = {
    assetsFound: Array.from(results.assetsFound),
    audioCandidates: Array.from(results.audioCandidates),
    jsImages: Array.from(results.jsStrings),
    cssUrls: results.cssUrls,
    keyframes: Object.keys(results.keyframes),
    keyframeDetails: results.keyframes
  };

  fs.writeFileSync('probe_results.json', JSON.stringify(out, null, 2));
  console.log(`Done! Found ${out.assetsFound.length} assets, ${out.audioCandidates.length} audio candidates, ${out.keyframes.length} keyframes.`);
}

run();
