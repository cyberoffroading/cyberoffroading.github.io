const ALLOWED_ORIGINS = [
  'https://cyberoffroading.com',
  'https://www.cyberoffroading.com',
  'http://localhost',
  'http://127.0.0.1',
];

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // GET /votes — return all vote counts
    if (request.method === 'GET' && path === '/votes') {
      const counts = await env.VOTES.get('counts', 'json') || {};
      const clicks = await env.VOTES.get('clicks', 'json') || {};
      return Response.json({ votes: counts, clicks }, { headers: corsHeaders(request) });
    }

    // POST /click/:id — track affiliate link click
    if (request.method === 'POST' && path.startsWith('/click/')) {
      const productId = path.slice(7);
      if (!productId) {
        return Response.json({ error: 'Missing product ID' }, { status: 400, headers: corsHeaders(request) });
      }
      const clicks = await env.VOTES.get('clicks', 'json') || {};
      clicks[productId] = (clicks[productId] || 0) + 1;
      await env.VOTES.put('clicks', JSON.stringify(clicks));
      return Response.json({ count: clicks[productId] }, { headers: corsHeaders(request) });
    }

    // POST /vote/:id — increment vote for a product
    if (request.method === 'POST' && path.startsWith('/vote/')) {
      const productId = path.slice(6);
      if (!productId) {
        return Response.json({ error: 'Missing product ID' }, { status: 400, headers: corsHeaders(request) });
      }

      // Rate limit: 1 vote per IP per product
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const ipKey = `voted:${ip}:${productId}`;
      const alreadyVoted = await env.VOTES.get(ipKey);
      if (alreadyVoted) {
        return Response.json({ error: 'Already voted' }, { status: 429, headers: corsHeaders(request) });
      }

      // Increment count
      const counts = await env.VOTES.get('counts', 'json') || {};
      counts[productId] = (counts[productId] || 0) + 1;
      await env.VOTES.put('counts', JSON.stringify(counts));

      // Mark IP as voted (expire after 365 days)
      await env.VOTES.put(ipKey, '1', { expirationTtl: 86400 * 365 });

      return Response.json({ count: counts[productId] }, { headers: corsHeaders(request) });
    }

    // POST /unvote/:id — decrement vote for a product
    if (request.method === 'POST' && path.startsWith('/unvote/')) {
      const productId = path.slice(8);
      if (!productId) {
        return Response.json({ error: 'Missing product ID' }, { status: 400, headers: corsHeaders(request) });
      }

      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const ipKey = `voted:${ip}:${productId}`;

      // Only allow unvote if this IP actually voted
      const hadVoted = await env.VOTES.get(ipKey);
      if (!hadVoted) {
        return Response.json({ error: 'No vote to remove' }, { status: 400, headers: corsHeaders(request) });
      }

      const counts = await env.VOTES.get('counts', 'json') || {};
      counts[productId] = Math.max((counts[productId] || 0) - 1, 0);
      await env.VOTES.put('counts', JSON.stringify(counts));
      await env.VOTES.delete(ipKey);

      return Response.json({ count: counts[productId] }, { headers: corsHeaders(request) });
    }

    return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders(request) });
  }
};
