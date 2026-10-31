const fs = require('fs');
const path = require('path');
const ASSETS_DIR = path.join(__dirname, 'downloaded_assets');

const files = fs.readdirSync(ASSETS_DIR).filter(f => f.startsWith('js_'));

for (const f of files) {
  const code = fs.readFileSync(path.join(ASSETS_DIR, f), 'utf8');
  const matches = code.match(/["'][^"']+\.(?:mp3|wav|ogg|m4a|aac)[^"']*["']/gi);
  if (matches) {
    console.log(`\n=== Audio in ${f} ===`);
    console.log([...new Set(matches)]);
  }
}
