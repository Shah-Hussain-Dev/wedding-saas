import fs from 'node:fs';
import assert from 'node:assert/strict';

const defaultData = JSON.parse(fs.readFileSync('templates/sheesh-mahal/data.json', 'utf8'));

function deepMergeData(fallback, incoming) {
  if (!incoming) return { ...fallback };
  const result = { ...fallback };
  for (const key of Object.keys(incoming)) {
    if (
      incoming[key] &&
      typeof incoming[key] === "object" &&
      !Array.isArray(incoming[key])
    ) {
      result[key] = deepMergeData(fallback[key] || {}, incoming[key]);
    } else if (incoming[key] !== undefined) {
      result[key] = incoming[key];
    }
  }
  return result;
}

console.log("=== ADVERSARIAL PROPS STRESS TEST ===");

// Scenario 1: null / undefined data
const res1 = deepMergeData(defaultData, null);
assert.strictEqual(res1.brideName, "Anaya");
assert.strictEqual(res1.groomName, "Zain");
assert.strictEqual(res1.events.length, 4);

// Scenario 2: empty object
const res2 = deepMergeData(defaultData, {});
assert.strictEqual(res2.brideName, "Anaya");
assert.strictEqual(res2.groomName, "Zain");

// Scenario 3: partial overrides (custom couple, venue, and 1 custom event)
const customPayload = {
  brideName: "Sarah",
  groomName: "Hamza",
  venue: {
    name: "Royal Palm Golf Club",
    address: "Lahore, Pakistan"
  },
  events: [
    {
      id: "valima",
      name: "Valima Reception",
      date: "Sunday · 20 December 2026",
      time: "8:00 pm",
      venue: "Royal Palm, Lahore"
    }
  ]
};
const res3 = deepMergeData(defaultData, customPayload);
assert.strictEqual(res3.brideName, "Sarah");
assert.strictEqual(res3.groomName, "Hamza");
assert.strictEqual(res3.venue.name, "Royal Palm Golf Club");
assert.strictEqual(res3.events.length, 1);
assert.strictEqual(res3.events[0].id, "valima");
// Fallback preserved for untouched fields
assert.strictEqual(res3.sacred.bismillah, "﷽");
assert.strictEqual(res3.sacred.familyReference, "Sunan Abi Dawud · 969");

// Scenario 4: Prototype pollution attempt
const maliciousPayload = JSON.parse('{"__proto__": {"polluted": true}, "brideName": "Ayesha"}');
const res4 = deepMergeData(defaultData, maliciousPayload);
assert.strictEqual(res4.brideName, "Ayesha");
assert.strictEqual({}.polluted, undefined, "Prototype pollution must not succeed");

console.log("=== ALL PROPS STRESS TESTS PASSED SUCCESSFULLY ===");
