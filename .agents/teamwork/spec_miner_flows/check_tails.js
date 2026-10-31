const fs = require('fs');
const path = require('path');
const ASSETS_DIR = path.join(__dirname, 'downloaded_assets');

['js_4fcdd2c4c0.js', 'js_fd5e8812d4.js', 'js_b672bc1327.js', 'js_dd11b867a6.js', 'js_3904bd8af0.js', 'js_2812262112.js', 'js_a96c99de75.js', 'js_3cf0d46f42.js'].forEach(f => {
  const code = fs.readFileSync(path.join(ASSETS_DIR, f), 'utf8');
  console.log(`\n=== TAIL OF ${f} ===`);
  console.log(code.slice(-600));
});
