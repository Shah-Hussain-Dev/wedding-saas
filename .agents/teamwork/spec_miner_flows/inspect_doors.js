const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, 'downloaded_assets', 'js_4fcdd2c4c0.js'), 'utf8');

// Look for addEventListener or click/pointerdown on medallion / gate
console.log('Size:', code.length);
// print parts containing medallion or gate
const parts = code.split(/(?=function|addEventListener|setTimeout)/);
for (const p of parts) {
  if (/medallion|is-opening|doors/i.test(p)) {
    console.log('--- Segment ---');
    console.log(p.slice(0, 500).replace(/\s+/g, ' '));
  }
}
