import fs from 'node:fs';
import assert from 'node:assert/strict';

const malicious = JSON.parse(fs.readFileSync('tests/e2e/fixtures/malicious-inputs.json', 'utf8'));

function sanitizeGuestParam(input) {
  if (!input) return "Family & Friends";
  let cleaned = String(input).trim();
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, "");
  cleaned = cleaned.replace(/<[^>]*>?/gm, "");
  cleaned = cleaned.replace(/["'<>]/g, "");
  if (cleaned.length > 60) {
    cleaned = cleaned.slice(0, 60).trim();
  }
  return cleaned.length > 0 ? cleaned : "Family & Friends";
}

console.log("=== 1. XSS PAYLOAD ADVERSARIAL SWEEP ===");
for (const xss of malicious.xssPayloads) {
  const result = sanitizeGuestParam(xss);
  console.log(`Input: ${xss} -> Sanitized: ${result}`);
  assert.ok(!result.includes('<'), 'Must not contain <');
  assert.ok(!result.includes('>'), 'Must not contain >');
  assert.ok(!result.includes('"'), 'Must not contain "');
  assert.ok(!result.includes("'"), "Must not contain '");
}

console.log("\n=== 2. OVERSIZED STRING BOUNDARY SWEEP ===");
for (const os of malicious.oversizedStrings) {
  const result = sanitizeGuestParam(os);
  console.log(`Input len: ${os.length} -> Output len: ${result.length}`);
  assert.ok(result.length <= 60, 'Length must be <= 60 chars');
}

console.log("\n=== 3. UNICODE & URDU PERSONALIZATION SWEEP ===");
for (const uni of malicious.unicodeInputs) {
  const result = sanitizeGuestParam(uni);
  console.log(`Input: ${uni} -> Output: ${result}`);
  assert.ok(result.length > 0, 'Unicode output must not be empty');
}

console.log("\n=== 4. CSS SCOPING & ISOLATION FORENSIC CHECK ===");
const cssContent = fs.readFileSync('templates/sheesh-mahal/style.css', 'utf8');
const lines = cssContent.split('\n');
let keyframeBraceDepth = 0;
let mediaBraceDepth = 0;
let leakySelectors = [];

for (let i = 0; i < lines.length; i++) {
  const rawLine = lines[i];
  const line = rawLine.trim();

  if (line.startsWith('/*') || line.startsWith('*') || line.endsWith('*/')) {
    continue;
  }

  if (line.includes('@keyframes')) {
    keyframeBraceDepth = 1;
    continue;
  }

  if (keyframeBraceDepth > 0) {
    for (const char of line) {
      if (char === '{') keyframeBraceDepth++;
      if (char === '}') keyframeBraceDepth--;
    }
    continue;
  }

  if (line.startsWith('@media') || line.startsWith('@container')) {
    mediaBraceDepth = 1;
    continue;
  }

  if (mediaBraceDepth > 0) {
    if (line.endsWith('{') && !line.startsWith('@')) {
      const selector = line.replace('{', '').trim();
      if (!selector.startsWith('.sheesh-mahal-root') && 
          !selector.startsWith('html.is-shut') && 
          !selector.startsWith('body.is-shut')) {
        leakySelectors.push(`Media line ${i+1}: ${selector}`);
      }
    }
    for (const char of line) {
      if (char === '{') mediaBraceDepth++;
      if (char === '}') mediaBraceDepth--;
    }
    continue;
  }

  if (line.endsWith('{') && !line.startsWith('@')) {
    const selector = line.replace('{', '').trim();
    if (!selector.startsWith('.sheesh-mahal-root') && 
        !selector.startsWith('html.is-shut') && 
        !selector.startsWith('body.is-shut')) {
      leakySelectors.push(`Line ${i+1}: ${selector}`);
    }
  }
}

console.log(`Found ${leakySelectors.length} selectors outside .sheesh-mahal-root / shut state:`);
leakySelectors.forEach(s => console.log('  ', s));
assert.strictEqual(leakySelectors.length, 0, 'No styles should leak outside .sheesh-mahal-root');

console.log("\n=== ALL ADVERSARIAL SWEEP CHECKS PASSED ===");
