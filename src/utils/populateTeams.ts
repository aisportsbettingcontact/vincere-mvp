import { supabase } from "@/integrations/supabase/client";
import teamDetailsJson from "@/data/teamdetails.json";

interface TeamData {
  sport: string;
  league: string;
  conference: string;
  division: string;
  team_abbreviation: string;
  team_city: string;
  team_nickname: string;
  arena_name: string;
  arena_city: string;
  arena_state: string;
  primary_color: string;
  primary_hex_code: string;
  secondary_color: string;
  secondary_hex_code: string;
  tertiary_color: string;
  tertiary_hex_code: string;
  vsin_slug?: string;
  logo_slug?: string;
}

export async function populateTeamsData(): Promise<{ success: boolean; message: string }> {
  try {
    const teams: TeamData[] = teamDetailsJson as TeamData[];
    
    // Insert teams in batches
    const batchSize = 50;
    for (let i = 0; i < teams.length; i += batchSize) {
      const batch = teams.slice(i, i + batchSize);
      const { error } = await supabase
        .from('teams')
        .upsert(batch, { 
          onConflict: 'sport,league,team_abbreviation',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error('Error inserting batch:', error);
        throw error;
      }
    }
    
    return { 
      success: true, 
      message: `Successfully populated ${teams.length} teams` 
    };
  } catch (error) {
    console.error('Error populating teams:', error);
    return { 
      success: false, 
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}
