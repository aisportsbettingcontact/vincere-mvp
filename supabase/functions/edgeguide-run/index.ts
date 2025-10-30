import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-edge-admin, x-trace-id",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

const SERVICE_URL =
  Deno.env.get("SERVICE_URL") ??
  "https://edgeguide-svc-620671498623.us-west2.run.app";
const EDGE_ADMIN = Deno.env.get("LOVABLE_EDGE_ADMIN");        // set in Lovable
const CLIENT_SECRET = Deno.env.get("APP_SHARED_SECRET");       // set in Lovable

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ detail: "Method Not Allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const trace = req.headers.get("X-Trace-Id") ?? crypto.randomUUID();

  if (!EDGE_ADMIN) {
    console.error("edgeguide-run misconfig: LOVABLE_EDGE_ADMIN missing", { trace });
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  if (!CLIENT_SECRET) {
    console.error("edgeguide-run misconfig: APP_SHARED_SECRET missing", { trace });
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Admin gate
  const token = req.headers.get("X-Edge-Admin");
  if (token !== EDGE_ADMIN) {
    console.warn("edgeguide-run forbidden", { trace });
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const t0 = performance.now();
  try {
    const upstream = `${SERVICE_URL}/run`;
    const uresp = await fetch(upstream, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Secret": CLIENT_SECRET,
        "X-Trace-Id": trace,
      },
      body: JSON.stringify({}),
    });
    const text = await uresp.text();

    console.log(
      JSON.stringify({
        at: new Date().toISOString(),
        fn: "edgeguide-run",
        trace,
        upstream,
        status: uresp.status,
        elapsed_ms: Math.round(performance.now() - t0),
        body_preview: text.slice(0, 256)
      }),
    );

    return new Response(text, {
      status: uresp.status,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("edgeguide-run error", { trace, err: String(err) });
    return new Response(
      JSON.stringify({ error: "Upstream fetch failed", trace }),
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});
