const baseUrl = (process.env.DESIGNOS_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log(`PASS ${message}`);
};

const invalid = await fetch(`${baseUrl}/api/generate`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ brief: 'too short' })
});
const invalidBody = await invalid.json();
assert(invalid.status === 400 && typeof invalidBody.error === 'string', 'rejects an underspecified brief with HTTP 400');

const valid = await fetch(`${baseUrl}/api/generate`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    brief: 'Redesign a mobile-first fintech checkout with transparent pricing, UPI, card, net banking, and safe failure recovery.',
    audience: 'Fintech customers', platform: 'Responsive web'
  })
});
const body = await valid.json();
assert(valid.status === 200, 'accepts a valid checkout brief');
assert(['demo', 'live'].includes(body.mode), 'reports whether generation used demo or live AI mode');
assert(typeof body.result?.summary === 'string', 'returns a design summary');
assert(Array.isArray(body.result?.journey) && body.result.journey.length > 0, 'returns a non-empty user journey');
assert(Array.isArray(body.result?.screens) && body.result.screens.length >= 3, 'returns checkout screen specifications');
assert(Array.isArray(body.result?.accessibility), 'returns accessibility checks');
console.log(`Smoke tests passed against ${baseUrl}. Mode: ${body.mode}.`);
