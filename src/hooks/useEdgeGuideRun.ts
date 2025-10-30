import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseEdgeGuideRunReturn {
  runAnalysis: () => Promise<void>;
  isLoading: boolean;
  data: any;
  error: string | null;
}

export function useEdgeGuideRun(): UseEdgeGuideRunReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const pollLatest = async (): Promise<any> => {
    const maxAttempts = 10;
    const pollInterval = 3000; // 3 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const { data: latestData, error: pollError } = await supabase.functions.invoke(
        'edgeguide-latest',
        { 
          method: 'GET',
          headers: {
            'X-Edge-Admin': import.meta.env.VITE_EDGE_ADMIN || '',
          }
        }
      );

      if (pollError) {
        console.error('Poll error:', pollError);
        continue;
      }

      if (latestData) {
        return latestData;
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
      // Race between the actual request and timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
      );

      const requestPromise = supabase.functions.invoke('edgeguide-run', {
        method: 'POST',
        headers: {
          'X-Trace-Id': traceId,
          'X-Edge-Admin': import.meta.env.VITE_EDGE_ADMIN || '',
        },
        body: {},
      });

      const { data: result, error: invokeError } = await Promise.race([
        requestPromise,
        timeoutPromise,
      ]) as any;

      if (invokeError) {
        throw invokeError;
      }

      setData(result);
      toast.success('Analysis completed successfully');
    } catch (err: any) {
      // If timeout, fall back to polling
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
