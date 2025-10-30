const SERVICE_URL = "https://edgeguide-svc-620671498623.us-west2.run.app";
const SECRET = Deno.env.get("APP_SHARED_SECRET") ?? "";
const EDGE_ADMIN = Deno.env.get("LOVABLE_EDGE_ADMIN");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-secret, x-edge-admin, content-type, x-client-info, apikey",
  "Content-Type": "application/json",
};

const gate = (req: Request) => {
  const h = req.headers.get("X-Edge-Admin");
  if (!EDGE_ADMIN || h !== EDGE_ADMIN) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { 
      status: 403, 
      headers: cors 
    });
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const deny = gate(req);
  if (deny) return deny;

  if (!SECRET) {
    return new Response(JSON.stringify({ error: "APP_SHARED_SECRET not configured" }), {
      status: 500,
      headers: cors,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ detail: "Method Not Allowed" }), { status: 405, headers: cors });
  }

  const body = await req.text(); // forward any JSON payload
  const upstream = await fetch(`${SERVICE_URL}/run`, {
    method: "POST",
    headers: {
      "X-Client-Secret": SECRET,
      "Content-Type": "application/json",
    },
    body: body || "{}",
  });

  const text = await upstream.text();
  return new Response(text, { status: upstream.status, headers: cors });
});
