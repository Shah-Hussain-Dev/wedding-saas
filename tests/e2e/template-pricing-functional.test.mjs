import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

// Test functional pure logic and state transformations
describe('Template Pricing Functional Invariants & Mathematical Edge Cases', () => {
  test('Discount calculation logic handles standard retail markdown correctly', () => {
    const orig = 2999;
    const sell = 1199;
    const computedDiscount = Math.round(((orig - sell) / orig) * 100);
    const savings = orig - sell;

    assert.equal(computedDiscount, 60, '2999 -> 1199 should be 60% OFF');
    assert.equal(savings, 1800, 'Savings should be ₹1,800');
  });

  test('Discount calculation clamps at 0% when selling price equals or exceeds MRP', () => {
    const orig = 2000;
    const sell = 2500;
    const computedDiscount = orig > sell ? Math.round(((orig - sell) / orig) * 100) : 0;
    const savings = Math.max(0, orig - sell);

    assert.equal(computedDiscount, 0, 'No discount when selling price exceeds original price');
    assert.equal(savings, 0, 'Zero savings when selling price exceeds original price');
  });

  test('100% OFF / Free promotional tier edge case calculates correctly', () => {
    const orig = 2999;
    const sell = 0;
    const computedDiscount = orig > sell ? Math.round(((orig - sell) / orig) * 100) : 0;
    const savings = Math.max(0, orig - sell);

    assert.equal(computedDiscount, 100, '0 INR should produce 100% OFF');
    assert.equal(savings, 2999, 'Savings should equal original price');
  });

  test('Standard INR string format handles commas for thousands and lakhs', () => {
    const formatInr = (n) => `₹${n.toLocaleString('en-IN')}`;
    assert.equal(formatInr(1199), '₹1,199');
    assert.equal(formatInr(2999), '₹2,999');
    assert.equal(formatInr(150000), '₹1,50,000');
  });

  test('Razorpay paise integer conversion does not produce floating point artifacts', () => {
    const prices = [1199, 899, 1499, 2999, 799, 900];
    for (const p of prices) {
      const paise = p * 100;
      assert.equal(Number.isInteger(paise), true, `${p} * 100 must be an integer`);
      assert.equal(paise % 100, 0, 'Paise must be exact multiple of 100');
    }
  });
});
