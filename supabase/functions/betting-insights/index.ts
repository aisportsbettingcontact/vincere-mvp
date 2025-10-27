import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { matchup, market, current_line, away_line, home_line, tickets, money, move } = await req.json();

    // Build detailed prompt based on market type
    let prompt = `Analyze this ${market} market for ${matchup}:\n\n`;
    
    if (market === "moneyline") {
      prompt += `Away ML: ${away_line}, Home ML: ${home_line}\n`;
    } else if (market === "total") {
      prompt += `Current Total: ${current_line}\n`;
      prompt += `Over: ${tickets.o}% of tickets, ${money.o}% of money\n`;
      prompt += `Under: ${tickets.u}% of tickets, ${money.u}% of money\n`;
    } else {
      prompt += `Current Line: ${current_line}\n`;
      prompt += `Away: ${tickets.away}% of tickets, ${money.away}% of money\n`;
      prompt += `Home: ${tickets.home}% of tickets, ${money.home}% of money\n`;
    }
    
    prompt += `\nLine Movement: ${move.from} → ${move.to}\n\n`;
    prompt += `Provide exactly 3 concise insights (2-3 sentences each):\n`;
    prompt += `1. "What Vegas Needs" - Which side do bookmakers need to win based on liability?\n`;
    prompt += `2. "Sharpest Play" - Where is the sharp money based on money vs tickets divergence?\n`;
    prompt += `3. "What The Public Is Hammering" - What side is getting the most public action?\n\n`;
    prompt += `Format each insight as: "[PLAY]. [Explanation]."\n`;
    prompt += `Example: "Patriots -3.5. Sharp money is pouring in with 65% of handle on only 42% of tickets."\n`;
    prompt += `Use team abbreviations from the matchup. Be specific about the play.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert sports betting analyst. Provide sharp, concise insights based on betting data. Always start with the specific play recommendation, then explain why."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the response into three sections
    const lines = content.split('\n').filter((l: string) => l.trim());
    
    // Extract insights by looking for numbered patterns or key phrases
    const bookNeed = lines.find((l: string) => 
      l.match(/1\.|vegas needs|bookmakers need/i) || 
      l.match(/^[A-Z]{2,4}\s+[+-]?\d+\.?\d*/)) || lines[0] || "";
    
    const sharpSide = lines.find((l: string) => 
      l.match(/2\.|sharp|smart money/i) || 
      (lines.indexOf(bookNeed) !== -1 && lines[lines.indexOf(bookNeed) + 1])) || lines[1] || "";
    
    const publicSide = lines.find((l: string) => 
      l.match(/3\.|public|hammering/i) || 
      lines[lines.length - 1]) || lines[2] || "";

    // Clean up numbering
    const cleanInsight = (text: string) => text.replace(/^\d+\.\s*/, '').trim();

    return new Response(
      JSON.stringify({
        bookNeed: cleanInsight(bookNeed),
        sharpSide: cleanInsight(sharpSide),
        publicSide: cleanInsight(publicSide),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in betting-insights function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to generate betting insights"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
