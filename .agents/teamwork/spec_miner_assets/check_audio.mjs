import fs from 'fs';

const base = 'https://aqdinvites.com/invites/sheesh-mahal/';

const sfxList = [
  'assets/closing/sfx-shimmer.mp3',
  'assets/rsvp/sfx-roll.mp3',
  'assets/rsvp/sfx-clink.mp3',
  'assets/events/sfx-open.mp3',
  'assets/countdown/sfx-tick.mp3',
  'assets/families/sfx-light.mp3',
  'assets/countdown/sfx-lock.mp3',
  'assets/letter/sfx-letter.mp3',
  'assets/cover/sfx-open.mp3',
  'assets/closing/sfx-float.mp3',
  'assets/families/sfx-join.mp3',
  'assets/rsvp/sfx-dove.mp3',
  'assets/music/music.mp3'
];

async function checkAudio() {
  console.log('--- CHECKING AUDIO FILES ---');
  for (const sfx of sfxList) {
    const url = new URL(sfx, base).href;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`Audio: ${sfx} -> ${res.status} (${res.headers.get('content-type')}, ${res.headers.get('content-length')} bytes)`);
    } catch (e) {
      console.log(`Audio error ${sfx}:`, e.message);
    }
  }
}

checkAudio();
