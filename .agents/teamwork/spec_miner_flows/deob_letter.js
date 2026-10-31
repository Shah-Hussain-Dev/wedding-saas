const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, 'downloaded_assets', 'js_b672bc1327.js'), 'utf8');

// The array function in js_b672bc1327.js is q9c
// Let's extract q9c and q9d
const q9cMatch = code.match(/function\s+q9c\s*\(\)\s*\{[\s\S]*?return\s+q9c\(\);\s*\}/);
const q9dMatch = code.match(/function\s+q9d\s*\([a-z,\s]+\)\s*\{[\s\S]*?return\s+[a-z]+;\s*\}/);

if (q9cMatch && q9dMatch) {
  const runner = `
  ${q9cMatch[0]}
  ${q9dMatch[0]}
  // Also run the de-shuffler loop right after q9d
  `;
  // Let's find the de-shuffler loop
  const loopMatch = code.match(/\(function\(a,b\)\{[\s\S]*?\}\(q9c,\s*(0x[0-9a-f]+|\d+)\)\)/);
  if (loopMatch) {
    const sandbox = `
      ${q9cMatch[0]}
      ${q9dMatch[0]}
      ${loopMatch[0]}
      module.exports = q9d;
    `;
    fs.writeFileSync(path.join(__dirname, 'q9d_runner.js'), sandbox, 'utf8');
    const q9d = require('./q9d_runner.js');
    console.log('q9d loaded successfully!');
    // Now replace all q9d(0x...) in code and print interesting lines!
    let deob = code.replace(/q9d\s*\(\s*(0x[0-9a-f]+|\d+)\s*\)/gi, (m, g) => {
      try {
        const val = q9d(parseInt(g));
        return JSON.stringify(val);
      } catch(e) {
        return m;
      }
    });
    // Also if there's an alias variable like var ag = q9d
    // let's check
    const aliasMatch = code.match(/var\s+([a-zA-Z0-9_$]+)\s*=\s*q9d/);
    if (aliasMatch) {
      const alias = aliasMatch[1];
      console.log('Alias:', alias);
      const aliasRegex = new RegExp(alias + '\\s*\\(\\s*(0x[0-9a-f]+|\\d+)\\s*\\)', 'g');
      deob = deob.replace(aliasRegex, (m, g) => {
        try {
          const val = q9d(parseInt(g));
          return JSON.stringify(val);
        } catch(e) {
          return m;
        }
      });
    }
    fs.writeFileSync(path.join(__dirname, 'js_b672bc1327_deob.js'), deob, 'utf8');
    console.log('Deobfuscated written, size:', deob.length);
  }
}
