const SERVICE_URL = "https://edgeguide-svc-620671498623.us-west2.run.app";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ detail: "Method Not Allowed" }), { status: 405, headers: cors });
  }

  const upstream = await fetch(`${SERVICE_URL}/latest`, { method: "GET" });
  const body = await upstream.text(); // pass through whatever JSON your service returns
  return new Response(body, { status: upstream.status, headers: cors });
});
