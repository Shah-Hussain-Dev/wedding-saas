import fs from 'fs';

async function deobfuscate(jsPath) {
  const url = 'https://aqdinvites.com/invites/sheesh-mahal/' + jsPath;
  const res = await fetch(url);
  const text = await res.text();

  // Find getter func e.g. function q5d(a,b){...}
  const getterMatch = text.match(/function\s+(q\d+d)\s*\([a-zA-Z0-9_,\\s]+\)\s*\{[\s\S]*?\}/);
  // Find table func e.g. function q5c(){...}
  const tableMatch = text.match(/function\s+(q\d+c)\s*\(\)\s*\{[\s\S]*?return\s+[a-zA-Z0-9_]+;\s*\}/);

  if (!getterMatch || !tableMatch) {
    console.log('Skipping (no getter/table match):', jsPath);
    return;
  }

  const getterName = getterMatch[1];
  const tableName = tableMatch[1];

  // Find the loop e.g. (function(a,b){...}(q5c,0x792ae)
  const loopRegex = new RegExp(`\\(function\\s*\\([a-zA-Z0-9_,\\s]+\\)\\s*\\{[\\s\\S]*?\\}\\s*\\(\\s*${tableName}\\s*,\\s*(0x[0-9a-fA-F]+|[0-9]+)\\s*\\)`);
  const loopMatch = text.match(loopRegex);
  if (!loopMatch) {
    console.log('Skipping (no loop match):', jsPath);
    return;
  }

  const evalEnv = `
    ${tableMatch[0]};
    ${getterMatch[0]};
    (${loopMatch[0]});
    globalThis.__GET = ${getterName};
  `;

  try {
    eval(evalEnv);
  } catch (e) {
    console.error('Eval error for', jsPath, e.message);
    return;
  }

  // Find all aliases assigned to getterName
  const aliasMatches = [...text.matchAll(new RegExp(`(?:var|let|const)\\s+([a-zA-Z0-9_]+)\\s*=\\s*${getterName}\\b`, 'g'))];
  const aliases = Array.from(new Set([getterName, ...aliasMatches.map(m => m[1])]));

  let replaced = text;
  for (const alias of aliases) {
    const callRegex = new RegExp(`\\b${alias}\\s*\\(\\s*(0x[0-9a-fA-F]+|[0-9]+)\\s*\\)`, 'g');
    replaced = replaced.replace(callRegex, (m, p1) => {
      try {
        const val = globalThis.__GET(parseInt(p1));
        return JSON.stringify(val);
      } catch (e) {
        return m;
      }
    });
  }

  const outName = `deobf_${jsPath.replace(/[\/\\]/g, '_')}`;
  fs.writeFileSync(outName, replaced);
  console.log(`Success deobfuscating ${jsPath} -> ${outName}`);
}

async function run() {
  const files = [
    'js/fd5e8812d4.js',
    'js/4fcdd2c4c0.js',
    'js/9f609920c1.js',
    'js/b672bc1327.js',
    'js/0a1eef2209.js',
    'js/b8647fffa5.js',
    'js/dd11b867a6.js',
    'js/3904bd8af0.js',
    'js/2812262112.js',
    'js/a96c99de75.js',
    'js/3cf0d46f42.js'
  ];
  for (const f of files) {
    await deobfuscate(f);
  }
}

run();
