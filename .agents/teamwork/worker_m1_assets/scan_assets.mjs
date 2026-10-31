import fs from 'fs';

const probe = JSON.parse(fs.readFileSync('.agents/teamwork/spec_miner_assets/probe_results.json', 'utf8'));
const base = 'https://aqdinvites.com/invites/sheesh-mahal/';
const urls = new Set();

for (const a of probe.assetsFound) {
  if (typeof a === 'string' && a.startsWith('http')) {
    urls.add(a.replace(/[\"')]+$/, ''));
  }
}
for (const img of probe.jsImages) {
  if (img.endsWith('.webp')) {
    urls.add(new URL(img, base).href);
  }
}
for (const aud of probe.audioCandidates) {
  if (aud.endsWith('.mp3')) {
    urls.add(new URL(aud, base).href);
  }
}

// Add known responsive variants for doors and medallion if not present
['doors', 'doors-tab', 'doors-land', 'medallion', 'medallion-tab', 'medallion-land', 'mirrors', 'mirrors-tab', 'mirrors-land'].forEach(name => {
  urls.add(new URL(`assets/cover/${name}.webp`, base).href);
});

// Also check closing and hero variants
['scene', 'scene-tab', 'scene-land'].forEach(name => {
  urls.add(new URL(`assets/closing/${name}.webp`, base).href);
});
['hall', 'hall-tab', 'hall-land', 'mirrors', 'mirrors-tab', 'mirrors-land'].forEach(name => {
  urls.add(new URL(`assets/hero/${name}.webp`, base).href);
});

console.log('Total unique candidate URLs:', urls.size);

async function checkAll() {
  const ok = [];
  const fail = [];
  for (const u of urls) {
    // Only check assets under /assets/
    if (!u.includes('/assets/')) continue;
    try {
      const res = await fetch(u, { method: 'HEAD' });
      if (res.status === 200) {
        ok.push({ url: u, type: res.headers.get('content-type'), size: res.headers.get('content-length') });
      } else {
        fail.push({ url: u, status: res.status });
      }
    } catch (e) {
      fail.push({ url: u, error: e.message });
    }
  }

  const webp = ok.filter(x => x.url.endsWith('.webp'));
  const mp3 = ok.filter(x => x.url.endsWith('.mp3'));
  console.log('200 OK under /assets/:', ok.length);
  console.log('WebP count:', webp.length);
  console.log('MP3 count:', mp3.length);

  const byDir = {};
  for (const w of webp) {
    const p = new URL(w.url).pathname;
    const parts = p.split('/');
    const dir = parts[parts.length - 2];
    byDir[dir] = (byDir[dir] || []).concat(parts[parts.length - 1]);
  }
  for (const d of Object.keys(byDir).sort()) {
    console.log(`${d} (${byDir[d].length}):`, byDir[d].sort());
  }

  const audioList = mp3.map(m => {
    const p = new URL(m.url).pathname;
    const parts = p.split('/');
    return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
  });
  console.log('Audio list:', audioList);

  fs.writeFileSync('.agents/teamwork/worker_m1_assets/assets_verified.json', JSON.stringify({ ok, webp, mp3, byDir }, null, 2));
}

checkAll();
