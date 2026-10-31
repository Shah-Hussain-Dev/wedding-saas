const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'downloaded_assets');

function readAsset(name) {
  const file = path.join(ASSETS_DIR, name.replace(/\//g, '_'));
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8');
  return '';
}

console.log('=== 1. COVER / DOORS / MEDALLION ===');
console.log(readAsset('assets/cover/beda901c97.css').slice(0, 3000));

console.log('\n=== 2. HERO ===');
console.log(readAsset('assets/hero/7bbc2d4d2a.css').slice(0, 3000));

console.log('\n=== 3. LETTER ===');
console.log(readAsset('assets/letter/ccaa93138c.css').slice(0, 3000));

console.log('\n=== 4. FAMILIES ===');
console.log(readAsset('assets/families/9b2914cc1e.css').slice(0, 3000));

console.log('\n=== 5. EVENTS ===');
console.log(readAsset('assets/events/717b519022.css').slice(0, 3000));

console.log('\n=== 6. COUNTDOWN ===');
console.log(readAsset('assets/countdown/cfd796cda3.css').slice(0, 3000));

console.log('\n=== 7. RSVP ===');
console.log(readAsset('assets/rsvp/0ee6818ba8.css').slice(0, 3000));

console.log('\n=== 8. CLOSING ===');
console.log(readAsset('assets/closing/4bd959f9db.css').slice(0, 3000));
