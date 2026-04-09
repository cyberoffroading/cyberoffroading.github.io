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
      return Response.json(counts, { headers: corsHeaders(request) });
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

    return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders(request) });
  }
};
