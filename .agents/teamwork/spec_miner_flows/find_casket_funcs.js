const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, 'downloaded_assets', 'js_b672bc1327.js'), 'utf8');

// Print occurrences of addEventListener or click
const matches = [...code.matchAll(/addEventListener\([^)]+\)/g)];
matches.forEach(m => console.log(m[0]));

// Print functions that modify casket or letter
const funcMatches = code.match(/function\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{[^}]{1,400}\}/g);
if (funcMatches) {
  funcMatches.filter(f => /casket|letter|sheet|aria-expanded/i.test(f)).forEach(f => console.log('\n--- FUNC ---\n', f));
}
