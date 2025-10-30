import { useState } from 'react';
import { toast } from 'sonner';
import { triggerEdgeguideRun, fetchLatest, EdgeGuideRunResponse, EdgeGuideLatestResponse } from '@/lib/edgeguide';

interface UseEdgeGuideRunReturn {
  runAnalysis: () => Promise<void>;
  isLoading: boolean;
  data: EdgeGuideRunResponse | EdgeGuideLatestResponse | null;
  error: string | null;
}

export function useEdgeGuideRun(): UseEdgeGuideRunReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<EdgeGuideRunResponse | EdgeGuideLatestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollLatest = async (): Promise<EdgeGuideLatestResponse> => {
    const maxAttempts = 10;
    const pollInterval = 3000; // 3 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const latestData = await fetchLatest();
        return latestData;
      } catch (pollError) {
        console.error('Poll error:', pollError);
        if (attempt === maxAttempts - 1) throw pollError;
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Polling timeout - no data received');
  };

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const traceId = crypto.randomUUID();
    const TIMEOUT_MS = 60000; // 60 seconds

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
      );

      const result = await Promise.race([
        triggerEdgeguideRun(traceId),
        timeoutPromise,
      ]);

      setData(result);
      toast.success('Analysis completed successfully');
    } catch (err: any) {
      if (err.message === 'timeout') {
        toast.info('Analysis taking longer than expected, checking for latest results...');
        
        try {
          const latestData = await pollLatest();
          setData(latestData);
          toast.success('Latest analysis retrieved');
        } catch (pollErr: any) {
          const errorMsg = pollErr.message || 'Failed to retrieve analysis';
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        const errorMsg = err.message || 'Failed to run analysis';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    runAnalysis,
    isLoading,
    data,
    error,
  };
}
