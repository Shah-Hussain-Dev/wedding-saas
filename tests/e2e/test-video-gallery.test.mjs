import { VIDEO_INVITATIONS, getVideoById, generateVideoWhatsAppUrl, WHATSAPP_CONTACT } from '../../data/video-invitations';
import fs from 'fs';
import path from 'path';

console.log('--- STARTING VIDEO GALLERY VERIFICATION TEST ---');

// 1. Verify all 6 videos exist in catalog
if (VIDEO_INVITATIONS.length !== 6) {
  throw new Error(`Expected 6 videos in catalog, found ${VIDEO_INVITATIONS.length}`);
}
console.log(`✓ Catalog contains exact 6 videos`);

// 2. Verify all underlying MP4 video files exist on disk
for (const video of VIDEO_INVITATIONS) {
  const filePath = path.join(process.cwd(), 'videos', video.filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Video file does not exist: ${filePath}`);
  }
  const stat = fs.statSync(filePath);
  if (stat.size === 0) {
    throw new Error(`Video file is empty: ${filePath}`);
  }
  console.log(`✓ Video file confirmed: "${video.filename}" (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

// 3. Verify all poster webp images exist on disk
for (const video of VIDEO_INVITATIONS) {
  const posterPath = path.join(process.cwd(), 'public', 'images', 'video-posters', `${video.id}.webp`);
  if (!fs.existsSync(posterPath)) {
    throw new Error(`Poster image missing: ${posterPath}`);
  }
  const stat = fs.statSync(posterPath);
  if (stat.size === 0) {
    throw new Error(`Poster image empty: ${posterPath}`);
  }
  console.log(`✓ Poster image confirmed: ${video.id}.webp (${(stat.size / 1024).toFixed(1)} KB)`);
}

// 4. Verify WhatsApp URLs and phone number
for (const video of VIDEO_INVITATIONS) {
  const url = generateVideoWhatsAppUrl(video);
  if (!url.startsWith(`https://wa.me/${WHATSAPP_CONTACT.phoneNumber}`)) {
    throw new Error(`Invalid WhatsApp phone number in URL: ${url}`);
  }
  if (!url.includes(encodeURIComponent(video.title))) {
    throw new Error(`WhatsApp URL missing properly encoded title for ${video.title}`);
  }
  console.log(`✓ WhatsApp URL verified for: "${video.title}"`);
  console.log(`   ↳ ${url}`);
}

console.log('--- ALL VIDEO GALLERY VERIFICATION TESTS PASSED ---');
