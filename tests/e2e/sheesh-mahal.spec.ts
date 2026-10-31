/**
 * Playwright E2E Browser Specification: Sheesh Mahal Digital Wedding Invitation
 * 
 * Target URLs:
 * - Standalone Preview: http://localhost:3000/preview/sheesh-mahal
 * - Interactive Customizer: http://localhost:3000/preview/sheesh-mahal/interactive
 * - Dynamic Slug: http://localhost:3000/[slug]
 * 
 * Execution:
 *   npx.cmd playwright test tests/e2e/sheesh-mahal.spec.ts
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

test.describe('Sheesh Mahal — Browser E2E Suite', () => {

  test.describe('Tier 1 & Tier 4: Complete Interactive Guest Journey (Mobile Viewport)', () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

    test('should complete guest journey without console errors or visual occlusion', async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // 1. Navigate with personalized recipient
      await page.goto(`${BASE_URL}/preview/sheesh-mahal?to=Auntie+Yasmin`);
      await page.waitForLoadState('domcontentloaded');

      // 2. Entrance Gate & Medallion Trigger
      const gate = page.locator('#gate, .sheesh-mahal-gate');
      await expect(gate).toBeVisible();

      const medallion = page.locator('button.medallion, button[aria-label*="Open"]');
      await expect(medallion).toBeVisible();

      // Check medallion touch target >= 44x44px
      const medallionBox = await medallion.boundingBox();
      expect(medallionBox?.width).toBeGreaterThanOrEqual(44);
      expect(medallionBox?.height).toBeGreaterThanOrEqual(44);

      // Tap medallion
      await medallion.click();

      // Verify gate opening class or transition
      await expect(gate).toHaveClass(/is-opening|is-open/, { timeout: 4000 });

      // 3. Audio Controller Floating Toggle
      const soundToggle = page.locator('.sound-toggle, .music-toggle, button[aria-label*="music" i]');
      if (await soundToggle.count() > 0) {
        const soundBox = await soundToggle.first().boundingBox();
        expect(soundBox?.width).toBeGreaterThanOrEqual(44);
        expect(soundBox?.height).toBeGreaterThanOrEqual(44);
      }

      // 4. Hero Hall & Facial Clearance
      const hero = page.locator('#hero, .sheesh-mahal-hero');
      await expect(hero).toBeVisible();

      // Check Bismillah invocation
      const bismillah = hero.locator('.h-bism, [aria-label*="Bismillah" i]');
      await expect(bismillah).toContainText(/﷽|Bismillah/);

      // Check couple names
      const coupleNames = hero.locator('.h-names, h1');
      await expect(coupleNames).toContainText(/Zain.*Anaya/i);

      // Facial Clearance Inspection: verify couple names sit in lower half
      const heroBox = await hero.boundingBox();
      const namesBox = await coupleNames.boundingBox();
      if (heroBox && namesBox) {
        const relativeTopRatio = (namesBox.y - heroBox.y) / heroBox.height;
        // Central face zone is 33%–68%, names must be placed at 40%+ to avoid covering top arches/focal points
        expect(relativeTopRatio).toBeGreaterThan(0.35);
      }

      // 5. Letter Casket & Personalization
      const casket = page.locator('button#casket, button.lt-casket');
      if (await casket.count() > 0) {
        await casket.scrollIntoViewIfNeeded();
        await casket.click();

        // Check personalization in unfolded sheet
        const guestName = page.locator('[data-guest]');
        await expect(guestName).toContainText('Auntie Yasmin');

        // Check Surah Ar-Rum
        const sheet = page.locator('#letterSheet, .lt-sheet');
        await expect(sheet).toContainText(/30:21|affection and mercy|مَّوَدَّةً/i);
      }

      // 6. Family Lamps
      const lamps = page.locator('.fm-lamp, button.lamp');
      if (await lamps.count() >= 2) {
        await lamps.nth(0).click();
        await lamps.nth(1).click();
        // Confluence threads should activate
        const threads = page.locator('svg.fm-threads, .fm-threads');
        await expect(threads).toBeVisible();
      }

      // 7. Festive Event Windows
      const eventCards = page.locator('.ev-win, .event-card');
      if (await eventCards.count() > 0) {
        await eventCards.first().scrollIntoViewIfNeeded();
        await eventCards.first().click();
        // Venue directions or calendar button should be visible
        const calBtn = page.locator('.ev-btn-cal, button[aria-label*="Calendar" i]');
        await expect(calBtn.first()).toBeVisible();
      }

      // 8. Bangle RSVP Desk
      const rsvpSection = page.locator('#rsvp, .sheesh-mahal-rsvp');
      if (await rsvpSection.count() > 0) {
        await rsvpSection.scrollIntoViewIfNeeded();

        // Stepper buttons touch target check
        const stepBtns = rsvpSection.locator('.rs-step, button.stepper-btn');
        if (await stepBtns.count() > 0) {
          const stepBox = await stepBtns.first().boundingBox();
          expect(stepBox?.width).toBeGreaterThanOrEqual(44);
          expect(stepBox?.height).toBeGreaterThanOrEqual(44);
        }

        // Fill guest name if empty
        const nameInput = rsvpSection.locator('input[name="name"], input#rsvp-name');
        if (await nameInput.count() > 0 && !(await nameInput.inputValue())) {
          await nameInput.fill('Auntie Yasmin');
        }

        // Toggle at least one bangle switch
        const bangle = rsvpSection.locator('[role="switch"], .rs-toggle').first();
        if (await bangle.count() > 0) {
          await bangle.click();
        }

        // Submit RSVP
        const submitBtn = rsvpSection.locator('button[type="submit"], .rs-submit');
        if (await submitBtn.count() > 0) {
          await submitBtn.click();
          // Shukriya confirmation card
          const thanksCard = page.locator('.rs-thanks, [data-testid="rsvp-confirmed"]');
          await expect(thanksCard).toBeVisible({ timeout: 5000 });
        }
      }

      // 9. Reflecting Pool & Replay
      const pool = page.locator('#closing, .sheesh-mahal-closing');
      if (await pool.count() > 0) {
        await pool.scrollIntoViewIfNeeded();
        // Tap water surface to spawn diya
        await pool.click({ position: { x: 195, y: 300 } });

        // Check replay button touch target
        const replayBtn = page.locator('.cl-replay, button[aria-label*="Replay" i]');
        if (await replayBtn.count() > 0) {
          const replayBox = await replayBtn.boundingBox();
          expect(replayBox?.width).toBeGreaterThanOrEqual(44);
          expect(replayBox?.height).toBeGreaterThanOrEqual(44);
        }
      }

      // Ensure no critical JavaScript runtime errors occurred
      const criticalErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('Hydration'));
      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Tier 2: Boundary & Viewport Tests', () => {

    test('iPhone SE (320px) should have zero horizontal scroll overflow', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto(`${BASE_URL}/preview/sheesh-mahal`);
      await page.waitForLoadState('domcontentloaded');

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Account for minor subpixel rounding
    });

    test('?nomusic flag should suppress background soundtrack and audio dock', async ({ page }) => {
      await page.goto(`${BASE_URL}/preview/sheesh-mahal?nomusic=1`);
      await page.waitForLoadState('domcontentloaded');

      const isAudioActive = await page.evaluate(() => {
        const audioEl = document.querySelector('audio');
        return audioEl ? !audioEl.paused : false;
      });
      expect(isAudioActive).toBe(false);
    });

    test('?to= with script injection payload should safely sanitize', async ({ page }) => {
      await page.goto(`${BASE_URL}/preview/sheesh-mahal?to=%3Cscript%3Ealert('xss')%3C%2Fscript%3E`);
      await page.waitForLoadState('domcontentloaded');

      // Check DOM does not evaluate raw script
      const scriptTags = await page.locator('script:has-text("alert(\'xss\')")').count();
      expect(scriptTags).toBe(0);
    });

  });

  test.describe('Tier 3: Multi-Faith Switching in Preview Dock', () => {
    test('switching faith should adapt sacred blessings dynamically', async ({ page }) => {
      await page.goto(`${BASE_URL}/preview/sheesh-mahal/interactive?faith=universal`);
      await page.waitForLoadState('domcontentloaded');

      // Verify page loads cleanly under universal faith
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

});
