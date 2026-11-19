import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Customizer Media Normalization & Defensive Typing Standards', () => {
  const multiUploaderPath = path.resolve(process.cwd(), 'components/media/MultiImageUploader.tsx');
  const wizardPath = path.resolve(process.cwd(), 'components/customizer/InvitationCustomizerWizard.tsx');
  const audioSelectorPath = path.resolve(process.cwd(), 'components/media/AudioTrackSelector.tsx');

  test('Feature 1: MultiImageUploader defensively normalizes input images to clean string URLs', () => {
    const content = fs.readFileSync(multiUploaderPath, 'utf8');
    assert.ok(
      content.includes('useMemo(() => {'),
      'MultiImageUploader must useMemo to sanitize and normalize rawImages'
    );
    assert.ok(
      content.includes('(item as any).url || (item as any).src'),
      'MultiImageUploader must extract .url or .src if an object was passed'
    );
    assert.ok(
      content.includes('typeof url === "string" && url.includes("/images/gallery-library/")'),
      'MultiImageUploader must typeguard url before calling .includes'
    );
  });

  test('Feature 2: MultiImageUploaderProps accepts both string[] and object gallery formats', () => {
    const content = fs.readFileSync(multiUploaderPath, 'utf8');
    assert.ok(
      content.includes('images: (string | { url?: string; src?: string; [key: string]: any })[]'),
      'MultiImageUploaderProps must allow object items in images prop'
    );
  });

  test('Feature 3: InvitationCustomizerWizard defines normalizeGalleryUrls helper', () => {
    const content = fs.readFileSync(wizardPath, 'utf8');
    assert.ok(
      content.includes('function normalizeGalleryUrls(raw: unknown): string[]'),
      'Wizard must declare normalizeGalleryUrls helper function'
    );
    assert.ok(
      content.includes('normalizeGalleryUrls('),
      'Wizard must call normalizeGalleryUrls during state initialization and hydration'
    );
  });

  test('Feature 4: InvitationCustomizerWizard normalizes initialData, demoDefaults and source gallery', () => {
    const content = fs.readFileSync(wizardPath, 'utf8');
    // Check initial state
    assert.ok(
      content.includes('initialData?.slideshowImages ??') &&
      content.includes('initialData?.gallery ??') &&
      content.includes('demoDefaults?.gallery'),
      'slideshowImages useState must inspect gallery fallbacks through normalizeGalleryUrls'
    );
    // Check initialData sync
    assert.ok(
      content.includes('setSlideshowImages(normalizeGalleryUrls(initialData.gallery))'),
      'initialData effect must normalize gallery'
    );
    // Check source hydration sync
    assert.ok(
      content.includes('setSlideshowImages(normalizeGalleryUrls(source.gallery))'),
      'source hydration effect must normalize gallery'
    );
  });

  test('Feature 5: AudioTrackSelector defensively guards selectedTrackUrl before .includes', () => {
    const content = fs.readFileSync(audioSelectorPath, 'utf8');
    assert.ok(
      content.includes('typeof selectedTrackUrl === "string"'),
      'AudioTrackSelector must typeguard selectedTrackUrl'
    );
    assert.ok(
      content.includes('typeof t.url === "string" && t.url.includes('),
      'AudioTrackSelector must typeguard track.url before calling .includes'
    );
  });
});
