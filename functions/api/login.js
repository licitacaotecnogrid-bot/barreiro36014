export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  let body = null;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: corsHeaders });
  }

  // Expecting the frontend to call this endpoint with the payload needed for login
  // e.g. { action: 'login', email, password }

  // The Pages function forwards database requests to an external Neon HTTP proxy
  // which must be provided in the environment as NEON_API_URL and NEON_SERVICE_KEY
  // The Neon HTTP proxy is a small secure endpoint you run (or a Neon Data API if available)

  const neonApiUrl = env.NEON_API_URL;
  const neonServiceKey = env.NEON_SERVICE_KEY;

  if (!neonApiUrl) {
    return new Response(JSON.stringify({ error: 'NEON_API_URL is not configured. Set the NEON_API_URL Pages env var to point to your Neon SQL proxy or Data API.' }), { status: 500, headers: corsHeaders });
  }

  try {
    // Forward the request to the Neon proxy. The proxy is responsible for executing SQL
    // securely using Neon credentials and returning JSON. This avoids opening TCP sockets
    // from the Edge runtime.
    const proxyRes = await fetch(neonApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(neonServiceKey ? { 'Authorization': `Bearer ${neonServiceKey}` } : {}),
      },
      body: JSON.stringify({ path: '/login', payload: body }),
    });

    const text = await proxyRes.text();
    const headers = { ...corsHeaders, 'Content-Type': proxyRes.headers.get('content-type') || 'application/json' };
    return new Response(text, { status: proxyRes.status, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error forwarding request to Neon proxy', details: String(err) }), { status: 502, headers: corsHeaders });
  }
}
