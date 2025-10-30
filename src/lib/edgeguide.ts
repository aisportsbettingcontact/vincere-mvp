export interface EdgeGuideRunResponse {
  ok: true;
  json_file: string;
  elapsed_sec: number;
  trace: string;
  elapsed_ms?: number;
}

interface RawSplitGame {
  id: string;
  d: string;
  a: string;
  h: string;
  spr: [number, number, [number, number], [number, number]];
  tot: [number, [number, number], [number, number]];
  ml: [number, number, [number, number], [number, number]];
  b: string;
  s: string;
}

export interface EdgeGuideLatestResponse {
  generated_at: string;
  tz_anchor?: string;
  books: {
    DK?: {
      NFL?: Record<string, RawSplitGame[]>;
      NBA?: Record<string, RawSplitGame[]>;
    };
    CIRCA?: {
      NFL?: Record<string, RawSplitGame[]>;
    };
  };
}

const EDGE_BASE = import.meta.env.VITE_EDGE_BASE as string;

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
  const r = await fetch(`${EDGE_BASE}/run-edgeguide`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Trace-Id": traceId },
    body: "{}",
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`run ${r.status}: ${txt}`);
  return JSON.parse(txt) as EdgeGuideRunResponse;
}
