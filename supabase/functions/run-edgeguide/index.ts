import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-trace-id",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

const EDGE_BASE = Deno.env.get("EDGE_BASE");
const EDGE_ADMIN = Deno.env.get("LOVABLE_EDGE_ADMIN");

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors, ...extra },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const trace = req.headers.get("X-Trace-Id") ?? `ui-${Date.now()}`;
  const start = performance.now();

  if (!EDGE_BASE || !EDGE_ADMIN) {
    return json({ error: "Server misconfigured: missing EDGE_BASE or LOVABLE_EDGE_ADMIN" }, 500);
  }

  try {
    // forward to Supabase /edgeguide-run with the admin header
    const res = await fetch(`${EDGE_BASE}/edgeguide-run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Edge-Admin": EDGE_ADMIN,
        "X-Trace-Id": trace,
      },
      body: "{}", // empty JSON body
    });

    const text = await res.text();
    const ms = Math.round(performance.now() - start);

    // Emit verbose logs to Lovable console
    console.log(
      JSON.stringify({
        at: new Date().toISOString(),
        trace,
        supabase_status: res.status,
        elapsed_ms: ms,
        body_preview: text.slice(0, 200),
      })
    );

    if (!res.ok) return json({ error: `upstream ${res.status}`, detail: text, trace }, 502);

    const data = JSON.parse(text);
    if (!data?.ok) return json({ error: "run not ok", detail: data, trace }, 502);

    return json({ ok: true, ...data, trace, elapsed_ms: ms });
  } catch (e) {
    const ms = Math.round(performance.now() - start);
    console.error(JSON.stringify({ trace, elapsed_ms: ms, error: String(e) }));
    return json({ error: "proxy failed", detail: String(e), trace }, 500);
  }
});
