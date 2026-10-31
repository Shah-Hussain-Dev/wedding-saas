import fs from 'fs';

const baseUrl = 'https://aqdinvites.com/invites/sheesh-mahal/';

const cssFiles = [
  'assets/cover/beda901c97.css',
  'assets/hero/7bbc2d4d2a.css',
  'assets/letter/ccaa93138c.css',
  'assets/families/9b2914cc1e.css',
  'assets/events/717b519022.css',
  'assets/countdown/cfd796cda3.css',
  'assets/rsvp/0ee6818ba8.css',
  'assets/closing/4bd959f9db.css',
  'css/007234ef6e.css',
  'css/1b51875257.css',
  'css/8647abf050.css',
  'css/82755858dd.css',
  'css/39e5cd7270.css',
  'css/647b3e70da.css',
  'css/4f1e219d7e.css',
  'css/41e3debf30.css',
  'css/f304a094ab.css',
  'css/9e86b95303.css'
];

async function extract() {
  const allCss = [];
  const cssByFile = {};

  for (const f of cssFiles) {
    const res = await fetch(new URL(f, baseUrl).href);
    const text = await res.text();
    cssByFile[f] = text;
    allCss.push(text);
  }

  const combined = allCss.join('\n');

  // 1. Extract CSS variables (--*)
  const varMatches = [...combined.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g)];
  const cssVars = {};
  for (const m of varMatches) {
    cssVars[m[1]] = m[2].trim();
  }

  // 2. Extract unique colors (hex and rgba)
  const hexColors = new Set([...combined.matchAll(/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g)].map(m => m[0].toLowerCase()));
  const rgbaColors = new Set([...combined.matchAll(/rgba?\([^)]+\)/g)].map(m => m[0]));

  // 3. Extract font-family rules
  const fonts = new Set([...combined.matchAll(/font(?:-family)?\s*:\s*([^;]+);/g)].map(m => m[1].trim()));

  // 4. Extract all @keyframes with full body
  const keyframes = {};
  const kfRegex = /@keyframes\s+([a-zA-Z0-9_-]+)\s*\{([^}]+(?:\{[^}]+\}[^}]*)*)\}/g;
  let km;
  while ((km = kfRegex.exec(combined)) !== null) {
    keyframes[km[1]] = km[2].trim();
  }

  // 5. Extract media queries
  const mediaQueries = new Set([...combined.matchAll(/@media\s*([^{]+)\{/g)].map(m => m[1].trim()));

  const report = {
    cssVars,
    hexColors: Array.from(hexColors).sort(),
    rgbaColors: Array.from(rgbaColors).sort(),
    fonts: Array.from(fonts),
    keyframes,
    mediaQueries: Array.from(mediaQueries),
    fileMap: Object.keys(cssByFile).map(f => ({
      file: f,
      length: cssByFile[f].length
    }))
  };

  fs.writeFileSync('css_tokens.json', JSON.stringify(report, null, 2));
  console.log('CSS tokens extracted successfully.');
}

extract();
