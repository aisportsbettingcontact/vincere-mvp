import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BettingInsights {
  bookNeed: string;
  sharpSide: string;
  publicSide: string;
}

interface InsightsParams {
  matchup: string;
  market: "spread" | "moneyline" | "total";
  current_line: string;
  away_line?: string;
  home_line?: string;
  tickets: { away?: number; home?: number; o?: number; u?: number };
  money: { away?: number; home?: number; o?: number; u?: number };
  move: { from: string; to: string };
}

export function useBettingInsights(params: InsightsParams | null) {
  const [insights, setInsights] = useState<BettingInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!params) return;

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: functionError } = await supabase.functions.invoke(
          "betting-insights",
          {
            body: params,
          }
        );

        if (functionError) {
          throw functionError;
        }

        if (data.error) {
          throw new Error(data.error);
        }

        setInsights(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load insights";
        setError(errorMessage);
        
        if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
          toast({
            title: "Rate Limit Reached",
            description: "Too many requests. Please wait a moment.",
            variant: "destructive",
          });
        } else if (errorMessage.includes("402") || errorMessage.includes("credits")) {
          toast({
            title: "Credits Exhausted",
            description: "AI analysis requires additional credits.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Analysis Unavailable",
            description: "Could not generate AI insights. Please try again.",
            variant: "destructive",
          });
        }

        // Set fallback insights
        setInsights({
          bookNeed: "Analysis unavailable. Please refresh to try again.",
          sharpSide: "Analysis unavailable. Please refresh to try again.",
          publicSide: "Analysis unavailable. Please refresh to try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [params?.matchup, params?.market, params?.current_line, toast]);

  return { insights, loading, error };
}
