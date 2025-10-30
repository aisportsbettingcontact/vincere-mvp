import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-edge-admin, x-trace-id",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

const SERVICE_URL =
  Deno.env.get("SERVICE_URL") ??
  "https://edgeguide-svc-620671498623.us-west2.run.app";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ detail: "Method Not Allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const trace = req.headers.get("X-Trace-Id") ?? crypto.randomUUID();
  const t0 = performance.now();
  try {
    const resp = await fetch(`${SERVICE_URL}/latest`, {
      headers: { "X-Trace-Id": trace },
    });

    const text = await resp.text();
    console.log(
      JSON.stringify({
        at: new Date().toISOString(),
        fn: "edgeguide-latest",
        trace,
        upstream: `${SERVICE_URL}/latest`,
        status: resp.status,
        elapsed_ms: Math.round(performance.now() - t0),
        body_preview: text.slice(0, 256)
      }),
    );

    return new Response(text, {
      status: resp.status,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("edgeguide-latest error", { trace, err: String(err) });
    return new Response(
      JSON.stringify({ error: "Upstream fetch failed", trace }),
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});
