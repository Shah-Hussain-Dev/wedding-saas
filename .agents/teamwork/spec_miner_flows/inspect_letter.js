const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, 'downloaded_assets', 'js_b672bc1327.js'), 'utf8');

console.log('Size:', code.length);
const parts = code.split(/(?=function|addEventListener|setTimeout)/);
for (const p of parts) {
  if (/casket|letter|sheet|sfx/i.test(p)) {
    console.log('--- Segment ---');
    console.log(p.slice(0, 400).replace(/\s+/g, ' '));
  }
}
