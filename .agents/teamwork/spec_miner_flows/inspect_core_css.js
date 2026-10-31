const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'downloaded_assets');

const cssList = fs.readdirSync(ASSETS_DIR).filter(f => f.startsWith('css_'));

for (const file of cssList) {
  const content = fs.readFileSync(path.join(ASSETS_DIR, file), 'utf8');
  console.log(`\n=== FILE: ${file} (size: ${content.length}) ===`);
  console.log(content.slice(0, 1500));
}
