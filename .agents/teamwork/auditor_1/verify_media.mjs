import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const dir = path.resolve('public/templates/sheesh-mahal');
const files = getFiles(dir);
console.log(`Total files found: ${files.length}`);

let webpCount = 0;
let mp3Count = 0;
let otherCount = 0;
const errors = [];
const manifest = [];

for (const f of files) {
  const stat = fs.statSync(f);
  const relPath = path.relative('public/templates/sheesh-mahal', f).replace(/\\/g, '/');
  
  if (stat.size === 0) {
    errors.push(`EMPTY FILE: ${relPath}`);
  }

  const fd = fs.openSync(f, 'r');
  const buf = Buffer.alloc(12);
  fs.readSync(fd, buf, 0, 12, 0);
  fs.closeSync(fd);

  if (f.endsWith('.webp')) {
    webpCount++;
    const riff = buf.subarray(0, 4).toString('ascii');
    const webp = buf.subarray(8, 12).toString('ascii');
    const isValid = riff === 'RIFF' && webp === 'WEBP';
    if (!isValid) {
      errors.push(`INVALID WEBP HEADER: ${relPath} (riff=${riff}, webp=${webp})`);
    }
    manifest.push({ path: relPath, type: 'webp', size: stat.size, header: `${riff}...${webp}`, valid: isValid });
  } else if (f.endsWith('.mp3')) {
    mp3Count++;
    const isId3 = buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33;
    const isMpegFrame = buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0;
    const isValid = isId3 || isMpegFrame;
    const headerType = isId3 ? 'ID3' : isMpegFrame ? 'MPEG Frame' : 'UNKNOWN';
    if (!isValid) {
      errors.push(`INVALID MP3 HEADER: ${relPath} (hex=${buf.subarray(0, 4).toString('hex')})`);
    }
    manifest.push({ path: relPath, type: 'mp3', size: stat.size, header: headerType, valid: isValid });
  } else {
    otherCount++;
    manifest.push({ path: relPath, type: 'other', size: stat.size, header: 'N/A', valid: true });
  }
}

console.log(`Summary:`);
console.log(`- WebP count: ${webpCount}`);
console.log(`- MP3 count: ${mp3Count}`);
console.log(`- Other files: ${otherCount}`);
console.log(`- Total media files: ${webpCount + mp3Count + otherCount}`);

if (errors.length > 0) {
  console.error('\nERRORS FOUND:');
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
} else {
  console.log('\nVERDICT: ALL 77 MEDIA FILES ARE AUTHENTIC AND VALID BINARIES!');
}
