import fs from 'fs';

const data = JSON.parse(fs.readFileSync('probe_results.json', 'utf8'));

const urls = new Set();
for (const a of data.assetsFound) {
  if (typeof a === 'string' && a.startsWith('http')) {
    let clean = a.replace(/[\"')]+$/, '');
    urls.add(clean);
  }
}

// Add known responsive variants for doors and medallion from line 20 script:
// doors, doors-tab, doors-land
// medallion, medallion-tab, medallion-land
const base = 'https://aqdinvites.com/invites/sheesh-mahal/';
['doors', 'doors-tab', 'doors-land', 'medallion', 'medallion-tab', 'medallion-land'].forEach(name => {
  urls.add(new URL(`assets/cover/${name}.webp`, base).href);
});

// Also check any audio files that might be relative
data.audioCandidates.forEach(ac => {
  if (ac.endsWith('.mp3')) {
    urls.add(new URL(ac, base).href);
  }
});

async function check() {
  const list = Array.from(urls);
  console.log('Total URLs to check:', list.length);
  const results = [];
  
  for (const u of list) {
    try {
      const res = await fetch(u, { method: 'HEAD' });
      const ct = res.headers.get('content-type') || '';
      const cl = res.headers.get('content-length') || '';
      results.push({ url: u, status: res.status, type: ct, size: cl });
    } catch (e) {
      results.push({ url: u, status: 'ERROR', error: e.message });
    }
  }

  fs.writeFileSync('checked_assets.json', JSON.stringify(results, null, 2));
  const s200 = results.filter(r => r.status === 200);
  const failed = results.filter(r => r.status !== 200);
  console.log(`Checked all. 200 OK: ${s200.length}, Non-200: ${failed.length}`);
  if (failed.length > 0) {
    console.log('Failed samples:', failed.slice(0, 10));
  }
}

check();
