const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'downloaded_assets');
const jsFiles = fs.readdirSync(ASSETS_DIR).filter(f => f.startsWith('js_'));

function searchJs(pattern, name) {
  console.log(`\n=================== SEARCH: ${name} (${pattern}) ===================`);
  for (const f of jsFiles) {
    const code = fs.readFileSync(path.join(ASSETS_DIR, f), 'utf8');
    const regex = new RegExp(pattern, 'gi');
    let match;
    let found = false;
    while ((match = regex.exec(code)) !== null) {
      if (!found) {
        console.log(`--- File: ${f} ---`);
        found = true;
      }
      const start = Math.max(0, match.index - 100);
      const end = Math.min(code.length, match.index + 200);
      console.log('Snippet:', code.slice(start, end).replace(/\s+/g, ' '));
      if (found) break; // one per file
    }
  }
}

searchJs('soundToggle|music-toggle|audio|Howl', 'AUDIO & MUSIC');
searchJs('medallion|gate|is-opening|is-shut', 'DOOR OPENING SEQUENCE');
searchJs('casket|letterSheet', 'CASKET & LETTER OPENING');
searchJs('fm-lamp|is-lit', 'FAMILIES LAMPS');
searchJs('ev-win|ev-leaf', 'EVENT ARMORED WINDOWS');
searchJs('cd-astro|astrolabe|valuenow', 'COUNTDOWN ASTROLABE');
searchJs('rs-toggle|bangle|rs-send|Shukriya', 'RSVP & BANGLE');
searchJs('cl-float|diya', 'CLOSING DIYAS');
