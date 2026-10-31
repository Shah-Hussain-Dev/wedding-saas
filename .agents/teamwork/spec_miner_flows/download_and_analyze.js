const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://aqdinvites.com/invites/sheesh-mahal/';
const OUT_DIR = __dirname;
const ASSETS_DIR = path.join(OUT_DIR, 'downloaded_assets');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

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

function fetchFile(relPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = BASE_URL + relPath;
    const dest = path.join(ASSETS_DIR, relPath.replace(/\//g, '_'));
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      return resolve({ path: relPath, content: fs.readFileSync(dest, 'utf8') });
    }
    const req = https.get(fullUrl, (res) => {
      if (res.statusCode !== 200) {
        return resolve({ path: relPath, error: `HTTP ${res.statusCode}` });
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(dest, data, 'utf8');
        resolve({ path: relPath, content: data });
      });
    });
    req.on('error', err => resolve({ path: relPath, error: err.message }));
  });
}

async function main() {
  console.log('Downloading CSS files...');
  const cssResults = await Promise.all(cssFiles.map(fetchFile));
  console.log(`Downloaded ${cssResults.filter(r => r.content).length}/${cssFiles.length} CSS files.`);

  console.log('Downloading JS files...');
  const jsResults = await Promise.all(jsFiles.map(fetchFile));
  console.log(`Downloaded ${jsResults.filter(r => r.content).length}/${jsFiles.length} JS files.`);

  // Combine CSS analysis
  let allCss = '';
  for (const r of cssResults) {
    if (r.content) {
      allCss += `\n/* === FILE: ${r.path} === */\n` + r.content;
    }
  }
  fs.writeFileSync(path.join(OUT_DIR, 'combined.css'), allCss, 'utf8');
  console.log('Saved combined.css, size:', allCss.length);

  // Extract key CSS rules
  // 1. Media queries
  const mediaQueries = [...allCss.matchAll(/@media[^{]+\{/g)].map(m => m[0]);
  console.log('\nMedia Queries found:', [...new Set(mediaQueries)]);

  // 2. Audio toggle / button sizes
  console.log('\nAnalyzing interactive elements and touch targets:');
  const selectors = [
    '\\.sound-toggle',
    '\\.medallion',
    '\\.lt-casket',
    '\\.fm-lamp',
    '\\.ev-win',
    '\\.ev-btn',
    '\\.cd-astro',
    '\\.rs-toggle',
    '\\.rs-step',
    '\\.rs-send',
    '\\.cl-float',
    '\\.cl-replay'
  ];

  for (const sel of selectors) {
    const regex = new RegExp(`(${sel}[^{]*\\{[^}]+\\})`, 'g');
    const matches = [...allCss.matchAll(regex)].map(m => m[0]);
    console.log(`\n=== Selector: ${sel} (${matches.length} rules) ===`);
    matches.forEach(m => console.log(m.replace(/\s+/g, ' ')));
  }

  // Inspect JS files for features / interactions
  console.log('\nAnalyzing JS files for audio, animations, astrolabe, countdown, rsvp, etc:');
  let jsSummary = [];
  for (const r of jsResults) {
    if (!r.content) continue;
    const c = r.content;
    const hasAudio = /audio|sound|play|mute|volume|Howler/i.test(c);
    const hasAstrolabe = /astro|astrolabe|angle|rotate|drag|touch/i.test(c);
    const hasCountdown = /countdown|target|days|hours|minutes|seconds/i.test(c);
    const hasRsvp = /rsvp|bangle|stand|attending|shukriya|seats/i.test(c);
    const hasDoors = /doors|medallion|gate|open|shut/i.test(c);
    const hasDiyas = /diya|diyas|float/i.test(c);
    const hasLamps = /lamp|lantern|lit|unlit/i.test(c);
    const hasLetter = /casket|letter|sheet/i.test(c);

    jsSummary.push({
      file: r.path,
      size: c.length,
      topics: {
        doors: hasDoors,
        audio: hasAudio,
        letter: hasLetter,
        lamps: hasLamps,
        astrolabe: hasAstrolabe,
        countdown: hasCountdown,
        rsvp: hasRsvp,
        diyas: hasDiyas
      }
    });
  }
  fs.writeFileSync(path.join(OUT_DIR, 'js_analysis.json'), JSON.stringify(jsSummary, null, 2), 'utf8');
  console.log('JS analysis written to js_analysis.json');
}

main().catch(console.error);
