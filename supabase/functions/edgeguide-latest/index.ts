const SERVICE_URL = 'https://edgeguide-svc-620671498623.us-west2.run.app';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
  'Content-Type': 'application/json',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ detail: 'Method Not Allowed' }), {
      status: 405, headers: cors,
    });
  }

  const upstream = await fetch(`${SERVICE_URL}/latest`, { method: 'GET' });
  const text = await upstream.text();
  return new Response(text, { status: upstream.status, headers: cors });
});
