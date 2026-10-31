const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, 'downloaded_assets', 'js_2812262112.js'), 'utf8');

// print occurrences of bangle, dove, seats, submit, roll
console.log('Size:', code.length);
const parts = code.split(/(?=function|addEventListener|setTimeout)/);
for (const p of parts) {
  if (/bangle|dove|seats|submit|shukriya|roll/i.test(p)) {
    console.log('--- Segment ---');
    console.log(p.slice(0, 400).replace(/\s+/g, ' '));
  }
}
