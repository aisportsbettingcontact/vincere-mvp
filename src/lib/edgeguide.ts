import { supabase } from '@/integrations/supabase/client';

export interface EdgeGuideRunResponse {
  ok: boolean;
  json_file: string;
  elapsed_sec: number;
}

export interface EdgeGuideLatestResponse {
  generated_at: string;
  tz_anchor?: string;
  books: unknown;
}

export async function triggerEdgeguideRun(trace?: string): Promise<EdgeGuideRunResponse> {
  const edgeAdmin = import.meta.env.VITE_EDGE_ADMIN;
  
  if (!edgeAdmin) {
    throw new Error("Missing VITE_EDGE_ADMIN");
  }

  const { data, error } = await supabase.functions.invoke('edgeguide-run', {
    method: 'POST',
    headers: {
      'X-Edge-Admin': edgeAdmin,
      ...(trace ? { 'X-Trace-Id': trace } : {}),
    },
    body: {},
  });

  if (error) {
    throw new Error(`Run failed: ${error.message}`);
  }

  if (!data?.ok) {
    throw new Error(`Run not ok: ${JSON.stringify(data)}`);
  }

  return data as EdgeGuideRunResponse;
}

export async function fetchLatest(): Promise<EdgeGuideLatestResponse> {
  const { data, error } = await supabase.functions.invoke('edgeguide-latest', {
    method: 'GET',
    headers: {
      'X-Trace-Id': `latest-${Date.now()}`,
    },
  });

  if (error) {
    throw new Error(`Latest failed: ${error.message}`);
  }

  if (!data?.generated_at || !data?.books) {
    throw new Error("Latest schema mismatch");
  }

  return data as EdgeGuideLatestResponse;
}
