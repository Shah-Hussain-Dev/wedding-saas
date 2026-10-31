const fs = require('fs');
const path = require('path');
const ASSETS_DIR = path.join(__dirname, 'downloaded_assets');

['js_fd5e8812d4.js', 'js_86109e910c.js', 'js_5d667f0d1b.js'].forEach(f => {
  const code = fs.readFileSync(path.join(ASSETS_DIR, f), 'utf8');
  console.log(`\n=== FILE: ${f} (${code.length} chars) ===`);
  console.log(code.slice(0, 2000));
});
