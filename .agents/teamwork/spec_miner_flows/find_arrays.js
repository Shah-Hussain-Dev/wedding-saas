const fs = require('fs');
const path = require('path');
const ASSETS_DIR = path.join(__dirname, 'downloaded_assets');

const files = [
  'js_4fcdd2c4c0.js',
  'js_fd5e8812d4.js',
  'js_b672bc1327.js',
  'js_0a1eef2209.js',
  'js_dd11b867a6.js',
  'js_3904bd8af0.js',
  'js_2812262112.js',
  'js_a96c99de75.js',
  'js_3cf0d46f42.js'
];

for (const f of files) {
  const code = fs.readFileSync(path.join(ASSETS_DIR, f), 'utf8');
  // Find all arrays in the code that have string elements
  const match = code.match(/var\s+([a-zA-Z0-9_$]+)\s*=\s*\[([^\]]{50,})\];/);
  if (match) {
    try {
      const arr = eval('[' + match[2] + ']');
      console.log(`\n=== ${f} Array (${arr.length} items) ===`);
      const interesting = arr.filter(s => typeof s === 'string' && s.length > 2 && !/^[0-9]+$/.test(s));
      console.log(interesting.slice(0, 30));
    } catch (e) {
      console.log(`${f}: eval error ${e.message}`);
    }
  } else {
    console.log(`${f}: no match`);
  }
}
