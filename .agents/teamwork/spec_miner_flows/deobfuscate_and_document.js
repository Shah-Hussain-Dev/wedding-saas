const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'downloaded_assets');

// Helper to extract string arrays from obfuscated scripts
function extractStrings(filename) {
  const content = fs.readFileSync(path.join(ASSETS_DIR, filename), 'utf8');
  // Match string array functions typically: function q...(){var T=[...]; return T;}
  const arrayMatch = content.match(/function\s+[a-zA-Z0-9_]+\(\)\s*\{\s*var\s+[a-zA-Z0-9_]+\s*=\s*(\[[^\]]+\]);/);
  if (arrayMatch) {
    try {
      const arr = eval(arrayMatch[1]);
      return arr.filter(s => typeof s === 'string' && s.length > 1 && !/^[0-9a-f]+$/i.test(s));
    } catch (e) {
      return [];
    }
  }
  return [];
}

const modules = [
  { name: 'DOORS', file: 'js_4fcdd2c4c0.js' },
  { name: 'AUDIO', file: 'js_fd5e8812d4.js' },
  { name: 'LETTER', file: 'js_b672bc1327.js' },
  { name: 'FAMILIES', file: 'js_0a1eef2209.js' },
  { name: 'EVENTS', file: 'js_dd11b867a6.js' },
  { name: 'COUNTDOWN', file: 'js_3904bd8af0.js' },
  { name: 'RSVP', file: 'js_2812262112.js' },
  { name: 'CLOSING', file: 'js_a96c99de75.js' }
];

console.log('=== STRING ARRAYS AND METRICS ===');
for (const m of modules) {
  const strings = extractStrings(m.file);
  console.log(`\n--- ${m.name} (${m.file}) ---`);
  console.log(strings.slice(0, 40));
}
