export interface EdgeGuideRunResponse {
  ok: boolean;
  json_file: string;
  elapsed_sec: number;
  trace: string;
}

export interface EdgeGuideLatestResponse {
  generated_at: string;
  tz_anchor?: string;
  books: unknown;
}

const EDGE_BASE = import.meta.env.VITE_EDGE_BASE as string;
const RUN_PROXY = "/run-edgeguide";

export async function fetchLatest(): Promise<EdgeGuideLatestResponse> {
  const r = await fetch(`${EDGE_BASE}/edgeguide-latest`, {
    headers: { "Accept": "application/json", "X-Trace-Id": `latest-${Date.now()}` },
    cache: "no-store",
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`latest ${r.status}: ${txt}`);
  const data = JSON.parse(txt);
  if (!data?.generated_at || !data?.books) throw new Error("latest schema mismatch");
  return data as EdgeGuideLatestResponse;
}

export async function triggerEdgeguideRun(trace?: string): Promise<EdgeGuideRunResponse> {
  const traceId = trace ?? `ui-run-${Date.now()}`;
  const r = await fetch(RUN_PROXY, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Trace-Id": traceId },
    body: "{}",
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`run ${r.status}: ${txt}`);
  return JSON.parse(txt) as EdgeGuideRunResponse;
}
