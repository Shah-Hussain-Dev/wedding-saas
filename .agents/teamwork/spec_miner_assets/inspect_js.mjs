import fs from 'fs';

const baseUrl = 'https://aqdinvites.com/invites/sheesh-mahal/';

const jsFiles = [
  'js/9ce6a602cb.js',
  'js/9d960c97da.js',
  'js/cab8ad18d0.js',
  'js/86109e910c.js',
  'js/5d667f0d1b.js',
  'js/fd5e8812d4.js',
  'js/67062d11f3.js',
  'js/4fcdd2c4c0.js',
  'js/9f609920c1.js',
  'js/b672bc1327.js',
  'js/0a1eef2209.js',
  'js/b8647fffa5.js',
  'js/dd11b867a6.js',
  'js/3904bd8af0.js',
  'js/2812262112.js',
  'js/a96c99de75.js',
  'js/dde9f85e25.js',
  'js/3efa463bf6.js',
  'js/3cf0d46f42.js'
];

async function inspectJs() {
  const summary = [];
  for (const f of jsFiles) {
    const res = await fetch(new URL(f, baseUrl).href);
    const text = await res.text();
    
    // Find clues: function names, event listeners, querySelectors, element ids
    const ids = [...text.matchAll(/#([a-zA-Z0-9_-]+)/g)].map(m => m[1]);
    const classes = [...text.matchAll(/\.([a-zA-Z0-9_-]{3,})/g)].map(m => m[1]);
    const uniqueIds = Array.from(new Set(ids)).filter(id => id.length > 2);
    
    summary.push({
      file: f,
      length: text.length,
      snippet: text.slice(0, 180),
      detectedIds: uniqueIds.slice(0, 8),
      detectedFeatures: [
        text.includes('Audio') || text.includes('sfx') ? 'Audio/Sound' : null,
        text.includes('canvas') || text.includes('getContext') ? 'Canvas' : null,
        text.includes('localStorage') ? 'LocalStorage' : null,
        text.includes('requestAnimationFrame') ? 'RAF Animation' : null,
        text.includes('fetch(') ? 'Network fetch' : null,
        text.includes('countdown') || text.includes('astrolabe') ? 'Countdown' : null,
        text.includes('rsvp') || text.includes('bangle') ? 'RSVP' : null,
        text.includes('diya') ? 'Diya/Water' : null,
        text.includes('medallion') || text.includes('doors') ? 'Gate/Doors' : null,
        text.includes('casket') || text.includes('letter') ? 'Letter/Casket' : null,
        text.includes('lamp') || text.includes('lantern') ? 'Families/Lamps' : null,
        text.includes('calendar') || text.includes('.ics') ? 'Calendar' : null
      ].filter(Boolean)
    });
  }

  console.log(JSON.stringify(summary, null, 2));
}

inspectJs();
