const SERVICE_URL = "https://edgeguide-svc-620671498623.us-west2.run.app";
const EDGE_ADMIN = Deno.env.get("LOVABLE_EDGE_ADMIN");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-edge-admin",
};

const gate = (req: Request) => {
  const h = req.headers.get("X-Edge-Admin");
  if (!EDGE_ADMIN || h !== EDGE_ADMIN) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const deny = gate(req);
  if (deny) return deny;

  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(JSON.stringify({ detail: "Method Not Allowed" }), { status: 405, headers: corsHeaders });
  }

  const upstream = await fetch(`${SERVICE_URL}/latest`, { method: "GET" });
  const body = await upstream.text();
  return new Response(body, { status: upstream.status, headers: corsHeaders });
});
