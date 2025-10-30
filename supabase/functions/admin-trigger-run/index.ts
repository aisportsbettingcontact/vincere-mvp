const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-edge-admin",
};

const EDGE_ADMIN = Deno.env.get("LOVABLE_EDGE_ADMIN");

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

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ detail: "Method Not Allowed" }), { status: 405, headers: corsHeaders });
  }

  const token = Deno.env.get("LOVABLE_EDGE_ADMIN");
  if (!token) {
    return new Response(JSON.stringify({ error: "Secret missing" }), { status: 500, headers: corsHeaders });
  }

  const resp = await fetch(
    `${Deno.env.get("SUPABASE_URL")}/functions/v1/edgeguide-run`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Edge-Admin": token,
      },
      body: JSON.stringify({}),
    }
  );

  const body = await resp.text();
  return new Response(body, {
    status: resp.status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
