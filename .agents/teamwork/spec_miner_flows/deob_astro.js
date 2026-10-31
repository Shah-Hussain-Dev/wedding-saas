const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, 'downloaded_assets', 'js_3904bd8af0.js'), 'utf8');

// Find string array at the end of js_3904bd8af0.js
const qMatch = code.match(/function\s+q([0-9]+)c\s*\(\)\s*\{[\s\S]*?return\s+q\1c\(\);\s*\}/);
const qdMatch = code.match(/function\s+q([0-9]+)d\s*\([a-z,\s]+\)\s*\{[\s\S]*?return\s+[a-z]+;\s*\}/);
console.log('qMatch:', !!qMatch, 'qdMatch:', !!qdMatch);

if (qMatch && qdMatch) {
  const num = qMatch[1];
  const loopMatch = code.match(new RegExp(`\\(function\\(a,b\\)\\{[\\s\\S]*?\\}\\(q${num}c,\\s*(0x[0-9a-f]+|\\d+)\\)\\)`));
  const sandbox = `
    ${qMatch[0]}
    ${qdMatch[0]}
    ${loopMatch[0]}
    module.exports = q${num}d;
  `;
  fs.writeFileSync(path.join(__dirname, 'q_astro_runner.js'), sandbox, 'utf8');
  const qd = require('./q_astro_runner.js');
  console.log('qd loaded successfully!');
  const aliasMatch = code.match(/var\s+([a-zA-Z0-9_$]+)\s*=\s*q\d+d/);
  const alias = aliasMatch ? aliasMatch[1] : `q${num}d`;
  console.log('Alias:', alias);
  let deob = code.replace(new RegExp(alias + '\\s*\\(\\s*(0x[0-9a-f]+|\\d+)\\s*\\)', 'g'), (m, g) => {
    try {
      return JSON.stringify(qd(parseInt(g)));
    } catch(e) {
      return m;
    }
  });
  fs.writeFileSync(path.join(__dirname, 'js_3904bd8af0_deob.js'), deob, 'utf8');
  console.log('Deob written, size:', deob.length);
}
