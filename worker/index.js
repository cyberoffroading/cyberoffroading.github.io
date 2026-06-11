// Cloudflare Worker: public product voting (stars) + affiliate click counters.
// Plain JS, no dependencies. KV binding: VOTES.

const PROD_ORIGINS = [
  'https://cyberoffroading.com',
  'https://www.cyberoffroading.com',
];

// Product IDs are lowercase kebab-case (e.g. "12k-winch", "tire-deflators").
const PRODUCT_ID_RE = /^[a-z0-9-]{1,64}$/;

// In-isolate cache for the GET /votes payload (keeps KV reads cheap).
// Writes only invalidate the cache in their own isolate, so /votes can be up
// to ~60s stale elsewhere — fine for social-proof counters, not real-time.
let votesCache = null;
let votesCacheTime = 0;
const VOTES_CACHE_TTL_MS = 60 * 1000;

function isAllowedOrigin(origin) {
  // Exact match for production origins — no prefix matching, so
  // https://cyberoffroading.com.evil.io is rejected.
  if (PROD_ORIGINS.includes(origin)) return true;
  // Local dev: http://localhost or http://127.0.0.1 on any port.
  try {
    const u = new URL(origin);
    return u.protocol === 'http:' && (u.hostname === 'localhost' || u.hostname === '127.0.0.1');
  } catch {
    return false;
  }
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin : PROD_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

// Rate-limit key: SHA-256 of "ip:productId" so raw IPs are never stored in KV.
async function votedKey(ip, productId) {
  const data = new TextEncoder().encode(`${ip}:${productId}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  return `voted:${hex}`;
}

// Read a per-product counter (`count:${id}` / `clicks:${id}`); if the
// per-product key doesn't exist yet, lazily seed from the legacy monolithic
// JSON blob ('counts' / 'clicks').
async function readCounter(env, prefix, legacyKey, productId) {
  const val = await env.VOTES.get(`${prefix}${productId}`);
  if (val !== null) return parseInt(val, 10) || 0;
  const legacy = await env.VOTES.get(legacyKey, 'json') || {};
  return Number(legacy[productId]) || 0;
}

// NOTE: KV has no compare-and-swap, so two concurrent increments of the SAME
// product can still lose an update. Accepted limitation for these low-stakes
// counters — exact counts would require Durable Objects. Per-product keys do
// guarantee that writes to DIFFERENT products never collide.
async function bumpCounter(env, prefix, legacyKey, productId, delta) {
  const current = await readCounter(env, prefix, legacyKey, productId);
  const next = Math.max(current + delta, 0);
  await env.VOTES.put(`${prefix}${productId}`, String(next));
  votesCache = null; // keep this isolate's /votes cache fresh
  return next;
}

// List all per-product counters under a prefix and resolve their values.
async function collectPrefix(env, prefix) {
  const out = {};
  let cursor;
  do {
    const page = await env.VOTES.list({ prefix, cursor });
    await Promise.all(page.keys.map(async (k) => {
      const val = await env.VOTES.get(k.name);
      if (val !== null) out[k.name.slice(prefix.length)] = parseInt(val, 10) || 0;
    }));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return out;
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // GET /votes — return all vote + click counts
    if (request.method === 'GET' && path === '/votes') {
      const headers = { ...corsHeaders(request), 'Cache-Control': 'public, max-age=60' };
      if (votesCache && Date.now() - votesCacheTime < VOTES_CACHE_TTL_MS) {
        return Response.json(votesCache, { headers });
      }
      const [legacyVotes, legacyClicks, votes, clicks] = await Promise.all([
        env.VOTES.get('counts', 'json').then(v => v || {}),
        env.VOTES.get('clicks', 'json').then(v => v || {}),
        collectPrefix(env, 'count:'),
        collectPrefix(env, 'clicks:'),
      ]);
      // Per-product keys win over the legacy blobs for any id present in both.
      const payload = {
        votes: { ...legacyVotes, ...votes },
        clicks: { ...legacyClicks, ...clicks },
      };
      votesCache = payload;
      votesCacheTime = Date.now();
      return Response.json(payload, { headers });
    }

    // POST /click/:id — track affiliate link click (client uses sendBeacon, which POSTs)
    if (request.method === 'POST' && path.startsWith('/click/')) {
      const productId = path.slice(7);
      if (!PRODUCT_ID_RE.test(productId)) {
        return Response.json({ error: 'Invalid product ID' }, { status: 400, headers: corsHeaders(request) });
      }
      const count = await bumpCounter(env, 'clicks:', 'clicks', productId, 1);
      return Response.json({ count }, { headers: corsHeaders(request) });
    }

    // POST /vote/:id — increment vote for a product
    if (request.method === 'POST' && path.startsWith('/vote/')) {
      const productId = path.slice(6);
      if (!PRODUCT_ID_RE.test(productId)) {
        return Response.json({ error: 'Invalid product ID' }, { status: 400, headers: corsHeaders(request) });
      }

      // Rate limit: 1 vote per IP per product (hashed key — no plaintext IPs in KV)
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const ipKey = await votedKey(ip, productId);
      const alreadyVoted = await env.VOTES.get(ipKey);
      if (alreadyVoted) {
        return Response.json({ error: 'Already voted' }, { status: 429, headers: corsHeaders(request) });
      }

      const count = await bumpCounter(env, 'count:', 'counts', productId, 1);

      // Mark IP+product as voted (expire after 365 days)
      await env.VOTES.put(ipKey, '1', { expirationTtl: 86400 * 365 });

      return Response.json({ count }, { headers: corsHeaders(request) });
    }

    // POST /unvote/:id — decrement vote for a product (clamped at 0)
    if (request.method === 'POST' && path.startsWith('/unvote/')) {
      const productId = path.slice(8);
      if (!PRODUCT_ID_RE.test(productId)) {
        return Response.json({ error: 'Invalid product ID' }, { status: 400, headers: corsHeaders(request) });
      }

      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const ipKey = await votedKey(ip, productId);

      // Only allow unvote if this IP actually voted
      const hadVoted = await env.VOTES.get(ipKey);
      if (!hadVoted) {
        return Response.json({ error: 'No vote to remove' }, { status: 400, headers: corsHeaders(request) });
      }

      const count = await bumpCounter(env, 'count:', 'counts', productId, -1);
      await env.VOTES.delete(ipKey);

      return Response.json({ count }, { headers: corsHeaders(request) });
    }

    return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders(request) });
  }
};
