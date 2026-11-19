import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Royal Lotus Hero Intro & Interactive Blooming Lotus Standards', () => {
  const pagePath = path.resolve(process.cwd(), 'templates/royal-lotus/page.tsx');
  const stylePath = path.resolve(process.cwd(), 'templates/royal-lotus/style.css');

  test('Feature 1: Royal Lotus page renders big interactive lotus button with aura & pulse rings', () => {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    assert.ok(pageContent.includes('intro__lotus-wrap'), 'page.tsx must use intro__lotus-wrap container');
    assert.ok(pageContent.includes('intro__lotus-btn'), 'page.tsx must have intro__lotus-btn');
    assert.ok(pageContent.includes('intro__lotus-glow'), 'page.tsx must have radial golden glow');
    assert.ok(pageContent.includes('intro__lotus-pulse-ring'), 'page.tsx must have expanding pulse ring');
    assert.ok(pageContent.includes('lotus-closed.webp'), 'page.tsx must have closed lotus bud image');
    assert.ok(pageContent.includes('lotus-open.webp'), 'page.tsx must have open blooming lotus image');
  });

  test('Feature 2: High-contrast, elegant "Tap the lotus to join us" badge with dual click affordance', () => {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    assert.ok(pageContent.includes('intro__lotus-badge'), 'page.tsx must render dedicated intro__lotus-badge');
    assert.ok(pageContent.includes('Tap the lotus to join us'), 'page.tsx must have clear CTA text');
    assert.ok(pageContent.includes('intro__badge-sparkle'), 'badge must feature decorative sparkles');
    assert.ok(pageContent.includes('onClick={handleLotusClick}'), 'badge must trigger handleLotusClick');
  });

  test('Feature 3: CSS enforces large touch target, mobile responsiveness and thumb zone ergonomics', () => {
    const styleContent = fs.readFileSync(stylePath, 'utf8');
    
    // Check lotus dimensions
    assert.match(
      styleContent,
      /\.tmpl-lotus-courtyard\s+\.intro__lotus-btn\s*\{[^}]*width:\s*clamp\(108px/i,
      'intro__lotus-btn must have responsive width starting at least 108px'
    );
    assert.match(
      styleContent,
      /\.tmpl-lotus-courtyard\s+\.intro__lotus-btn\s*\{[^}]*height:\s*clamp\(108px/i,
      'intro__lotus-btn must have responsive height starting at least 108px'
    );

    // Check touch target standards (minimum 44px)
    assert.match(
      styleContent,
      /\.tmpl-lotus-courtyard\s+\.intro__lotus-badge\s*\{[^}]*min-height:\s*44px/i,
      'intro__lotus-badge must satisfy 44px minimum touch target standard'
    );

    // Check high-contrast typography and backdrop styling
    assert.ok(
      styleContent.includes('backdrop-filter: blur(12px)'),
      'intro__lotus-badge must have frosted glass backdrop for contrast'
    );
    assert.ok(
      styleContent.includes('rgba(245, 220, 140, 0.75)'),
      'intro__lotus-badge must have radiant antique gold border'
    );
    assert.ok(
      styleContent.includes('letter-spacing: 0.18em'),
      'intro__badge-text must have elegant tracking'
    );
  });

  test('Feature 4: Micro-interactions and cinematic animations', () => {
    const styleContent = fs.readFileSync(stylePath, 'utf8');
    assert.ok(styleContent.includes('@keyframes royalLotusHoverSway'), 'Must define royalLotusHoverSway animation');
    assert.ok(styleContent.includes('@keyframes royalLotusGlowPulse'), 'Must define royalLotusGlowPulse animation');
    assert.ok(styleContent.includes('@keyframes royalLotusPulseRing'), 'Must define royalLotusPulseRing animation');
    assert.ok(styleContent.includes('@keyframes royalBadgeBreathing'), 'Must define royalBadgeBreathing animation');
  });

  test('Feature 5: Royal Lotus events section implements scroll-triggered Farman unrolling', () => {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    assert.ok(pageContent.includes('RoyalLotusEventCard'), 'page.tsx must use RoyalLotusEventCard component');
    assert.ok(pageContent.includes('events__rolled-wrap'), 'Event card must render events__rolled-wrap');
    assert.ok(pageContent.includes('farman-rolled.webp'), 'Event card must include farman-rolled.webp');
    assert.ok(pageContent.includes('events__open-wrap'), 'Event card must render events__open-wrap');
    assert.ok(pageContent.includes('farman-open.webp'), 'Event card must include farman-open.webp');
    assert.ok(pageContent.includes('IntersectionObserver'), 'Event card must observe scroll intersection');
    assert.ok(pageContent.includes('intersectionRatio >='), 'Must ensure card is completely visible in view before trigger');
    assert.ok(pageContent.includes('setTimeout'), 'Must apply graceful delay so user clearly sees the rolled scroll');
    assert.ok(pageContent.includes('events__stop--rolled'), 'Event card must support rolled initial state');
    assert.ok(pageContent.includes('events__stop--unrolling'), 'Event card must support unrolling transition state');
  });

  test('Feature 6: Event scroll unrolling CSS with smooth clip-path and content cascading', () => {
    const styleContent = fs.readFileSync(stylePath, 'utf8');
    assert.ok(styleContent.includes('.events__stop--rolled .events__open-wrap'), 'Must define rolled open-wrap clip-path');
    assert.ok(styleContent.includes('clip-path: inset(0 0 100% round 4px)'), 'Rolled state must clip parchment to 100%');
    assert.ok(styleContent.includes('.events__stop--unrolling .events__open-wrap'), 'Must define unrolling state');
    assert.ok(styleContent.includes('clip-path: inset(0 0 0% round 4px)'), 'Unrolled state must expand clip-path to 0%');
    assert.ok(styleContent.includes('@keyframes royalRolledFloat'), 'Must define royalRolledFloat animation');
    assert.ok(styleContent.includes('@keyframes royalRolledAura'), 'Must define royalRolledAura animation');
    assert.ok(styleContent.includes('eventsMotifIn'), 'Must cascade motif icon on unroll');
    assert.ok(styleContent.includes('eventsTextIn'), 'Must cascade ceremony text on unroll');
  });

  test('Feature 7: Royal Lotus removes RSVP pedestal banner and modal dialog', () => {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    assert.ok(!pageContent.includes('rl-rsvp-banner-card'), 'RSVP banner card must be removed');
    assert.ok(!pageContent.includes('rl-modal-overlay'), 'RSVP modal overlay must be removed');
    assert.ok(!pageContent.includes('handleRsvpSubmit'), 'RSVP submit handler must be removed');
    assert.ok(!pageContent.includes('isRsvpOpen'), 'isRsvpOpen state must be removed');
    assert.ok(!pageContent.includes('id="rsvp"'), 'RSVP section id anchor must be removed');
  });

  test('Feature 8: Royal Lotus enforces mobile-first stacked footer layout and marketing atelier', () => {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    const styleContent = fs.readFileSync(stylePath, 'utf8');

    // Page structure has closing__marketing-wrap
    assert.ok(pageContent.includes('closing__marketing-wrap'), 'page.tsx must wrap TemplateMarketingFooter in closing__marketing-wrap');
    assert.ok(pageContent.includes('closing__lotus'), 'page.tsx must have sacred closing lotus motif');
    assert.ok(pageContent.includes('closing__cow'), 'page.tsx must have Kamadhenu cow motif');
    assert.ok(pageContent.includes('closing__elephant'), 'page.tsx must have sacred elephant motif');

    // CSS strictly enforces column stacking on .closing
    assert.match(
      styleContent,
      /\.tmpl-lotus-courtyard\s+\.closing\s*\{[^}]*flex-direction:\s*column\s*!important/i,
      '.closing section must enforce flex-direction: column to prevent side-by-side squishing on mobile'
    );
    assert.match(
      styleContent,
      /\.tmpl-lotus-courtyard\s+\.closing\s+\.section-inner\s*\{[^}]*flex-direction:\s*column\s*!important/i,
      '.section-inner in closing must enforce column alignment'
    );
    assert.ok(
      styleContent.includes('closing__marketing-wrap'),
      'style.css must define .closing__marketing-wrap full-width styling'
    );
    assert.ok(
      styleContent.includes('env(safe-area-inset-bottom'),
      'style.css must account for safe area insets on mobile footer'
    );
  });

  test('Feature 9: Royal Lotus Gallery implements mobile-first bento mosaic wall with responsive spans', () => {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    const styleContent = fs.readFileSync(stylePath, 'utf8');

    // Page structure
    assert.ok(pageContent.includes('gallery__bento-wall'), 'page.tsx must render gallery__bento-wall grid');
    assert.ok(pageContent.includes('gallery__card--hero'), 'First item must have gallery__card--hero span');
    assert.ok(pageContent.includes('gallery__card--wide'), 'Closing item must have gallery__card--wide span');
    assert.ok(pageContent.includes('gallery__tap-pill'), 'Each card must render enlarge tap pill');
    assert.ok(pageContent.includes('gallery__plaque'), 'Each card must have caption plaque');

    // CSS Grid & Responsive Spans
    assert.ok(styleContent.includes('.gallery__bento-wall'), 'CSS must define .gallery__bento-wall');
    assert.ok(styleContent.includes('grid-template-columns: repeat(2, 1fr)'), 'CSS must use 2-column grid by default on mobile');
    assert.ok(styleContent.includes('.gallery__card--hero'), 'CSS must style hero span');
    assert.ok(styleContent.includes('.gallery__card--wide'), 'CSS must style wide span');
    assert.ok(styleContent.includes('@media (min-width: 640px)'), 'CSS must have tablet breakpoint');
    assert.ok(styleContent.includes('@media (min-width: 1024px)'), 'CSS must have desktop breakpoint');
  });

  test('Feature 10: Interactive accessible lightbox with keyboard navigation and 44px touch targets', () => {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    const styleContent = fs.readFileSync(stylePath, 'utf8');

    // Page JSX & handlers
    assert.ok(pageContent.includes('activePhotoIdx'), 'page.tsx must manage activePhotoIdx state');
    assert.ok(pageContent.includes('rl-lightbox-overlay'), 'page.tsx must render rl-lightbox-overlay');
    assert.ok(pageContent.includes('rl-lightbox-counter'), 'Lightbox must render photo index counter');
    assert.ok(pageContent.includes('rl-lightbox-btn--close'), 'Lightbox must render close button');
    assert.ok(pageContent.includes('rl-lightbox-nav--prev'), 'Lightbox must render prev button');
    assert.ok(pageContent.includes('rl-lightbox-nav--next'), 'Lightbox must render next button');
    assert.ok(pageContent.includes('ArrowLeft'), 'page.tsx must handle keyboard arrow left');
    assert.ok(pageContent.includes('ArrowRight'), 'page.tsx must handle keyboard arrow right');
    assert.ok(pageContent.includes('Escape'), 'page.tsx must handle keyboard Escape key');

    // Touch Targets in CSS (>= 44px)
    assert.match(
      styleContent,
      /\.rl-lightbox-btn--close\s*\{[^}]*min-width:\s*44px/i,
      'Close button must satisfy minimum 44px touch target'
    );
    assert.match(
      styleContent,
      /\.rl-lightbox-nav\s*\{[^}]*min-width:\s*44px/i,
      'Prev/Next navigation buttons must satisfy minimum 44px touch target'
    );
  });
  test('Feature 11: Floating bell rope/thread smoothly retracts and hides when bride & groom names reveal', () => {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    const styleContent = fs.readFileSync(stylePath, 'utf8');

    // Page checks
    assert.ok(
      pageContent.includes('reveals.names ? "intro__rope--hidden" : ""'),
      'Rope button must apply intro__rope--hidden class when reveals.names is true'
    );
    assert.ok(
      pageContent.includes('aria-hidden={reveals.names}'),
      'Rope button must set aria-hidden when names are revealed'
    );
    assert.ok(
      pageContent.includes('tabIndex={reveals.names ? -1 : 0}'),
      'Rope button must remove tabIndex when hidden'
    );
    assert.ok(
      pageContent.includes('translateY(-140%)'),
      'Rope must smoothly ascend out of view when names reveal'
    );

    // CSS checks
    assert.ok(
      styleContent.includes('.intro__rope--hidden'),
      'style.css must define .intro__rope--hidden rule'
    );
    assert.ok(
      styleContent.includes('opacity: 0 !important'),
      '.intro__rope--hidden must fade out with opacity 0'
    );
    assert.ok(
      styleContent.includes('pointer-events: none !important'),
      '.intro__rope--hidden must disable pointer events'
    );
    assert.ok(
      styleContent.includes('transform: translateX(-50%) translateY(-140%) !important'),
      '.intro__rope--hidden must transform upward past canopy'
    );
  });

  test('Feature 12: Desktop Farman Scroll Event Cards — 3-column grid layout, crystal-clear readability and zero collisions', () => {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    const styleContent = fs.readFileSync(stylePath, 'utf8');

    // Page checks
    assert.ok(
      pageContent.includes('event.time ? <p className="events__time">{event.time}</p> : null'),
      'RoyalLotusEventCard must conditionally render time only when present'
    );

    // CSS checks for Desktop (min-width: 1024px)
    assert.ok(
      styleContent.includes('ROYAL LOTUS DESKTOP FARMAN SCROLL EVENT CARDS'),
      'style.css must have dedicated desktop Farman scroll section'
    );
    assert.ok(
      styleContent.includes('grid-template-columns: repeat(3, minmax(0, 1fr)) !important'),
      'Desktop cards must restore authentic 3-column grid layout'
    );
    assert.ok(
      styleContent.includes('color: #2b1218 !important'),
      'Desktop venue and address must use high-contrast deep royal ink'
    );
    assert.ok(
      styleContent.includes('opacity: 0.95 !important'),
      'Desktop venue must have solid 0.95 opacity for crisp legibility against parchment'
    );
    assert.ok(
      styleContent.includes('max-height: 46px !important'),
      'Desktop icon must be refined to preserve vertical space for address & CTA'
    );
    assert.ok(
      styleContent.includes('overflow: visible !important'),
      'Desktop content must avoid clipping text or buttons'
    );
    assert.ok(
      styleContent.includes('min-height: 32px !important'),
      'Desktop map button must have compact height to prevent bottom border collision'
    );
  });
});
